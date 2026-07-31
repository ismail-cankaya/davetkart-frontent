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

const BASE = import.meta.env.BASE_URL;

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
  },
  {
    id: 'kurumsal',
    label: 'Kurumsal Etkinlik',
    description: 'Lansman, zirve ve gala için profesyonel davet',
    nameLabels: ['Kurum / Marka', 'Etkinlik Adı'],
    suggestedTitle: 'ETKİNLİĞİMİZE DAVETLİSİNİZ'
  }
];

/**
 * Videolu şablonların kapak görseli, videonun kendi poster karesidir —
 * ayrıca bir kapak.jpg kopyası tutulmaz. Yol sözleşmesi videoAssets.ts ile
 * birebir aynıdır; slug doğruysa kapak da doğrudur.
 */
const videoCover = (slug: string) =>
  BASE + 'videos/templates/' + slug + '/' + slug + '-desktop-poster.jpg';

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
  // ——— Videosuz modern tasarım dilleri (Aurora / Bento / Noir / Krom) ———
  {
    id: 'dugun-aurora',
    name: 'Aurora Cam (Modern)',
    primaryColor: '#0b0a14',
    backgroundStyle: 'bg-gradient-to-br from-[#1c1430] via-[#a78bfa] to-[#f0abd0]',
    titleColor: 'text-[#faf7ff]',
    btnColor: 'bg-gradient-to-r from-[#f0abd0] to-[#a78bfa] text-[#140f1e]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'nisan-aurora',
    name: 'Aurora Cam (Modern)',
    primaryColor: '#080d16',
    backgroundStyle: 'bg-gradient-to-br from-[#0f2036] via-[#8ba7f0] to-[#7fd8e8]',
    titleColor: 'text-[#f5f9ff]',
    btnColor: 'bg-gradient-to-r from-[#7fd8e8] to-[#8ba7f0] text-[#08131c]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'kina-aurora',
    name: 'Aurora Cam (Modern)',
    primaryColor: '#140610',
    backgroundStyle: 'bg-gradient-to-br from-[#3a0c22] via-[#e0568c] to-[#f0b775]',
    titleColor: 'text-[#fdf2f6]',
    btnColor: 'bg-gradient-to-r from-[#f0b775] to-[#e0568c] text-[#1a0710]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'dugun-bento',
    name: 'Bento Editorial (Modern)',
    primaryColor: '#f7f5f1',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfaf7] via-[#e8e4da] to-[#c3ccb6]',
    titleColor: 'text-[#1f1d1a]',
    btnColor: 'bg-[#1f1d1a] hover:bg-[#35322d] text-[#f7f5f1]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'nisan-bento',
    name: 'Bento Editorial (Modern)',
    primaryColor: '#f4f6f9',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfcfe] via-[#dde5ef] to-[#a8c2dd]',
    titleColor: 'text-[#141d2b]',
    btnColor: 'bg-[#141d2b] hover:bg-[#26344a] text-[#f4f6f9]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'kina-bento',
    name: 'Bento Editorial (Modern)',
    primaryColor: '#faf3f4',
    backgroundStyle: 'bg-gradient-to-br from-[#fdf8f8] via-[#f0dcdd] to-[#dcb9a0]',
    titleColor: 'text-[#3d1620]',
    btnColor: 'bg-[#8e1b2e] hover:bg-[#a52b40] text-[#faf3f4]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'dugun-noir',
    name: 'Noir Minimal (Modern)',
    primaryColor: '#070707',
    backgroundStyle: 'bg-gradient-to-br from-[#1a1814] via-[#0a0a09] to-[#c9a961]',
    titleColor: 'text-[#f4f1ea]',
    btnColor: 'bg-[#c9a961] hover:bg-[#d8ba76] text-[#0b0a07]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'nisan-noir',
    name: 'Noir Minimal (Modern)',
    primaryColor: '#060708',
    backgroundStyle: 'bg-gradient-to-br from-[#151a1f] via-[#08090b] to-[#c4d0dd]',
    titleColor: 'text-[#f2f5f8]',
    btnColor: 'bg-[#c4d0dd] hover:bg-[#d6e0ea] text-[#08090b]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'kina-noir',
    name: 'Noir Minimal (Modern)',
    primaryColor: '#080405',
    backgroundStyle: 'bg-gradient-to-br from-[#241012] via-[#0b0506] to-[#d9564f]',
    titleColor: 'text-[#f5eff0]',
    btnColor: 'bg-[#b3323f] hover:bg-[#c64450] text-[#fdf2f3]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'dugun-krom',
    name: 'Likit Krom (Modern)',
    primaryColor: '#0a0b10',
    backgroundStyle: 'bg-gradient-to-br from-[#f2f6ff] via-[#c9b8f0] to-[#9fd6f5]',
    titleColor: 'text-[#0d1018]',
    btnColor: 'bg-gradient-to-r from-[#dfe6ff] via-[#c9b8f0] to-[#9fd6f5] text-[#0d1018]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'nisan-krom',
    name: 'Likit Krom (Modern)',
    primaryColor: '#080c12',
    backgroundStyle: 'bg-gradient-to-br from-[#f0f8ff] via-[#a9d8ec] to-[#8fb4e0]',
    titleColor: 'text-[#0a1119]',
    btnColor: 'bg-gradient-to-r from-[#dff0fa] via-[#a9d8ec] to-[#8fb4e0] text-[#0a1119]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'kina-krom',
    name: 'Likit Krom (Modern)',
    primaryColor: '#100809',
    backgroundStyle: 'bg-gradient-to-br from-[#fff2e8] via-[#f0b9a0] to-[#d98fa8]',
    titleColor: 'text-[#190c0d]',
    btnColor: 'bg-gradient-to-r from-[#ffeadd] via-[#f0b9a0] to-[#d98fa8] text-[#190c0d]',
    imageUrl: '',
    categories: ['kina']
  },
  // ——— Sinematik video konsept koleksiyonu (8 kategori x 3 konsept) ———
  {
    id: 'dugun-sahil',
    name: 'Sinematik Sahil (Videolu)',
    primaryColor: '#171526',
    backgroundStyle: 'bg-[#171526]',
    titleColor: 'text-[#fbf2e4]',
    btnColor: 'bg-[#f0b46a] hover:bg-[#f6c384] text-[#2a1d13]',
    imageUrl: videoCover('dugun-sahil'),
    categories: ['dugun']
  },
  {
    id: 'dugun-onyx',
    name: 'Onyx & Altın (Videolu)',
    primaryColor: '#080807',
    backgroundStyle: 'bg-[#080807]',
    titleColor: 'text-[#f7edd6]',
    btnColor: 'bg-gradient-to-r from-[#d4af5f] to-[#e8c987] text-[#14100a]',
    imageUrl: videoCover('dugun-onyx'),
    categories: ['dugun']
  },
  {
    id: 'nisan-orman',
    name: 'Orman Rüyası (Videolu)',
    primaryColor: '#101a13',
    backgroundStyle: 'bg-[#101a13]',
    titleColor: 'text-[#f2f0e2]',
    btnColor: 'bg-[#d8b26a] hover:bg-[#e4c384] text-[#1a1409]',
    imageUrl: videoCover('nisan-orman'),
    categories: ['nisan']
  },
  {
    id: 'nisan-alyans',
    name: 'Zarif Alyanslar (Videolu)',
    primaryColor: '#070a10',
    backgroundStyle: 'bg-[#070a10]',
    titleColor: 'text-[#f4f8ff]',
    btnColor: 'bg-gradient-to-r from-[#bcd4ea] to-[#e6eef8] text-[#0b1018]',
    imageUrl: videoCover('nisan-alyans'),
    categories: ['nisan']
  },
  {
    id: 'nisan-bohem',
    name: 'Bohem Gün Batımı (Videolu)',
    primaryColor: '#f6efe4',
    backgroundStyle: 'bg-[#f6efe4]',
    titleColor: 'text-[#453528]',
    btnColor: 'bg-[#a8703f] hover:bg-[#bb8250] text-[#f9f3ea]',
    imageUrl: videoCover('nisan-bohem'),
    categories: ['nisan']
  },
  {
    id: 'sunnet-masallah',
    name: 'Maşallah Kuşağı (Videolu)',
    primaryColor: '#180a0d',
    backgroundStyle: 'bg-[#180a0d]',
    titleColor: 'text-[#fdf0dd]',
    btnColor: 'bg-gradient-to-r from-[#e0b662] to-[#f0d18d] text-[#1d0f06]',
    imageUrl: videoCover('sunnet-masallah'),
    categories: ['sunnet']
  },
  {
    id: 'sunnet-lunapark',
    name: 'Lunapark (Videolu)',
    primaryColor: '#0d0a1c',
    backgroundStyle: 'bg-[#0d0a1c]',
    titleColor: 'text-[#fbf7ff]',
    btnColor: 'bg-[#ffb547] hover:bg-[#ffc468] text-[#241505]',
    imageUrl: videoCover('sunnet-lunapark'),
    categories: ['sunnet']
  },
  {
    id: 'mezuniyet-kampus',
    name: 'Tarihi Kampüs (Videolu)',
    primaryColor: '#12100c',
    backgroundStyle: 'bg-[#12100c]',
    titleColor: 'text-[#f8f1e0]',
    btnColor: 'bg-[#c9a961] hover:bg-[#d8ba76] text-[#1a1409]',
    imageUrl: videoCover('mezuniyet-kampus'),
    categories: ['mezuniyet']
  },
  {
    id: 'mezuniyet-pusula',
    name: 'Pusula & Keşif (Videolu)',
    primaryColor: '#161208',
    backgroundStyle: 'bg-[#161208]',
    titleColor: 'text-[#fbf3dd]',
    btnColor: 'bg-gradient-to-r from-[#d9b45c] to-[#efd493] text-[#1c1509]',
    imageUrl: videoCover('mezuniyet-pusula'),
    categories: ['mezuniyet']
  },
  {
    id: 'kina-saray',
    name: 'Saray Esintisi (Videolu)',
    primaryColor: '#1a0710',
    backgroundStyle: 'bg-[#1a0710]',
    titleColor: 'text-[#fdeee2]',
    btnColor: 'bg-gradient-to-r from-[#e3bd72] to-[#f3d99e] text-[#1f0c07]',
    imageUrl: videoCover('kina-saray'),
    categories: ['kina']
  },
  {
    id: 'kina-mum',
    name: 'Mistik Mumlar (Videolu)',
    primaryColor: '#120608',
    backgroundStyle: 'bg-[#120608]',
    titleColor: 'text-[#fbeadb]',
    btnColor: 'bg-[#b3323f] hover:bg-[#c64450] text-[#fdeee6]',
    imageUrl: videoCover('kina-mum'),
    categories: ['kina']
  },
  {
    id: 'dogum-gunu-luks',
    name: 'Lüks Patlama (Videolu)',
    primaryColor: '#0a0809',
    backgroundStyle: 'bg-[#0a0809]',
    titleColor: 'text-[#fdf4e8]',
    btnColor: 'bg-gradient-to-r from-[#e0b878] to-[#f0d5a4] text-[#171009]',
    imageUrl: videoCover('dogum-gunu-luks'),
    categories: ['dogum-gunu']
  },
  {
    id: 'dogum-gunu-bulut',
    name: 'Sihirli Bulutlar (Videolu)',
    primaryColor: '#fdf2f8',
    backgroundStyle: 'bg-[#fdf2f8]',
    titleColor: 'text-[#43304a]',
    btnColor: 'bg-[#e277b0] hover:bg-[#ea8dbe] text-[#fff5fa]',
    imageUrl: videoCover('dogum-gunu-bulut'),
    categories: ['dogum-gunu']
  },
  {
    id: 'dogum-gunu-zarif',
    name: 'Zarif Kutlama (Videolu)',
    primaryColor: '#0c0a07',
    backgroundStyle: 'bg-[#0c0a07]',
    titleColor: 'text-[#faf1dd]',
    btnColor: 'bg-gradient-to-r from-[#d9bd7c] to-[#efdaa8] text-[#171208]',
    imageUrl: videoCover('dogum-gunu-zarif'),
    categories: ['dogum-gunu']
  },
  {
    id: 'baby-melek',
    name: 'Melek Kanatları (Videolu)',
    primaryColor: '#fbf8f2',
    backgroundStyle: 'bg-[#fbf8f2]',
    titleColor: 'text-[#4a4238]',
    btnColor: 'bg-[#c9a961] hover:bg-[#d6ba79] text-[#fffdf8]',
    imageUrl: videoCover('baby-melek'),
    categories: ['baby-shower']
  },
  {
    id: 'baby-muzik-kutusu',
    name: 'Müzik Kutusu (Videolu)',
    primaryColor: '#f8f1ea',
    backgroundStyle: 'bg-[#f8f1ea]',
    titleColor: 'text-[#4c3d33]',
    btnColor: 'bg-[#a9704f] hover:bg-[#ba8161] text-[#fdf6ef]',
    imageUrl: videoCover('baby-muzik-kutusu'),
    categories: ['baby-shower']
  },
  {
    id: 'baby-gokyuzu',
    name: 'Gökyüzü Macerası (Videolu)',
    primaryColor: '#f2f6fb',
    backgroundStyle: 'bg-[#f2f6fb]',
    titleColor: 'text-[#33455e]',
    btnColor: 'bg-[#5b7ba6] hover:bg-[#6c8cb7] text-[#f4f8fc]',
    imageUrl: videoCover('baby-gokyuzu'),
    categories: ['baby-shower']
  },
  {
    id: 'kurumsal-network',
    name: 'Dinamik Ağ (Videolu)',
    primaryColor: '#06070d',
    backgroundStyle: 'bg-[#06070d]',
    titleColor: 'text-[#f2f6ff]',
    btnColor: 'bg-gradient-to-r from-[#4a7ef0] to-[#8b6cf0] text-[#f4f7ff]',
    imageUrl: videoCover('kurumsal-network'),
    categories: ['kurumsal']
  },
  {
    id: 'kurumsal-cam',
    name: 'Sıvı Cam (Videolu)',
    primaryColor: '#080a12',
    backgroundStyle: 'bg-[#080a12]',
    titleColor: 'text-[#f4f7ff]',
    btnColor: 'bg-[#7ee0d0] hover:bg-[#95e8da] text-[#07231f]',
    imageUrl: videoCover('kurumsal-cam'),
    categories: ['kurumsal']
  },
  {
    id: 'kurumsal-zirve',
    name: 'Zirve & Liderlik (Videolu)',
    primaryColor: '#0a0f1a',
    backgroundStyle: 'bg-[#0a0f1a]',
    titleColor: 'text-[#f6f9ff]',
    btnColor: 'bg-[#e8b06a] hover:bg-[#f0c184] text-[#1a1206]',
    imageUrl: videoCover('kurumsal-zirve'),
    categories: ['kurumsal']
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

