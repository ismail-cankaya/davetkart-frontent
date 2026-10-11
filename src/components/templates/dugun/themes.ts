import { cn } from '../../../utils/cn';
import { SectionTheme } from '../shared/palette';

/**
 * Düğün kategorisinin bölüm temaları — "Tül & Kurdele" ailesi.
 *
 * Bütün renkler tek bir aileden gelir: soğuk inci beyazı zemin, menekşe-siyah
 * mürekkep, tek sıcak vurgu olarak şakayık ve botanik şablonlarda mersin
 * yeşili. Altın ve bronz bilinçli olarak yok; metal ışığını inci taşır.
 *
 * 🔴 Tailwind sınıfları kaynakta literal durmalı: hex değerleri bu yüzden
 * her temada açıkça yazılı (şablon dizgisiyle üretilen sınıf derlenmez).
 */

/**
 * Zarf: açıkta tül kağıt + şakayık mum mührü, koyuda gece kağıdı + inci mühür.
 * Ortak varsayılan koyu temada altın mühür ve ışıma basar; kimlikte altın yok.
 */
const ZARF_TUL: NonNullable<SectionTheme['envelope']> = {
  paper: 'bg-gradient-to-b from-[#fbfafc] to-[#ece7f0]',
  flap: 'bg-[#e1dae7]',
  seal: 'bg-[#9b3a63] text-[#f8f6f9]',
  glow: 'bg-[#f3dde7]/70',
  card: 'bg-white border border-[#e4dee9]'
};
const ZARF_GECE: NonNullable<SectionTheme['envelope']> = {
  paper: 'bg-gradient-to-b from-[#241d2e] to-[#16121d]',
  flap: 'bg-[#2c2438]',
  seal: 'bg-[#efe8f3] text-[#16121d]',
  glow: 'bg-[#eba9c6]/10',
  card: 'bg-[#16121d] border border-white/10'
};

/** "LCV kartı" alanı: kutu değil, üstüne yazılan bir satır. */
const REPLY_INPUT =
  'w-full bg-transparent border-0 border-b rounded-none px-1 py-2.5 text-sm focus:outline-none focus:ring-0 transition-colors duration-300';
/** Hap biçimli butonlar; harf aralığı davetiye kartının küçük başlıklarıyla aynı dilde. */
const PILL_PRIMARY = 'rounded-full tracking-[0.12em]';
const PILL_GHOST = 'rounded-full border';

/**
 * Kategori karakterini temaya giydirir: Cormorant serif, alt çizgili
 * alanlar, hap butonlar. Kendi sert geometrisi olan tasarım dilleri
 * (Brutal, Teknik Çizim, Noir) bunu kullanmaz, yalnızca renk ailesini alır.
 */
function kurdele(theme: SectionTheme): SectionTheme {
  const dark = theme.id === 'midnight';
  return {
    ...theme,
    envelope: theme.envelope ?? (dark ? ZARF_GECE : ZARF_TUL),
    mapHeader: theme.mapHeader ?? (dark ? 'bg-[#1f1a28]' : 'bg-[#efebf2]'),
    base: cn('theme-cormorant', theme.base),
    input: cn(REPLY_INPUT, theme.input),
    buttonPrimary: cn(PILL_PRIMARY, theme.buttonPrimary),
    buttonGhost: cn(PILL_GHOST, theme.buttonGhost)
  };
}

/** Açık zemin kartı: inci kenarlı beyaz tül, altında uzun yumuşak gölge. */
const TUL_SURFACE = 'bg-white/75 backdrop-blur-md shadow-[0_24px_48px_-32px_rgba(33,27,45,0.35)]';
/** Koyu zemin kartı: üst kenarında tek bir inci ışığı. */
const GECE_SURFACE = 'bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]';

/** Tül — ailenin açık çekirdeği; ayrıca bir zemini olmayan şablonların teması. */
const TUL: SectionTheme = kurdele({
  id: 'stone',
  base: 'bg-[#f8f6f9]',
  page: 'text-[#433b52]',
  surface: TUL_SURFACE,
  border: 'border-[#e4dee9]',
  heading: 'text-[#211b2d]',
  body: 'text-[#655d74]',
  accent: 'text-[#9b3a63]',
  accentBg: 'bg-[#9b3a63]',
  accentSoft: 'bg-[#9b3a63]/10',
  input: 'border-[#cbc2d3] text-[#211b2d] placeholder:text-[#776f85] focus:border-[#9b3a63]',
  buttonPrimary: 'bg-[#211b2d] hover:bg-[#3a3149] text-[#f8f6f9] shadow-lg shadow-[#211b2d]/15',
  buttonGhost: 'border-[#d6cfdc] text-[#433b52] hover:bg-white hover:border-[#b8aec2]',
  divider: 'bg-[#e4dee9]',
  timelineLine: 'from-[#9b3a63] via-[#cbc2d3]/70 to-transparent'
});

/** Gece — ailenin koyu çekirdeği: inci yazı, şakayık ışığı, inci buton. */
const GECE: SectionTheme = kurdele({
  id: 'midnight',
  base: 'bg-[#16121d]',
  page: 'text-[#e2dce8]',
  surface: GECE_SURFACE,
  border: 'border-white/12',
  heading: 'text-[#f6f1f8]',
  body: 'text-[#b1a8bd]',
  accent: 'text-[#eba9c6]',
  accentBg: 'bg-[#eba9c6]',
  accentSoft: 'bg-[#eba9c6]/12',
  input: 'border-white/25 text-[#f6f1f8] placeholder:text-[#958ca5] focus:border-[#eba9c6]',
  buttonPrimary: 'bg-[#efe8f3] hover:bg-white text-[#16121d] shadow-lg shadow-black/30',
  buttonGhost: 'border-white/18 text-[#e2dce8] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#eba9c6] via-[#d9d0e2]/40 to-transparent'
});

