import { create } from 'zustand';
import { RSVPResponse, RsvpCreatePayload, RsvpDraft } from '../types';
import { INITIAL_RSVP_DRAFT } from '../data';
import { persistenceService } from '../services/persistence';
import { mediaService, type GuestMediaKind } from '../services/media';

/** Taslaktaki iki medya yuvası; her biri bir kimlik + bir önizleme URL'si tutar. */
type DraftMediaField = 'photo' | 'video';

const MEDIA_KIND: Record<DraftMediaField, GuestMediaKind> = {
  photo: 'rsvp_photo',
  video: 'rsvp_video',
};

/** Yerel önizleme URL'si sızdırmamak için: yenisini koymadan eskisini bırak. */
function releaseObjectUrl(url: string): void {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url);
}

interface RsvpState {
  /**
   * 🔴 Hangi davetiyenin LCV'leri okunuyor/yazılıyor.
   *
   * `null` = **önizleme yüzeyi**: tasarım editörünün cihaz simülatörü ya da
   * ana sayfadaki tanıtım paneli. Oralarda sunucuda bir davetiye yoktur;
   * gönderilen yanıt yalnızca bu oturumda yaşar. Kimliği olmayan bir yola
   * istek atmak (`/invitations/null/rsvps`) 404'ten başka bir şey üretmezdi.
   */
  invitationId: string | null;
  rsvpList: RSVPResponse[];
  /** Liste isteği uçuyor. */
  isLoading: boolean;
  /** Son çekme başarısız oldu — panel yeniden deneme sunar. */
  remoteError: boolean;
  /** Misafirin doldurmakta olduğu form. */
  draft: RsvpDraft;
  /**
   * Hangi davetiyeyle çalışıldığını bildirir. Kimlik değişince liste
   * sıfırlanır: önceki davetiyenin yanıtlarının bir an için yenisine aitmiş
   * gibi görünmesi, ev sahibinin sayımını yanlış okumasına yol açardı.
   */
  setInvitationScope: (invitationId: string | null) => void;
  fetchRsvps: () => Promise<void>;
  updateDraft: (patch: Partial<RsvpDraft>) => void;
  /** Dosyayı misafir ucundan yükler ve dönen **kimliği** taslağa yazar. */
  attachDraftMedia: (field: DraftMediaField, file: File) => Promise<void>;
  /**
   * Taslağı doğrulayıp yeni bir LCV olarak gönderir. Sunucunun ürettiği
   * kayıtla çözülür; taslak geçersizse `null` döner. Ağ/API hataları
   * fırlatılır — formu gösteren bileşen onları yüzeye çıkarır.
   */
  submitDraft: () => Promise<RSVPResponse | null>;
  /**
   * Kaydı iyimser olarak kaldırır, sonra sunucuyla doğrular; istek
   * reddedilirse kayıt geri konur ve hata yeniden fırlatılır.
   */
  deleteRsvp: (id: string) => Promise<void>;
}

export const useRsvpStore = create<RsvpState>()((set, get) => ({
  invitationId: null,
  rsvpList: [],
  isLoading: false,
  remoteError: false,
  draft: INITIAL_RSVP_DRAFT,

  setInvitationScope: (invitationId) => {
    if (get().invitationId === invitationId) return;
    set({ invitationId, rsvpList: [], remoteError: false, isLoading: false });
  },

  fetchRsvps: async () => {
    const { invitationId } = get();
    if (!invitationId) return;

    set({ isLoading: true });
    try {
      const rsvps = await persistenceService.listRsvps(invitationId);
      set({ rsvpList: rsvps, remoteError: false, isLoading: false });
    } catch {
      set({ remoteError: true, isLoading: false });
    }
  },

  updateDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),

  attachDraftMedia: async (field, file) => {
    const { invitationId, draft } = get();
    const previousUrl = field === 'photo' ? draft.photoUrl : draft.videoUrl;

    // Önizlemede sunucuya çıkılmaz: kimliği olmayan bir davetiyeye dosya
    // iliştirilemez. Kullanıcı yine de seçtiği dosyayı görür.
    if (!invitationId) {
      releaseObjectUrl(previousUrl);
      const localUrl = URL.createObjectURL(file);
      set((state) => ({
        draft: { ...state.draft, [`${field}Url`]: localUrl, [`${field}MediaId`]: '' },
      }));
      return;
    }

    const media = await mediaService.uploadAsGuest(invitationId, file, MEDIA_KIND[field]);

    releaseObjectUrl(previousUrl);
    set((state) => ({
      draft: { ...state.draft, [`${field}Url`]: media.url, [`${field}MediaId`]: media.id },
    }));
  },

  submitDraft: async () => {
    const { draft, invitationId } = get();
    if (!draft.guestName.trim()) return null;

    const payload: RsvpCreatePayload = {
      guestName: draft.guestName.trim(),
      guestCount: Number(draft.guestCount),
      status: draft.status,
      menuPreference: draft.menuPreference || null,
      message: draft.message || null,
      // Boş dizgi değil `null`: alan isteğe bağlıdır ve ULID kuralı boş
      // dizgiyi reddeder.
      photoMediaId: draft.photoMediaId || null,
      videoMediaId: draft.videoMediaId || null,
      // Tuzağın değeri formdan olduğu gibi taşınır; burada sabitlenmez.
      website: draft.website,
    };

    if (!invitationId) {
      // Önizleme: kayıt yalnızca bu oturumda yaşar. Sunucunun üreteceği
      // alanlar yerel olarak doldurulur ki panel gerçeğiyle aynı görünsün.
      const localEntry: RSVPResponse = {
        id: `preview-${Date.now()}`,
        guestName: payload.guestName,
        guestCount: payload.guestCount,
        menuPreference: payload.menuPreference ?? '',
        status: payload.status,
        message: payload.message ?? undefined,
        photoUrl: draft.photoUrl || undefined,
        videoUrl: draft.videoUrl || undefined,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        rsvpList: [localEntry, ...state.rsvpList],
        draft: INITIAL_RSVP_DRAFT,
      }));
      return localEntry;
    }

    const entry = await persistenceService.createRsvp(invitationId, payload);
    set((state) => ({ rsvpList: [entry, ...state.rsvpList], draft: INITIAL_RSVP_DRAFT }));
    return entry;
  },

  deleteRsvp: async (id) => {
    const previous = get().rsvpList;
    set({ rsvpList: previous.filter((r) => r.id !== id) });

    // Önizleme kayıtlarının sunucuda karşılığı yok; silme isteği 404 verirdi.
    if (!get().invitationId) return;

    try {
      await persistenceService.deleteRsvp(id);
    } catch (error) {
      set({ rsvpList: previous });
      throw error;
    }
  },
}));
