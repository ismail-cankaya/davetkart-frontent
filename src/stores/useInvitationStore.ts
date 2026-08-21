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

export const useInvitationStore = create<InvitationState>()((set, get) => {
  const runSave = async (): Promise<void> => {
    const { invitation, recordId } = get();

    // Backend sort_order'ı listedeki konumdan yazıyor, dolayısıyla yanıt
    // gönderdiğimiz sırayı korur; eşleştirmeyi bu varsayıma dayandırıyoruz.
    const sentKeys = invitation.timelineEvents.map((event) => event.localKey);

    set({ saveState: 'saving' });

    try {
      const record = recordId
        ? await persistenceService.updateInvitation(recordId, invitation)
        : await persistenceService.createInvitation(invitation);

      set((state) => ({
        recordId: record.id,
        saveState: 'saved',
        invitation: {
          ...state.invitation,
          timelineEvents: adoptServerIds(state.invitation.timelineEvents, sentKeys, record)
        }
      }));
    } catch {
      // A failed save must never crash the editor; the status hint surfaces
      // it and the next edit re-triggers the debounced save.
      set({ saveState: 'error' });
    }
  };

  return {
    invitation: INITIAL_INVITATION,
    activePresetId: INITIAL_INVITATION.imageTheme,
    recordId: null,
    saveState: 'idle',

    updateField: (name, value) =>
      set((state) => ({ invitation: { ...state.invitation, [name]: value } })),

    selectTemplate: (presetId) =>
      set((state) => ({
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
    loadRecord: (record) =>
      set({
        recordId: record.id,
        invitation: { ...INITIAL_INVITATION, ...record.invitation },
        activePresetId: record.invitation.imageTheme || INITIAL_INVITATION.imageTheme,
        saveState: 'idle'
      }),

    // 🔴 recordId de sıfırlanır: aksi halde "yeni davetiye" mevcut kaydın
    // üzerine yazardı.
    resetInvitation: () =>
      set({
        recordId: null,
        invitation: INITIAL_INVITATION,
        activePresetId: INITIAL_INVITATION.imageTheme,
        saveState: 'idle'
      }),

    saveInvitation: () => {
      saveQueue = saveQueue.then(runSave);
      return saveQueue;
    }
  };
});

/** The full preset object for the currently selected template. */
export function useActivePreset(): TemplatePreset {
  return useInvitationStore(
    (state) => TEMPLATE_PRESETS.find((p) => p.id === state.activePresetId) ?? TEMPLATE_PRESETS[0]
  );
}
