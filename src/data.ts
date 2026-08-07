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
  // ——— Denge turu: güçlü dillerin zayıf kategorilere taşınması ———
  {
    id: 'parti-krom',
    name: 'Likit Krom',
    primaryColor: '#0a0714',
    backgroundStyle: 'bg-gradient-to-br from-[#fdf4ff] via-[#c084fc] to-[#8ab6f5]',
    titleColor: 'text-[#12081c]',
    btnColor: 'bg-gradient-to-r from-[#f0d4ff] via-[#c084fc] to-[#8ab6f5] text-[#12081c]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'parti-noir',
    name: 'Noir Minimal',
    primaryColor: '#070708',
    backgroundStyle: 'bg-gradient-to-br from-[#1a1814] via-[#0a0a09] to-[#c9a961]',
    titleColor: 'text-[#f6f3ec]',
    btnColor: 'bg-[#c9a961] hover:bg-[#d8ba76] text-[#0b0a07]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'parti-riso',
    name: 'Risograph Poster',
    primaryColor: '#f7f3e9',
    backgroundStyle: 'bg-gradient-to-br from-[#fbf7ed] via-[#1f6feb] to-[#e0453f]',
    titleColor: 'text-[#1a1712]',
    btnColor: 'bg-[#1a1712] hover:bg-[#39332c] text-[#f7f3e9]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-bento',
    name: 'Bento Editorial',
    primaryColor: '#f5f6f8',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfcfd] via-[#e4e9ef] to-[#1f7a8c]',
    titleColor: 'text-[#12161c]',
    btnColor: 'bg-[#12161c] hover:bg-[#242b34] text-[#f5f6f8]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  {
    id: 'kurumsal-noir',
    name: 'Noir Minimal',
    primaryColor: '#060607',
    backgroundStyle: 'bg-gradient-to-br from-[#171a1c] via-[#08090a] to-[#a8b4bd]',
    titleColor: 'text-[#f4f6f7]',
    btnColor: 'bg-[#a8b4bd] hover:bg-[#bdc7ce] text-[#08090a]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  {
    id: 'mezuniyet-bento',
    name: 'Bento Editorial',
    primaryColor: '#f6f5f1',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfaf7] via-[#e8e5da] to-[#8a6d2f]',
    titleColor: 'text-[#1c1a14]',
    btnColor: 'bg-[#1c1a14] hover:bg-[#332f26] text-[#f6f5f1]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'mezuniyet-noir',
    name: 'Noir Minimal',
    primaryColor: '#060606',
    backgroundStyle: 'bg-gradient-to-br from-[#191614] via-[#090908] to-[#b08d4f]',
    titleColor: 'text-[#f5f2ea]',
    btnColor: 'bg-[#b08d4f] hover:bg-[#c29f63] text-[#0a0806]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'mezuniyet-riso',
    name: 'Risograph Poster',
    primaryColor: '#f4f4ee',
    backgroundStyle: 'bg-gradient-to-br from-[#f8f8f2] via-[#1b5e9c] to-[#d94f2b]',
    titleColor: 'text-[#191814]',
    btnColor: 'bg-[#191814] hover:bg-[#37362f] text-[#f4f4ee]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'sunnet-aurora',
    name: 'Aurora Cam',
    primaryColor: '#070d1c',
    backgroundStyle: 'bg-gradient-to-br from-[#0f2140] via-[#5fb8e8] to-[#7d8ff0]',
    titleColor: 'text-[#f4f8ff]',
    btnColor: 'bg-gradient-to-r from-[#5fb8e8] to-[#7d8ff0] text-[#07131f]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'sunnet-deco',
    name: 'Art Deco Gala',
    primaryColor: '#0a0a08',
    backgroundStyle: 'bg-gradient-to-br from-[#1c1810] via-[#0e0c08] to-[#d9b45c]',
    titleColor: 'text-[#f9f3e2]',
    btnColor: 'bg-gradient-to-r from-[#d9b45c] to-[#f0d79a] text-[#15110a]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-aurora',
    name: 'Aurora Cam',
    primaryColor: '#100716',
    backgroundStyle: 'bg-gradient-to-br from-[#2c1140] via-[#ff7ac6] to-[#a78bfa]',
    titleColor: 'text-[#fdf5fd]',
    btnColor: 'bg-gradient-to-r from-[#ff7ac6] to-[#a78bfa] text-[#1a0714]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'dogum-gunu-deco',
    name: 'Art Deco Gala',
    primaryColor: '#0c0a08',
    backgroundStyle: 'bg-gradient-to-br from-[#221a12] via-[#100d09] to-[#e8b878]',
    titleColor: 'text-[#fdf5e8]',
    btnColor: 'bg-gradient-to-r from-[#e8b878] to-[#f6dcae] text-[#17110a]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'baby-bento',
    name: 'Bento Editorial',
    primaryColor: '#f7f6f2',
    backgroundStyle: 'bg-gradient-to-br from-[#fcfbf9] via-[#e8ebe6] to-[#7fa88c]',
    titleColor: 'text-[#1f1e1a]',
    btnColor: 'bg-[#1f1e1a] hover:bg-[#37352f] text-[#f7f6f2]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'baby-kagit',
    name: 'Kağıt & Mühür',
    primaryColor: '#f4f1ea',
    backgroundStyle: 'bg-gradient-to-br from-[#f8f5ef] via-[#e8e2d3] to-[#3f6b57]',
    titleColor: 'text-[#2b2618]',
    btnColor: 'bg-[#2b2618] hover:bg-[#443d29] text-[#f8f5ef]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  // ——— Denge turu II: her kategoriye eksik kalan iki tasarım dili ———
  {
    id: 'dugun-riso',
    name: 'Risograph Poster',
    primaryColor: '#f7f3ea',
    backgroundStyle: 'bg-gradient-to-br from-[#fbf8f1] via-[#d9536f] to-[#5f7f57]',
    titleColor: 'text-[#1b1712]',
    btnColor: 'bg-[#1b1712] hover:bg-[#3b352c] text-[#f7f3ea]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'dugun-bilet',
    name: 'Davet Bileti',
    primaryColor: '#f4efe6',
    backgroundStyle: 'bg-gradient-to-br from-[#faf6ee] via-[#e4dbc9] to-[#9c3b46]',
    titleColor: 'text-[#26201a]',
    btnColor: 'bg-[#26201a] hover:bg-[#3f372c] text-[#f8f4ec]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-deco',
    name: 'Art Deco Gala',
    primaryColor: '#120609',
    backgroundStyle: 'bg-gradient-to-br from-[#2a0d14] via-[#150609] to-[#cf9f4e]',
    titleColor: 'text-[#fbf1e2]',
    btnColor: 'bg-gradient-to-r from-[#cf9f4e] to-[#ecd5a2] text-[#1a0b0d]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'kina-riso',
    name: 'Risograph Poster',
    primaryColor: '#f8f1e4',
    backgroundStyle: 'bg-gradient-to-br from-[#fcf6ea] via-[#e04b2e] to-[#0f7a72]',
    titleColor: 'text-[#1d1712]',
    btnColor: 'bg-[#1d1712] hover:bg-[#3d3227] text-[#f8f1e4]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-deco',
    name: 'Art Deco Gala',
    primaryColor: '#080b16',
    backgroundStyle: 'bg-gradient-to-br from-[#141b2e] via-[#0a0e1a] to-[#dcc188]',
    titleColor: 'text-[#f7f2e6]',
    btnColor: 'bg-gradient-to-r from-[#dcc188] to-[#f2e2b8] text-[#0d1120]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'nisan-riso',
    name: 'Risograph Poster',
    primaryColor: '#f2f4f7',
    backgroundStyle: 'bg-gradient-to-br from-[#f8fafc] via-[#2f5fe0] to-[#f2856b]',
    titleColor: 'text-[#161a20]',
    btnColor: 'bg-[#161a20] hover:bg-[#383d45] text-[#f2f4f7]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-bento',
    name: 'Bento Editorial',
    primaryColor: '#f3f6f9',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfcfe] via-[#e7edf3] to-[#1c7d99]',
    titleColor: 'text-[#141a22]',
    btnColor: 'bg-[#141a22] hover:bg-[#28313d] text-[#f3f6f9]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'sunnet-krom',
    name: 'Likit Krom',
    primaryColor: '#080c16',
    backgroundStyle: 'bg-gradient-to-br from-[#eef4ff] via-[#a9c8f0] to-[#7fe0e8]',
    titleColor: 'text-[#0a1018]',
    btnColor: 'bg-gradient-to-r from-[#dcecff] via-[#a9c8f0] to-[#7fe0e8] text-[#0a1018]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-bento',
    name: 'Bento Editorial',
    primaryColor: '#f6f6f4',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfdfb] via-[#edebe5] to-[#f26b3a]',
    titleColor: 'text-[#1b1a17]',
    btnColor: 'bg-[#1b1a17] hover:bg-[#333029] text-[#f6f6f4]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'dogum-gunu-krom',
    name: 'Likit Krom',
    primaryColor: '#0c0714',
    backgroundStyle: 'bg-gradient-to-br from-[#fff2fb] via-[#ff9ad5] to-[#8fe6f0]',
    titleColor: 'text-[#150a1c]',
    btnColor: 'bg-gradient-to-r from-[#ffd6f0] via-[#ff9ad5] to-[#8fe6f0] text-[#150a1c]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-aurora',
    name: 'Aurora Cam',
    primaryColor: '#070b16',
    backgroundStyle: 'bg-gradient-to-br from-[#102a3c] via-[#6fd7c4] to-[#6c8cf0]',
    titleColor: 'text-[#f2f6ff]',
    btnColor: 'bg-gradient-to-r from-[#6fd7c4] to-[#6c8cf0] text-[#06131a]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'mezuniyet-kagit',
    name: 'Kağıt & Mühür',
    primaryColor: '#f4f2ea',
    backgroundStyle: 'bg-gradient-to-br from-[#f7f4ec] via-[#e9e4d5] to-[#1d3f76]',
    titleColor: 'text-[#221f18]',
    btnColor: 'bg-[#221f18] hover:bg-[#3c3729] text-[#f7f4ec]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-aurora',
    name: 'Aurora Cam',
    primaryColor: '#f7f6fb',
    backgroundStyle: 'bg-gradient-to-br from-[#ffffff] via-[#9a8fd8] to-[#7ec8e0]',
    titleColor: 'text-[#241f2e]',
    btnColor: 'bg-gradient-to-r from-[#9a8fd8] to-[#7ec8e0] text-[#1e1a28]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'baby-krom',
    name: 'Likit Krom',
    primaryColor: '#f5f7fa',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfeff] via-[#d8c0e8] to-[#a9e0d8]',
    titleColor: 'text-[#22262e]',
    btnColor: 'bg-gradient-to-r from-[#a9c9e8] via-[#d8c0e8] to-[#a9e0d8] text-[#22262e]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-bento',
    name: 'Bento Editorial',
    primaryColor: '#0b0b0f',
    backgroundStyle: 'bg-gradient-to-br from-[#16180f] via-[#0d0e10] to-[#a3e635]',
    titleColor: 'text-[#f6f7f2]',
    btnColor: 'bg-[#a3e635] hover:bg-[#b7ef5c] text-[#0e1206]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'parti-kagit',
    name: 'Kağıt & Mühür',
    primaryColor: '#f2eee4',
    backgroundStyle: 'bg-gradient-to-br from-[#f6f3ea] via-[#e9e3d4] to-[#2f4f7a]',
    titleColor: 'text-[#221f1a]',
    btnColor: 'bg-[#221f1a] hover:bg-[#3c372c] text-[#f6f3ea]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-aurora',
    name: 'Aurora Cam',
    primaryColor: '#07070f',
    backgroundStyle: 'bg-gradient-to-br from-[#1a1840] via-[#8b7dff] to-[#4f9dff]',
    titleColor: 'text-[#f4f4ff]',
    btnColor: 'bg-gradient-to-r from-[#8b7dff] to-[#4f9dff] text-[#070714]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  {
    id: 'kurumsal-kagit',
    name: 'Kağıt & Mühür',
    primaryColor: '#f2f1ec',
    backgroundStyle: 'bg-gradient-to-br from-[#f6f5f0] via-[#eae8e0] to-[#2c4a44]',
    titleColor: 'text-[#1c1b18]',
    btnColor: 'bg-[#1c1b18] hover:bg-[#33312b] text-[#f6f5f0]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  // ——— Malzeme tabanlı diller (Kağıt & Mühür / Art Deco / Bilet / Risograph) ———
  {
    id: 'dugun-kagit',
    name: 'Kağıt & Mühür',
    primaryColor: '#f3ede1',
    backgroundStyle: 'bg-gradient-to-br from-[#f7f2e8] via-[#e4dac6] to-[#8e1b2e]',
    titleColor: 'text-[#2a231b]',
    btnColor: 'bg-[#2a231b] hover:bg-[#43392e] text-[#f7f2e8]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'nisan-kagit',
    name: 'Kağıt & Mühür',
    primaryColor: '#eef0f2',
    backgroundStyle: 'bg-gradient-to-br from-[#f2f4f6] via-[#e0e5ea] to-[#2f5d8a]',
    titleColor: 'text-[#1e262e]',
    btnColor: 'bg-[#1e262e] hover:bg-[#333d47] text-[#f2f4f6]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'kina-kagit',
    name: 'Kağıt & Mühür',
    primaryColor: '#f7ecec',
    backgroundStyle: 'bg-gradient-to-br from-[#faf1f1] via-[#eddcdd] to-[#9c2436]',
    titleColor: 'text-[#33161b]',
    btnColor: 'bg-[#8e1b2e] hover:bg-[#a52b40] text-[#faf1f1]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'sunnet-kagit',
    name: 'Kağıt & Mühür',
    primaryColor: '#edf1f6',
    backgroundStyle: 'bg-gradient-to-br from-[#f0f4f9] via-[#dde6f0] to-[#1f4e8c]',
    titleColor: 'text-[#16243a]',
    btnColor: 'bg-[#16243a] hover:bg-[#293a53] text-[#f0f4f9]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dugun-deco',
    name: 'Art Deco Gala',
    primaryColor: '#0b0a09',
    backgroundStyle: 'bg-gradient-to-br from-[#1d1913] via-[#0e0c0a] to-[#c9a961]',
    titleColor: 'text-[#faf3e6]',
    btnColor: 'bg-gradient-to-r from-[#c9a961] to-[#e6d3a0] text-[#15120c]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'parti-deco',
    name: 'Art Deco Gala',
    primaryColor: '#0a0908',
    backgroundStyle: 'bg-gradient-to-br from-[#1b1710] via-[#0d0b08] to-[#d4af5f]',
    titleColor: 'text-[#f8f0d8]',
    btnColor: 'bg-gradient-to-r from-[#d4af5f] to-[#eed79b] text-[#14110a]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-deco',
    name: 'Art Deco Gala',
    primaryColor: '#061410',
    backgroundStyle: 'bg-gradient-to-br from-[#0d2a20] via-[#071a14] to-[#d8c07a]',
    titleColor: 'text-[#f0f8f2]',
    btnColor: 'bg-gradient-to-r from-[#d8c07a] to-[#f0e0aa] text-[#0a1a14]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  {
    id: 'mezuniyet-bilet',
    name: 'Etkinlik Bileti',
    primaryColor: '#0b1220',
    backgroundStyle: 'bg-gradient-to-br from-[#17233c] via-[#0d1626] to-[#e8b45c]',
    titleColor: 'text-[#f4f8ff]',
    btnColor: 'bg-[#e8b45c] hover:bg-[#f0c47a] text-[#1a1206]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'kurumsal-bilet',
    name: 'Etkinlik Bileti',
    primaryColor: '#0d1013',
    backgroundStyle: 'bg-gradient-to-br from-[#1a2226] via-[#10161a] to-[#4fd1c5]',
    titleColor: 'text-[#f2f6f9]',
    btnColor: 'bg-[#4fd1c5] hover:bg-[#6bdbd1] text-[#062522]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  {
    id: 'parti-bilet',
    name: 'Etkinlik Bileti',
    primaryColor: '#0a0710',
    backgroundStyle: 'bg-gradient-to-br from-[#1e1030] via-[#12081c] to-[#ff4fa3]',
    titleColor: 'text-[#faf5ff]',
    btnColor: 'bg-[#ff4fa3] hover:bg-[#ff6cb4] text-[#1a0410]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'dogum-gunu-riso',
    name: 'Risograph Poster',
    primaryColor: '#f7f2e7',
    backgroundStyle: 'bg-gradient-to-br from-[#faf6ec] via-[#2f6df0] to-[#ff3d7f]',
    titleColor: 'text-[#1c1917]',
    btnColor: 'bg-[#1c1917] hover:bg-[#3a3330] text-[#f7f2e7]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'baby-riso',
    name: 'Risograph Poster',
    primaryColor: '#f6f4ee',
    backgroundStyle: 'bg-gradient-to-br from-[#f9f8f2] via-[#3fbf9f] to-[#ff6b5a]',
    titleColor: 'text-[#1b1a17]',
    btnColor: 'bg-[#1b1a17] hover:bg-[#3b3a35] text-[#f6f4ee]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'sunnet-riso',
    name: 'Risograph Poster',
    primaryColor: '#f5f3ea',
    backgroundStyle: 'bg-gradient-to-br from-[#f8f6ee] via-[#ffc93c] to-[#1c5fe0]',
    titleColor: 'text-[#181712]',
    btnColor: 'bg-[#181712] hover:bg-[#35332c] text-[#f5f3ea]',
    imageUrl: '',
    categories: ['sunnet']
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
    name: 'Orman Rüyası (Sinematik)',
    primaryColor: '#101a13',
    backgroundStyle: 'bg-gradient-to-br from-[#24361f] via-[#16241a] to-[#d8b26a]',
    titleColor: 'text-[#f2f0e2]',
    btnColor: 'bg-[#d8b26a] hover:bg-[#e4c384] text-[#1a1409]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'nisan-alyans',
    name: 'Zarif Alyanslar (Sinematik)',
    primaryColor: '#070a10',
    backgroundStyle: 'bg-gradient-to-br from-[#16202e] via-[#0a0f17] to-[#bcd4ea]',
    titleColor: 'text-[#f4f8ff]',
    btnColor: 'bg-gradient-to-r from-[#bcd4ea] to-[#e6eef8] text-[#0b1018]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'nisan-bohem',
    name: 'Bohem Gün Batımı (Sinematik)',
    primaryColor: '#f6efe4',
    backgroundStyle: 'bg-gradient-to-br from-[#e8c79c] via-[#f6efe4] to-[#a8703f]',
    titleColor: 'text-[#453528]',
    btnColor: 'bg-[#a8703f] hover:bg-[#bb8250] text-[#f9f3ea]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-masallah',
    name: 'Maşallah Kuşağı (Sinematik)',
    primaryColor: '#180a0d',
    backgroundStyle: 'bg-gradient-to-br from-[#4a1319] via-[#240d11] to-[#e0b662]',
    titleColor: 'text-[#fdf0dd]',
    btnColor: 'bg-gradient-to-r from-[#e0b662] to-[#f0d18d] text-[#1d0f06]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'sunnet-lunapark',
    name: 'Lunapark (Sinematik)',
    primaryColor: '#0d0a1c',
    backgroundStyle: 'bg-gradient-to-br from-[#2a1d5c] via-[#150f33] to-[#ffb547]',
    titleColor: 'text-[#fbf7ff]',
    btnColor: 'bg-[#ffb547] hover:bg-[#ffc468] text-[#241505]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'mezuniyet-kampus',
    name: 'Tarihi Kampüs (Sinematik)',
    primaryColor: '#12100c',
    backgroundStyle: 'bg-gradient-to-br from-[#3a3225] via-[#201b14] to-[#c9a961]',
    titleColor: 'text-[#f8f1e0]',
    btnColor: 'bg-[#c9a961] hover:bg-[#d8ba76] text-[#1a1409]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'mezuniyet-pusula',
    name: 'Pusula & Keşif (Sinematik)',
    primaryColor: '#161208',
    backgroundStyle: 'bg-gradient-to-br from-[#4a3a18] via-[#221a0c] to-[#d9b45c]',
    titleColor: 'text-[#fbf3dd]',
    btnColor: 'bg-gradient-to-r from-[#d9b45c] to-[#efd493] text-[#1c1509]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'kina-saray',
    name: 'Saray Esintisi (Sinematik)',
    primaryColor: '#1a0710',
    backgroundStyle: 'bg-gradient-to-br from-[#5c1a2a] via-[#2a0c15] to-[#e3bd72]',
    titleColor: 'text-[#fdeee2]',
    btnColor: 'bg-gradient-to-r from-[#e3bd72] to-[#f3d99e] text-[#1f0c07]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'kina-mum',
    name: 'Mistik Mumlar (Sinematik)',
    primaryColor: '#120608',
    backgroundStyle: 'bg-gradient-to-br from-[#4a1a12] via-[#22090b] to-[#e09a5e]',
    titleColor: 'text-[#fbeadb]',
    btnColor: 'bg-[#b3323f] hover:bg-[#c64450] text-[#fdeee6]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'dogum-gunu-luks',
    name: 'Lüks Patlama (Sinematik)',
    primaryColor: '#0a0809',
    backgroundStyle: 'bg-gradient-to-br from-[#2e2415] via-[#14100b] to-[#e0b878]',
    titleColor: 'text-[#fdf4e8]',
    btnColor: 'bg-gradient-to-r from-[#e0b878] to-[#f0d5a4] text-[#171009]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'dogum-gunu-bulut',
    name: 'Sihirli Bulutlar (Sinematik)',
    primaryColor: '#fdf2f8',
    backgroundStyle: 'bg-gradient-to-br from-[#c8e0fb] via-[#f6dcee] to-[#e277b0]',
    titleColor: 'text-[#43304a]',
    btnColor: 'bg-[#e277b0] hover:bg-[#ea8dbe] text-[#fff5fa]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'dogum-gunu-zarif',
    name: 'Zarif Kutlama (Sinematik)',
    primaryColor: '#0c0a07',
    backgroundStyle: 'bg-gradient-to-br from-[#322612] via-[#16110a] to-[#d9bd7c]',
    titleColor: 'text-[#faf1dd]',
    btnColor: 'bg-gradient-to-r from-[#d9bd7c] to-[#efdaa8] text-[#171208]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'baby-melek',
    name: 'Melek Kanatları (Sinematik)',
    primaryColor: '#fbf8f2',
    backgroundStyle: 'bg-gradient-to-br from-[#eef4fb] via-[#fbf8f2] to-[#c9a961]',
    titleColor: 'text-[#4a4238]',
    btnColor: 'bg-[#c9a961] hover:bg-[#d6ba79] text-[#fffdf8]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'baby-muzik-kutusu',
    name: 'Müzik Kutusu (Sinematik)',
    primaryColor: '#f8f1ea',
    backgroundStyle: 'bg-gradient-to-br from-[#fbf3ea] via-[#f0e0cd] to-[#a9704f]',
    titleColor: 'text-[#4c3d33]',
    btnColor: 'bg-[#a9704f] hover:bg-[#ba8161] text-[#fdf6ef]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'baby-gokyuzu',
    name: 'Gökyüzü Macerası (Sinematik)',
    primaryColor: '#f2f6fb',
    backgroundStyle: 'bg-gradient-to-br from-[#b9d4ee] via-[#f2ddd6] to-[#e8917f]',
    titleColor: 'text-[#33455e]',
    btnColor: 'bg-[#5b7ba6] hover:bg-[#6c8cb7] text-[#f4f8fc]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'kurumsal-network',
    name: 'Dinamik Ağ (Sinematik)',
    primaryColor: '#06070d',
    backgroundStyle: 'bg-gradient-to-br from-[#131c3a] via-[#0a0d1c] to-[#6ea8ff]',
    titleColor: 'text-[#f2f6ff]',
    btnColor: 'bg-gradient-to-r from-[#4a7ef0] to-[#8b6cf0] text-[#f4f7ff]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  {
    id: 'kurumsal-cam',
    name: 'Sıvı Cam (Sinematik)',
    primaryColor: '#080a12',
    backgroundStyle: 'bg-gradient-to-br from-[#0e2a2e] via-[#101430] to-[#7ee0d0]',
    titleColor: 'text-[#f4f7ff]',
    btnColor: 'bg-[#7ee0d0] hover:bg-[#95e8da] text-[#07231f]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  {
    id: 'kurumsal-zirve',
    name: 'Zirve & Liderlik (Sinematik)',
    primaryColor: '#0a0f1a',
    backgroundStyle: 'bg-gradient-to-br from-[#2a3b58] via-[#6b5a52] to-[#e8b06a]',
    titleColor: 'text-[#f6f9ff]',
    btnColor: 'bg-[#e8b06a] hover:bg-[#f0c184] text-[#1a1206]',
    imageUrl: '',
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

