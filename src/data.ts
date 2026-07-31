import { EventCategory, FeaturedTemplate, Invitation, RsvpDraft, SubscriptionPlan, TemplatePreset, TimelineEvent } from './types';
import dugun1Preview from './components/templates/dugun/Dugun1/assets/dugun1-left.png';
import dugun2Preview from './components/templates/dugun/Dugun2/assets/dugun2-top.png';
import dugun3Preview from './components/templates/dugun/Dugun3/assets/dugun3-bottom.png';
import dugun4Preview from './components/templates/dugun/Dugun4/assets/dugun4.png';
import dugun5Preview from './components/templates/dugun/Dugun5/assets/dugun5-bottom.png';
import dugunGokyuzuPreview from './components/templates/dugun/DugunGokyuzu/assets/dugun-gokyuzu-kapak.jpg';
import dugunMumIsigiPreview from './components/templates/dugun/DugunMumIsigi/assets/mum-isigi-kapak.jpg';
import dugunGulYapraklariPreview from './components/templates/dugun/DugunGulYapraklari/assets/gul-yapraklari-kapak.jpg';
import dugunDenizIsiltisiPreview from './components/templates/dugun/DugunDenizIsiltisi/assets/deniz-isiltisi-kapak.jpg';
import kinaBordoPreview from './components/templates/kina/KinaBordo/assets/kina-bordo-kapak.jpg';
import nisanSampanyaPreview from './components/templates/nisan/NisanSampanya/assets/nisan-sampanya-kapak.jpg';
import sunnetYildizPreview from './components/templates/sunnet/SunnetYildiz/assets/sunnet-yildiz-kapak.jpg';
import dogumGunuKonfetiPreview from './components/templates/dogum-gunu/DogumGunuKonfeti/assets/dogum-gunu-konfeti-kapak.jpg';
import mezuniyetLacivertPreview from './components/templates/mezuniyet/MezuniyetLacivert/assets/mezuniyet-lacivert-kapak.jpg';
import babyShowerKabarcikPreview from './components/templates/baby-shower/BabyShowerKabarcik/assets/baby-shower-kabarcik-kapak.jpg';
import partiAuroraPreview from './components/templates/parti/PartiAurora/assets/parti-aurora-kapak.jpg';

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: 'dugun',
    label: 'Düğün',
    description: 'Hayatınızın en özel gününe zarif bir davet',
    nameLabels: ['Gelin Adı', 'Damat Adı'],
    suggestedTitle: 'HAYATIMIZIN EN ANLAMLI GÜNÜ'
  },
  {
    id: 'kina',
    label: 'Kına Gecesi',
    description: 'Geleneksel gecenize modern bir dokunuş',
    nameLabels: ['Gelin Adı', 'Damat Adı'],
    suggestedTitle: 'KINA GECEMİZE DAVETLİSİNİZ'
  },
  {
    id: 'nisan',
    label: 'Nişan',
    description: 'Mutluluğa atılan ilk adımı birlikte kutlayın',
    nameLabels: ['Partner 1', 'Partner 2'],
    suggestedTitle: 'NİŞANIMIZA DAVETLİSİNİZ'
  },
  {
    id: 'sunnet',
    label: 'Sünnet',
    description: 'Şehzadenizin büyük günü için görkemli davet',
    nameLabels: ['Çocuğun Adı', 'Aile Adı'],
    suggestedTitle: 'SÜNNET DÜĞÜNÜMÜZE DAVETLİSİNİZ'
  },
  {
    id: 'dogum-gunu',
    label: 'Doğum Günü',
    description: 'Yeni yaşınızı sevdiklerinizle karşılayın',
    nameLabels: ['Doğum Günü Sahibi', 'Ev Sahibi (opsiyonel)'],
    suggestedTitle: 'DOĞUM GÜNÜ PARTİSİNE DAVETLİSİNİZ'
  },
  {
    id: 'mezuniyet',
    label: 'Mezuniyet',
    description: 'Emeklerinizin taçlandığı anı paylaşın',
    nameLabels: ['Mezun Adı', 'Okul / Bölüm'],
    suggestedTitle: 'MEZUNİYET TÖRENİME DAVETLİSİNİZ'
  },
  {
    id: 'baby-shower',
    label: 'Baby Shower',
    description: 'Minik misafirinizi hep birlikte karşılayın',
    nameLabels: ['Anne Adayı', 'Bebeğin Adı'],
    suggestedTitle: 'ARAMIZA HOŞ GELDİN BEBEĞİM'
  },
  {
    id: 'parti',
    label: 'Parti',
    description: 'Unutulmaz bir gece için şık bir başlangıç',
    nameLabels: ['Ev Sahibi 1', 'Ev Sahibi 2 (opsiyonel)'],
    suggestedTitle: 'PARTİMİZE DAVETLİSİNİZ'
  }
];

