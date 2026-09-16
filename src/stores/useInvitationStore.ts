import { create } from 'zustand';
import {
  Invitation,
  InvitationRecord,
  InvitationSaveState,
  PaletteId,
  TemplatePreset,
  TimelineEvent
} from '../types';
import { INITIAL_INVITATION, TEMPLATE_PRESETS } from '../data';
import { persistenceService } from '../services/persistence';
import { useAuthStore } from './useAuthStore';

/** Palette carried by each modular preset; legacy presets keep the current palette. */
const PRESET_PALETTES: Record<string, PaletteId> = {
  'moda-gece': 'midnight',
  'moda-tas': 'stone',
  'dugun-sade': 'stone',
  // Katmanlı düğün şablon ailesi — hepsi açık zeminli temalar
  'dugun-1': 'stone',
  'dugun-2': 'stone',
  'dugun-3': 'stone',
  'dugun-4': 'stone',
  'dugun-5': 'stone',
  // Kategoriye özel yeni tema koleksiyonu
  'sunnet-klasik': 'midnight',
  'sunnet-modern': 'stone',
  'dogum-gunu-neseli': 'stone',
  'dogum-gunu-sik': 'midnight',
  'mezuniyet-akademik': 'midnight',
  'mezuniyet-dinamik': 'midnight',
  'baby-shower-pastel': 'stone',
  'baby-shower-boho': 'stone',
  'parti-neon': 'midnight',
  'parti-gala': 'midnight'
};

interface InvitationState {
  invitation: Invitation;
  activePresetId: string;
  /** Sunucudaki kaydın kimliği; `null` = bu tasarım henüz kaydedilmedi (K37). */
  recordId: string | null;
  /** Outcome of the most recent backend save (drives the editor's status hint). */
  saveState: InvitationSaveState;
  /**
   * Kullanıcı düzenlemesi sayacı — yalnızca `updateField` ve `selectTemplate`
   * artırır. Otomatik kaydetme BUNU izler, `invitation` referansını değil.
   *
   * 🔴 Kaydetme yanıtı da `invitation`'ı yeniden yazar (sunucu kimlikleri).
   * Referans izlenseydi her başarılı kayıt bir sonrakini tetikler ve editör
   * açık kaldıkça sonsuz bir PUT döngüsü dönerdi.
   */
  editRevision: number;
  /** Update a single invitation field (form inputs). */
  updateField: <K extends keyof Invitation>(name: K, value: Invitation[K]) => void;
  /** Switch the visual template; keeps the invitation's theme fields in sync. */
  selectTemplate: (presetId: string) => void;
  /** Dashboard "düzenlemeye devam et" — kaydı KİMLİĞİYLE birlikte yükler. */
  loadRecord: (record: InvitationRecord) => void;
  /** Restore the invitation and template to their factory defaults. */
  resetInvitation: () => void;
  /** Persist the current design to the backend (called by the debounced auto-save). */
  saveInvitation: () => Promise<void>;
  /**
   * Davetiyeyi yayına alır ve yayınlanan kaydı döndürür.
   *
   * 🔴 Hiçbir ön yetki kontrolü yapmaz — **denemek kontrolün kendisidir.**
   * Gereken planı ve ödenmiş hakkı sunucu bilir (`TierResolver` + `orders`);
   * frontend'in `getRequiredTier()` kopyası yalnızca sunum içindir. 402/409
   * hataları çağırana fırlatılır ki doğru ekran açılabilsin.
   *
   * Kaydedilmemiş bir tasarım önce kaydedilir: yayınlama ucu kimlik ister.
   */
  publishInvitation: () => Promise<InvitationRecord>;
}

/**
 * 🔴 Kaydetmeler SIRAYA alınır.
 *
 * Autosave debounce'ludur; iki kaydetme çakışabilir. İlki POST edip dönen
 * kimliği yazmadan ikincisi başlarsa `recordId` hâlâ null olur ve ikincisi de
 * POST atar — kullanıcı tek davetiye yaptığını sanırken İKİ kayıt oluşur.
 */
let saveQueue: Promise<void> = Promise.resolve();