export const DUGUN_THEMES = {
  // ——— Kategori hero'lu şablonlar (KurdeleHero) ———

  /** Zarif Sadelik: ailenin açık çekirdeği, olduğu gibi. */
  DugunSade: TUL,

  /** İnci Gravür: süslü çerçeve görseli tersine çevrilip gümüş bir gravüre döner; tül zemin, mor mürekkep. */
  DugunManzara: kurdele({
    id: 'stone',
    base: 'bg-[#f6f3f7]',
    page: 'text-[#433b52]',
    surface: TUL_SURFACE,
    border: 'border-[#e2dbe7]',
    heading: 'text-[#211b2d]',
    body: 'text-[#5d5569]',
    accent: 'text-[#5e3f6e]',
    accentBg: 'bg-[#5e3f6e]',
    accentSoft: 'bg-[#5e3f6e]/10',
    input: 'border-[#cbc2d3] text-[#211b2d] placeholder:text-[#736b80] focus:border-[#5e3f6e]',
    buttonPrimary: 'bg-[#2c2340] hover:bg-[#3f3456] text-[#f6f3f7] shadow-lg shadow-[#2c2340]/15',
    buttonGhost: 'border-[#d6cfdc] text-[#433b52] hover:bg-white hover:border-[#b8aec2]',
    divider: 'bg-[#e2dbe7]',
    timelineLine: 'from-[#5e3f6e] via-[#cbc2d3]/70 to-transparent'
  }),

  /** İnci Motif: mersin gecesinde inci kafes ve kemer plaket; vurgu şakayık değil inci. */
  DugunSekilli: {
    ...GECE,
    base: 'theme-cormorant bg-[#0f1714]',
    page: 'text-[#e1e7e2]',
    heading: 'text-[#f4f6f2]',
    body: 'text-[#a8b6ad]',
    envelope: { ...ZARF_GECE, paper: 'bg-gradient-to-b from-[#1a2620] to-[#0f1714]', flap: 'bg-[#22302a]', card: 'bg-[#0f1714] border border-white/10' },
    mapHeader: 'bg-[#18231e]',
    accent: 'text-[#dcd2e6]',
    accentBg: 'bg-[#dcd2e6]',
    accentSoft: 'bg-[#dcd2e6]/12',
    border: 'border-[#dcd2e6]/18',
    divider: 'bg-[#dcd2e6]/18',
    input: cn(REPLY_INPUT, 'border-[#dcd2e6]/30 text-[#f6f1f8] placeholder:text-[#958ca5] focus:border-[#dcd2e6]'),
    timelineLine: 'from-[#dcd2e6] via-[#dcd2e6]/35 to-transparent'
  },

  /** Gece Modası: koyu cam kartlar ve orkide ışığı. */
  DugunModern: {
    ...GECE,
    base: 'theme-cormorant bg-[#0c0b0e]',
    heading: 'text-[#f7f5f8]',
    body: 'text-[#aaa6b0]',
    envelope: { ...ZARF_GECE, paper: 'bg-gradient-to-b from-[#1b1a1f] to-[#0c0b0e]', flap: 'bg-[#232228]', glow: 'bg-[#e79ac0]/12' },
    mapHeader: 'bg-[#18171c]',
    surface: 'bg-white/[0.06] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
    accent: 'text-[#e79ac0]',
    accentBg: 'bg-[#e79ac0]',
    accentSoft: 'bg-[#e79ac0]/12',
    timelineLine: 'from-[#e79ac0] via-[#b9a7e0]/45 to-transparent'
  },

  /** Zarif Çerçeve: suluboya buketlerin tozlu gülü. */
  Dugun1: kurdele({
    id: 'stone',
    base: 'bg-[#faf8f9]',
    page: 'text-[#4a4049]',
    surface: TUL_SURFACE,
    border: 'border-[#e9e1e6]',
    heading: 'text-[#33282f]',
    body: 'text-[#6e5f69]',
    accent: 'text-[#9a4a63]',
    accentBg: 'bg-[#9a4a63]',
    accentSoft: 'bg-[#9a4a63]/10',
    input: 'border-[#d6c9d1] text-[#33282f] placeholder:text-[#7b6c76] focus:border-[#9a4a63]',
    buttonPrimary: 'bg-[#33282f] hover:bg-[#4a3d45] text-[#faf8f9] shadow-lg shadow-[#33282f]/15',
    buttonGhost: 'border-[#ddd1d8] text-[#4a4049] hover:bg-white hover:border-[#c4b4be]',
    divider: 'bg-[#e9e1e6]',
    timelineLine: 'from-[#9a4a63] via-[#d6c9d1]/70 to-transparent'
  }),

  /** Pastel Buket: okaliptüs girlandının mersin yeşili. */
  Dugun2: kurdele({
    id: 'stone',
    base: 'bg-[#f8f8f5]',
    page: 'text-[#424a42]',
    surface: TUL_SURFACE,
    border: 'border-[#e2e5dc]',
    heading: 'text-[#2c362e]',
    body: 'text-[#5e6a60]',
    accent: 'text-[#4f6b55]',
    accentBg: 'bg-[#4f6b55]',
    accentSoft: 'bg-[#4f6b55]/10',
    input: 'border-[#c9d0c3] text-[#2c362e] placeholder:text-[#667168] focus:border-[#4f6b55]',
    buttonPrimary: 'bg-[#2f3d33] hover:bg-[#435447] text-[#f8f8f5] shadow-lg shadow-[#2f3d33]/15',
    buttonGhost: 'border-[#d3d8cc] text-[#424a42] hover:bg-white hover:border-[#b5bea9]',
    divider: 'bg-[#e2e5dc]',
    timelineLine: 'from-[#4f6b55] via-[#c9d0c3]/70 to-transparent'
  }),

  /** Bordo Zambak: zambakların koyu şakayığı. */
  Dugun3: kurdele({
    id: 'stone',
    base: 'bg-[#faf7f8]',
    page: 'text-[#4b3a42]',
    surface: TUL_SURFACE,
    border: 'border-[#ecdfe4]',
    heading: 'text-[#3a1d2b]',
    body: 'text-[#735a66]',
    accent: 'text-[#8a3150]',
    accentBg: 'bg-[#8a3150]',
    accentSoft: 'bg-[#8a3150]/10',
    input: 'border-[#dcc8d0] text-[#3a1d2b] placeholder:text-[#7d6672] focus:border-[#8a3150]',
    buttonPrimary: 'bg-[#4a1d31] hover:bg-[#632a43] text-[#faf7f8] shadow-lg shadow-[#4a1d31]/20',
    buttonGhost: 'border-[#e2cfd6] text-[#5a3b4a] hover:bg-white hover:border-[#caa9b6]',
    divider: 'bg-[#ecdfe4]',
    timelineLine: 'from-[#8a3150] via-[#dcc8d0]/70 to-transparent'
  }),

  /** Pembe Kemer: çiçekli kemerin pudra pembesi. */
  Dugun4: kurdele({
    id: 'stone',
    base: 'bg-[#fcf5f7]',
    page: 'text-[#55374a]',
    surface: 'bg-white/80 backdrop-blur-md shadow-[0_24px_48px_-32px_rgba(74,37,55,0.3)]',
    border: 'border-[#f0dde4]',
    heading: 'text-[#4a2537]',
    body: 'text-[#6b4659]',
    accent: 'text-[#923454]',
    accentBg: 'bg-[#923454]',
    accentSoft: 'bg-[#923454]/10',
    input: 'border-[#e3c6d1] text-[#4a2537] placeholder:text-[#7d5b6d] focus:border-[#923454]',
    buttonPrimary: 'bg-[#8f3a5a] hover:bg-[#a34a6b] text-white shadow-lg shadow-[#8f3a5a]/20',
    buttonGhost: 'border-[#e8ccd6] text-[#6e4458] hover:bg-white hover:border-[#d4a8b8]',
    divider: 'bg-[#f0dde4]',
    timelineLine: 'from-[#923454] via-[#e3c6d1]/70 to-transparent'
  }),

  /** Bahar Bahçesi: çayırın mersin yeşili, çiçeklerin şakayığı. */
  Dugun5: kurdele({
    id: 'stone',
    base: 'bg-[#f5f8f4]',
    page: 'text-[#3f4d43]',
    surface: TUL_SURFACE,
    border: 'border-[#dde5da]',
    heading: 'text-[#26392f]',
    body: 'text-[#56665b]',
    accent: 'text-[#9c4566]',
    accentBg: 'bg-[#9c4566]',
    accentSoft: 'bg-[#9c4566]/10',
    input: 'border-[#c4d0c0] text-[#26392f] placeholder:text-[#68776c] focus:border-[#41604f]',
    buttonPrimary: 'bg-[#2f4a3b] hover:bg-[#3f5f4c] text-[#f5f8f4] shadow-lg shadow-[#2f4a3b]/15',
    buttonGhost: 'border-[#cbd6c6] text-[#3f4d43] hover:bg-white hover:border-[#a9baa2]',
    divider: 'bg-[#dde5da]',
    timelineLine: 'from-[#41604f] via-[#c4d0c0]/70 to-transparent'
  }),

  /** Gökyüzü Rüyası: şafak göğünün mavisi, bulut altındaki şakayık. */
  DugunGokyuzu: kurdele({
    id: 'stone',
    base: 'bg-[#f1f4f9]',
    page: 'text-[#3a4458]',
    surface: 'bg-white/75 backdrop-blur-md shadow-[0_24px_48px_-32px_rgba(33,45,67,0.3)]',
    border: 'border-[#dde4ee]',
    heading: 'text-[#212d43]',
    body: 'text-[#4a566c]',
    accent: 'text-[#8e3a5b]',
    accentBg: 'bg-[#8e3a5b]',
    accentSoft: 'bg-[#8e3a5b]/10',
    input: 'border-[#c5d0de] text-[#212d43] placeholder:text-[#5f6b82] focus:border-[#8e3a5b]',
    buttonPrimary: 'bg-[#2c3a55] hover:bg-[#3d4e6e] text-[#f1f4f9] shadow-lg shadow-[#2c3a55]/15',
    buttonGhost: 'border-[#cbd5e2] text-[#3a4458] hover:bg-white hover:border-[#a9b8cc]',
    divider: 'bg-[#dde4ee]',
    timelineLine: 'from-[#8e3a5b] via-[#c5d0de]/70 to-transparent'
  }),

  /** Mum Işığı: gece nikâhı; ışık sıcak, vurgu inci pembesi. */
  DugunMumIsigi: {
    ...GECE,
    base: 'theme-cormorant bg-[#120d0b]',
    page: 'text-[#ece0d8]',
    heading: 'text-[#fbf3ee]',
    body: 'text-[#bcaea5]',
    accent: 'text-[#f2c6b6]',
    accentBg: 'bg-[#f2c6b6]',
    accentSoft: 'bg-[#f2c6b6]/12',
    envelope: { ...ZARF_GECE, paper: 'bg-gradient-to-b from-[#241a15] to-[#120d0b]', flap: 'bg-[#2c211b]', glow: 'bg-[#f2c6b6]/12', card: 'bg-[#120d0b] border border-white/10' },
    mapHeader: 'bg-[#1e1612]',
    timelineLine: 'from-[#f2c6b6] via-[#f2c6b6]/40 to-transparent'
  },

  /** Gül Yaprakları: pudra zeminde şakayık. */
  DugunGulYapraklari: kurdele({
    id: 'stone',
    base: 'bg-[#fbf3f5]',
    page: 'text-[#53404a]',
    surface: 'bg-white/80 backdrop-blur-md shadow-[0_24px_48px_-32px_rgba(61,39,50,0.3)]',
    border: 'border-[#f0dfe5]',
    heading: 'text-[#3d2732]',
    body: 'text-[#523b48]',
    accent: 'text-[#7f2849]',
    accentBg: 'bg-[#7f2849]',
    accentSoft: 'bg-[#7f2849]/10',
    input: 'border-[#e3cbd4] text-[#3d2732] placeholder:text-[#7a6370] focus:border-[#7f2849]',
    buttonPrimary: 'bg-[#3d2732] hover:bg-[#553a47] text-[#fbf3f5] shadow-lg shadow-[#3d2732]/15',
    buttonGhost: 'border-[#e6d1d9] text-[#53404a] hover:bg-white hover:border-[#cfaebb]',
    divider: 'bg-[#f0dfe5]',
    timelineLine: 'from-[#7f2849] via-[#e3cbd4]/70 to-transparent'
  }),

  /** Deniz Işıltısı: akvamarin zemin, mercan-şakayık vurgu. */
  DugunDenizIsiltisi: kurdele({
    id: 'stone',
    base: 'bg-[#eef6f5]',
    page: 'text-[#2f4b4c]',
    surface: 'bg-white/75 backdrop-blur-md shadow-[0_24px_48px_-32px_rgba(27,53,55,0.3)]',
    border: 'border-[#d4e6e3]',
    heading: 'text-[#1b3537]',
    body: 'text-[#4f6b6a]',
    accent: 'text-[#9c3d61]',
    accentBg: 'bg-[#9c3d61]',
    accentSoft: 'bg-[#9c3d61]/10',
    input: 'border-[#bcd6d2] text-[#1b3537] placeholder:text-[#5f7978] focus:border-[#9c3d61]',
    buttonPrimary: 'bg-[#1f4446] hover:bg-[#2c5a5c] text-[#eef6f5] shadow-lg shadow-[#1f4446]/15',
    buttonGhost: 'border-[#c3dbd8] text-[#2f4b4c] hover:bg-white hover:border-[#9ec4bf]',
    divider: 'bg-[#d4e6e3]',
    timelineLine: 'from-[#9c3d61] via-[#bcd6d2]/70 to-transparent'
  }),

  /** Sinematik Sahil: gün batımının mor laciverti, vurgu inci pembesi. */
  DugunSahil: {
    ...GECE,
    base: 'theme-cormorant bg-[#171526]',
    surface: 'bg-white/[0.06] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]',
    heading: 'text-[#fbf5f4]',
    body: 'text-[#b6aab4]',
    accent: 'text-[#f5c2cf]',
    accentBg: 'bg-[#f5c2cf]',
    accentSoft: 'bg-[#f5c2cf]/12',
    timelineLine: 'from-[#f5c2cf] via-[#f5c2cf]/40 to-transparent'
  },

  /** Onyx & İnci: sıvı metal videonun önünde inci tipografi. */
  DugunOnyx: {
    ...GECE,
    base: 'theme-cormorant bg-[#070708]',
    envelope: { ...ZARF_GECE, paper: 'bg-gradient-to-b from-[#18171a] to-[#070708]', flap: 'bg-[#1f1e22]', glow: 'bg-white/[0.06]', card: 'bg-[#070708] border border-white/10' },
    mapHeader: 'bg-[#141316]',
    surface: 'bg-white/[0.05] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]',
    border: 'border-[#e4dbe9]/18',
    heading: 'text-[#f7f2f8]',
    body: 'text-[#a9a0b0]',
    accent: 'text-[#e4dbe9]',
    accentBg: 'bg-[#e4dbe9]',
    accentSoft: 'bg-[#e4dbe9]/10',
    buttonPrimary: cn(PILL_PRIMARY, 'bg-gradient-to-r from-[#f6f2f8] to-[#d9cfe3] hover:brightness-105 text-[#0d0b10] shadow-lg shadow-black/40'),
    divider: 'bg-[#e4dbe9]/15',
    timelineLine: 'from-[#e4dbe9] via-[#e4dbe9]/35 to-transparent'
  },

  /** Sedef: inci kabuğunun açık, yanardöner iç yüzeyi; üzerinde buzlu cam kartlar. */
  DugunAurora: kurdele({
    id: 'stone',
    base: 'bg-[#f6f3f8]',
    page: 'text-[#433b52]',
    surface: 'bg-white/55 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_24px_48px_-32px_rgba(33,27,45,0.3)]',
    border: 'border-white/80',
    heading: 'text-[#211b2d]',
    body: 'text-[#584f66]',
    accent: 'text-[#87306a]',
    accentBg: 'bg-[#87306a]',
    accentSoft: 'bg-[#87306a]/10',
    input: 'border-[#c9bfd4] text-[#211b2d] placeholder:text-[#6c6479] focus:border-[#87306a]',
    buttonPrimary: 'bg-[#211b2d] hover:bg-[#3a3149] text-[#f6f3f8] shadow-lg shadow-[#211b2d]/15',
    buttonGhost: 'border-[#d3c9de] text-[#433b52] hover:bg-white hover:border-[#b5a9c3]',
    divider: 'bg-[#e0d8e8]',
    timelineLine: 'from-[#87306a] via-[#c7b8e2]/60 to-transparent'
  }),

  /** Saten Gümüş: soğuk gümüş bantlı açık metal zemin; isimler koyu metal degradeden kesilir. */
  DugunKrom: kurdele({
    id: 'stone',
    base: 'bg-[#eceff3]',
    page: 'text-[#353b46]',
    surface: 'bg-white/70 backdrop-blur-xl backdrop-saturate-150 shadow-[0_24px_48px_-32px_rgba(31,36,46,0.35)]',
    border: 'border-[#cdd3dc]',
    heading: 'text-transparent bg-clip-text bg-gradient-to-br from-[#0d0f13] via-[#2e3440] to-[#14171d]',
    body: 'text-[#3f4652]',
    accent: 'text-[#4b3f6b]',
    accentBg: 'bg-[#4b3f6b]',
    accentSoft: 'bg-[#4b3f6b]/10',
    input: 'border-[#b9c0cb] text-[#14171d] placeholder:text-[#5f6775] focus:border-[#4b3f6b]',
    buttonPrimary: 'bg-[#1b1f27] hover:bg-[#2e3440] text-[#eceff3] shadow-lg shadow-black/15',
    buttonGhost: 'border-[#c3cad4] text-[#3a414d] hover:bg-white hover:border-[#9aa3b1]',
    divider: 'bg-[#d3d9e1]',
    timelineLine: 'from-[#4b3f6b] via-[#b9c0cb]/70 to-transparent',
    envelope: {
      paper: 'bg-gradient-to-b from-[#f7f8fa] to-[#dfe3ea]',
      flap: 'bg-[#d3d9e1]',
      seal: 'bg-[#1b1f27] text-[#eceff3]',
      glow: 'bg-white/60',
      card: 'bg-white border border-[#cdd3dc]'
    },
    mapHeader: 'bg-[#e1e5eb]'
  }),

  // ——— Ortak hero'lu tasarım dilleri ———

  /** Bento: tül zeminde neredeyse opak hücreler. */
  DugunBento: { ...TUL, surface: 'bg-white/90 backdrop-blur-sm shadow-[0_18px_40px_-30px_rgba(33,27,45,0.35)]' },

  /** Noir: gece zemin, şampanya yerine inci kıl çizgiler; köşesiz İsviçre geometrisi. */
  DugunNoir: {
    id: 'midnight',
    base: 'theme-cormorant bg-[#0d0b10]',
    page: 'text-[#dcd6e0]',
    surface: 'bg-white/[0.035] backdrop-blur-md',
    border: 'border-[#d9d0e2]/16',
    heading: 'text-[#f5f1f7]',
    body: 'text-[#9d95a8]',
    accent: 'text-[#d9d0e2]',
    accentBg: 'bg-[#d9d0e2]',
    accentSoft: 'bg-[#d9d0e2]/10',
    input:
      'w-full bg-white/[0.035] border border-[#d9d0e2]/16 rounded-none px-3.5 py-2.5 text-sm text-[#f0ebf3] placeholder:text-[#8c8497] focus:outline-none focus:border-[#d9d0e2]/55 focus:ring-0 transition duration-300',
    buttonPrimary: 'rounded-none bg-[#e9e3ee] hover:bg-white text-[#0d0b10] shadow-none',
    envelope: { ...ZARF_GECE, paper: 'bg-gradient-to-b from-[#1a171e] to-[#0d0b10]', flap: 'bg-[#221e27]', glow: 'bg-white/[0.05]', card: 'bg-[#0d0b10] border border-[#d9d0e2]/16' },
    mapHeader: 'bg-[#16131a]',
    buttonGhost: 'rounded-none border border-[#d9d0e2]/22 text-[#dcd6e0] hover:bg-[#d9d0e2]/8 hover:border-[#d9d0e2]/40',
    divider: 'bg-[#d9d0e2]/18',
    timelineLine: 'from-[#d9d0e2] via-[#d9d0e2]/30 to-transparent'
  },

  /** Kağıt & Mühür: inci kağıt, şakayık mum mührü. */
  DugunKagit: kurdele({
    id: 'stone',
    base: 'bg-[#f3f1f4]',
    page: 'text-[#4d4558]',
    surface: 'bg-white/80 backdrop-blur-sm shadow-[0_24px_48px_-32px_rgba(35,29,43,0.35)]',
    border: 'border-[#dcd5e1]',
    heading: 'text-[#231d2b]',
    body: 'text-[#625a6d]',
    accent: 'text-[#8f2f57]',
    accentBg: 'bg-[#8f2f57]',
    accentSoft: 'bg-[#8f2f57]/10',
    input: 'border-[#c9c0d0] text-[#231d2b] placeholder:text-[#71697c] focus:border-[#8f2f57]',
    buttonPrimary: 'bg-[#231d2b] hover:bg-[#3a3245] text-[#f3f1f4] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#d3cbd9] text-[#4d4558] hover:bg-white hover:border-[#b6abc0]',
    divider: 'bg-[#dcd5e1]',
    timelineLine: 'from-[#8f2f57] via-[#c9c0d0]/70 to-transparent'
  }),

  /**
   * Art Deco — platin deco: altın yerine inci; 1920'lerin platin mücevher dili.
   * DecoHero sayaç ayırıcısı `divider`'dan `divide-[#d9d0e2]/22` sınıfını türetir.
   */
  DugunDeco: {
    ...GECE,
    base: 'theme-cormorant bg-[#0e0c12]',
    page: 'text-[#e6e0ea]',
    border: 'border-[#d9d0e2]/22',
    heading: 'text-[#f8f4fa]',
    body: 'text-[#a39bad]',
    accent: 'text-[#d9d0e2]',
    accentBg: 'bg-[#d9d0e2]',
    accentSoft: 'bg-[#d9d0e2]/10',
    input: cn(REPLY_INPUT, 'border-[#d9d0e2]/30 text-[#f8f4fa] placeholder:text-[#8f879a] focus:border-[#d9d0e2]'),
    buttonPrimary: cn(PILL_PRIMARY, 'bg-gradient-to-r from-[#d9d0e2] to-[#f3eff6] hover:brightness-105 text-[#120f16] shadow-lg shadow-black/40'),
    buttonGhost: cn(PILL_GHOST, 'border-[#d9d0e2]/25 text-[#e6e0ea] hover:bg-[#d9d0e2]/10 hover:border-[#d9d0e2]/45'),
    divider: 'bg-[#d9d0e2]/22',
    timelineLine: 'from-[#d9d0e2] via-[#d9d0e2]/35 to-transparent'
  },

  /** Risograph: iki spot mürekkep — floresan şakayık ve mersin. */
  DugunRiso: kurdele({
    id: 'stone',
    base: 'bg-[#f7f5f6]',
    page: 'text-[#3a3440]',
    surface: 'bg-white/85',
    border: 'border-[#1d1922]/15',
    heading: 'text-[#1d1922]',
    body: 'text-[#5f5866]',
    accent: 'text-[#bc2a5e]',
    accentBg: 'bg-[#bc2a5e]',
    accentSoft: 'bg-[#3f6b55]/25',
    input: 'border-[#1d1922]/25 text-[#1d1922] placeholder:text-[#6b6472] focus:border-[#bc2a5e]',
    buttonPrimary: 'bg-[#1d1922] hover:bg-[#3a3440] text-[#f7f5f6] shadow-none',
    buttonGhost: 'border-2 border-[#1d1922] text-[#1d1922] hover:bg-[#1d1922] hover:text-[#f7f5f6]',
    divider: 'bg-[#1d1922]/15',
    timelineLine: 'from-[#bc2a5e] via-[#3f6b55]/50 to-transparent'
  }),

  /** Davet Bileti: inci kart stoğu, şakayık mürekkep. */
  DugunBilet: kurdele({
    id: 'stone',
    base: 'bg-[#f2f0f4]',
    page: 'text-[#463f50]',
    surface: 'bg-white/90 backdrop-blur-sm',
    border: 'border-[#dbd4e0]',
    heading: 'text-[#211b2b]',
    body: 'text-[#615a6b]',
    accent: 'text-[#8f2f57]',
    accentBg: 'bg-[#8f2f57]',
    accentSoft: 'bg-[#8f2f57]/12',
    input: 'border-[#c8bfcf] text-[#211b2b] placeholder:text-[#6e6679] focus:border-[#8f2f57]',
    buttonPrimary: 'bg-[#211b2b] hover:bg-[#3a3245] text-[#f2f0f4] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#d2cad8] text-[#463f50] hover:bg-white hover:border-[#b3a8bd]',
    divider: 'bg-[#dbd4e0]',
    timelineLine: 'from-[#8f2f57] via-[#c8bfcf]/70 to-transparent'
  }),

  /** Vitray: şakayık–lila–mersin camlar, arkadan inci ışığı. */
  DugunVitray: {
    ...GECE,
    base: 'theme-cormorant bg-[#110d16]',
    page: 'text-[#e3dce8]',
    heading: 'text-[#f8f2f8]',
    body: 'text-[#a299ad]',
    accent: 'text-[#ebb0c9]',
    accentBg: 'bg-[#ebb0c9]',
    accentSoft: 'bg-[#ebb0c9]/12',
    buttonPrimary: cn(PILL_PRIMARY, 'bg-gradient-to-r from-[#ebb0c9] to-[#d9cdf3] hover:brightness-105 text-[#140f19] shadow-lg shadow-[#ebb0c9]/20'),
    timelineLine: 'from-[#ebb0c9] via-[#c7b8e2]/45 to-transparent'
  },

  /** Kinetik Tipografi: tül zemin, mürekkep kontur, şakayık vurgu. */
  DugunKinetik: { ...TUL, base: 'theme-cormorant bg-[#f6f5f7]', heading: 'text-[#19141f]' },

  /** Tek Çizgi: tül kağıt, mor mürekkepli tek hat. */
  DugunCizgi: kurdele({
    id: 'stone',
    base: 'bg-[#f9f8fa]',
    page: 'text-[#463f50]',
    surface: 'bg-white/85',
    border: 'border-[#e0dae5]',
    heading: 'text-[#211b2b]',
    body: 'text-[#655d70]',
    accent: 'text-[#5a3f73]',
    accentBg: 'bg-[#5a3f73]',
    accentSoft: 'bg-[#5a3f73]/10',
    input: 'border-[#cdc4d6] text-[#211b2b] placeholder:text-[#71697c] focus:border-[#5a3f73]',
    buttonPrimary: 'bg-[#211b2b] hover:bg-[#3a3245] text-[#f9f8fa] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#d8d1de] text-[#463f50] hover:bg-white hover:border-[#b9aec4]',
    divider: 'bg-[#e0dae5]',
    timelineLine: 'from-[#5a3f73] via-[#cdc4d6]/70 to-transparent'
  }),

  /** Vinil Plak: ilk dansın plağı — şakayık etiket, gece zemin. */
  DugunPlak: {
    ...GECE,
    base: 'theme-cormorant bg-[#121016]',
    body: 'text-[#a198aa]',
    accent: 'text-[#e7a3c0]',
    accentBg: 'bg-[#e7a3c0]',
    accentSoft: 'bg-[#e7a3c0]/12',
    timelineLine: 'from-[#e7a3c0] via-[#8f2f57]/45 to-transparent'
  },

  /** Suluboya: şakayık, lila ve mersin lekeleri; inci kağıt. */
  DugunSuluboya: kurdele({
    id: 'stone',
    base: 'bg-[#faf9fb]',
    page: 'text-[#4a4253]',
    surface: 'bg-white/80 backdrop-blur-sm',
    border: 'border-[#e6e0ea]',
    heading: 'text-[#2a2333]',
    body: 'text-[#665e70]',
    accent: 'text-[#9b3a63]',
    accentBg: 'bg-[#9b3a63]',
    accentSoft: 'bg-[#9b3a63]/12',
    input: 'border-[#d0c7d8] text-[#2a2333] placeholder:text-[#746c7f] focus:border-[#9b3a63]',
    buttonPrimary: 'bg-[#2a2333] hover:bg-[#403749] text-[#faf9fb] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#ddd6e2] text-[#4a4253] hover:bg-white hover:border-[#c0b5c9]',
    divider: 'bg-[#e6e0ea]',
    timelineLine: 'from-[#9b3a63] via-[#c7b8e2]/60 to-transparent'
  }),

  /** Mekanik Pano: gece mürekkebi kanatlar, inci harfler. */
  DugunPano: {
    ...GECE,
    base: 'theme-cormorant bg-[#120f17]',
    page: 'text-[#e0dae6]',
    body: 'text-[#a097ab]',
    accent: 'text-[#eab0c8]',
    accentBg: 'bg-[#eab0c8]',
    accentSoft: 'bg-[#eab0c8]/12',
    timelineLine: 'from-[#eab0c8] via-[#8f2f57]/45 to-transparent'
  },

  /** Yıldız Haritası: menekşe gece, inci takımyıldız. */
  DugunYildizHaritasi: {
    ...GECE,
    base: 'theme-cormorant bg-[#0c0b16]',
    page: 'text-[#dedbea]',
    heading: 'text-[#f7f4fb]',
    body: 'text-[#a19db4]',
    accent: 'text-[#e2d4f5]',
    accentBg: 'bg-[#e2d4f5]',
    accentSoft: 'bg-[#e2d4f5]/12',
    timelineLine: 'from-[#e2d4f5] via-[#8f86b8]/45 to-transparent'
  },

  /** Dokuma: keten-inci zemin; şakayık, mersin ve lila iplikler. */
  DugunDokuma: kurdele({
    id: 'stone',
    base: 'bg-[#f5f2f4]',
    page: 'text-[#4b4350]',
    surface: 'bg-[#faf8f9]/90',
    border: 'border-[#e0d8df]',
    heading: 'text-[#251e29]',
    body: 'text-[#675f6c]',
    accent: 'text-[#8f2f57]',
    accentBg: 'bg-[#8f2f57]',
    accentSoft: 'bg-[#8f2f57]/12',
    input: 'border-[#cbc1cb] text-[#251e29] placeholder:text-[#736a77] focus:border-[#8f2f57]',
    buttonPrimary: 'bg-[#251e29] hover:bg-[#3c3341] text-[#f5f2f4] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#d6cdd5] text-[#4b4350] hover:bg-white hover:border-[#b9adb8]',
    divider: 'bg-[#e0d8df]',
    timelineLine: 'from-[#8f2f57] via-[#3f6b55]/50 to-transparent'
  }),

  /** Film Şeridi: gece şerit, inci kareler. */
  DugunFilm: {
    ...GECE,
    base: 'theme-cormorant bg-[#100d13]',
    page: 'text-[#e0dae4]',
    body: 'text-[#a097a9]',
    accent: 'text-[#ddd3e6]',
    accentBg: 'bg-[#ddd3e6]',
    accentSoft: 'bg-[#ddd3e6]/12',
    timelineLine: 'from-[#ddd3e6] via-[#ddd3e6]/35 to-transparent'
  },

  /** Mermer & Rölyef: inci-lila damarlı beyaz taş. */
  DugunMermer: kurdele({
    id: 'stone',
    base: 'bg-[#f4f2f5]',
    page: 'text-[#4b4552]',
    surface: 'bg-[#fbfafc]/85 backdrop-blur-sm',
    border: 'border-[#e2dde6]',
    heading: 'text-[#241f2b]',
    body: 'text-[#665f6e]',
    accent: 'text-[#8f2f57]',
    accentBg: 'bg-[#8f2f57]',
    accentSoft: 'bg-[#8f2f57]/12',
    input: 'border-[#cdc6d3] text-[#241f2b] placeholder:text-[#716a79] focus:border-[#8f2f57]',
    buttonPrimary: 'bg-[#241f2b] hover:bg-[#3a3443] text-[#f4f2f5] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#dbd5e0] text-[#4b4552] hover:bg-white hover:border-[#bbb2c4]',
    divider: 'bg-[#e2dde6]',
    timelineLine: 'from-[#8f2f57] via-[#cdc6d3]/70 to-transparent'
  }),

  /** Gazete Manşeti: nötr gazete kâğıdı, şakayık manşet mürekkebi. */
  DugunGazete: kurdele({
    id: 'stone',
    base: 'bg-[#f3f2f1]',
    page: 'text-[#45414a]',
    surface: 'bg-[#faf9f8]/85 backdrop-blur-sm',
    border: 'border-[#dedbd9]',
    heading: 'text-[#16131a]',
    body: 'text-[#625d67]',
    accent: 'text-[#8f2f57]',
    accentBg: 'bg-[#8f2f57]',
    accentSoft: 'bg-[#8f2f57]/12',
    input: 'border-[#c9c5c9] text-[#16131a] placeholder:text-[#6d6871] focus:border-[#8f2f57]',
    buttonPrimary: 'bg-[#16131a] hover:bg-[#2f2a34] text-[#f3f2f1] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#d6d2d4] text-[#45414a] hover:bg-white hover:border-[#b5b0b6]',
    divider: 'bg-[#dedbd9]',
    timelineLine: 'from-[#8f2f57] via-[#c9c5c9]/70 to-transparent'
  }),

  /** Posta Damgası: şakayık–mürekkep şerit, inci pul. */
  DugunPosta: kurdele({
    id: 'stone',
    base: 'bg-[#f7f5f8]',
    page: 'text-[#463f50]',
    surface: 'bg-[#fdfcfd]/85 backdrop-blur-sm',
    border: 'border-[#e2dce6]',
    heading: 'text-[#231d2b]',
    body: 'text-[#635b6d]',
    accent: 'text-[#8f2f57]',
    accentBg: 'bg-[#8f2f57]',
    accentSoft: 'bg-[#8f2f57]/12',
    input: 'border-[#cdc4d4] text-[#231d2b] placeholder:text-[#706879] focus:border-[#8f2f57]',
    buttonPrimary: 'bg-[#231d2b] hover:bg-[#3a3245] text-[#f7f5f8] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#dbd4e0] text-[#463f50] hover:bg-white hover:border-[#b9aec4]',
    divider: 'bg-[#e2dce6]',
    timelineLine: 'from-[#8f2f57] via-[#cdc4d4]/70 to-transparent'
  }),

  /** Brutal: süssüz, sert kontrast — mürekkep, canlı şakayık ve lila. Kendi geometrisini korur. */
  DugunBrutal: {
    id: 'stone',
    base: 'bg-[#f1eef3]',
    page: 'text-[#5c5566]',
    surface: 'bg-[#fdfcfe]',
    border: 'border-[#17131c]/20',
    heading: 'text-[#17131c]',
    body: 'text-[#5c5566]',
    accent: 'text-[#b8245a]',
    accentBg: 'bg-[#b8245a]',
    accentSoft: 'bg-[#b8245a]/12',
    input:
      'w-full bg-[#fdfcfe] border-2 border-[#17131c] rounded-none px-3.5 py-2.5 text-sm text-[#17131c] placeholder:text-[#5c5566] focus:outline-none focus:border-[#b8245a] focus:ring-0 transition-colors duration-200',
    buttonPrimary:
      'bg-[#b8245a] hover:brightness-110 text-[#fff5f8] border-2 border-[#17131c] rounded-none font-black uppercase tracking-wide shadow-[4px_4px_0_0_#17131c]',
    buttonGhost:
      'bg-[#fdfcfe] border-2 border-[#17131c] text-[#17131c] rounded-none font-black uppercase tracking-wide hover:bg-[#cfc3ee] hover:text-[#17131c]',
    divider: 'bg-[#17131c]/20',
    timelineLine: 'from-[#b8245a] via-[#b8245a]/40 to-transparent',
    envelope: { ...ZARF_TUL, paper: 'bg-[#fdfcfe]', flap: 'bg-[#e4dee9]', seal: 'bg-[#b8245a] text-[#fff5f8]', card: 'bg-[#fdfcfe] border-2 border-[#17131c]' },
    mapHeader: 'bg-[#e9e4ee]'
  },

  /** Terrazzo: şakayık, mersin, lila ve mürekkep çakıllar; inci harç. */
  DugunTerrazzo: kurdele({
    id: 'stone',
    base: 'bg-[#f5f3f6]',
    page: 'text-[#5a5364]',
    surface: 'bg-[#fdfcfd]/85 backdrop-blur-sm',
    border: 'border-[#e3dde7]',
    heading: 'text-[#241f2b]',
    body: 'text-[#615a6b]',
    accent: 'text-[#8f2f57]',
    accentBg: 'bg-[#8f2f57]',
    accentSoft: 'bg-[#8f2f57]/12',
    input: 'border-[#cec6d4] text-[#241f2b] placeholder:text-[#6e6779] focus:border-[#8f2f57]',
    buttonPrimary: 'bg-[#241f2b] hover:bg-[#3a3443] text-[#f5f3f6] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#ddd6e2] text-[#241f2b] hover:bg-[#8f2f57]/10 hover:border-[#8f2f57]/50',
    divider: 'bg-[#e3dde7]',
    timelineLine: 'from-[#8f2f57] via-[#8f2f57]/40 to-transparent'
  }),

  /** Teknik Çizim: mürekkep moru ozalit, inci-lila çizgi, şakayık revizyon. Kendi geometrisini korur. */
  DugunBlueprint: {
    id: 'midnight',
    base: 'bg-[#1e1832]',
    page: 'text-[#e3d9f2]/80',
    surface: 'bg-white/[0.04] backdrop-blur-sm',
    border: 'border-[#e3d9f2]/25',
    heading: 'text-[#e3d9f2]',
    body: 'text-[#e3d9f2]/70',
    accent: 'text-[#f4b3cd]',
    accentBg: 'bg-[#f4b3cd]',
    accentSoft: 'bg-[#f4b3cd]/12',
    input:
      'w-full bg-white/[0.04] border border-[#e3d9f2]/30 rounded-none px-3.5 py-2.5 text-sm text-[#e3d9f2] placeholder:text-[#e3d9f2]/65 focus:outline-none focus:border-[#f4b3cd] focus:ring-1 focus:ring-[#f4b3cd]/30 transition-colors duration-200',
    buttonPrimary:
      'bg-[#f4b3cd] hover:brightness-110 text-[#1e1832] rounded-none font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/25',
    buttonGhost:
      'border border-[#e3d9f2]/35 text-[#e3d9f2] rounded-none uppercase tracking-[0.12em] hover:bg-[#e3d9f2]/10 hover:border-[#e3d9f2]/60',
    divider: 'bg-[#e3d9f2]/20',
    timelineLine: 'from-[#f4b3cd] via-[#f4b3cd]/40 to-transparent',
    envelope: { paper: 'bg-gradient-to-b from-[#2a2245] to-[#1e1832]', flap: 'bg-[#2f2750]', seal: 'bg-[#f4b3cd] text-[#1e1832]', glow: 'bg-[#e3d9f2]/10', card: 'bg-[#1e1832] border border-[#e3d9f2]/25' },
    mapHeader: 'bg-[#251e3d]'
  },

  /** Herbaryum: inci föy, mersin örnek, şakayık kayıt mürekkebi. */
  DugunHerbaryum: kurdele({
    id: 'stone',
    base: 'bg-[#f5f4f6]',
    page: 'text-[#5a5466]',
    surface: 'bg-[#fdfcfd]/85 backdrop-blur-sm',
    border: 'border-[#41604f]/25',
    heading: 'text-[#26212d]',
    body: 'text-[#5f596a]',
    accent: 'text-[#8f2f57]',
    accentBg: 'bg-[#8f2f57]',
    accentSoft: 'bg-[#8f2f57]/10',
    input: 'border-[#41604f]/35 text-[#26212d] placeholder:text-[#6c6677] focus:border-[#8f2f57]',
    buttonPrimary: 'bg-[#26212d] hover:bg-[#3c3545] text-[#f5f4f6] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#41604f]/35 text-[#26212d] hover:bg-[#41604f]/10 hover:border-[#41604f]/60',
    divider: 'bg-[#41604f]/20',
    timelineLine: 'from-[#8f2f57] via-[#8f2f57]/40 to-transparent'
  }),

  /** Ufuk: servi bahçesinde akşam; vurgu inci pembesi, buton inci. */
  DugunUfuk: kurdele({
    id: 'midnight',
    base: 'bg-[#05070f]',
    page: 'text-[#ece8f4]',
    // Bölümler hareketli bir sahnenin önünden akar: kartlar koyu ve yoğun cam
    // taşır ki arkadaki ışık metnin kontrastını hiçbir an düşürmesin.
    surface: 'bg-[#0b0d1d]/75 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]',
    border: 'border-white/12',
    heading: 'text-white',
    body: 'text-[#bdb8cf]',
    accent: 'text-[#f3c3d2]',
    accentBg: 'bg-[#f3c3d2]',
    accentSoft: 'bg-[#f3c3d2]/12',
    input: 'border-white/25 text-white placeholder:text-white/50 focus:border-[#f3c3d2]',
    buttonPrimary: 'bg-[#f3e9f0] hover:bg-white text-[#1a1426] shadow-lg shadow-black/30',
    buttonGhost: 'border-white/20 text-white hover:bg-white/10 hover:border-white/35',
    divider: 'bg-white/12',
    timelineLine: 'from-[#f3c3d2] via-[#f3c3d2]/40 to-transparent'
  }),

  // ——— 2. turda eklenen tasarım dilleri ———

  /** Çini: inci sır üstünde mürekkep moru hat, şakayık çiçek ve mersin yaprak. */
  DugunCini: kurdele({
    id: 'stone',
    base: 'bg-[#f5f3f7]',
    page: 'text-[#433b52]',
    surface: 'bg-[#fdfcfe]/90 backdrop-blur-sm',
    border: 'border-[#2c2340]/20',
    heading: 'text-[#211b2d]',
    body: 'text-[#5d5569]',
    accent: 'text-[#8f2f57]',
    accentBg: 'bg-[#2c2340]',
    accentSoft: 'bg-[#8f2f57]/10',
    input: 'border-[#2c2340]/30 text-[#211b2d] placeholder:text-[#6e6679] focus:border-[#8f2f57]',
    buttonPrimary: 'bg-[#2c2340] hover:bg-[#3f3456] text-[#fdfcfe] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#2c2340]/35 text-[#211b2d] hover:bg-[#2c2340]/8 hover:border-[#2c2340]/60',
    divider: 'bg-[#2c2340]/15',
    timelineLine: 'from-[#8f2f57] via-[#2c2340]/40 to-transparent'
  }),

  /** Ebru: inci su üstünde pudra şakayık, lila ve mersin damlaları. */
  DugunEbru: kurdele({
    id: 'stone',
    base: 'bg-[#f3eff4]',
    page: 'text-[#4a4254]',
    surface: 'bg-[#fbf9fb]/90 backdrop-blur-sm',
    border: 'border-[#b4a9c0]/35',
    heading: 'text-[#211b2d]',
    body: 'text-[#5f5769]',
    accent: 'text-[#8f2f57]',
    accentBg: 'bg-[#211b2d]',
    accentSoft: 'bg-[#8f2f57]/10',
    input: 'border-[#b4a9c0]/60 text-[#211b2d] placeholder:text-[#6e6679] focus:border-[#8f2f57]',
    buttonPrimary: 'bg-[#211b2d] hover:bg-[#3a3149] text-[#fbf9fb] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#b4a9c0]/60 text-[#211b2d] hover:bg-[#b4a9c0]/15 hover:border-[#b4a9c0]',
    divider: 'bg-[#b4a9c0]/30',
    timelineLine: 'from-[#8f2f57] via-[#b4a9c0]/50 to-transparent'
  }),

  /** Monogram: altın varak yerine inci-gümüş varak, şakayık boyalı kenar. */
  DugunMonogram: kurdele({
    id: 'stone',
    base: 'bg-[#f4f2f6]',
    page: 'text-[#4a4254]',
    surface: 'bg-[#fdfcfe]/90 backdrop-blur-sm',
    border: 'border-[#b4a9c0]/35',
    heading: 'text-[#211b2d]',
    body: 'text-[#5f5769]',
    accent: 'text-[#8f2f57]',
    accentBg: 'bg-[#211b2d]',
    accentSoft: 'bg-[#8f2f57]/10',
    input: 'border-[#b4a9c0]/60 text-[#211b2d] placeholder:text-[#6e6679] focus:border-[#8f2f57]',
    buttonPrimary: 'bg-[#211b2d] hover:bg-[#3a3149] text-[#fdfcfe] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#b4a9c0]/60 text-[#211b2d] hover:bg-[#b4a9c0]/15 hover:border-[#b4a9c0]',
    divider: 'bg-[#b4a9c0]/30',
    timelineLine: 'from-[#8f2f57] via-[#b4a9c0]/50 to-transparent'
  }),

  /** Takvim: tül yaprak, inci spiral, şakayık mürekkeple çizilmiş gün. */
  DugunTakvim: kurdele({
    id: 'stone',
    base: 'bg-[#f2f0f4]',
    page: 'text-[#4a4254]',
    surface: 'bg-[#fdfcfe]/90 backdrop-blur-sm',
    border: 'border-[#b4a9c0]/35',
    heading: 'text-[#211b2d]',
    body: 'text-[#5f5769]',
    accent: 'text-[#8f2f57]',
    accentBg: 'bg-[#211b2d]',
    accentSoft: 'bg-[#8f2f57]/10',
    input: 'border-[#b4a9c0]/60 text-[#211b2d] placeholder:text-[#6e6679] focus:border-[#8f2f57]',
    buttonPrimary: 'bg-[#211b2d] hover:bg-[#3a3149] text-[#fdfcfe] shadow-lg shadow-black/10',
    buttonGhost: 'border-[#b4a9c0]/60 text-[#211b2d] hover:bg-[#b4a9c0]/15 hover:border-[#b4a9c0]',
    divider: 'bg-[#b4a9c0]/30',
    timelineLine: 'from-[#8f2f57] via-[#b4a9c0]/50 to-transparent'
  })
} satisfies Record<string, SectionTheme>;

export type DugunTemplateName = keyof typeof DUGUN_THEMES;
