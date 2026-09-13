/**
 * 🔴 Ağda **İngilizce** gider ve gelir — backend `RsvpStatus` enum'ının ham
 * değerleri (K21/K49: sözleşme metin değil KOD taşır).
 *
 * *"Katılıyor"* / *"Belirsiz"* / *"Katılamıyorum"* birer **sunum** kararıdır
 * ve çeviri frontend'de yapılır: `utils/rsvpStatus.ts`. Bu tipin Türkçe
 * olduğu dönemde liste ucu 404 verdiği için uyuşmazlık hiç görünmemişti —
 * `RsvpResource` ilk günden `status->value` gönderiyordu.
 */
export type RsvpStatus = 'attending' | 'pending' | 'declined';

export interface AuthUser {
  id: string;
  /**
   * Ad ve soyad backend'de ayrı kolonlarda durur (users.first_name /
   * users.last_name) ve UserResource bunları camelCase olarak AYRI AYRI
   * döner. Tek satırlık gösterim gerektiğinde birleştirme frontend'in işi:
   * `utils/user.ts` → `fullName()`.
   */
  firstName: string;
  lastName: string;
  email: string;
}

/** JWT session issued by the Auth microservice. */
export interface AuthSession {
  user: AuthUser;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/** POST /api/auth/register gövdesi — alan adları backend RegisterRequest ile birebir. */
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/** Router location state used to send the user back after authentication. */
export interface AuthRedirectState {
  from?: string;
}

/** Color mood of the modular invitation: elite dark (slate) or elite pastel/stone. */
export type PaletteId = 'midnight' | 'stone';

/** A single entry of the event's program flow (nikah, yemek, eğlence…). */
export interface TimelineEvent {
  /**
   * Sunucunun verdiği kimlik. `null` = bu adım henüz kaydedilmedi; backend
   * kaydederken kendi id'sini üretir (K44). Tarayıcı kimlik uydurmaz.
   */
  id: string | null;
  /**
   * Yalnızca React listesinin `key` ihtiyacı için yerel anahtar. Sunucuya
   * GÖNDERİLMEZ — `invitationService` istek gövdesini kurarken düşürür.
   * `id` null olan yeni adımların da kararlı bir anahtarı olsun diye var.
   */
  localKey: string;
  /** Display time, e.g. "16:30". */
  time: string;
  title: string;
  description: string;
}

export interface Invitation {
  title: string;
  subtitle: string;
  names: string;
  date: string;
  venue: string;
  /** Google Maps share link guests use for directions. */
  mapUrl: string;
  phoneBackground: string;
  imageTheme: string;
  /** Wizard category driving the modular template flavor (dugun/kina/nisan…). */
  categoryId: string;
  palette: PaletteId;

  // ——— Module visibility (Grup C wizard toggles) ———
  showEnvelope: boolean;
  showTimer: boolean;
  showTimeline: boolean;
  showGallery: boolean;
  showGift: boolean;
  showRSVP: boolean;

  // ——— Gift / IBAN details ———
  bankName: string;
  accountHolder: string;
  iban: string;
  /** Pre-set gift amounts (₺) guests can pick in the gift section. */
  giftOptions: number[];

  // ——— RSVP details ———
  /** Last day guests can submit their RSVP (yyyy-MM-dd). */
  rsvpDeadline: string;
  askMenuPreference: boolean;