/**
 * 🔴 Editördeki belgenin kuşağı — `loadRecord` ve `resetInvitation` artırır.
 *
 * Kaydetme ağda uçarken başka bir belge açılabilir (ör. editörden çıkarken
 * boşaltılan kaydetme sürerken panelden başka bir kart düzenlenir). Yanıt,
 * kuşak değiştikten sonra gelirse YOK SAYILIR: yazılsaydı eski kaydın kimliği
 * yeni belgeye geçer ve bir sonraki kaydetme yeni içeriği eski kaydın üzerine
 * yazardı.
 */
let documentGeneration = 0;

/**
 * Editördeki belgenin ait olduğu hesap: kayıt yüklendiğinde ya da ilk kez
 * sunucuya yazıldığında belirlenir. Anonim taslaklarda `null` — sahipleri
 * yoktur ve girişte korunurlar. Bkz. dosya sonundaki sahiplik bekçisi.
 */
let documentOwnerId: string | null = null;

const currentUserId = (): string | null => useAuthStore.getState().user?.id ?? null;

/**
 * Sunucunun ürettiği program kimliklerini geri yazar (K44).
 *
 * İstek uçarken kullanıcı yazmaya devam etmiş olabilir; bu yüzden yanıtın
 * tamamını kopyalamıyoruz. Yalnızca hâlâ listede duran ve hâlâ kimliksiz olan
 * adımlara, gönderim sırasındaki KONUMUNDAN gelen kimliği takıyoruz.
 */
function adoptServerIds(
  current: TimelineEvent[],
  sentKeys: string[],
  record: InvitationRecord
): TimelineEvent[] {
  const saved = record.invitation.timelineEvents;

  return current.map((event) => {
    if (event.id !== null) return event;

    const position = sentKeys.indexOf(event.localKey);
    const serverId = position >= 0 ? saved[position]?.id ?? null : null;

    return serverId === null ? event : { ...event, id: serverId };
  });
}

/**
 * Tek bir kaydetmenin sonucu. Otomatik kaydetme bunu yok sayar (durum ipucu
 * `saveState`'ten okunur); yayınlama ise kaydın GERÇEKTEN yazıldığını bilmek
 * zorundadır.
 */
type SaveOutcome = { ok: true } | { ok: false; error: unknown };

const SUPERSEDED: SaveOutcome = {
  ok: false,
  error: new Error('Düzenlenen davetiye değişti; kaydetme uygulanmadı.')
};

