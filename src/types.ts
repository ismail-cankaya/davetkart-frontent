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

/**
 * POST /api/auth/reset-password gövdesi (Faz 10, FE 10.16) — backend
 * ResetPasswordRequest ile birebir. `token` ve `email` maildeki bağlantıdan gelir.
 */
export interface PasswordResetPayload {
  token: string;
  email: string;
  password: string;
}

/** `/sifremi-unuttum`'a giderken taşınan adres: giriş formunda yazılanı yeniden yazdırmamak için. */
export interface ForgotPasswordState {
  email?: string;
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

/**
 * Galerideki tek bir fotoğraf.
 *
 * 🔴 Sıra ve üyelik SUNUCUNUNDUR: yükleme fotoğrafı galerinin sonuna sunucu
 * tarafında ekler, silme ayrı bir uçtan yapılır. Galeri davetiye kaydıyla
 * (PUT) GÖNDERİLMEZ — gönderilseydi yükleme ile otomatik kaydetme yarışında
 * yeni fotoğraf kaybolurdu.
 */
export interface GalleryImage {
  /**
   * `media` kaydının ULID'si — silme ucu bunu ister. Misafir görünümünde
   * `null`: misafir galeriyi düzenlemez ve sunucu ona kimlik göndermez (C5).
   */
  id: string | null;
  /** Sunucunun türettiği genel adres (E1). */
  url: string;
}

export interface Invitation {
  title: string;
  subtitle: string;
  names: string;
  /**
   * 🔴 **Duvar saati**, offset'siz: `2026-11-14T19:00`.
   *
   * Bu metin tek başına bir ANI göstermez — hangi saat diliminde okunacağı
   * `timezone` alanında durur. `new Date()` ile doğrudan ayrıştırmak, onu
   * tarayıcının yerel saati saymak demektir; bkz. `utils/eventTime.ts`.
   */
  date: string;
  /**
   * Etkinliğin IANA saat dilimi (`Europe/Istanbul`).
   *
   * Misafir ucunda **her zaman dolu** gelir (backend boşsa varsayılanı
   * koyar); sahibin ucunda kullanıcı seçmediyse boş olabilir.
   */
  timezone: string;
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
  /**
   * Faz 10 (FE 10.20 · K102): "DavetKart ile hazırlandı" imzası çizilsin mi?
   * Sunucunun kararı (Elit'te `false`): misafir yanıtında ve FE 10.21'den beri
   * sahibin kaydında da gelir. Kullanıcı yazmaz, istek gövdesine girmez.
   * Yoksa (kaydedilmemiş taslak) imza çizilir.
   */
  showBranding?: boolean;

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
  /** Galeri fotoğrafları, sunucunun tuttuğu sırayla. */
  galleryImages: GalleryImage[];
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

/**
 * Bir paketin VİTRİNİ: ad, slogan, özellik listesi.
 *
 * 🔴 Faz 13 (backend K128): **fiyat burada YOK.** Fiyat, indirim ve ödenecek
 * tutar backend'in fiyat kataloğundan gelir (`PlanPrice`, `usePricingStore`).
 * Eskiden burada duran `price` alanı, backend'deki tahsilat fiyatının elle
 * tutulan bir kopyasıydı; indirim geldiği gün iki sayı ayrışırdı.
 */
export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  features: PlanFeature[];
}

/**
 * Otomatik indirimin kaynağı — backend `PromotionKind` (Faz 13).
 *
 * | Değer | Anlamı |
 * |---|---|
 * | `first_publish` | Kullanıcının ilk yayını (hiç ödenmiş siparişi yok) |
 * | `campaign` | İşletmenin açtığı süreli kampanya |
 */
export type PromotionKind = 'first_publish' | 'campaign';

/** Bir fiyata uygulanmış otomatik indirim (Faz 13). */
export interface PlanPromotion {
  kind: PromotionKind;
  /** Gösterim için yüzde (60 → "%60"). Hesap için KULLANILMAZ: tutar `discountMinor`. */
  percent: number;
  /** Bu indirimin düştüğü tutar (kuruş). */
  discountMinor: number;
  /** Kampanyanın bitişi (ISO 8601, UTC); ilk yayın indiriminde ve süresiz kampanyada `null`. */
  endsAt: string | null;
}

/**
 * Bir paketin fiyat dökümü — backend `PriceQuoteResource` (Faz 13).
 *
 * 🔴 Frontend HİÇBİR sayıyı hesaplamaz. Üstü çizili fiyat `priceMinor`, büyük
 * yazılan fiyat `totalMinor`; ikisi de backend'in tahsil edeceği hesaptan.
 * `priceMinor × (1 − percent)` gibi bir hesap yuvarlamada kartla ayrışırdı.
 */
export interface PlanPrice {
  tier: SubscriptionTier;
  /** Liste fiyatı (kuruş). */
  priceMinor: number;
  promotion: PlanPromotion | null;
  /** Toplam indirim (kuruş). */
  discountMinor: number;
  /** Ödenecek (kuruş). */
  totalMinor: number;
}

/** Fiyat kataloğunda adı geçebilen ödeme yöntemleri — backend `PaymentMethod` (Faz 13, K134). */
export type CatalogPaymentMethod = 'card' | 'bank_transfer' | 'gift_code';

/**
 * `GET /public/plans` (misafir) ve `GET /pricing` (oturumlu) — backend `PricingResource` (Faz 13).
 *
 * `paymentMethods` backend `.env`'indeki `PAYMENT_METHODS` satırıdır: hangi
 * ödeme düğmelerinin çizileceğine bu liste karar verir. Backend kapalı yöntemi
 * zaten reddeder (403 `PAYMENT_METHOD_DISABLED`); liste kullanıcıyı o
 * hataya hiç götürmemek için.
 */
export interface PricingCatalog {
  currency: string;
  /** `true`: kullanıcıya özel (ilk yayın indirimi hesaba katıldı). */
  personalized: boolean;
  /** İlk yayın indirimi yüzdesi; `0` = kapalı. Misafire "ilk yayınınıza %60" yazmak için. */
  firstPublishPercent: number;
  /** Üç paket, rank sırasında (standart → gold → elit). */
  plans: PlanPrice[];
  /** Açık yöntemler, sabit sırada (kart → havale → kod). */
  paymentMethods: CatalogPaymentMethod[];
  /** Havale açıkken hesap bilgisi; kapalıyken `null` (K135). */
  bankTransfer: BankTransferAccount | null;
}

/**
 * Checkout gövdesi.
 *
 * 🔴 **Fiyat gövdeye KONULMAZ.** Backend onu `config`'ten okur (M6): fiyatı
 * istemciden almak, istemcinin kendi fiyatını yazmasına izin vermek olurdu.
 * Faz 13: frontend fiyatı yalnızca GÖSTERİR ve onu da backend'den okur.
 */
export interface CheckoutPayload {
  tier: SubscriptionTier;
  /**
   * Faz 11: isteğe bağlı hediye kodu. Kodsuz ödemede anahtar HİÇ gönderilmez.
   * İndirim de fiyat gibi sunucuda hesaplanır; gövdede tutar ya da indirim yok.
   */
  giftCode?: string;
}

/** Hediye kodunun faydası — backend `GiftCodeBenefit` enum'ı (Faz 11). */
export type GiftCodeBenefit = 'free' | 'percent' | 'fixed';

/**
 * `POST /gift-codes/preview` yanıtı (Faz 11; Faz 13'te `PlanPrice` alanları eklendi).
 *
 * 🔴 Para alanları **kuruş** (tam sayı), adları bu yüzden `…Minor` ile biter.
 * Gösterim için `formatTryMinor()`.
 *
 * Faz 13 (backend K133): kod, otomatik indirimden (ilk yayın / kampanya) SONRA
 * kalan fiyata uygulanır. `discountMinor` TOPLAM indirimdir; kodun kendi payı
 * `giftDiscountMinor`. `priceMinor − discountMinor = totalMinor` her zaman doğru.
 *
 * Önizleme bir söz değildir: kod arada tükenebilir, karar checkout'ta verilir.
 */
export interface GiftCodePreview extends PlanPrice {
  benefit: GiftCodeBenefit;
  /** Hediye kodunun payı (kuruş). */
  giftDiscountMinor: number;
  currency: string;
}

/**
 * Sipariş yaşam döngüsü — backend `OrderStatus` enum'ı.
 *
 * `expired` (Faz 10, K89): ödeme penceresi doldu, sağlayıcıdan sonuç GELMEDİ.
 * `failed`'dan farkı: kesin bir red değil, bir bekleme sonu — geç gelen ödeme
 * siparişi yine `paid` yapabilir. Arayüz ikisini de "tekrar dene" diye
 * gösterebilir; ama `expired` bir siparişin sonradan `paid` olabileceğini
 * bilmek, ödeme dönüş sayfasının (10.27) yoklamayı erken bırakmamasını sağlar.
 */
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';

/**
 * `POST /invitations/{id}/checkout` ve `POST /payments/checkout` yanıtı (201).
 *
 * 🔴 **Kodsuz ödemede `status` her zaman `pending` doğar.** `paid`'e geçişi
 * sağlayıcının **webhook**'u yapar; yani checkout bir ödeme değil, bir ödeme
 * *niyetidir*. Bunu `paid` sanmak, kullanıcıya "ödendi" deyip hemen ardından
 * yayınlamada 402 göstermek demektir — planın en pahalı maddesi buydu.
 *
 * Faz 11 (backend K107) — TEK istisna: hediye kodu tutarı **0**'a indirirse
 * sipariş sağlayıcıya gitmeden `paid` doğar ve `redirectUrl` doğrudan başarı
 * sayfasını gösterir. Bunu bilmenin yolu yanıttaki `status`'tur; istemci
 * kendi hesabıyla "bedava oldu" varsaymaz.
 */
/**
 * Faz 12 (backend K118 · K119): ödeme sayfasına NASIL gidileceği.
 *
 * | `type` | Ne yapılır |
 * |---|---|
 * | `redirect` | Tarayıcı `url`'e gider (Fake, hediye siparişi) |
 * | `form` | Tarayıcı `fields`'ı `url`'e POST eder (Shopier'in imzalı formu) |
 *
 * Birleşik tip (tagged union): `type` okunmadan `fields`'a erişilemez. "İkisi
 * de dolu" gibi anlamsız durumlar yazılamaz.
 *
 * 🔴 `fields` imzalıdır (tutar, sipariş kimliği). Değiştirilmeden gönderilir;
 * bir alan değişirse Shopier ödemeyi reddeder.
 */
export type CheckoutAction =
  | { type: 'redirect'; url: string }
  | { type: 'form'; url: string; fields: Record<string, string> };

export interface CheckoutResult {
  orderId: string;
  tier: SubscriptionTier;
  status: OrderStatus;
  /**
   * Faz 12: ödeme sayfasına gidiş. Yalnızca checkout yanıtında gelir (C7).
   * `type: 'redirect'` iken eski `redirectUrl` de aynı adresle gelir; `form`'da
   * `redirectUrl` YOKTUR. Okumak için `checkoutActionOf()` (services/payments).
   */
  checkout?: CheckoutAction;
  /**
   * Sağlayıcının ödeme sayfası. Kullanıcı buraya **gitmeli**; ödeme
   * uygulamanın dışında tamamlanır.
   *
   * 🔴 Opsiyonel alan yoksa **anahtar hiç gelmez**, `null` gelmez (C7).
   * `redirectUrl === undefined` kontrolü doğru olandır.
   */
  redirectUrl?: string;
  /** Faz 11: hediye kodunun düştüğü tutar (kuruş). Yalnızca indirim varsa gelir (C7). */
  discountMinor?: number;
}

/**
 * `GET /orders` ve `GET /orders/{id}` — backend `OrderResource` (Faz 10, 10.24).
 *
 * Ödeme dönüş sayfası (`/odeme/basarili`) bu kaydı yoklayarak "ödendi mi?"
 * sorusunu sorar. Sağlayıcı alanları BİLEREK yok (C1).
 *
 * Faz 13 (backend 13.7): siparişe DONDURULMUŞ fiyat dökümü geliyor
 * (`priceMinor`, `totalMinor`, `currency`, `promotion`). Katalog bugün başka
 * bir şey söyleyebilir; bu siparişin gerçek tutarı budur. Eski bir backend'e
 * karşı da çalışılabilsin diye alanlar isteğe bağlı.
 *
 * Nullable alanların anahtarı HER ZAMAN gelir; `null` bir bilgidir (N4).
 * `CheckoutResult.redirectUrl`'den farkı bu: o bağlama göre var olan bir alan.
 */
export interface OrderRecord {
  orderId: string;
  tier: SubscriptionTier;
  status: OrderStatus;
  /** `null`: paket siparişi ya da silme penceresinde serbest bırakılmış tekil sipariş (K82). */
  invitationId: string | null;
  /** ISO 8601 (UTC). */
  createdAt: string;
  /** ISO 8601 (UTC). `null` = henüz ödenmedi (`pending`, `failed`, `expired`). */
  paidAt: string | null;
  /** Faz 11: toplam indirim (kuruş). Yalnızca indirim varsa gelir (C7). */
  discountMinor?: number;
  /** Faz 13: sipariş anındaki liste fiyatı (kuruş). */
  priceMinor?: number;
  /** Faz 13: ödenen / ödenecek (kuruş). */
  totalMinor?: number;
  /** Faz 13: ISO 4217. */
  currency?: string;
  /** Faz 13: otomatik indirim; yüzde yok, sipariş tutarı dondurur. */
  promotion?: { kind: PromotionKind; discountMinor: number } | null;
}

/**
 * Ödeme sayfasındaki (`/odeme`) iki yöntem.
 *
 * | Yöntem | Tahsilat | Onay |
 * |---|---|---|
 * | `card` | Ödeme sağlayıcısı (Shopier ya da muadili) | Sağlayıcının bildirimi (webhook) |
 * | `bank_transfer` | Şirket hesabına Havale/EFT | Hesap hareketinin elle eşleştirilmesi |
 */
export type PaymentMethod = 'card' | 'bank_transfer';

/**
 * Havale/EFT için şirket hesabı — Faz 13'ten beri backend'in fiyat
 * kataloğundan gelir (`PricingCatalog.bankTransfer`, K135).
 *
 * `iban` boşluksuz ve büyük harflidir (`TR…`, 26 karakter); gruplanmış
 * gösterim `utils/iban.ts` → `formatIban()` ile yapılır. Kopyalanan değer bu
 * ham hâlidir: bankaların IBAN alanları boşluk kabul etmeyebilir.
 */
export interface BankTransferAccount {
  bankName: string;
  accountHolder: string;
  iban: string;
}

/** Lifecycle of an invitation stored on the Invitation microservice. */
export type InvitationStatus = 'published' | 'saved';

/** An invitation record as returned by `GET /api/invitations`. */
export interface InvitationRecord {
  id: string;
  status: InvitationStatus;
  /** ISO timestamp of the last server-side update. */
  updatedAt: string;
  /**
   * Yayın anı (ISO 8601). `null` = hiç yayınlanmadı. Faz 10, backend 10.21.
   *
   * `updatedAt` bunun vekili OLAMAZ: yayından sonraki tek bir düzenleme onu tazeler.
   */
  publishedAt: string | null;
  /**
   * Bu andan ÖNCE silinirse, davetiye için ödenen tekil siparişin hakkı serbest
   * kalır; sonra silinirse yanar (K82). `null` = hiç yayınlanmadı, hak harcanmadı.
   *
   * 🔴 Pencerenin uzunluğu ("3 gün") BİLEREK burada hesaplanmıyor: backend config'ten
   * geliyor ve silme kuralıyla aynı satırdan türetiliyor. Frontend'e ikinci bir `3`
   * yazılsaydı config değiştiğinde uyarı ile gerçek davranış sessizce ayrışırdı.
   */
  releasableUntil: string | null;
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
  /**
   * Faz 10 (FE 10.18 · K101): yalnızca misafirin KENDİ gönderim/güncelleme
   * yanıtında gelir; sahibin listesinde yoktur. Aynı yanıtı sonradan
   * güncellemenin anahtarı.
   */
  editCode?: string;
}

/** Bu cihazdan verilmiş yanıtın kimliği ve düzenleme kodu (FE 10.18 · K101). */
export interface RsvpReceipt {
  rsvpId: string;
  editCode: string;
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
  /**
   * İsim alanlarının yönlendirici placeholder'ları ("Gelin adını giriniz").
   *
   * 🔴 Örnek bir isim DEĞİL, talimat taşır: gerçek veri gibi görünen metin
   * ("Örn. Sophia") kullanıcıya alan doluymuş izlenimi verir.
   */
  namePlaceholders: [string, string];
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
  /**
   * Faz 10 (FE 10.20 · K102): yayınlamak için gereken en düşük plan.
   * Yalnızca premium (videolu) temalarda `'gold'`; yoksa her planda yayınlanır.
   * Backend `config/davetkart.php` → `preset_tiers` ile AYNI liste.
   */
  minimumTier?: SubscriptionTier;
  /**
   * Kategoriye göre kart görünümü. Aynı preset birden çok kategoriye hizmet
   * ettiğinde (sade/manzara/sekilli/modern) her kategori kartını kendi
   * kimliğiyle gösterir; verilmeyen alanlar preset'in kendisinden gelir.
   * Yalnızca görsel alanlar: plan (`minimumTier`) kategoriye göre değişmez.
   */
  categoryOverrides?: Partial<Record<string, TemplatePresetLook>>;
}

/** Bir preset kartının kategoriye göre değişebilen görsel alanları. */
export type TemplatePresetLook = Partial<
  Pick<TemplatePreset, 'name' | 'primaryColor' | 'backgroundStyle' | 'titleColor' | 'btnColor' | 'imageUrl'>
>;

/** A curated homepage showcase slot: a preset pinned to a single category. */
export interface FeaturedTemplate {
  presetId: string;
  categoryId: string;
}

/** Device frames offered by the preview simulator. */
export type PreviewDevice = 'phone' | 'tablet' | 'laptop';

/** WGS84 koordinatı (derece). */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/**
 * Konum aramasında listelenen tek bir öneri.
 *
 * Öneriler backend'in harita sağlayıcısı vekilinden gelir (bkz.
 * `services/places.ts`); sağlayıcı anahtarı frontend'e hiç inmez.
 */
export interface PlaceSuggestion {
  /** Sağlayıcının yer kimliği (Google `place_id`); yalnızca liste anahtarı. */
  placeId: string;
  /** Birincil satır: "Çırağan Sarayı Kempinski". */
  name: string;
  /** İkincil satır: "Çırağan Cd. No:32, Beşiktaş/İstanbul". */
  address: string;
  location: GeoPoint;
}

// ─────────────────────────────────────────────── Hesap ayarları (Faz 14)

/**
 * Bir siparişin hakkı ŞU AN nerede — backend `EntitlementState` (Faz 14, K140).
 *
 * | Değer | Anlamı | Sayaçta |
 * |---|---|---|
 * | `available` | Ödendi, hiçbir davetiyeye bağlı değil | **asıl sayı** |
 * | `in_use` | Bir davetiyede (yayında ya da taslakta) | bilgi |
 * | `refund_requested` | İptal istendi, karar bekleniyor; hak donmuş | bilgi |
 * | `pending` | Ödeme onayı bekleniyor (ör. havale) | hak değil |
 * | `consumed` | Davetiye 3 gün sonra silindi, hak yandı | geçmiş |
 * | `refunded` | Para iade edildi | geçmiş |
 */
export type EntitlementState = 'available' | 'in_use' | 'refund_requested' | 'pending' | 'consumed' | 'refunded';

/** Bir hakkın neden iptal edilemediği — backend `RefundBlocker` (K139). */
export type RefundBlocker = 'already_requested' | 'not_paid' | 'in_use' | 'free' | 'window_closed';

export type RefundRequestStatus = 'requested' | 'approved' | 'rejected' | 'withdrawn';

/** Bir planın kova sayıları. Üç plan her zaman gelir, sıfır olsa da. */
export interface TierEntitlementCounts {
  tier: SubscriptionTier;
  available: number;
  inUse: number;
  refundRequested: number;
  pending: number;
  consumed: number;
  refunded: number;
}

/** Hak listesinin bir satırı — bir sipariş. */
export interface EntitlementRight {
  orderId: string;
  tier: SubscriptionTier;
  state: EntitlementState;
  createdAt: string | null;
  paidAt: string | null;
  totalMinor: number;
  currency: string;
  /** Bağsız hakta `null`. Yanmış hakta `deleted: true` (çöpte) ya da `null` (kalıcı silindi). */
  invitation: {
    id: string;
    title: string;
    publishedAt: string | null;
    releasableUntil: string | null;
    deleted: boolean;
  } | null;
  refund: {
    /** İptal düğmesi bu alana göre gösterilir; kararı yine sunucu verir. */
    eligible: boolean;
    blocker: RefundBlocker | null;
    /** İade penceresinin sonu (ödemeden itibaren 14 gün). */
    windowEndsAt: string | null;
    request: { id: string; status: RefundRequestStatus; createdAt: string | null } | null;
  };
}

/** `GET /api/account/entitlements` — "Planlarım". */
export interface AccountEntitlements {
  tiers: TierEntitlementCounts[];
  totalAvailable: number;
  rights: EntitlementRight[];
}

/** `GET /api/auth/sessions` satırı — bir cihazdaki oturum (K143). IP yok. */
export interface AccountSession {
  id: string;
  /** `null`: tanınmayan tarayıcı. */
  browser: string | null;
  system: string | null;
  createdAt: string | null;
  lastUsedAt: string | null;
  /** İsteği yapan oturum: "bu cihaz". */
  current: boolean;
}

export interface ProfilePayload {
  firstName: string;
  lastName: string;
}

export interface PasswordChangePayload {
  currentPassword: string;
  password: string;
}

export interface EmailChangePayload {
  email: string;
  currentPassword: string;
}