/** Categories served by the composable style presets (sade/manzara/sekilli/modern). */
const COMPOSABLE_CATEGORIES = ['dugun', 'kina', 'nisan'];

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'sade',
    name: 'Zarif Sadelik',
    primaryColor: '#faf8f3',
    backgroundStyle: 'bg-stone-100',
    titleColor: 'text-stone-800',
    btnColor: 'bg-stone-900 hover:bg-stone-700 text-stone-50',
    imageUrl: '/images/dugun-sade.svg',
    categories: COMPOSABLE_CATEGORIES
  },
  {
    id: 'manzara',
    name: 'Zümrüt Vadisi',
    primaryColor: '#0f172a',
    backgroundStyle: 'bg-slate-900',
    titleColor: 'text-white',
    btnColor: 'bg-emerald-500 hover:bg-emerald-400 text-white',
    imageUrl: '/images/emerald.png',
    categories: COMPOSABLE_CATEGORIES
  },
  {
    id: 'sekilli',
    name: 'Altın Motif',
    primaryColor: '#1a1c23',
    backgroundStyle: 'bg-[#1a1c23]',
    titleColor: 'text-amber-400',
    btnColor: 'bg-gradient-to-r from-amber-400 to-amber-600 text-stone-900',
    imageUrl: '/images/corporate.png',
    categories: COMPOSABLE_CATEGORIES
  },
  {
    id: 'modern',
    name: 'Gece Modası',
    primaryColor: '#09090b',
    backgroundStyle: 'bg-zinc-950',
    titleColor: 'text-white',
    btnColor: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    imageUrl: '/images/moda-gece.svg',
    categories: COMPOSABLE_CATEGORIES
  },
  // Katmanlı görsel düğün şablon ailesi (Dugun1–Dugun5)
  {
    id: 'dugun-1',
    name: 'Zarif Çerçeve (Düğün 1)',
    primaryColor: '#faf8f5',
    backgroundStyle: 'bg-stone-50',
    titleColor: 'text-stone-800',
    btnColor: 'bg-stone-900 hover:bg-stone-700 text-stone-50',
    imageUrl: dugun1Preview,
    categories: ['dugun']
  },
  {
    id: 'dugun-2',
    name: 'Pastel Buket (Düğün 2)',
    primaryColor: '#fbfaf5',
    backgroundStyle: 'bg-[#fbfaf5]',
    titleColor: 'text-[#3c4034]',
    btnColor: 'bg-[#4a5540] hover:bg-[#5d6a50] text-[#f7f6ee]',
    imageUrl: dugun2Preview,
    categories: ['dugun']
  },
  {
    id: 'dugun-3',
    name: 'Bordo Zambak (Düğün 3)',
    primaryColor: '#faf6f3',
    backgroundStyle: 'bg-[#faf6f3]',
    titleColor: 'text-[#452430]',
    btnColor: 'bg-[#54263a] hover:bg-[#6b3049] text-[#faf3ef]',
    imageUrl: dugun3Preview,
    categories: ['dugun']
  },
  {
    id: 'dugun-4',
    name: 'Pembe Kemer (Düğün 4)',
    primaryColor: '#fdf4f5',
    backgroundStyle: 'bg-[#fdf4f5]',
    titleColor: 'text-[#5c3140]',
    btnColor: 'bg-[#a54d68] hover:bg-[#b95d79] text-white',
    imageUrl: dugun4Preview,
    categories: ['dugun']
  },
  {
    id: 'dugun-5',
    name: 'Bahar Bahçesi (Düğün 5)',
    primaryColor: '#f4f7f0',
    backgroundStyle: 'bg-[#f4f7f0]',
    titleColor: 'text-[#39503f]',
    btnColor: 'bg-[#3d5245] hover:bg-[#4c6555] text-[#f2f5ee]',
    imageUrl: dugun5Preview,
    categories: ['dugun']
  },
  {
    // Videolu şablon ailesinin ilki: hero arka planı döngüsel gökyüzü videosu.
    id: 'dugun-gokyuzu',
    name: 'Gökyüzü Rüyası (Videolu)',
    primaryColor: '#eef3f9',
    backgroundStyle: 'bg-[#eef3f9]',
    titleColor: 'text-[#2b3a4f]',
    btnColor: 'bg-[#3f5673] hover:bg-[#4e6a8c] text-[#f4f8fc]',
    imageUrl: dugunGokyuzuPreview,
    categories: ['dugun']
  },
  {
    id: 'dugun-mum-isigi',
    name: 'Mum Işığı (Videolu)',
    primaryColor: '#0a0d14',
    backgroundStyle: 'bg-[#0a0d14]',
    titleColor: 'text-[#f7edd8]',
    btnColor: 'bg-[#e3b878] hover:bg-[#efc98d] text-[#17110a]',
    imageUrl: dugunMumIsigiPreview,
    categories: ['dugun']
  },
  {
    id: 'dugun-gul-yapraklari',
    name: 'Gül Yaprakları (Videolu)',
    primaryColor: '#fdf4f2',
    backgroundStyle: 'bg-[#fdf4f2]',
    titleColor: 'text-[#48302f]',
    btnColor: 'bg-[#a8616c] hover:bg-[#b9737f] text-[#fdf4f2]',
    imageUrl: dugunGulYapraklariPreview,
    categories: ['dugun']
  },
  {
    id: 'dugun-deniz-isiltisi',
    name: 'Deniz Işıltısı (Videolu)',
    primaryColor: '#eef7f6',
    backgroundStyle: 'bg-[#eef7f6]',
    titleColor: 'text-[#22403f]',
    btnColor: 'bg-[#2f5d5b] hover:bg-[#3c716e] text-[#f1faf9]',
    imageUrl: dugunDenizIsiltisiPreview,
    categories: ['dugun']
  },
  // ——— Kategoriye özel videolu temalar ———
  {
    id: 'kina-bordo',
    name: 'Bordo İpek (Videolu)',
    primaryColor: '#1d0710',
    backgroundStyle: 'bg-[#1d0710]',
    titleColor: 'text-[#f2ded3]',
    btnColor: 'bg-[#e8c07a] hover:bg-[#f0cf95] text-[#2b0a15]',
    imageUrl: kinaBordoPreview,
    categories: ['kina']
  },
  {
    id: 'nisan-sampanya',
    name: 'Şampanya İpek (Videolu)',
    primaryColor: '#faf6ee',
    backgroundStyle: 'bg-[#faf6ee]',
    titleColor: 'text-[#3b342a]',
    btnColor: 'bg-[#3b342a] hover:bg-[#4e4536] text-[#faf6ee]',
    imageUrl: nisanSampanyaPreview,
    categories: ['nisan']
  },
  {
    id: 'sunnet-yildiz',
    name: 'Yıldız Tozu (Videolu)',
    primaryColor: '#060f26',
    backgroundStyle: 'bg-[#060f26]',
    titleColor: 'text-[#f2d79b]',
    btnColor: 'bg-[#f2d79b] hover:bg-[#f8e4b4] text-[#0a1633]',
    imageUrl: sunnetYildizPreview,
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-konfeti',
    name: 'Konfeti (Videolu)',
    primaryColor: '#fffaf6',
    backgroundStyle: 'bg-[#fffaf6]',
    titleColor: 'text-[#37271f]',
    btnColor: 'bg-[#e8705f] hover:bg-[#f0836f] text-white',
    imageUrl: dogumGunuKonfetiPreview,
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-lacivert',
    name: 'Tören Işığı (Videolu)',
    primaryColor: '#071328',
    backgroundStyle: 'bg-[#071328]',
    titleColor: 'text-[#f0c761]',
    btnColor: 'bg-[#f0c761] hover:bg-[#f6d780] text-[#071328]',
    imageUrl: mezuniyetLacivertPreview,
    categories: ['mezuniyet']
  },
  {
    id: 'baby-shower-kabarcik',
    name: 'Kabarcıklar (Videolu)',
    primaryColor: '#f4faf7',
    backgroundStyle: 'bg-[#f4faf7]',
    titleColor: 'text-[#38504b]',
    btnColor: 'bg-[#5f9c8f] hover:bg-[#6fada0] text-[#f2fbf8]',
    imageUrl: babyShowerKabarcikPreview,
    categories: ['baby-shower']
  },
  {
    id: 'parti-aurora',
    name: 'Neon Aurora (Videolu)',
    primaryColor: '#06060c',
    backgroundStyle: 'bg-[#06060c]',
    titleColor: 'text-[#ece8fa]',
    btnColor: 'bg-gradient-to-r from-[#ff3fa4] to-[#8b5cff] text-white',
    imageUrl: partiAuroraPreview,
    categories: ['parti']
  },
  // ——— Kategoriye özel yeni tema koleksiyonu ———
  // Sünnet
  {
    id: 'sunnet-klasik',
    name: 'Şehzade (Sünnet · Klasik)',
    primaryColor: '#0a1633',
    backgroundStyle: 'bg-[#0a1633]',
    titleColor: 'text-amber-200',
    btnColor: 'bg-gradient-to-r from-amber-300 to-amber-500 text-[#0a1633]',
    imageUrl: '/images/sunnet-klasik.svg',
    categories: ['sunnet']
  },
  {
    id: 'sunnet-modern',
    name: 'Ferah Turkuaz (Sünnet · Modern)',
    primaryColor: '#f2fbfb',
    backgroundStyle: 'bg-[#f2fbfb]',
    titleColor: 'text-slate-800',
    btnColor: 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white',
    imageUrl: '/images/sunnet-modern.svg',
    categories: ['sunnet']
  },
  // Doğum Günü
  {
    id: 'dogum-gunu-neseli',
    name: 'Konfeti (Doğum Günü · Neşeli)',
    primaryColor: '#fff7fa',
    backgroundStyle: 'bg-[#fff7fa]',
    titleColor: 'text-rose-950',
    btnColor: 'bg-gradient-to-r from-fuchsia-500 via-rose-500 to-orange-400 text-white',
    imageUrl: '/images/dogum-gunu-neseli.svg',
    categories: ['dogum-gunu']
  },
  {
    id: 'dogum-gunu-sik',
    name: 'Altın Gece (Doğum Günü · Şık)',
    primaryColor: '#0c0c0f',
    backgroundStyle: 'bg-[#0c0c0f]',
    titleColor: 'text-white',
    btnColor: 'bg-gradient-to-r from-amber-300 to-yellow-500 text-black',
    imageUrl: '/images/dogum-gunu-sik.svg',
    categories: ['dogum-gunu']
  },
  // Mezuniyet
  {
    id: 'mezuniyet-akademik',
    name: 'Kep & Cübbe (Mezuniyet · Akademik)',
    primaryColor: '#101f3e',
    backgroundStyle: 'bg-[#101f3e]',
    titleColor: 'text-yellow-400',
    btnColor: 'bg-yellow-500 hover:bg-yellow-400 text-[#101f3e]',
    imageUrl: '/images/mezuniyet-akademik.svg',
    categories: ['mezuniyet']
  },
  {
    id: 'mezuniyet-dinamik',
    name: 'Fosfor (Mezuniyet · Dinamik)',
    primaryColor: '#050505',
    backgroundStyle: 'bg-[#050505]',
    titleColor: 'text-white',
    btnColor: 'bg-lime-400 hover:bg-lime-300 text-black',
    imageUrl: '/images/mezuniyet-dinamik.svg',
    categories: ['mezuniyet']
  },
  // Baby Shower
  {
    id: 'baby-shower-pastel',
    name: 'Pamuk Bulut (Baby Shower · Pastel)',
    primaryColor: '#fdf6f8',
    backgroundStyle: 'bg-[#fdf6f8]',
    titleColor: 'text-[#8a5a6d]',
    btnColor: 'bg-rose-300 hover:bg-rose-400 text-white',
    imageUrl: '/images/baby-shower-pastel.svg',
    categories: ['baby-shower']
  },
  {
    id: 'baby-shower-boho',
    name: 'Toprak Kemer (Baby Shower · Boho)',
    primaryColor: '#f6f1e8',
    backgroundStyle: 'bg-[#f6f1e8]',
    titleColor: 'text-[#7a5c3e]',
    btnColor: 'bg-[#b08d63] hover:bg-[#9a7952] text-[#fdfaf4]',
    imageUrl: '/images/baby-shower-boho.svg',
    categories: ['baby-shower']
  },
  // Parti
  {
    id: 'parti-neon',
    name: 'Neon Gece (Parti)',
    primaryColor: '#07070f',
    backgroundStyle: 'bg-[#07070f]',
    titleColor: 'text-cyan-300',
    btnColor: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white',
    imageUrl: '/images/parti-neon.svg',
    categories: ['parti']
  },
  {
    id: 'parti-gala',
    name: 'Gala (Parti · Glamour)',
    primaryColor: '#0a0a0a',
    backgroundStyle: 'bg-[#0a0a0a]',
    titleColor: 'text-[#e8cf7a]',
    btnColor: 'bg-[#d4af37] hover:bg-[#e3c35a] text-black',
    imageUrl: '/images/parti-gala.svg',
    categories: ['parti']
  }
];