  // ——— Content collections ———
  timelineEvents: TimelineEvent[];
  /** Uploaded gallery photo URLs (served by the media boundary). */
  galleryImages: string[];
}

/** Paid plan tiers — there is no free tier; publishing always requires a purchase. */
export type SubscriptionTier = 'standart' | 'gold' | 'elit';

/**
 * Hata zarfından gelen `requiredTier` bir plan değeri mi?
 *
 * Sunucudan gelen bir dizgi, tipinin `SubscriptionTier` olduğunu söylemez —
 * doğrulamadan kullanmak, backend bir gün yeni bir plan eklediğinde paywall'ı
 * tanımsız bir plana kilitlerdi.
 */
export function isSubscriptionTier(value: unknown): value is SubscriptionTier {
  return value === 'standart' || value === 'gold' || value === 'elit';
}

/** A single row of a plan card's feature list. */
export interface PlanFeature {
  label: string;
  /** false renders the row dimmed/struck-through (locked in this plan). */
  included: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  /** One-time price in TL. */
  price: number;
  tagline: string;
  features: PlanFeature[];
}

/**
 * Checkout gövdesi.
 *
 * 🔴 **Fiyat gövdeye KONULMAZ.** Backend onu `config`'ten okur (M6): fiyatı
 * istemciden almak, istemcinin kendi fiyatını yazmasına izin vermek olurdu.
 * `data.ts`'teki fiyat katalogu yalnızca **gösterim** içindir.
 */
export interface CheckoutPayload {
  tier: SubscriptionTier;
}

/** Sipariş yaşam döngüsü — backend `OrderStatus` enum'ı. */
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * `POST /invitations/{id}/checkout` ve `POST /payments/checkout` yanıtı (201).
 *
 * 🔴 **`status` her zaman `pending` doğar.** `paid`'e geçişi sağlayıcının
 * **webhook**'u yapar; yani checkout bir ödeme değil, bir ödeme *niyetidir*.
 * Bunu `paid` sanmak, kullanıcıya "ödendi" deyip hemen ardından yayınlamada
 * 402 göstermek demektir — planın en pahalı maddesi buydu.
 */
export interface CheckoutResult {
  orderId: string;
  tier: SubscriptionTier;
  status: OrderStatus;
  /**
   * Sağlayıcının ödeme sayfası. Kullanıcı buraya **gitmeli**; ödeme
   * uygulamanın dışında tamamlanır.
   *
   * 🔴 Opsiyonel alan yoksa **anahtar hiç gelmez**, `null` gelmez (C7).
   * `redirectUrl === undefined` kontrolü doğru olandır.
   */
  redirectUrl?: string;
}

/** Lifecycle of an invitation stored on the Invitation microservice. */
export type InvitationStatus = 'published' | 'saved';

/** An invitation record as returned by `GET /api/invitations`. */
export interface InvitationRecord {
  id: string;
  status: InvitationStatus;
  /** ISO timestamp of the last server-side update. */
  updatedAt: string;
  /** Full design payload; reloaded into the editor to continue editing. */
  invitation: Invitation;
}

export interface RSVPResponse {
  id: string;
  guestName: string;
  guestCount: number;
  menuPreference: string;
  status: RsvpStatus;
  message?: string;
  photoUrl?: string;
  videoUrl?: string;
  createdAt: string;
}

/**
 * `POST /api/public/invitations/{id}/rsvps` gövdesi — `id` ve `createdAt`
 * sunucuda üretilir.
 *
 * 🔴 `RSVPResponse`'tan türetilemez. Yanıt medyayı **URL** olarak taşır
 * (`photoUrl`), istek ise **kimlik** olarak gönderir (`photoMediaId`): şema
 * kimlik tutar, sözleşme URL taşır (E1). İki şekli tek tipe bağlamak, yükleme
 * yanıtındaki kimliğin sessizce düşmesi demekti.
 */
export interface RsvpCreatePayload {
  guestName: string;
  guestCount: number;
  status: RsvpStatus;
  menuPreference?: string | null;
  message?: string | null;
  /** `mediaService` yükleme yanıtından gelen ULID. */
  photoMediaId?: string | null;
  videoMediaId?: string | null;
  /**
   * 🔴 Bot tuzağı (`HasHoneypot::HONEYPOT_FIELD`). İnsanlar alanı göremediği
   * için boş gönderir; backend boş dizgiyi `null`'a çevirip görmezden gelir.
   * Dolu gelirse **204 döner ve kaydetmez** — sessiz tuzak (L2).
   *
   * Değer formdan gelir, burada sabitlenmez: sabitleseydik botun yazdığı
   * değer atılır ve tuzak kurulmamış olurdu.
   */
  website: string;
}

/** Lifecycle of the editor's debounced cloud auto-save. */
export type InvitationSaveState = 'idle' | 'saving' | 'saved' | 'error';

/** Form state of an RSVP being composed, before it becomes an RSVPResponse. */
export interface RsvpDraft {
  guestName: string;
  guestCount: number;
  menuPreference: string;
  status: RsvpStatus;
  message: string;
  /**
   * 🔴 Yükleme yanıtı hem kimlik hem URL verir ve taslak **ikisini de** tutar:
   * kimlik gönderilir, URL yalnızca kullanıcıya "yüklendi" göstermek için
   * durur. Yalnızca URL saklansaydı LCV'ye fotoğraf hiçbir zaman bağlanamazdı.
   */
  photoMediaId: string;
  photoUrl: string;
  videoMediaId: string;
  videoUrl: string;
  /** Bot tuzağı; bkz. `RsvpCreatePayload.website`. */
  website: string;
}

/** Event category presented in the /create wizard's first step. */
export interface EventCategory {
  id: string;
  label: string;
  description: string;
  /** Field labels for the two-person name inputs (e.g. Gelin / Damat). */
  nameLabels: [string, string];
  /** Suggested top badge text applied when the category is picked. */
  suggestedTitle: string;
}

export interface TemplatePreset {
  id: string;
  name: string;
  primaryColor: string;
  backgroundStyle: string;
  titleColor: string;
  btnColor: string;
  imageUrl: string;
  /** Event categories this preset can serve (drives category filtering). */
  categories: string[];
}

/** A curated homepage showcase slot: a preset pinned to a single category. */
export interface FeaturedTemplate {
  presetId: string;
  categoryId: string;
}

/** Device frames offered by the preview simulator. */
export type PreviewDevice = 'phone' | 'tablet' | 'laptop';
