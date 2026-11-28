import { EventCategory, FeaturedTemplate, Invitation, RsvpDraft, SubscriptionPlan, TemplatePreset, TimelineEvent } from './types';
import { DEFAULT_INVITATION_LOCALE } from './invitationText/types';
export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: 'dugun',
    label: 'Düğün',
    description: 'Hayatınızın en özel gününe zarif bir davet',
    nameLabels: ['Gelin Adı', 'Damat Adı'],
    namePlaceholders: ['Gelin adını giriniz', 'Damat adını giriniz'],
    suggestedTitle: 'HAYATIMIZIN EN ANLAMLI GÜNÜ'
  },
  {
    id: 'kina',
    label: 'Kına Gecesi',
    description: 'Geleneksel gecenize modern bir dokunuş',
    nameLabels: ['Gelin Adı', 'Damat Adı'],
    namePlaceholders: ['Gelin adını giriniz', 'Damat adını giriniz'],
    suggestedTitle: 'KINA GECEMİZE DAVETLİSİNİZ'
  },
  {
    id: 'nisan',
    label: 'Nişan',
    description: 'Mutluluğa atılan ilk adımı birlikte kutlayın',
    nameLabels: ['Partner 1', 'Partner 2'],
    namePlaceholders: ['Birinci partnerin adını giriniz', 'İkinci partnerin adını giriniz'],
    suggestedTitle: 'NİŞANIMIZA DAVETLİSİNİZ'
  },
  {
    id: 'sunnet',
    label: 'Sünnet',
    description: 'Şehzadenizin büyük günü için görkemli davet',
    nameLabels: ['Çocuğun Adı', 'Aile Adı'],
    namePlaceholders: ['Çocuğun adını giriniz', 'Aile adını giriniz'],
    suggestedTitle: 'SÜNNET DÜĞÜNÜMÜZE DAVETLİSİNİZ'
  },
  {
    id: 'dogum-gunu',
    label: 'Doğum Günü',
    description: 'Yeni yaşınızı sevdiklerinizle karşılayın',
    nameLabels: ['Doğum Günü Sahibi', 'Ev Sahibi (opsiyonel)'],
    namePlaceholders: ['Doğum günü sahibinin adını giriniz', 'Ev sahibinin adını giriniz'],
    suggestedTitle: 'DOĞUM GÜNÜ PARTİSİNE DAVETLİSİNİZ'
  },
  {
    id: 'mezuniyet',
    label: 'Mezuniyet',
    description: 'Emeklerinizin taçlandığı anı paylaşın',
    nameLabels: ['Mezun Adı', 'Okul / Bölüm'],
    namePlaceholders: ['Mezunun adını giriniz', 'Okul veya bölüm adını giriniz'],
    suggestedTitle: 'MEZUNİYET TÖRENİME DAVETLİSİNİZ'
  },
  {
    id: 'baby-shower',
    label: 'Baby Shower',
    description: 'Minik misafirinizi hep birlikte karşılayın',
    nameLabels: ['Anne Adayı', 'Bebeğin Adı'],
    namePlaceholders: ['Anne adayının adını giriniz', 'Bebeğin adını giriniz'],
    suggestedTitle: 'ARAMIZA HOŞ GELDİN BEBEĞİM'
  },
  {
    id: 'parti',
    label: 'Parti',
    description: 'Unutulmaz bir gece için şık bir başlangıç',
    nameLabels: ['Ev Sahibi 1', 'Ev Sahibi 2 (opsiyonel)'],
    namePlaceholders: ['Ev sahibinin adını giriniz', 'İkinci ev sahibinin adını giriniz'],
    suggestedTitle: 'PARTİMİZE DAVETLİSİNİZ'
  },
  {
    id: 'kurumsal',
    label: 'Kurumsal Etkinlik',
    description: 'Lansman, zirve ve gala için profesyonel davet',
    nameLabels: ['Kurum / Marka', 'Etkinlik Adı'],
    namePlaceholders: ['Kurum veya marka adını giriniz', 'Etkinlik adını giriniz'],
    suggestedTitle: 'ETKİNLİĞİMİZE DAVETLİSİNİZ'
  }
];

/** Display label of a category (e.g. "dugun" → "Düğün"). */
export function getCategoryLabel(categoryId: string): string {
  return EVENT_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
}

/**
 * Anasayfa vitrini — en popüler 5 tasarım, her biri tek bir kategoriye
 * sabitlenir; 6. slot "Tüm Tasarımları Görüntüle" kartına ayrılmıştır.
 */
export const FEATURED_TEMPLATES: FeaturedTemplate[] = [
  { presetId: 'dugun-2', categoryId: 'dugun' },
  { presetId: 'manzara', categoryId: 'kina' },
  { presetId: 'sekilli', categoryId: 'nisan' },
  { presetId: 'sunnet-klasik', categoryId: 'sunnet' },
  { presetId: 'dogum-gunu-neseli', categoryId: 'dogum-gunu' }
];