/**
 * Kategoriye göre şablon filtreleme — hem /create sihirbazı hem anasayfa
 * vitrini bu tek kaynaktan beslenir. Kategori seçilmemişse (null) tüm
 * koleksiyon döner.
 */
export function getTemplatesForCategory(categoryId: string | null): TemplatePreset[] {
  if (!categoryId) return TEMPLATE_PRESETS;
  return TEMPLATE_PRESETS.filter((preset) => preset.categories.includes(categoryId));
}

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

/** Starter program flow shown when the timeline module is enabled. */
export const DEFAULT_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'tl-1',
    time: '17:00',
    title: 'Karşılama & Kokteyl',
    description: 'Misafirlerimizi hoş geldin kokteyli ile karşılıyoruz.'
  },
  {
    id: 'tl-2',
    time: '19:00',
    title: 'Nikah Töreni',
    description: 'Evet dediğimiz o büyülü ana hep birlikte tanıklık edin.'
  },
  {
    id: 'tl-3',
    time: '20:00',
    title: 'Akşam Yemeği',
    description: 'Özenle hazırlanan menümüz eşliğinde keyifli bir akşam.'
  },
  {
    id: 'tl-4',
    time: '22:00',
    title: 'İlk Dans & Eğlence',
    description: 'Gece boyu sürecek müzik ve dans ile kutlamaya devam.'
  }
];

