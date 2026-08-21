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
  // ——— Yeni konseptler: Film Şeridi / Mermer & Rölyef / Gazete Manşeti / Posta Damgası ———
  {
    id: 'dugun-film',
    name: 'Film Şeridi',
    primaryColor: '#100e0f',
    backgroundStyle: 'bg-gradient-to-br from-[#1d1a18] via-[#110f0e] to-[#d8b98a]',
    titleColor: 'text-[#f6f1e9]',
    btnColor: 'bg-[#d8b98a] hover:brightness-110 text-[#100e0f]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-film',
    name: 'Film Şeridi',
    primaryColor: '#150a0b',
    backgroundStyle: 'bg-gradient-to-br from-[#281314] via-[#160b0c] to-[#e0785f]',
    titleColor: 'text-[#f9ece6]',
    btnColor: 'bg-[#e0785f] hover:brightness-110 text-[#150a0b]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-film',
    name: 'Film Şeridi',
    primaryColor: '#0b0e13',
    backgroundStyle: 'bg-gradient-to-br from-[#171d26] via-[#0c1015] to-[#9fb8d8]',
    titleColor: 'text-[#eef2f8]',
    btnColor: 'bg-[#9fb8d8] hover:brightness-110 text-[#0b0e13]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-film',
    name: 'Film Şeridi',
    primaryColor: '#071019',
    backgroundStyle: 'bg-gradient-to-br from-[#10222f] via-[#08121b] to-[#5fb8a8]',
    titleColor: 'text-[#eaf2f8]',
    btnColor: 'bg-[#5fb8a8] hover:brightness-110 text-[#071019]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-film',
    name: 'Film Şeridi',
    primaryColor: '#110e14',
    backgroundStyle: 'bg-gradient-to-br from-[#1f1a26] via-[#120f16] to-[#f5a0c8]',
    titleColor: 'text-[#f8f2f6]',
    btnColor: 'bg-[#f5a0c8] hover:brightness-110 text-[#110e14]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-film',
    name: 'Film Şeridi',
    primaryColor: '#0b0d12',
    backgroundStyle: 'bg-gradient-to-br from-[#161a22] via-[#0c0f14] to-[#c9a961]',
    titleColor: 'text-[#f0f2f6]',
    btnColor: 'bg-[#c9a961] hover:brightness-110 text-[#0b0d12]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-film',
    name: 'Film Şeridi',
    primaryColor: '#0e1118',
    backgroundStyle: 'bg-gradient-to-br from-[#1a2130] via-[#0f131a] to-[#a8c8d8]',
    titleColor: 'text-[#f0f4f8]',
    btnColor: 'bg-[#a8c8d8] hover:brightness-110 text-[#0e1118]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-film',
    name: 'Film Şeridi',
    primaryColor: '#08080a',
    backgroundStyle: 'bg-gradient-to-br from-[#17151a] via-[#09090b] to-[#ff5f7a]',
    titleColor: 'text-[#f2f2ef]',
    btnColor: 'bg-[#ff5f7a] hover:brightness-110 text-[#08080a]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-film',
    name: 'Film Şeridi',
    primaryColor: '#0a0d10',
    backgroundStyle: 'bg-gradient-to-br from-[#151c21] via-[#0b0e11] to-[#5fb0c8]',
    titleColor: 'text-[#eef2f4]',
    btnColor: 'bg-[#5fb0c8] hover:brightness-110 text-[#0a0d10]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  {
    id: 'dugun-mermer',
    name: 'Mermer & Rölyef',
    primaryColor: '#f4f2ed',
    backgroundStyle: 'bg-gradient-to-br from-[#fbf9f5] via-[#f0ede6] to-[#9c7f5f]',
    titleColor: 'text-[#2b2620]',
    btnColor: 'bg-[#2b2620] hover:brightness-125 text-[#f4f2ed]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-mermer',
    name: 'Mermer & Rölyef',
    primaryColor: '#f6f0e8',
    backgroundStyle: 'bg-gradient-to-br from-[#fcf8f1] via-[#f2ebdf] to-[#a04f4f]',
    titleColor: 'text-[#2c211a]',
    btnColor: 'bg-[#2c211a] hover:brightness-125 text-[#f6f0e8]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-mermer',
    name: 'Mermer & Rölyef',
    primaryColor: '#f5f6f7',
    backgroundStyle: 'bg-gradient-to-br from-[#fcfcfd] via-[#f0f1f3] to-[#5f7f9f]',
    titleColor: 'text-[#23272c]',
    btnColor: 'bg-[#23272c] hover:brightness-125 text-[#f5f6f7]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-mermer',
    name: 'Mermer & Rölyef',
    primaryColor: '#f2f5f7',
    backgroundStyle: 'bg-gradient-to-br from-[#fafcfd] via-[#edf1f4] to-[#2f6f8c]',
    titleColor: 'text-[#1e2830]',
    btnColor: 'bg-[#1e2830] hover:brightness-125 text-[#f2f5f7]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-mermer',
    name: 'Mermer & Rölyef',
    primaryColor: '#f8f2f2',
    backgroundStyle: 'bg-gradient-to-br from-[#fefafa] via-[#f4eded] to-[#c05f7f]',
    titleColor: 'text-[#2c2224]',
    btnColor: 'bg-[#2c2224] hover:brightness-125 text-[#f8f2f2]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-mermer',
    name: 'Mermer & Rölyef',
    primaryColor: '#f3f5f1',
    backgroundStyle: 'bg-gradient-to-br from-[#fafcf8] via-[#eef1ea] to-[#3f6b4f]',
    titleColor: 'text-[#212722]',
    btnColor: 'bg-[#212722] hover:brightness-125 text-[#f3f5f1]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-mermer',
    name: 'Mermer & Rölyef',
    primaryColor: '#faf7f2',
    backgroundStyle: 'bg-gradient-to-br from-[#fffdfa] via-[#f6f2ea] to-[#8fa8b8]',
    titleColor: 'text-[#2b2823]',
    btnColor: 'bg-[#2b2823] hover:brightness-125 text-[#faf7f2]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-mermer',
    name: 'Mermer & Rölyef',
    primaryColor: '#0d0d0f',
    backgroundStyle: 'bg-gradient-to-br from-[#1a1a1e] via-[#0d0d10] to-[#d8c08f]',
    titleColor: 'text-[#f2f2f4]',
    btnColor: 'bg-[#d8c08f] hover:brightness-110 text-[#0d0d0f]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-mermer',
    name: 'Mermer & Rölyef',
    primaryColor: '#0c0e10',
    backgroundStyle: 'bg-gradient-to-br from-[#181c1f] via-[#0c0e10] to-[#6fb0c8]',
    titleColor: 'text-[#eef1f3]',
    btnColor: 'bg-[#6fb0c8] hover:brightness-110 text-[#0c0e10]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  {
    id: 'dugun-gazete',
    name: 'Gazete Manşeti',
    primaryColor: '#f5f2e9',
    backgroundStyle: 'bg-gradient-to-br from-[#faf8f0] via-[#f0ece0] to-[#8c3f2f]',
    titleColor: 'text-[#1a180f]',
    btnColor: 'bg-[#1a180f] hover:brightness-125 text-[#f5f2e9]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-gazete',
    name: 'Gazete Manşeti',
    primaryColor: '#f8f1e5',
    backgroundStyle: 'bg-gradient-to-br from-[#fdf7ec] via-[#f3ebdb] to-[#b8323f]',
    titleColor: 'text-[#20180f]',
    btnColor: 'bg-[#20180f] hover:brightness-125 text-[#f8f1e5]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-gazete',
    name: 'Gazete Manşeti',
    primaryColor: '#f4f5f6',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfcfd] via-[#eff1f3] to-[#2f5f8c]',
    titleColor: 'text-[#15181d]',
    btnColor: 'bg-[#15181d] hover:brightness-125 text-[#f4f5f6]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-gazete',
    name: 'Gazete Manşeti',
    primaryColor: '#f2f5f6',
    backgroundStyle: 'bg-gradient-to-br from-[#fafcfd] via-[#edf1f3] to-[#1f6f8c]',
    titleColor: 'text-[#141c22]',
    btnColor: 'bg-[#141c22] hover:brightness-125 text-[#f2f5f6]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-gazete',
    name: 'Gazete Manşeti',
    primaryColor: '#faf6ec',
    backgroundStyle: 'bg-gradient-to-br from-[#fefbf3] via-[#f4efe2] to-[#d9432f]',
    titleColor: 'text-[#1d1a12]',
    btnColor: 'bg-[#1d1a12] hover:brightness-125 text-[#faf6ec]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-gazete',
    name: 'Gazete Manşeti',
    primaryColor: '#f4f3ed',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfaf5] via-[#efeee6] to-[#2f5f4f]',
    titleColor: 'text-[#161814]',
    btnColor: 'bg-[#161814] hover:brightness-125 text-[#f4f3ed]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-gazete',
    name: 'Gazete Manşeti',
    primaryColor: '#f9f7f0',
    backgroundStyle: 'bg-gradient-to-br from-[#fefdf9] via-[#f4f2e9] to-[#5f8f7f]',
    titleColor: 'text-[#1c1c17]',
    btnColor: 'bg-[#1c1c17] hover:brightness-125 text-[#f9f7f0]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-gazete',
    name: 'Gazete Manşeti',
    primaryColor: '#0c0c0d',
    backgroundStyle: 'bg-gradient-to-br from-[#17171a] via-[#0b0b0c] to-[#ff4f3f]',
    titleColor: 'text-[#f4f4f2]',
    btnColor: 'bg-[#ff4f3f] hover:brightness-110 text-[#0c0c0d]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-gazete',
    name: 'Gazete Manşeti',
    primaryColor: '#f3f5f6',
    backgroundStyle: 'bg-gradient-to-br from-[#fafcfd] via-[#eef1f3] to-[#1f5f7f]',
    titleColor: 'text-[#12171a]',
    btnColor: 'bg-[#12171a] hover:brightness-125 text-[#f3f5f6]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  {
    id: 'dugun-posta',
    name: 'Posta Damgası',
    primaryColor: '#f8f5ee',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfbf5] via-[#f3efe4] to-[#9c3b46]',
    titleColor: 'text-[#2a231b]',
    btnColor: 'bg-[#2a231b] hover:brightness-125 text-[#f8f5ee]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-posta',
    name: 'Posta Damgası',
    primaryColor: '#faf3e8',
    backgroundStyle: 'bg-gradient-to-br from-[#fefaf1] via-[#f4ecdd] to-[#b8434f]',
    titleColor: 'text-[#2b1f16]',
    btnColor: 'bg-[#2b1f16] hover:brightness-125 text-[#faf3e8]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-posta',
    name: 'Posta Damgası',
    primaryColor: '#f6f7f9',
    backgroundStyle: 'bg-gradient-to-br from-[#fcfdfe] via-[#f1f3f6] to-[#4f6f9f]',
    titleColor: 'text-[#22262e]',
    btnColor: 'bg-[#22262e] hover:brightness-125 text-[#f6f7f9]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-posta',
    name: 'Posta Damgası',
    primaryColor: '#f4f7f9',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfdfe] via-[#eff4f7] to-[#2f7f8c]',
    titleColor: 'text-[#1d2730]',
    btnColor: 'bg-[#1d2730] hover:brightness-125 text-[#f4f7f9]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-posta',
    name: 'Posta Damgası',
    primaryColor: '#fdf8f2',
    backgroundStyle: 'bg-gradient-to-br from-[#fffdf9] via-[#f8f2e8] to-[#d9603f]',
    titleColor: 'text-[#2b2219]',
    btnColor: 'bg-[#2b2219] hover:brightness-125 text-[#fdf8f2]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-posta',
    name: 'Posta Damgası',
    primaryColor: '#f6f4ee',
    backgroundStyle: 'bg-gradient-to-br from-[#fcfbf7] via-[#f1efe7] to-[#7a2f39]',
    titleColor: 'text-[#22221b]',
    btnColor: 'bg-[#22221b] hover:brightness-125 text-[#f6f4ee]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-posta',
    name: 'Posta Damgası',
    primaryColor: '#fbf9f4',
    backgroundStyle: 'bg-gradient-to-br from-[#fffefb] via-[#f6f3ec] to-[#8fa8b8]',
    titleColor: 'text-[#2a2822]',
    btnColor: 'bg-[#2a2822] hover:brightness-125 text-[#fbf9f4]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-posta',
    name: 'Posta Damgası',
    primaryColor: '#0b0a0c',
    backgroundStyle: 'bg-gradient-to-br from-[#191520] via-[#0a090c] to-[#ff5f8f]',
    titleColor: 'text-[#f4f2f6]',
    btnColor: 'bg-[#ff5f8f] hover:brightness-110 text-[#0b0a0c]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-posta',
    name: 'Posta Damgası',
    primaryColor: '#f5f6f7',
    backgroundStyle: 'bg-gradient-to-br from-[#fcfdfd] via-[#f0f2f3] to-[#2f6f8c]',
    titleColor: 'text-[#1c2124]',
    btnColor: 'bg-[#1c2124] hover:brightness-125 text-[#f5f6f7]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  // ——— Yeni konseptler: Suluboya (taşan pigment, ıslak kenar) ———
  {
    id: 'dugun-suluboya',
    name: 'Suluboya',
    primaryColor: '#fbf8f4',
    backgroundStyle: 'bg-gradient-to-br from-[#fefcf9] via-[#e8cea0] to-[#d9a3b8]',
    titleColor: 'text-[#2e2620]',
    btnColor: 'bg-[#2e2620] hover:bg-[#463c32] text-[#fbf8f4]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-suluboya',
    name: 'Suluboya',
    primaryColor: '#fbf6ee',
    backgroundStyle: 'bg-gradient-to-br from-[#fefaf3] via-[#e0a05c] to-[#c4404f]',
    titleColor: 'text-[#2b1e18]',
    btnColor: 'bg-[#2b1e18] hover:bg-[#453227] text-[#fbf6ee]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-suluboya',
    name: 'Suluboya',
    primaryColor: '#f8f9fb',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfdfe] via-[#d8b8c8] to-[#a8b8d8]',
    titleColor: 'text-[#232830]',
    btnColor: 'bg-[#232830] hover:bg-[#3a404a] text-[#f8f9fb]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-suluboya',
    name: 'Suluboya',
    primaryColor: '#f6f9fb',
    backgroundStyle: 'bg-gradient-to-br from-[#fcfeff] via-[#8fc4b8] to-[#7fa8d8]',
    titleColor: 'text-[#1c2630]',
    btnColor: 'bg-[#1c2630] hover:bg-[#323e4a] text-[#f6f9fb]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-suluboya',
    name: 'Suluboya',
    primaryColor: '#fdf9f4',
    backgroundStyle: 'bg-gradient-to-br from-[#fffdfa] via-[#f5d07a] to-[#f0a0c0]',
    titleColor: 'text-[#2b2320]',
    btnColor: 'bg-[#2b2320] hover:bg-[#443832] text-[#fdf9f4]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-suluboya',
    name: 'Suluboya',
    primaryColor: '#f9f8f4',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfdfa] via-[#d8c08f] to-[#8fa8c8]',
    titleColor: 'text-[#22252b]',
    btnColor: 'bg-[#22252b] hover:bg-[#383c44] text-[#f9f8f4]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-suluboya',
    name: 'Suluboya',
    primaryColor: '#fbfaf7',
    backgroundStyle: 'bg-gradient-to-br from-[#fefefc] via-[#f5d0d0] to-[#c8dce8]',
    titleColor: 'text-[#2b2b26]',
    btnColor: 'bg-[#2b2b26] hover:bg-[#43433b] text-[#fbfaf7]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-suluboya',
    name: 'Suluboya',
    primaryColor: '#0e0b14',
    backgroundStyle: 'bg-gradient-to-br from-[#1c1230] via-[#5fd0f0] to-[#ff5fa8]',
    titleColor: 'text-[#f6f0fa]',
    btnColor: 'bg-[#ff7fbf] hover:bg-[#ff9bcd] text-[#160a14]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-suluboya',
    name: 'Suluboya',
    primaryColor: '#f7f8f9',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfdfe] via-[#a8c0b8] to-[#8fb0c8]',
    titleColor: 'text-[#1a1f24]',
    btnColor: 'bg-[#1a1f24] hover:bg-[#30363d] text-[#f7f8f9]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  // ——— Yeni konseptler: Mekanik Pano (kanat çeviren split-flap) ———
  {
    id: 'dugun-pano',
    name: 'Mekanik Pano',
    primaryColor: '#12100e',
    backgroundStyle: 'bg-gradient-to-br from-[#1e1a16] via-[#13100d] to-[#d8b98a]',
    titleColor: 'text-[#f7f2e8]',
    btnColor: 'bg-[#d8b98a] hover:bg-[#e6cda6] text-[#17130e]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-pano',
    name: 'Mekanik Pano',
    primaryColor: '#160a0c',
    backgroundStyle: 'bg-gradient-to-br from-[#2a1013] via-[#17090b] to-[#e0785f]',
    titleColor: 'text-[#f9ece6]',
    btnColor: 'bg-[#e0785f] hover:bg-[#ec9179] text-[#190a0b]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-pano',
    name: 'Mekanik Pano',
    primaryColor: '#0c0f14',
    backgroundStyle: 'bg-gradient-to-br from-[#171d27] via-[#0d1117] to-[#9fb8d8]',
    titleColor: 'text-[#eef2f8]',
    btnColor: 'bg-[#9fb8d8] hover:bg-[#b6cae6] text-[#0c0f14]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-pano',
    name: 'Mekanik Pano',
    primaryColor: '#08111c',
    backgroundStyle: 'bg-gradient-to-br from-[#10233a] via-[#091624] to-[#4fa88f]',
    titleColor: 'text-[#eaf2fa]',
    btnColor: 'bg-[#4fa88f] hover:bg-[#68bda5] text-[#04140f]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-pano',
    name: 'Mekanik Pano',
    primaryColor: '#100e12',
    backgroundStyle: 'bg-gradient-to-br from-[#1d1a20] via-[#121016] to-[#f5b04f]',
    titleColor: 'text-[#f7f2f5]',
    btnColor: 'bg-[#f5b04f] hover:bg-[#f9c274] text-[#171104]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-pano',
    name: 'Mekanik Pano',
    primaryColor: '#0c0e13',
    backgroundStyle: 'bg-gradient-to-br from-[#171b24] via-[#0d1015] to-[#d8843f]',
    titleColor: 'text-[#f0f3f7]',
    btnColor: 'bg-[#d8843f] hover:bg-[#e59c5e] text-[#140b04]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-pano',
    name: 'Mekanik Pano',
    primaryColor: '#f7f5f0',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfcf9] via-[#e6dfd0] to-[#a88f5f]',
    titleColor: 'text-[#2e2b24]',
    btnColor: 'bg-[#2e2b24] hover:bg-[#464236] text-[#f7f5f0]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-pano',
    name: 'Mekanik Pano',
    primaryColor: '#08080a',
    backgroundStyle: 'bg-gradient-to-br from-[#121815] via-[#0a0c0b] to-[#4fe0a0]',
    titleColor: 'text-[#f2f2ef]',
    btnColor: 'bg-[#4fe0a0] hover:bg-[#71e9b5] text-[#04140c]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-pano',
    name: 'Mekanik Pano',
    primaryColor: '#0b0e12',
    backgroundStyle: 'bg-gradient-to-br from-[#151d26] via-[#0c1014] to-[#4fb0e0]',
    titleColor: 'text-[#eef2f5]',
    btnColor: 'bg-[#4fb0e0] hover:bg-[#6ec2ea] text-[#04121c]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  // ——— Yeni konseptler: Yıldız Haritası (davetin kendi gökyüzü) ———
  {
    id: 'dugun-yildiz-haritasi',
    name: 'Yıldız Haritası',
    primaryColor: '#0a0c16',
    backgroundStyle: 'bg-gradient-to-br from-[#14182c] via-[#0b0e1a] to-[#f0d6a8]',
    titleColor: 'text-[#f6f2ea]',
    btnColor: 'bg-[#f0d6a8] hover:bg-[#f7e4c4] text-[#0f1018]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-yildiz-haritasi',
    name: 'Yıldız Haritası',
    primaryColor: '#12060e',
    backgroundStyle: 'bg-gradient-to-br from-[#2a0f1c] via-[#170811] to-[#e0a878]',
    titleColor: 'text-[#fbeee8]',
    btnColor: 'bg-[#e0a878] hover:bg-[#ebbd95] text-[#180a10]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-yildiz-haritasi',
    name: 'Yıldız Haritası',
    primaryColor: '#080c18',
    backgroundStyle: 'bg-gradient-to-br from-[#131c34] via-[#0a0f1e] to-[#a8c0f0]',
    titleColor: 'text-[#f0f4fc]',
    btnColor: 'bg-[#a8c0f0] hover:bg-[#bed1f6] text-[#080c18]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-yildiz-haritasi',
    name: 'Yıldız Haritası',
    primaryColor: '#050e18',
    backgroundStyle: 'bg-gradient-to-br from-[#0d2438] via-[#06131f] to-[#7fd0c0]',
    titleColor: 'text-[#eef4f8]',
    btnColor: 'bg-[#7fd0c0] hover:bg-[#9adcd0] text-[#04141a]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-yildiz-haritasi',
    name: 'Yıldız Haritası',
    primaryColor: '#0e0a18',
    backgroundStyle: 'bg-gradient-to-br from-[#221338] via-[#120c20] to-[#f0a0d0]',
    titleColor: 'text-[#f8f0fa]',
    btnColor: 'bg-[#f0a0d0] hover:bg-[#f6b8dd] text-[#16081a]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-yildiz-haritasi',
    name: 'Yıldız Haritası',
    primaryColor: '#060a14',
    backgroundStyle: 'bg-gradient-to-br from-[#10182c] via-[#080d18] to-[#d8c890]',
    titleColor: 'text-[#f2f4f8]',
    btnColor: 'bg-[#d8c890] hover:bg-[#e5d8ae] text-[#0b0e16]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-yildiz-haritasi',
    name: 'Yıldız Haritası',
    primaryColor: '#0c1020',
    backgroundStyle: 'bg-gradient-to-br from-[#172140] via-[#0d1226] to-[#c8d8f0]',
    titleColor: 'text-[#f2f5fc]',
    btnColor: 'bg-[#c8d8f0] hover:bg-[#dae5f6] text-[#0c1020]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-yildiz-haritasi',
    name: 'Yıldız Haritası',
    primaryColor: '#06060c',
    backgroundStyle: 'bg-gradient-to-br from-[#0e1a24] via-[#070b12] to-[#7ff0d8]',
    titleColor: 'text-[#f2f4f6]',
    btnColor: 'bg-[#7ff0d8] hover:bg-[#9df5e4] text-[#04140f]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-yildiz-haritasi',
    name: 'Yıldız Haritası',
    primaryColor: '#06090e',
    backgroundStyle: 'bg-gradient-to-br from-[#101c28] via-[#080f16] to-[#8fb8d8]',
    titleColor: 'text-[#eff3f6]',
    btnColor: 'bg-[#8fb8d8] hover:bg-[#a8cae4] text-[#06090e]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  // ——— Yeni konseptler: Dokuma (çözgü-atkı örgüsü, kilim şeridi) ———
  {
    id: 'dugun-dokuma',
    name: 'Dokuma',
    primaryColor: '#f7f1e6',
    backgroundStyle: 'bg-gradient-to-br from-[#fbf6ec] via-[#2f6f6a] to-[#b8433f]',
    titleColor: 'text-[#2b2118]',
    btnColor: 'bg-[#2b2118] hover:bg-[#453626] text-[#f7f1e6]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-dokuma',
    name: 'Dokuma',
    primaryColor: '#f9efe2',
    backgroundStyle: 'bg-gradient-to-br from-[#fdf5e9] via-[#1f6f6a] to-[#c2354f]',
    titleColor: 'text-[#2c1d16]',
    btnColor: 'bg-[#2c1d16] hover:bg-[#463125] text-[#f9efe2]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-dokuma',
    name: 'Dokuma',
    primaryColor: '#f6f4ee',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfaf6] via-[#c08f7f] to-[#5f7f9f]',
    titleColor: 'text-[#242830]',
    btnColor: 'bg-[#242830] hover:bg-[#3a3f49] text-[#f6f4ee]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-dokuma',
    name: 'Dokuma',
    primaryColor: '#f4f2e8',
    backgroundStyle: 'bg-gradient-to-br from-[#faf9f0] via-[#c47a2f] to-[#1f5f8c]',
    titleColor: 'text-[#232a24]',
    btnColor: 'bg-[#232a24] hover:bg-[#39423a] text-[#f4f2e8]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-dokuma',
    name: 'Dokuma',
    primaryColor: '#faf4e8',
    backgroundStyle: 'bg-gradient-to-br from-[#fefaf1] via-[#3f9fa8] to-[#e0603f]',
    titleColor: 'text-[#2c2318]',
    btnColor: 'bg-[#2c2318] hover:bg-[#463928] text-[#faf4e8]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-dokuma',
    name: 'Dokuma',
    primaryColor: '#f5f3ea',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfaf4] via-[#2f5f4f] to-[#7a2f39]',
    titleColor: 'text-[#26241c]',
    btnColor: 'bg-[#26241c] hover:bg-[#3e3b2e] text-[#f5f3ea]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-dokuma',
    name: 'Dokuma',
    primaryColor: '#faf7f0',
    backgroundStyle: 'bg-gradient-to-br from-[#fefdf9] via-[#e8b8b0] to-[#8fb8a8]',
    titleColor: 'text-[#2b2a24]',
    btnColor: 'bg-[#2b2a24] hover:bg-[#44423a] text-[#faf7f0]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-dokuma',
    name: 'Dokuma',
    primaryColor: '#150f14',
    backgroundStyle: 'bg-gradient-to-br from-[#221720] via-[#f0b83f] to-[#e0455f]',
    titleColor: 'text-[#f6f0ee]',
    btnColor: 'bg-[#3fc0b8] hover:bg-[#5fd0c9] text-[#04140f]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-dokuma',
    name: 'Dokuma',
    primaryColor: '#f4f3ef',
    backgroundStyle: 'bg-gradient-to-br from-[#fafaf7] via-[#8f7f5f] to-[#2f4f5f]',
    titleColor: 'text-[#22262a]',
    btnColor: 'bg-[#22262a] hover:bg-[#383d42] text-[#f4f3ef]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  // ——— Yeni konseptler: Tek Çizgi (kendini çizen monoline kartuş) ———
  {
    id: 'dugun-cizgi',
    name: 'Tek Çizgi',
    primaryColor: '#faf7f2',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfbf7] via-[#ece5da] to-[#4a5b7a]',
    titleColor: 'text-[#23201b]',
    btnColor: 'bg-[#23201b] hover:bg-[#3b362e] text-[#faf7f2]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-cizgi',
    name: 'Tek Çizgi',
    primaryColor: '#f9f3e8',
    backgroundStyle: 'bg-gradient-to-br from-[#fdf8ee] via-[#eee2cc] to-[#1f6f6a]',
    titleColor: 'text-[#241a14]',
    btnColor: 'bg-[#241a14] hover:bg-[#3d2d22] text-[#f9f3e8]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-cizgi',
    name: 'Tek Çizgi',
    primaryColor: '#f6f7f9',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfcfd] via-[#e6e9ee] to-[#6b7a4f]',
    titleColor: 'text-[#1e2228]',
    btnColor: 'bg-[#1e2228] hover:bg-[#343a43] text-[#f6f7f9]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-cizgi',
    name: 'Tek Çizgi',
    primaryColor: '#f2f6f9',
    backgroundStyle: 'bg-gradient-to-br from-[#fafcfe] via-[#e2eaf1] to-[#8c3b4a]',
    titleColor: 'text-[#17202b]',
    btnColor: 'bg-[#17202b] hover:bg-[#2c3743] text-[#f2f6f9]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-cizgi',
    name: 'Tek Çizgi',
    primaryColor: '#fbf8f3',
    backgroundStyle: 'bg-gradient-to-br from-[#fefcf8] via-[#efe8dc] to-[#7a4fa8]',
    titleColor: 'text-[#201d1a]',
    btnColor: 'bg-[#201d1a] hover:bg-[#38332d] text-[#fbf8f3]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-cizgi',
    name: 'Tek Çizgi',
    primaryColor: '#f5f4f0',
    backgroundStyle: 'bg-gradient-to-br from-[#fafaf7] via-[#e8e6de] to-[#7a2f39]',
    titleColor: 'text-[#16181d]',
    btnColor: 'bg-[#16181d] hover:bg-[#2c2f36] text-[#f5f4f0]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-cizgi',
    name: 'Tek Çizgi',
    primaryColor: '#f9f8f5',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfdfb] via-[#eae8e0] to-[#6f86a8]',
    titleColor: 'text-[#2a2a26]',
    btnColor: 'bg-[#2a2a26] hover:bg-[#42423b] text-[#f9f8f5]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-cizgi',
    name: 'Tek Çizgi',
    primaryColor: '#f4f4f2',
    backgroundStyle: 'bg-gradient-to-br from-[#fafafa] via-[#e6e6e8] to-[#5b4ff0]',
    titleColor: 'text-[#121214]',
    btnColor: 'bg-[#121214] hover:bg-[#2b2b30] text-[#f4f4f2]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-cizgi',
    name: 'Tek Çizgi',
    primaryColor: '#f4f6f7',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfcfc] via-[#e5eaed] to-[#20386b]',
    titleColor: 'text-[#101418]',
    btnColor: 'bg-[#101418] hover:bg-[#262c33] text-[#f4f6f7]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  // ——— Yeni konseptler: Vinil Plak (dairesel kompozisyon, dönen tırnaklar) ———
  {
    id: 'dugun-plak',
    name: 'Vinil Plak',
    primaryColor: '#131110',
    backgroundStyle: 'bg-gradient-to-br from-[#241d18] via-[#131110] to-[#c98a5e]',
    titleColor: 'text-[#f7f2ea]',
    btnColor: 'bg-[#c98a5e] hover:bg-[#d99e75] text-[#171310]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-plak',
    name: 'Vinil Plak',
    primaryColor: '#170a0c',
    backgroundStyle: 'bg-gradient-to-br from-[#2e1216] via-[#170a0c] to-[#b8323f]',
    titleColor: 'text-[#faeee9]',
    btnColor: 'bg-[#e08a72] hover:bg-[#eda189] text-[#1a0b0c]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-plak',
    name: 'Vinil Plak',
    primaryColor: '#0d1016',
    backgroundStyle: 'bg-gradient-to-br from-[#1a2130] via-[#0d1016] to-[#3a5a8c]',
    titleColor: 'text-[#f2f5fa]',
    btnColor: 'bg-[#8aa8d8] hover:bg-[#a2bce6] text-[#0d1016]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-plak',
    name: 'Vinil Plak',
    primaryColor: '#0a1420',
    backgroundStyle: 'bg-gradient-to-br from-[#14273a] via-[#0a1420] to-[#c47a2f]',
    titleColor: 'text-[#f0f5fa]',
    btnColor: 'bg-[#e0a05c] hover:bg-[#ebb478] text-[#12080a]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-plak',
    name: 'Vinil Plak',
    primaryColor: '#121014',
    backgroundStyle: 'bg-gradient-to-br from-[#241a22] via-[#121014] to-[#e8455f]',
    titleColor: 'text-[#f8f2f4]',
    btnColor: 'bg-[#f2758a] hover:bg-[#f78ea0] text-[#18090d]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-plak',
    name: 'Vinil Plak',
    primaryColor: '#0e1016',
    backgroundStyle: 'bg-gradient-to-br from-[#182024] via-[#0e1016] to-[#2f5f4f]',
    titleColor: 'text-[#f2f5f6]',
    btnColor: 'bg-[#7cbfa4] hover:bg-[#95d0b8] text-[#0b1512]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-plak',
    name: 'Vinil Plak',
    primaryColor: '#f6f4ef',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfbf6] via-[#2b2822] to-[#dcb43c]',
    titleColor: 'text-[#2a271f]',
    btnColor: 'bg-[#2a271f] hover:bg-[#433e31] text-[#f6f4ef]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-plak',
    name: 'Vinil Plak',
    primaryColor: '#08080a',
    backgroundStyle: 'bg-gradient-to-br from-[#1a1030] via-[#08080a] to-[#6d28d9]',
    titleColor: 'text-[#f4f1fb]',
    btnColor: 'bg-[#a78bfa] hover:bg-[#bda4fc] text-[#0b0616]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-plak',
    name: 'Vinil Plak',
    primaryColor: '#0b0e12',
    backgroundStyle: 'bg-gradient-to-br from-[#141c26] via-[#0b0e12] to-[#1f5f8c]',
    titleColor: 'text-[#f0f4f7]',
    btnColor: 'bg-[#5f9fd8] hover:bg-[#7cb3e4] text-[#08111a]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  // ——— Yeni konseptler: Vitray Işık (kurşun camlı kemer) ———
  {
    id: 'dugun-vitray',
    name: 'Vitray Işık',
    primaryColor: '#0e0a12',
    backgroundStyle: 'bg-gradient-to-br from-[#d98fa8] via-[#e8c88a] to-[#8f7fc4]',
    titleColor: 'text-[#1a0f16]',
    btnColor: 'bg-gradient-to-r from-[#dda3b6] to-[#e8c88a] text-[#1a0f16]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-vitray',
    name: 'Vitray Işık',
    primaryColor: '#120609',
    backgroundStyle: 'bg-gradient-to-br from-[#c2354f] via-[#e0a75c] to-[#8a2352]',
    titleColor: 'text-[#1c0a10]',
    btnColor: 'bg-gradient-to-r from-[#d1587f] to-[#e0a75c] text-[#1c0a10]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-vitray',
    name: 'Vitray Işık',
    primaryColor: '#0a0d1a',
    backgroundStyle: 'bg-gradient-to-br from-[#7c6cf0] via-[#c9b6f2] to-[#6fb6e8]',
    titleColor: 'text-[#0d1020]',
    btnColor: 'bg-gradient-to-r from-[#c9b6f2] to-[#6fb6e8] text-[#0d1020]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-vitray',
    name: 'Vitray Işık',
    primaryColor: '#050e1a',
    backgroundStyle: 'bg-gradient-to-br from-[#1f7a6a] via-[#e2b558] to-[#2b5fa8]',
    titleColor: 'text-[#04140f]',
    btnColor: 'bg-gradient-to-r from-[#3fa88f] to-[#e2b558] text-[#04140f]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-vitray',
    name: 'Vitray Işık',
    primaryColor: '#120a1c',
    backgroundStyle: 'bg-gradient-to-br from-[#ff6fae] via-[#48c9d8] to-[#ffd166]',
    titleColor: 'text-[#12061a]',
    btnColor: 'bg-gradient-to-r from-[#48c9d8] to-[#ff6fae] text-[#12061a]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-vitray',
    name: 'Vitray Işık',
    primaryColor: '#080c18',
    backgroundStyle: 'bg-gradient-to-br from-[#1e3a6e] via-[#d4af5f] to-[#8c2b3a]',
    titleColor: 'text-[#0a0f1c]',
    btnColor: 'bg-gradient-to-r from-[#9fb8e8] to-[#d4af5f] text-[#0a0f1c]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-vitray',
    name: 'Vitray Işık',
    primaryColor: '#f8f5f0',
    backgroundStyle: 'bg-gradient-to-br from-[#a8d5e2] via-[#f7c8c8] to-[#cfe3b5]',
    titleColor: 'text-[#2b2822]',
    btnColor: 'bg-gradient-to-r from-[#e695a8] to-[#a8d5e2] text-[#2b2822]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-vitray',
    name: 'Vitray Işık',
    primaryColor: '#07040f',
    backgroundStyle: 'bg-gradient-to-br from-[#ff3d81] via-[#22d3ee] to-[#a855f7]',
    titleColor: 'text-[#07040f]',
    btnColor: 'bg-gradient-to-r from-[#22d3ee] to-[#ff3d81] text-[#07040f]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-vitray',
    name: 'Vitray Işık',
    primaryColor: '#060a0e',
    backgroundStyle: 'bg-gradient-to-br from-[#1f7a8c] via-[#3d7ea6] to-[#9fb8c9]',
    titleColor: 'text-[#04100e]',
    btnColor: 'bg-gradient-to-r from-[#3f9e88] to-[#3d7ea6] text-[#04100e]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  // ——— Yeni konseptler: Kinetik Tipografi (akan dev yazı şeritleri) ———
  {
    id: 'dugun-kinetik',
    name: 'Kinetik Tipografi',
    primaryColor: '#f5f1ea',
    backgroundStyle: 'bg-gradient-to-br from-[#faf7f1] via-[#e2dacc] to-[#a8804f]',
    titleColor: 'text-[#1a1712]',
    btnColor: 'bg-[#1a1712] hover:bg-[#332e26] text-[#f5f1ea]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-kinetik',
    name: 'Kinetik Tipografi',
    primaryColor: '#1a0710',
    backgroundStyle: 'bg-gradient-to-br from-[#2c0d18] via-[#1a0710] to-[#dd6b7a]',
    titleColor: 'text-[#f9ece6]',
    btnColor: 'bg-[#dd6b7a] hover:bg-[#e8838f] text-[#1a0710]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-kinetik',
    name: 'Kinetik Tipografi',
    primaryColor: '#f7f0f2',
    backgroundStyle: 'bg-gradient-to-br from-[#fbf6f7] via-[#e8dce0] to-[#b0798f]',
    titleColor: 'text-[#2a1f26]',
    btnColor: 'bg-[#2a1f26] hover:bg-[#41333b] text-[#f7f0f2]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-kinetik',
    name: 'Kinetik Tipografi',
    primaryColor: '#0b1b3a',
    backgroundStyle: 'bg-gradient-to-br from-[#122c5c] via-[#0b1b3a] to-[#ff7a5c]',
    titleColor: 'text-[#eef4ff]',
    btnColor: 'bg-[#ff7a5c] hover:bg-[#ff9077] text-[#0b1b3a]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-kinetik',
    name: 'Kinetik Tipografi',
    primaryColor: '#111014',
    backgroundStyle: 'bg-gradient-to-br from-[#1c1a20] via-[#111014] to-[#f5e050]',
    titleColor: 'text-[#f7f5ea]',
    btnColor: 'bg-[#f5e050] hover:bg-[#f9ea7c] text-[#171509]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-kinetik',
    name: 'Kinetik Tipografi',
    primaryColor: '#f4f2ec',
    backgroundStyle: 'bg-gradient-to-br from-[#f9f8f3] via-[#e0ded6] to-[#2f6b4f]',
    titleColor: 'text-[#14171f]',
    btnColor: 'bg-[#14171f] hover:bg-[#2a2e38] text-[#f4f2ec]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-kinetik',
    name: 'Kinetik Tipografi',
    primaryColor: '#f6f8f4',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfcfa] via-[#e0e6de] to-[#3fb894]',
    titleColor: 'text-[#26302a]',
    btnColor: 'bg-[#26302a] hover:bg-[#3c483f] text-[#f6f8f4]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-kinetik',
    name: 'Kinetik Tipografi',
    primaryColor: '#0a0a0b',
    backgroundStyle: 'bg-gradient-to-br from-[#17150f] via-[#0a0a0b] to-[#ff8a1f]',
    titleColor: 'text-[#f2f2ef]',
    btnColor: 'bg-[#ff8a1f] hover:bg-[#ffa24a] text-[#150a02]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-kinetik',
    name: 'Kinetik Tipografi',
    primaryColor: '#0e1116',
    backgroundStyle: 'bg-gradient-to-br from-[#182029] via-[#0e1116] to-[#f2653a]',
    titleColor: 'text-[#f2f5f7]',
    btnColor: 'bg-[#f2653a] hover:bg-[#ff7d55] text-[#120704]',
    imageUrl: '',
    categories: ['kurumsal']
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
  },
  // ——— Yeni konseptler: Brutal (düz renk blok, sert çerçeve, dev tipografi) ———
  {
    id: 'dugun-brutal',
    name: 'Brutal',
    primaryColor: '#f2efe6',
    backgroundStyle: 'bg-gradient-to-br from-[#fffdf7] via-[#f2efe6] to-[#d92b3a]',
    titleColor: 'text-[#121110]',
    btnColor: 'bg-[#d92b3a] hover:brightness-110 text-[#fff4ee]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-brutal',
    name: 'Brutal',
    primaryColor: '#f8efdf',
    backgroundStyle: 'bg-gradient-to-br from-[#fffaef] via-[#f8efdf] to-[#c81e4a]',
    titleColor: 'text-[#17110a]',
    btnColor: 'bg-[#c81e4a] hover:brightness-110 text-[#fff0f3]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-brutal',
    name: 'Brutal',
    primaryColor: '#eef1f7',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfdff] via-[#eef1f7] to-[#3b5bdb]',
    titleColor: 'text-[#0e1117]',
    btnColor: 'bg-[#3b5bdb] hover:brightness-110 text-[#eef2ff]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-brutal',
    name: 'Brutal',
    primaryColor: '#e9f3f5',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfeff] via-[#e9f3f5] to-[#0d8f7a]',
    titleColor: 'text-[#0a1418]',
    btnColor: 'bg-[#0d8f7a] hover:brightness-110 text-[#eafff9]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-brutal',
    name: 'Brutal',
    primaryColor: '#fdf0d9',
    backgroundStyle: 'bg-gradient-to-br from-[#fffbf0] via-[#fdf0d9] to-[#ff5722]',
    titleColor: 'text-[#17120a]',
    btnColor: 'bg-[#ff5722] hover:brightness-110 text-[#fff3ec]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-brutal',
    name: 'Brutal',
    primaryColor: '#f0ede2',
    backgroundStyle: 'bg-gradient-to-br from-[#fffdf4] via-[#f0ede2] to-[#8b1e3f]',
    titleColor: 'text-[#12110d]',
    btnColor: 'bg-[#8b1e3f] hover:brightness-110 text-[#ffeef2]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-brutal',
    name: 'Brutal',
    primaryColor: '#edf5f3',
    backgroundStyle: 'bg-gradient-to-br from-[#fcfffe] via-[#edf5f3] to-[#2f9ad9]',
    titleColor: 'text-[#0d1513]',
    btnColor: 'bg-[#2f9ad9] hover:brightness-110 text-[#eef9ff]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-brutal',
    name: 'Brutal',
    primaryColor: '#0d0d10',
    backgroundStyle: 'bg-gradient-to-br from-[#16161b] via-[#0d0d10] to-[#d6ff3d]',
    titleColor: 'text-[#f2f2f0]',
    btnColor: 'bg-[#d6ff3d] hover:brightness-110 text-[#0d0d10]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-brutal',
    name: 'Brutal',
    primaryColor: '#eef1f3',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfefe] via-[#eef1f3] to-[#1668c4]',
    titleColor: 'text-[#0a0f13]',
    btnColor: 'bg-[#1668c4] hover:brightness-110 text-[#eef5ff]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  // ——— Yeni konseptler: Terrazzo (kırık taş saçılımı) ———
  {
    id: 'dugun-terrazzo',
    name: 'Terrazzo',
    primaryColor: '#f6f2ec',
    backgroundStyle: 'bg-gradient-to-br from-[#fffdf9] via-[#f6f2ec] to-[#c9a227]',
    titleColor: 'text-[#2b2620]',
    btnColor: 'bg-[#2b2620] hover:brightness-125 text-[#f6f2ec]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-terrazzo',
    name: 'Terrazzo',
    primaryColor: '#fbf3e6',
    backgroundStyle: 'bg-gradient-to-br from-[#fffcf5] via-[#fbf3e6] to-[#c1272d]',
    titleColor: 'text-[#2c1d16]',
    btnColor: 'bg-[#2c1d16] hover:brightness-125 text-[#fbf3e6]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-terrazzo',
    name: 'Terrazzo',
    primaryColor: '#f3f5f8',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfeff] via-[#f3f5f8] to-[#5b7db1]',
    titleColor: 'text-[#232833]',
    btnColor: 'bg-[#232833] hover:brightness-125 text-[#f3f5f8]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-terrazzo',
    name: 'Terrazzo',
    primaryColor: '#eff6f7',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfeff] via-[#eff6f7] to-[#2f7f8c]',
    titleColor: 'text-[#17262b]',
    btnColor: 'bg-[#17262b] hover:brightness-125 text-[#eff6f7]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-terrazzo',
    name: 'Terrazzo',
    primaryColor: '#fff7ef',
    backgroundStyle: 'bg-gradient-to-br from-[#fffdf8] via-[#fff7ef] to-[#ff6b35]',
    titleColor: 'text-[#2a2018]',
    btnColor: 'bg-[#2a2018] hover:brightness-125 text-[#fff7ef]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-terrazzo',
    name: 'Terrazzo',
    primaryColor: '#f5f2ea',
    backgroundStyle: 'bg-gradient-to-br from-[#fffdf7] via-[#f5f2ea] to-[#7a2f39]',
    titleColor: 'text-[#24211a]',
    btnColor: 'bg-[#24211a] hover:brightness-125 text-[#f5f2ea]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-terrazzo',
    name: 'Terrazzo',
    primaryColor: '#fbf7f2',
    backgroundStyle: 'bg-gradient-to-br from-[#fffefb] via-[#fbf7f2] to-[#a8c8d8]',
    titleColor: 'text-[#2a2722]',
    btnColor: 'bg-[#2a2722] hover:brightness-125 text-[#fbf7f2]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-terrazzo',
    name: 'Terrazzo',
    primaryColor: '#131018',
    backgroundStyle: 'bg-gradient-to-br from-[#131018] via-[#131018] to-[#ff5f8f]',
    titleColor: 'text-[#f6f2f8]',
    btnColor: 'bg-[#f6f2f8] hover:brightness-125 text-[#131018]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-terrazzo',
    name: 'Terrazzo',
    primaryColor: '#f1f4f5',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfeff] via-[#f1f4f5] to-[#2f6f8c]',
    titleColor: 'text-[#1a2024]',
    btnColor: 'bg-[#1a2024] hover:brightness-125 text-[#f1f4f5]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  // ——— Yeni konseptler: Teknik Çizim (ozalit ızgara, kot çizgileri, antet) ———
  {
    id: 'dugun-blueprint',
    name: 'Teknik Çizim',
    primaryColor: '#10233f',
    backgroundStyle: 'bg-gradient-to-br from-[#183258] via-[#10233f] to-[#ffcf8a]',
    titleColor: 'text-[#cfe3ff]',
    btnColor: 'bg-[#ffcf8a] hover:brightness-110 text-[#10233f]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-blueprint',
    name: 'Teknik Çizim',
    primaryColor: '#2a1020',
    backgroundStyle: 'bg-gradient-to-br from-[#3d1a2f] via-[#2a1020] to-[#ff9f68]',
    titleColor: 'text-[#ffd9e6]',
    btnColor: 'bg-[#ff9f68] hover:brightness-110 text-[#2a1020]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-blueprint',
    name: 'Teknik Çizim',
    primaryColor: '#0f1c33',
    backgroundStyle: 'bg-gradient-to-br from-[#182a49] via-[#0f1c33] to-[#ffc9de]',
    titleColor: 'text-[#dae7ff]',
    btnColor: 'bg-[#ffc9de] hover:brightness-110 text-[#0f1c33]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-blueprint',
    name: 'Teknik Çizim',
    primaryColor: '#06232a',
    backgroundStyle: 'bg-gradient-to-br from-[#0c353f] via-[#06232a] to-[#ffd166]',
    titleColor: 'text-[#cdf0f5]',
    btnColor: 'bg-[#ffd166] hover:brightness-110 text-[#06232a]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-blueprint',
    name: 'Teknik Çizim',
    primaryColor: '#221033',
    backgroundStyle: 'bg-gradient-to-br from-[#34194d] via-[#221033] to-[#ffd166]',
    titleColor: 'text-[#f0dcff]',
    btnColor: 'bg-[#ffd166] hover:brightness-110 text-[#221033]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-blueprint',
    name: 'Teknik Çizim',
    primaryColor: '#101a2e',
    backgroundStyle: 'bg-gradient-to-br from-[#1b2a45] via-[#101a2e] to-[#d9b44a]',
    titleColor: 'text-[#dfe7f5]',
    btnColor: 'bg-[#d9b44a] hover:brightness-110 text-[#101a2e]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-blueprint',
    name: 'Teknik Çizim',
    primaryColor: '#0d2430',
    backgroundStyle: 'bg-gradient-to-br from-[#143646] via-[#0d2430] to-[#ffd3d3]',
    titleColor: 'text-[#d8f0f7]',
    btnColor: 'bg-[#ffd3d3] hover:brightness-110 text-[#0d2430]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-blueprint',
    name: 'Teknik Çizim',
    primaryColor: '#0a0a12',
    backgroundStyle: 'bg-gradient-to-br from-[#14142a] via-[#0a0a12] to-[#d6ff3d]',
    titleColor: 'text-[#d9ffe8]',
    btnColor: 'bg-[#d6ff3d] hover:brightness-110 text-[#0a0a12]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-blueprint',
    name: 'Teknik Çizim',
    primaryColor: '#0b1b26',
    backgroundStyle: 'bg-gradient-to-br from-[#122c3c] via-[#0b1b26] to-[#3fbfd8]',
    titleColor: 'text-[#d6ecf7]',
    btnColor: 'bg-[#3fbfd8] hover:brightness-110 text-[#0b1b26]',
    imageUrl: '',
    categories: ['kurumsal']
  },
  // ——— Yeni konseptler: Herbaryum (preslenmiş örnek föyü) ———
  {
    id: 'dugun-herbaryum',
    name: 'Herbaryum',
    primaryColor: '#f7f3e8',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfbf3] via-[#f7f3e8] to-[#9c3b46]',
    titleColor: 'text-[#2e2a1f]',
    btnColor: 'bg-[#2e2a1f] hover:brightness-125 text-[#f7f3e8]',
    imageUrl: '',
    categories: ['dugun']
  },
  {
    id: 'kina-herbaryum',
    name: 'Herbaryum',
    primaryColor: '#faf1e0',
    backgroundStyle: 'bg-gradient-to-br from-[#fffbf0] via-[#faf1e0] to-[#b8434f]',
    titleColor: 'text-[#2d2116]',
    btnColor: 'bg-[#2d2116] hover:brightness-125 text-[#faf1e0]',
    imageUrl: '',
    categories: ['kina']
  },
  {
    id: 'nisan-herbaryum',
    name: 'Herbaryum',
    primaryColor: '#f6f4ee',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfcf7] via-[#f6f4ee] to-[#6f7fa3]',
    titleColor: 'text-[#2a2b26]',
    btnColor: 'bg-[#2a2b26] hover:brightness-125 text-[#f6f4ee]',
    imageUrl: '',
    categories: ['nisan']
  },
  {
    id: 'sunnet-herbaryum',
    name: 'Herbaryum',
    primaryColor: '#f1f5f1',
    backgroundStyle: 'bg-gradient-to-br from-[#fafdfa] via-[#f1f5f1] to-[#2f7f8c]',
    titleColor: 'text-[#202b26]',
    btnColor: 'bg-[#202b26] hover:brightness-125 text-[#f1f5f1]',
    imageUrl: '',
    categories: ['sunnet']
  },
  {
    id: 'dogum-gunu-herbaryum',
    name: 'Herbaryum',
    primaryColor: '#fdf6ea',
    backgroundStyle: 'bg-gradient-to-br from-[#fffdf6] via-[#fdf6ea] to-[#d9603f]',
    titleColor: 'text-[#2c2418]',
    btnColor: 'bg-[#2c2418] hover:brightness-125 text-[#fdf6ea]',
    imageUrl: '',
    categories: ['dogum-gunu']
  },
  {
    id: 'mezuniyet-herbaryum',
    name: 'Herbaryum',
    primaryColor: '#f5f1e6',
    backgroundStyle: 'bg-gradient-to-br from-[#fdfbf3] via-[#f5f1e6] to-[#7a2f39]',
    titleColor: 'text-[#262319]',
    btnColor: 'bg-[#262319] hover:brightness-125 text-[#f5f1e6]',
    imageUrl: '',
    categories: ['mezuniyet']
  },
  {
    id: 'baby-herbaryum',
    name: 'Herbaryum',
    primaryColor: '#fbf8f1',
    backgroundStyle: 'bg-gradient-to-br from-[#fffefa] via-[#fbf8f1] to-[#8fa8b8]',
    titleColor: 'text-[#2b2a23]',
    btnColor: 'bg-[#2b2a23] hover:brightness-125 text-[#fbf8f1]',
    imageUrl: '',
    categories: ['baby-shower']
  },
  {
    id: 'parti-herbaryum',
    name: 'Herbaryum',
    primaryColor: '#17150f',
    backgroundStyle: 'bg-gradient-to-br from-[#211e15] via-[#17150f] to-[#ff7fa8]',
    titleColor: 'text-[#ece7d8]',
    btnColor: 'bg-[#ece7d8] hover:brightness-125 text-[#17150f]',
    imageUrl: '',
    categories: ['parti']
  },
  {
    id: 'kurumsal-herbaryum',
    name: 'Herbaryum',
    primaryColor: '#f3f5f2',
    backgroundStyle: 'bg-gradient-to-br from-[#fbfcfa] via-[#f3f5f2] to-[#2f6f8c]',
    titleColor: 'text-[#222824]',
    btnColor: 'bg-[#222824] hover:brightness-125 text-[#f3f5f2]',
    imageUrl: '',
    categories: ['kurumsal']
  },
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
/**
 * Yeni davetiyenin başlangıç programı.
 *
 * 🔴 `id: null` — bunlar henüz kaydedilmemiş adımlardır; kimliği backend
 * kaydederken üretir (K44). `localKey` yalnızca React'in liste anahtarıdır.
 */
export const DEFAULT_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: null,
    localKey: 'tl-default-1',
    time: '17:00',
    title: 'Karşılama & Kokteyl',
    description: 'Misafirlerimizi hoş geldin kokteyli ile karşılıyoruz.'
  },
  {
    id: null,
    localKey: 'tl-default-2',
    time: '19:00',
    title: 'Nikah Töreni',
    description: 'Evet dediğimiz o büyülü ana hep birlikte tanıklık edin.'
  },
  {
    id: null,
    localKey: 'tl-default-3',
    time: '20:00',
    title: 'Akşam Yemeği',
    description: 'Özenle hazırlanan menümüz eşliğinde keyifli bir akşam.'
  },
  {
    id: null,
    localKey: 'tl-default-4',
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

