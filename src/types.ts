export type RsvpStatus = 'Katılıyor' | 'Bekleniyor' | 'Katılamıyor';

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

/** Payload the checkout endpoint will receive once the Payments service exists. */
export interface CheckoutPayload {
  tier: SubscriptionTier;
}

export interface CheckoutResult {
  orderId: string;
  tier: SubscriptionTier;
  status: 'paid';
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

/** Payload for `POST /api/rsvps` — the server assigns `id` and `createdAt`. */
export type RsvpCreatePayload = Omit<RSVPResponse, 'id' | 'createdAt'>;

/** Lifecycle of the editor's debounced cloud auto-save. */
export type InvitationSaveState = 'idle' | 'saving' | 'saved' | 'error';

/** Form state of an RSVP being composed, before it becomes an RSVPResponse. */
export interface RsvpDraft {
  guestName: string;
  guestCount: number;
  menuPreference: string;
  status: RsvpStatus;
  message: string;
  photoUrl: string;
  videoUrl: string;
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