/** Ready-made invitation messages the wizard offers as one-tap suggestions. */
export const DEFAULT_INVITE_MESSAGES: string[] = [
  'Sizleri de bu mutlu günümüzde aramızda görmekten onur duyarız.',
  'Hayatımızın en özel anına tanıklık etmenizi yürekten diliyoruz.',
  'Bir ömür boyu sürecek yolculuğumuzun ilk adımında yanımızda olun.',
  'Bu anlamlı günü sevdiklerimizle paylaşmak, mutluluğumuzu ikiye katlayacak.'
];

/**
 * Yeni davetiyenin başlangıç programı: kullanıcıya iki BOŞ adım sunulur.
 *
 * 🔴 Örnek etkinlik ya da saat yazılmaz. Dolu bir varsayılan, kullanıcı ona
 * hiç dokunmadan kaydedilir ve misafirin önüne gerçek program gibi çıkardı.
 *
 * 🔴 `id: null` — bunlar henüz kaydedilmemiş adımlardır; kimliği backend
 * kaydederken üretir (K44). `localKey` yalnızca React'in liste anahtarıdır ve
 * sabit veride deterministik tutulur; sonradan eklenen adımların anahtarını
 * `utils/timelineEvents.ts` üretir.
 */
export const DEFAULT_TIMELINE_EVENTS: TimelineEvent[] = [
  { id: null, localKey: 'tl-default-1', time: '', title: '', description: '' },
  { id: null, localKey: 'tl-default-2', time: '', title: '', description: '' }
];

/** Pre-set gift amounts (₺) offered in the gift registry section. */
export const DEFAULT_GIFT_OPTIONS: number[] = [1000, 2500, 5000];

/**
 * Paid publishing plans (paywall). Feature rows are kept parallel across the
 * three plans so the pricing cards read as a comparison table; `included`
 * drives the check vs struck-through rendering.
 *
 * 🔴 Faz 13 (backend K128): FİYAT YOK. Burası paketlerin vitrini (ad,
 * slogan, özellikler); fiyat, indirim ve ödenecek tutar backend'in fiyat
 * kataloğundan gelir (`usePricingStore`). `scripts/verify-pricing.ts` bu
 * dosyada bir fiyat alanı bulursa kırmızı yanar.
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'standart',
    name: 'Standart',
    tagline: 'Zarif bir başlangıç için temel modüller',
    features: [
      { label: 'Temel şablon koleksiyonu', included: true },
      { label: 'Harita & Konum yönlendirmesi', included: true },
      { label: 'Geri sayım sayacı', included: true },
      { label: 'LCV — maksimum 100 kişi', included: true },
      { label: 'Zarf açılış animasyonu', included: false },
      { label: 'Hikaye / Zaman çizelgesi', included: false },
      { label: 'Fotoğraf galerisi', included: false },
      { label: 'Hediye & IBAN modülü', included: false },
      { label: 'Metinleri özelleştirme', included: false },
      { label: 'Logosuz özel yayın', included: false }
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    tagline: 'Premium temalar ve etkileyici anlatım',
    features: [
      { label: 'Premium tema koleksiyonu', included: true },
      { label: 'Harita & Konum yönlendirmesi', included: true },
      { label: 'Geri sayım sayacı', included: true },
      { label: 'Sınırsız LCV', included: true },
      { label: 'Zarf açılış animasyonu', included: true },
      { label: 'Hikaye / Zaman çizelgesi', included: true },
      { label: 'Fotoğraf galerisi', included: false },
      { label: 'Hediye & IBAN modülü', included: false },
      { label: 'Metinleri özelleştirme', included: false },
      { label: 'Logosuz özel yayın', included: false }
    ]
  },
  {
    id: 'elit',
    name: 'Elit',
    tagline: 'Sitedeki tüm özellikler, sınırsız deneyim',
    features: [
      { label: 'Premium tema koleksiyonu', included: true },
      { label: 'Harita & Konum yönlendirmesi', included: true },
      { label: 'Geri sayım sayacı', included: true },
      { label: 'Sınırsız LCV', included: true },
      { label: 'Zarf açılış animasyonu', included: true },
      { label: 'Hikaye / Zaman çizelgesi', included: true },
      { label: 'Fotoğraf galerisi', included: true },
      { label: 'Hediye & IBAN modülü', included: true },
      { label: 'Metinleri özelleştirme', included: true },
      { label: 'Logosuz özel yayın', included: true }
    ]
  }
];

/**
 * Yeni bir davetiyenin başlangıç durumu — sihirbaz formu bununla açılır.
 *
 * 🔴 Kişiye özel içerik alanları (isimler, tarih, konum, ulaşım) BOŞ başlar.
 * Buraya yazılan her değer kullanıcı hiç dokunmasa da otomatik kaydetmeyle
 * sunucuya gider ve misafire gerçek bilgi gibi gösterilir. Yönlendirici
 * metinler form alanlarının placeholder'ında durur, state'te değil.
 *
 * Ana sayfa önizlemesinin örnek içeriği ayrı tutulur: `SHOWCASE_CONTENT`.
 */