/** Pre-set gift amounts (₺) offered in the gift registry section. */
export const DEFAULT_GIFT_OPTIONS: number[] = [1000, 2500, 5000];

/**
 * Paid publishing plans (paywall). Feature rows are kept parallel across the
 * three plans so the pricing cards read as a comparison table; `included`
 * drives the check vs struck-through rendering.
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'standart',
    name: 'Standart',
    price: 249,
    tagline: 'Zarif bir başlangıç için temel modüller',
    features: [
      { label: 'Temel şablon koleksiyonu', included: true },
      { label: 'Harita & Konum yönlendirmesi', included: true },
      { label: 'Geri sayım sayacı', included: true },
      { label: 'LCV — maksimum 100 kişi', included: true },
      { label: 'Zarf açılış animasyonu', included: false },
      { label: 'Hikaye / Zaman çizelgesi', included: false },
      { label: 'Fotoğraf & Video galerisi', included: false },
      { label: 'Hediye & IBAN modülü', included: false },
      { label: 'Logosuz özel yayın', included: false }
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 399,
    tagline: 'Premium temalar ve etkileyici anlatım',
    features: [
      { label: 'Premium tema koleksiyonu', included: true },
      { label: 'Harita & Konum yönlendirmesi', included: true },
      { label: 'Geri sayım sayacı', included: true },
      { label: 'Sınırsız LCV', included: true },
      { label: 'Zarf açılış animasyonu', included: true },
      { label: 'Hikaye / Zaman çizelgesi', included: true },
      { label: 'Fotoğraf & Video galerisi', included: false },
      { label: 'Hediye & IBAN modülü', included: false },
      { label: 'Logosuz özel yayın', included: false }
    ]
  },
  {
    id: 'elit',
    name: 'Elit',
    price: 549,
    tagline: 'Sitedeki tüm özellikler, sınırsız deneyim',
    features: [
      { label: 'Premium tema koleksiyonu', included: true },
      { label: 'Harita & Konum yönlendirmesi', included: true },
      { label: 'Geri sayım sayacı', included: true },
      { label: 'Sınırsız LCV', included: true },
      { label: 'Zarf açılış animasyonu', included: true },
      { label: 'Hikaye / Zaman çizelgesi', included: true },
      { label: 'Fotoğraf & Video galerisi', included: true },
      { label: 'Hediye & IBAN modülü', included: true },
      { label: 'Logosuz özel yayın', included: true }
    ]
  }
];

export const INITIAL_INVITATION: Invitation = {
  title: 'HAYATIMIZIN EN ANLAMLI GÜNÜ',
  subtitle: 'Sizleri de bu mutlu günümüzde aramızda görmekten onur duyarız.',
  names: 'Sophia & Elias',
  date: '2026-09-12T19:00',
  venue: 'Çırağan Sarayı Kempinski, İstanbul',
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

  timelineEvents: DEFAULT_TIMELINE_EVENTS,
  galleryImages: []
};

export const INITIAL_RSVP_DRAFT: RsvpDraft = {
  guestName: '',
  guestCount: 2,
  menuPreference: 'Et Menü',
  status: 'Katılıyor',
  message: '',
  photoUrl: '',
  videoUrl: ''
};