export const useInvitationStore = create<InvitationState>()((set, get) => {
  const runSave = async (generation: number): Promise<SaveOutcome> => {
    // Sırada beklerken belge değiştiyse bu kaydetme artık başka bir belgeye ait.
    if (generation !== documentGeneration) return SUPERSEDED;

    const { invitation, recordId } = get();
    const ownerId = currentUserId();

    // Backend sort_order'ı listedeki konumdan yazıyor, dolayısıyla yanıt
    // gönderdiğimiz sırayı korur; eşleştirmeyi bu varsayıma dayandırıyoruz.
    const sentKeys = invitation.timelineEvents.map((event) => event.localKey);

    set({ saveState: 'saving' });

    try {
      const record = recordId
        ? await persistenceService.updateInvitation(recordId, invitation)
        : await persistenceService.createInvitation(invitation);

      if (generation !== documentGeneration) return SUPERSEDED;

      documentOwnerId = ownerId;
      set((state) => ({
        recordId: record.id,
        saveState: 'saved',
        invitation: {
          ...state.invitation,
          timelineEvents: adoptServerIds(state.invitation.timelineEvents, sentKeys, record)
        }
      }));
      return { ok: true };
    } catch (error) {
      // A failed save must never crash the editor; the status hint surfaces
      // it and the next edit re-triggers the debounced save.
      if (generation !== documentGeneration) return SUPERSEDED;
      set({ saveState: 'error' });
      return { ok: false, error };
    }
  };

  const enqueueSave = (): Promise<SaveOutcome> => {
    // Kuşak SIRAYA GİRERKEN yakalanır: kaydetme, istendiği andaki belgeye aittir.
    const generation = documentGeneration;
    const outcome = saveQueue.then(() => runSave(generation));
    saveQueue = outcome.then(() => undefined);
    return outcome;
  };

  return {
    invitation: INITIAL_INVITATION,
    activePresetId: INITIAL_INVITATION.imageTheme,
    recordId: null,
    saveState: 'idle',
    editRevision: 0,

    updateField: (name, value) =>
      set((state) => ({
        invitation: { ...state.invitation, [name]: value },
        editRevision: state.editRevision + 1
      })),

    selectTemplate: (presetId) =>
      set((state) => ({
        editRevision: state.editRevision + 1,
        activePresetId: presetId,
        invitation: {
          ...state.invitation,
          imageTheme: presetId,
          phoneBackground: presetId,
          palette: PRESET_PALETTES[presetId] ?? state.invitation.palette
        }
      })),

    // Merge over the factory defaults so records created before newer modular
    // fields existed (showGift, timelineEvents…) load with sane values.
    loadRecord: (record) => {
      documentGeneration += 1;
      documentOwnerId = currentUserId();
      set({
        recordId: record.id,
        invitation: { ...INITIAL_INVITATION, ...record.invitation },
        activePresetId: record.invitation.imageTheme || INITIAL_INVITATION.imageTheme,
        saveState: 'idle'
      });
    },

    // 🔴 recordId de sıfırlanır: aksi halde "yeni davetiye" mevcut kaydın
    // üzerine yazardı.
    resetInvitation: () => {
      documentGeneration += 1;
      documentOwnerId = null;
      set({
        recordId: null,
        invitation: INITIAL_INVITATION,
        activePresetId: INITIAL_INVITATION.imageTheme,
        saveState: 'idle'
      });
    },

    saveInvitation: async () => {
      await enqueueSave();
    },

    publishInvitation: async () => {
      // Yayınlamadan önce son hâli sunucuya yazılır. İki sebep: kimliği
      // olmayan bir tasarım yayınlanamaz, ve kullanıcının son düzenlemesi
      // debounce penceresinde takılı kalmış olabilir — yayınlanan davetiye
      // ekranda gördüğünden eski olmamalı.
      const outcome = await enqueueSave();

      // 🔴 Kimliğin var olması yetmez: güncelleme başarısızsa sunucudaki sürüm
      // ekrandakinden eskidir ve yayınlamak onu yayına çıkarırdı. Kaydetmenin
      // KENDİ hatası fırlatılır ki kullanıcı sebebini (bağlantı, doğrulama…)
      // görsün.
      if (outcome.ok === false) throw outcome.error;

      const recordId = get().recordId;
      if (!recordId) {
        throw new Error('Davetiye kaydedilemediği için yayınlanamadı.');
      }

      const record = await persistenceService.publishInvitation(recordId);

      // Sunucunun döndürdüğü durum ('published') editöre yazılır ki aynı
      // oturumda ikinci kez yayınlamaya çalışılmasın.
      set({ recordId: record.id });
      return record;
    }
  };
});

/**
 * 🔴 Sahiplik bekçisi: editördeki belge başka bir hesaba aitse düşürülür.
 *
 * Oturum süresi dolduğunda (401) editör bilerek temizlenmez — aynı kullanıcı
 * yeniden girip devam edebilmeli. Ama aynı sekmede FARKLI bir hesap girerse
 * önceki hesabın tasarımı ekranda kalır ve bir sonraki kaydetme onun kaydına
 * yazılmaya çalışılırdı.
 */
useAuthStore.subscribe((auth) => {
  const userId = auth.user?.id ?? null;
  if (userId !== null && documentOwnerId !== null && documentOwnerId !== userId) {
    useInvitationStore.getState().resetInvitation();
  }
});

/** The full preset object for the currently selected template. */
export function useActivePreset(): TemplatePreset {
  return useInvitationStore(
    (state) => TEMPLATE_PRESETS.find((p) => p.id === state.activePresetId) ?? TEMPLATE_PRESETS[0]
  );
}