export const INITIAL_INVITATION: Invitation = {
  title: 'HAYATIMIZIN EN ANLAMLI GÜNÜ',
  subtitle: 'Sizleri de bu mutlu günümüzde aramızda görmekten onur duyarız.',
  names: '',
  date: '',
  // Varsayılan davetiye İstanbul'da; backend'in `default_timezone` değeriyle aynı.
  timezone: 'Europe/Istanbul',
  venue: '',
  mapUrl: '',
  phoneBackground: 'moda-gece',
  imageTheme: 'moda-gece',
  categoryId: 'dugun',
  palette: 'midnight',

  showEnvelope: true,
  showTimer: true,
  showTimeline: true,
  showGallery: false,
  showGift: false,
  showRSVP: true,

  bankName: '',
  accountHolder: '',
  iban: '',
  giftOptions: DEFAULT_GIFT_OPTIONS,

  rsvpDeadline: '',
  askMenuPreference: true,

  // Faz 24 (K302, K303): davetiyenin dili ve değiştirilen sabit metinler (başta hiçbiri).
  locale: DEFAULT_INVITATION_LOCALE,
  textOverrides: {},

  timelineEvents: DEFAULT_TIMELINE_EVENTS,
  galleryImages: []
};

/** Ana sayfa önizlemesinin örnek içerikle doldurduğu alanlar. */
export type ShowcaseContent = Pick<Invitation, 'names' | 'date' | 'venue' | 'timelineEvents'>;

/** Tanıtımdaki etkinliğin, sayfanın açıldığı günden kaç gün sonra olduğu. */
const SHOWCASE_LEAD_DAYS = 120;

/**
 * Tanıtım etkinliğinin tarihi: bugünden `SHOWCASE_LEAD_DAYS` gün sonra, 19:00.
 *
 * 🔴 Sabit yazılamaz. Sabit bir tarih bir gün geçmişte kalır ve ana sayfadaki
 * geri sayım sıfırda donar, "geçmiş etkinlik" gibi görünür — kod değişmeden
 * bozulan türden bir hata. Biçim, formun ve backend'in kullandığı offset'siz
 * duvar saatidir (`2026-11-14T19:00`, bkz. `utils/eventTime.ts`).
 */
export function upcomingShowcaseDate(now: Date = new Date()): string {
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + SHOWCASE_LEAD_DAYS);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}T19:00`;
}

/**
 * Ana sayfadaki canlı önizlemenin tanıtım içeriği.
 *
 * 🔴 Kullanıcı verisi DEĞİLDİR ve store'a hiç yazılmaz: yalnızca taslakta
 * henüz içerik yokken önizlemeye bindirilir (bkz. `utils/showcase.ts`).
 * Böylece tanıtım dolu görünür, sihirbaz formu ise boş açılır.
 */
export const SHOWCASE_CONTENT: ShowcaseContent = {
  names: 'Sophia & Elias',
  date: upcomingShowcaseDate(),
  venue: 'Çırağan Sarayı Kempinski, İstanbul',
  timelineEvents: [
    {
      id: null,
      localKey: 'tl-showcase-1',
      time: '17:00',
      title: 'Karşılama & Kokteyl',
      description: 'Misafirlerimizi hoş geldin kokteyli ile karşılıyoruz.'
    },
    {
      id: null,
      localKey: 'tl-showcase-2',
      time: '19:00',
      title: 'Nikah Töreni',
      description: 'Evet dediğimiz o büyülü ana hep birlikte tanıklık edin.'
    },
    {
      id: null,
      localKey: 'tl-showcase-3',
      time: '20:00',
      title: 'Akşam Yemeği',
      description: 'Özenle hazırlanan menümüz eşliğinde keyifli bir akşam.'
    },
    {
      id: null,
      localKey: 'tl-showcase-4',
      time: '22:00',
      title: 'İlk Dans & Eğlence',
      description: 'Gece boyu sürecek müzik ve dans ile kutlamaya devam.'
    }
  ]
};

export const INITIAL_RSVP_DRAFT: RsvpDraft = {
  guestName: '',
  guestCount: 2,
  menuPreference: 'Et Menü',
  status: 'attending',
  message: '',
  // Tuzak boş başlar; insan onu göremediği için boş kalır (L2).
  website: ''
};

