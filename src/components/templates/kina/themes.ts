import { SectionTheme } from '../shared/palette';

/**
 * "Al & Kına" — kına kategorisinin 35 teması (renk kaynağı: `parts/palette.ts`).
 *
 * Aile: avuç (şeftali krem) ya da ıs (kahve-siyah) zemin, kına kahvesi
 * mürekkep, imza kına turuncusu, duvak alı, süs olarak sırma ve kuru kına
 * yaprağı zeytini. Sınıflar Tailwind taraması için değerleriyle açık yazılır.
 * Bölüm karakteri: 10 px köşeli "tepsi" düğmeleri ve dolgulu kutu alanlar.
 */

/* ————— Zarf ve harita başlığı ————— */

const ZARF_AVUC: SectionTheme['envelope'] = {
  paper: 'bg-gradient-to-b from-[#f6e3d2] to-[#ebcfb8]',
  flap: 'bg-[#e0bb9d]',
  seal: 'bg-[#b0241c] text-[#fbeee2]',
  glow: 'bg-[#f0a066]/30',
  card: 'bg-[#fdf6ef] border border-[#e4c4ab]'
};

const ZARF_IS: SectionTheme['envelope'] = {
  paper: 'bg-gradient-to-b from-[#3a1a10] to-[#22100a]',
  flap: 'bg-[#4a2416]',
  seal: 'bg-[#c4581d] text-[#fff4ea]',
  glow: 'bg-[#c4581d]/20',
  card: 'bg-[#1b0c07] border border-[#f2a066]/20'
};

const HARITA_AVUC = 'bg-[#f1dccb]';
const HARITA_IS = 'bg-[#2a130b]';

/* ————— Kategori hero'lu şablonlar ————— */

/** Sade — avuç kâğıdı, kına damgası filigranı. */
export const KINA_SADE: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8ebdf]',
  page: 'text-[#52261a]',
  surface: 'bg-[#fdf6ef]/90 backdrop-blur-sm',
  border: 'border-[#e4c4ab]',
  heading: 'text-[#33140c]',
  body: 'text-[#7a4532]',
  accent: 'text-[#a4451a]',
  accentBg: 'bg-[#b0241c]',
  accentSoft: 'bg-[#c4581d]/12',
  input:
    'w-full bg-[#fffaf5] border border-[#e4c4ab] rounded-[10px] px-3.5 py-2.5 text-sm text-[#33140c] placeholder:text-[#8a5a46] focus:outline-none focus:border-[#c4581d] focus:ring-2 focus:ring-[#c4581d]/20 transition duration-300',
  buttonPrimary: 'bg-[#b0241c] hover:bg-[#981d16] text-[#fdf3ea] rounded-[10px] shadow-lg shadow-[#b0241c]/20',
  buttonGhost: 'border border-[#d9b296] text-[#52261a] rounded-[10px] hover:bg-[#c4581d]/10 hover:border-[#c4581d]/60',
  divider: 'bg-[#e4c4ab]',
  timelineLine: 'from-[#c4581d] via-[#b0241c]/45 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/** Manzara — "Yüksek Tepeler": kayısı akşamı, kına yaprağı zeytini. */
export const KINA_MANZARA: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7e5d3]',
  page: 'text-[#4e2418]',
  surface: 'bg-[#fdf5ec]/90 backdrop-blur-sm',
  border: 'border-[#e2c1a5]',
  heading: 'text-[#2e120a]',
  body: 'text-[#76412e]',
  accent: 'text-[#5a5e22]',
  accentBg: 'bg-[#5a5e22]',
  accentSoft: 'bg-[#666a2c]/12',
  input:
    'w-full bg-[#fffaf4] border border-[#e2c1a5] rounded-[10px] px-3.5 py-2.5 text-sm text-[#2e120a] placeholder:text-[#865642] focus:outline-none focus:border-[#666a2c] focus:ring-2 focus:ring-[#666a2c]/20 transition duration-300',
  buttonPrimary: 'bg-[#2e120a] hover:bg-[#4a2215] text-[#f7e5d3] rounded-[10px] shadow-lg shadow-[#2e120a]/20',
  buttonGhost: 'border border-[#d4ae8e] text-[#4e2418] rounded-[10px] hover:bg-[#666a2c]/10 hover:border-[#666a2c]/60',
  divider: 'bg-[#e2c1a5]',
  timelineLine: 'from-[#666a2c] via-[#c4581d]/45 to-transparent',
  envelope: {
    ...ZARF_AVUC,
    seal: 'bg-[#2e120a] text-[#f7e5d3]'
  },
  mapHeader: 'bg-[#efd8c2]'
};

/** Şekilli — "Bindallı": vişne kadife, sırma işleme. */
export const KINA_SEKILLI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#3a0b17]',
  page: 'text-[#f4dccb]',
  surface: 'bg-[#1f050c]/45 backdrop-blur-sm',
  border: 'border-[#d8a24a]/28',
  heading: 'text-[#fbe9d6]',
  body: 'text-[#dcb4a2]',
  accent: 'text-[#ebbb62]',
  accentBg: 'bg-[#ebbb62]',
  accentSoft: 'bg-[#d8a24a]/12',
  input:
    'w-full bg-[#1f050c]/50 border border-[#d8a24a]/30 rounded-[10px] px-3.5 py-2.5 text-sm text-[#fbe9d6] placeholder:text-[#c89c8a] focus:outline-none focus:border-[#ebbb62]/70 focus:ring-2 focus:ring-[#ebbb62]/15 transition duration-300',
  buttonPrimary: 'bg-[#ebbb62] hover:bg-[#f3ca7c] text-[#2a0810] rounded-[10px] shadow-lg shadow-black/30',
  buttonGhost: 'border border-[#d8a24a]/40 text-[#f4dccb] rounded-[10px] hover:bg-[#d8a24a]/10 hover:border-[#d8a24a]/70',
  divider: 'bg-[#d8a24a]/22',
  timelineLine: 'from-[#ebbb62] via-[#c4581d]/45 to-transparent',
  envelope: {
    paper: 'bg-gradient-to-b from-[#5a1426] to-[#360a15]',
    flap: 'bg-[#6a1a2e]',
    seal: 'bg-[#d8a24a] text-[#3a0b17]',
    glow: 'bg-[#d8a24a]/15',
    card: 'bg-[#2a0710] border border-[#d8a24a]/30'
  },
  mapHeader: 'bg-[#2a0710]'
};

/** Modern — kına turuncusu afiş: dev leke, kahve mürekkep. */
export const KINA_MODERN: SectionTheme = {
  id: 'stone',
  base: 'bg-[#ec8f57]',
  page: 'text-[#3a1209]',
  surface: 'bg-[#fff3e8]/92 backdrop-blur-sm',
  border: 'border-[#3a1209]/15',
  heading: 'text-[#260a04]',
  body: 'text-[#4f1d10]',
  accent: 'text-[#6a140e]',
  accentBg: 'bg-[#260a04]',
  accentSoft: 'bg-[#260a04]/10',
  input:
    'w-full bg-[#fffaf5] border border-[#3a1209]/20 rounded-[10px] px-3.5 py-2.5 text-sm text-[#260a04] placeholder:text-[#7a4a38] focus:outline-none focus:border-[#260a04] focus:ring-2 focus:ring-[#260a04]/15 transition duration-300',
  buttonPrimary: 'bg-[#260a04] hover:bg-[#40160b] text-[#fff1e4] rounded-[10px] shadow-lg shadow-[#260a04]/25',
  buttonGhost: 'border border-[#3a1209]/35 text-[#260a04] rounded-[10px] hover:bg-[#260a04]/10 hover:border-[#260a04]/60',
  divider: 'bg-[#3a1209]/15',
  timelineLine: 'from-[#260a04] via-[#6a140e]/45 to-transparent',
  envelope: {
    paper: 'bg-gradient-to-b from-[#f29a62] to-[#df7a3e]',
    flap: 'bg-[#d46c30]',
    seal: 'bg-[#260a04] text-[#fff1e4]',
    glow: 'bg-[#fff1e4]/30',
    card: 'bg-[#fff3e8] border border-[#3a1209]/15'
  },
  mapHeader: 'bg-[#f6c39f]'
};

/** Bordo — "Al Duvak": şarap ipeği videosu, kına ışığı vurgu. */
export const KINA_BORDO: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#1d0710]',
  page: 'text-[#f4e0d4]',
  surface: 'bg-[#12040a]/55 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#fdeee4]',
  body: 'text-[#d6b3a5]',
  accent: 'text-[#f4a76c]',
  accentBg: 'bg-[#f4a76c]',
  accentSoft: 'bg-[#f4a76c]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-[10px] px-3.5 py-2.5 text-sm text-[#fdeee4] placeholder:text-[#c29b8c] focus:outline-none focus:border-[#f4a76c]/60 focus:ring-2 focus:ring-[#f4a76c]/15 transition duration-300',
  buttonPrimary: 'bg-[#f4a76c] hover:bg-[#f7b986] text-[#2b0a12] rounded-[10px] shadow-lg shadow-black/30',
  buttonGhost: 'border border-white/16 text-[#f4e0d4] rounded-[10px] hover:bg-white/[0.07] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f4a76c] via-[#b0241c]/50 to-transparent',
  envelope: {
    paper: 'bg-gradient-to-b from-[#4a0f1f] to-[#2a0812]',
    flap: 'bg-[#5c1428]',
    seal: 'bg-[#c4581d] text-[#fff4ea]',
    glow: 'bg-[#b0241c]/25',
    card: 'bg-[#1d0710] border border-[#f4a76c]/20'
  },
  mapHeader: 'bg-[#2c0a16]'
};

/** Saray — al kemerler altında mum ışığı; metin kemer pencerede. */
export const KINA_SARAY: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#240a07]',
  page: 'text-[#f6e0d0]',
  surface: 'bg-[#1a0604]/70 backdrop-blur-md',
  border: 'border-[#f5b26b]/25',
  heading: 'text-[#fff0e2]',
  body: 'text-[#dcb3a0]',
  accent: 'text-[#f5b26b]',
  accentBg: 'bg-[#f5b26b]',
  accentSoft: 'bg-[#f5b26b]/12',
  input:
    'w-full bg-white/[0.05] border border-[#f5b26b]/25 rounded-[10px] px-3.5 py-2.5 text-sm text-[#fff0e2] placeholder:text-[#c79a86] focus:outline-none focus:border-[#f5b26b]/65 focus:ring-2 focus:ring-[#f5b26b]/15 transition duration-300',
  buttonPrimary: 'bg-[#c0362a] hover:bg-[#d04434] text-[#fff0e2] rounded-[10px] shadow-lg shadow-black/30',
  buttonGhost: 'border border-[#f5b26b]/30 text-[#f6e0d0] rounded-[10px] hover:bg-[#f5b26b]/10 hover:border-[#f5b26b]/55',
  divider: 'bg-[#f5b26b]/20',
  timelineLine: 'from-[#f5b26b] via-[#c0362a]/50 to-transparent',
  envelope: {
    paper: 'bg-gradient-to-b from-[#5a1a10] to-[#320c08]',
    flap: 'bg-[#6e2214]',
    seal: 'bg-[#c4581d] text-[#fff4ea]',
    glow: 'bg-[#c0362a]/25',
    card: 'bg-[#240a07] border border-[#f5b26b]/25'
  },
  mapHeader: 'bg-[#33100a]'
};

/** Mum — "Kına Tepsisi": ıs zemin, bakır tepside yanan mumlar. */
export const KINA_MUM: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#170a05]',
  page: 'text-[#f3dfcd]',
  surface: 'bg-[#2a140a]/60 backdrop-blur-md',
  border: 'border-[#ffc777]/18',
  heading: 'text-[#fff1df]',
  body: 'text-[#cfa991]',
  accent: 'text-[#ffc777]',
  accentBg: 'bg-[#ffc777]',
  accentSoft: 'bg-[#ffc777]/10',
  input:
    'w-full bg-white/[0.05] border border-[#ffc777]/20 rounded-[10px] px-3.5 py-2.5 text-sm text-[#fff1df] placeholder:text-[#b48d76] focus:outline-none focus:border-[#ffc777]/60 focus:ring-2 focus:ring-[#ffc777]/15 transition duration-300',
  buttonPrimary: 'bg-[#e57f3c] hover:bg-[#ee9152] text-[#1b0c07] rounded-[10px] shadow-lg shadow-[#e57f3c]/20',
  buttonGhost: 'border border-[#ffc777]/25 text-[#f3dfcd] rounded-[10px] hover:bg-[#ffc777]/10 hover:border-[#ffc777]/45',
  divider: 'bg-[#ffc777]/16',
  timelineLine: 'from-[#ffc777] via-[#e57f3c]/50 to-transparent',
  envelope: ZARF_IS,
  mapHeader: HARITA_IS
};

/** Aurora — kına, al ve sırma mesh'i; metin buzlu camda. */
export const KINA_AURORA: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#1a0907]',
  page: 'text-[#f6e2d6]',
  surface: 'bg-[#1a0907]/45 backdrop-blur-2xl backdrop-saturate-150',
  border: 'border-white/16',
  heading: 'text-[#fff4ec]',
  body: 'text-[#e3bfae]',
  accent: 'text-[#ffc08a]',
  accentBg: 'bg-[#ffc08a]',
  accentSoft: 'bg-[#ffc08a]/12',
  input:
    'w-full bg-white/[0.07] border border-white/16 rounded-[10px] px-3.5 py-2.5 text-sm text-[#fff4ec] placeholder:text-[#c79d8b] focus:outline-none focus:border-[#ffc08a]/60 focus:ring-2 focus:ring-[#ffc08a]/15 transition duration-300',
  buttonPrimary: 'bg-gradient-to-r from-[#ffc08a] to-[#f2805a] hover:brightness-110 text-[#1f0a06] rounded-[10px] shadow-lg shadow-[#f2805a]/25',
  buttonGhost: 'border border-white/18 text-[#f6e2d6] rounded-[10px] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ffc08a] via-[#f2805a]/50 to-transparent',
  envelope: ZARF_IS,
  mapHeader: HARITA_IS
};

/** Krom — "Bakır Tepsi": dövme bakır yansıması, sola yaslı afiş. */
export const KINA_KROM: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#140a07]',
  page: 'text-[#f1ded2]',
  surface: 'bg-white/[0.07] backdrop-blur-2xl backdrop-saturate-150',
  border: 'border-white/16',
  heading: 'text-transparent bg-clip-text bg-gradient-to-br from-[#ffeadb] via-[#f4b48c] to-[#de8a5e]',
  body: 'text-[#c9a593]',
  accent: 'text-[#f4b48c]',
  accentBg: 'bg-[#f4b48c]',
  accentSoft: 'bg-[#f4b48c]/12',
  input:
    'w-full bg-white/[0.07] border border-white/16 rounded-[10px] px-3.5 py-2.5 text-sm text-[#f8e8de] placeholder:text-[#bb9787] focus:outline-none focus:border-[#f4b48c]/60 focus:ring-2 focus:ring-[#f4b48c]/15 transition duration-300',
  buttonPrimary: 'bg-gradient-to-r from-[#ffe2cc] via-[#f4b48c] to-[#de8a5e] hover:brightness-110 text-[#1a0c07] rounded-[10px] shadow-lg shadow-[#de8a5e]/20',
  buttonGhost: 'border border-white/18 text-[#f1ded2] rounded-[10px] hover:bg-white/[0.08] hover:border-white/32',
  divider: 'bg-white/14',
  timelineLine: 'from-[#f4b48c] via-[#de8a5e]/50 to-transparent',
  envelope: {
    ...ZARF_IS,
    seal: 'bg-[#de8a5e] text-[#1a0c07]',
    glow: 'bg-[#de8a5e]/20'
  },
  mapHeader: HARITA_IS
};

/* ————— Ortak hero'lu şablonlar: açık aile ————— */

/** Bento — avuç kâğıdı, al vurgu. */
export const KINA_BENTO: SectionTheme = {
  id: 'stone',
  base: 'bg-[#faf0e6]',
  page: 'text-[#52261a]',
  surface: 'bg-[#fffaf5]/90 backdrop-blur-sm',
  border: 'border-[#ecd2bd]',
  heading: 'text-[#33140c]',
  body: 'text-[#7a4532]',
  accent: 'text-[#a8261c]',
  accentBg: 'bg-[#a8261c]',
  accentSoft: 'bg-[#b0241c]/10',
  input:
    'w-full bg-white border border-[#ecd2bd] rounded-[10px] px-3.5 py-2.5 text-sm text-[#33140c] placeholder:text-[#8a5a46] focus:outline-none focus:border-[#b0241c] focus:ring-2 focus:ring-[#b0241c]/18 transition duration-300',
  buttonPrimary: 'bg-[#b0241c] hover:bg-[#981d16] text-[#fdf3ea] rounded-[10px] shadow-lg shadow-[#b0241c]/15',
  buttonGhost: 'border border-[#e2c3aa] text-[#52261a] rounded-[10px] hover:bg-[#f4e2d3] hover:border-[#d0a585]',
  divider: 'bg-[#ecd2bd]',
  timelineLine: 'from-[#b0241c] via-[#c4581d]/45 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/** Kağıt — avuç kâğıdı, al mühür. */
export const KINA_KAGIT: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5e3d2]',
  page: 'text-[#52261a]',
  surface: 'bg-[#fdf6ef]/85 backdrop-blur-sm',
  border: 'border-[#e2c3aa]',
  heading: 'text-[#33140c]',
  body: 'text-[#76412e]',
  accent: 'text-[#a8261c]',
  accentBg: 'bg-[#a8261c]',
  accentSoft: 'bg-[#b0241c]/10',
  input:
    'w-full bg-[#fffaf5] border border-[#e2c3aa] rounded-[10px] px-3.5 py-2.5 text-sm text-[#33140c] placeholder:text-[#865642] focus:outline-none focus:border-[#b0241c] focus:ring-2 focus:ring-[#b0241c]/20 transition duration-300',
  buttonPrimary: 'bg-[#b0241c] hover:bg-[#981d16] text-[#fdf3ea] rounded-[10px] shadow-lg shadow-[#b0241c]/15',
  buttonGhost: 'border border-[#d9b296] text-[#52261a] rounded-[10px] hover:bg-[#efd9c6] hover:border-[#c99a78]',
  divider: 'bg-[#e2c3aa]',
  timelineLine: 'from-[#b0241c] via-[#d9a585]/60 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/** Riso — kına turuncusu ve yaprak zeytini iki mürekkep. */
export const KINA_RISO: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8eadb]',
  page: 'text-[#3e1c10]',
  surface: 'bg-[#fffaf3]/90',
  border: 'border-[#2a0f08]/15',
  heading: 'text-[#2a0f08]',
  body: 'text-[#6e3f2c]',
  accent: 'text-[#a8400f]',
  accentBg: 'bg-[#a8400f]',
  accentSoft: 'bg-[#666a2c]/22',
  input:
    'w-full bg-white border border-[#2a0f08]/18 rounded-[10px] px-3.5 py-2.5 text-sm text-[#2a0f08] placeholder:text-[#7a4a36] focus:outline-none focus:border-[#c4581d] focus:ring-2 focus:ring-[#c4581d]/18 transition duration-300',
  buttonPrimary: 'bg-[#2a0f08] hover:bg-[#45200f] text-[#f8eadb] rounded-[10px] shadow-none',
  buttonGhost: 'border-2 border-[#2a0f08] text-[#2a0f08] rounded-[10px] hover:bg-[#2a0f08] hover:text-[#f8eadb]',
  divider: 'bg-[#2a0f08]/15',
  timelineLine: 'from-[#c4581d] via-[#666a2c]/55 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/** Tek Çizgi — kına yaprağı zeytini hat. */
export const KINA_CIZGI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fbf2e8]',
  page: 'text-[#46281a]',
  surface: 'bg-white/85',
  border: 'border-[#e6d0bb]',
  heading: 'text-[#2c140c]',
  body: 'text-[#704634]',
  accent: 'text-[#565a1f]',
  accentBg: 'bg-[#565a1f]',
  accentSoft: 'bg-[#666a2c]/10',
  input:
    'w-full bg-white border border-[#e6d0bb] rounded-[10px] px-3.5 py-2.5 text-sm text-[#2c140c] placeholder:text-[#835a46] focus:outline-none focus:border-[#666a2c] focus:ring-2 focus:ring-[#666a2c]/18 transition duration-300',
  buttonPrimary: 'bg-[#2c140c] hover:bg-[#46261a] text-[#fbf2e8] rounded-[10px] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dcc2aa] text-[#46281a] rounded-[10px] hover:bg-[#f3e6d8] hover:border-[#bfa184]',
  divider: 'bg-[#e6d0bb]',
  timelineLine: 'from-[#666a2c] via-[#b9b56d]/60 to-transparent',
  envelope: { ...ZARF_AVUC, seal: 'bg-[#565a1f] text-[#fbf2e8]' },
  mapHeader: HARITA_AVUC
};

/** Suluboya — kına, al ve yaprak lekeleri. */
export const KINA_SULUBOYA: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fbf2e9]',
  page: 'text-[#4e2418]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#ead3bf]',
  heading: 'text-[#2e120a]',
  body: 'text-[#5e2f1f]',
  accent: 'text-[#a4451a]',
  accentBg: 'bg-[#a4451a]',
  accentSoft: 'bg-[#c4581d]/12',
  input:
    'w-full bg-white border border-[#ead3bf] rounded-[10px] px-3.5 py-2.5 text-sm text-[#2e120a] placeholder:text-[#865642] focus:outline-none focus:border-[#c4581d] focus:ring-2 focus:ring-[#c4581d]/18 transition duration-300',
  buttonPrimary: 'bg-[#2e120a] hover:bg-[#4a2215] text-[#fbf2e9] rounded-[10px] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e0c3a9] text-[#4e2418] rounded-[10px] hover:bg-[#f5e6d8] hover:border-[#c99f7f]',
  divider: 'bg-[#ead3bf]',
  timelineLine: 'from-[#c4581d] via-[#b0241c]/40 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/** Dokuma — al, kına ve yaprak iplikleri. */
export const KINA_DOKUMA: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7e8da]',
  page: 'text-[#4e2418]',
  surface: 'bg-[#fdf5ec]/90',
  border: 'border-[#e3c8b0]',
  heading: 'text-[#2e120a]',
  body: 'text-[#74402d]',
  accent: 'text-[#a8261c]',
  accentBg: 'bg-[#a8261c]',
  accentSoft: 'bg-[#b0241c]/10',
  input:
    'w-full bg-white border border-[#e3c8b0] rounded-[10px] px-3.5 py-2.5 text-sm text-[#2e120a] placeholder:text-[#835340] focus:outline-none focus:border-[#b0241c] focus:ring-2 focus:ring-[#b0241c]/18 transition duration-300',
  buttonPrimary: 'bg-[#2e120a] hover:bg-[#4a2215] text-[#f7e8da] rounded-[10px] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dbbea4] text-[#4e2418] rounded-[10px] hover:bg-[#f0dfce] hover:border-[#c49a78]',
  divider: 'bg-[#e3c8b0]',
  timelineLine: 'from-[#b0241c] via-[#666a2c]/45 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/** Mermer — gül-kayısı mermer, kına damarı. */
export const KINA_MERMER: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7ebe1]',
  page: 'text-[#4e2a1e]',
  surface: 'bg-[#fdf6ef]/85 backdrop-blur-sm',
  border: 'border-[#e7cfbd]',
  heading: 'text-[#2e140c]',
  body: 'text-[#76453a]',
  accent: 'text-[#9c4320]',
  accentBg: 'bg-[#9c4320]',
  accentSoft: 'bg-[#c4581d]/12',
  input:
    'w-full bg-white border border-[#e7cfbd] rounded-[10px] px-3.5 py-2.5 text-sm text-[#2e140c] placeholder:text-[#855849] focus:outline-none focus:border-[#c4581d] focus:ring-2 focus:ring-[#c4581d]/18 transition duration-300',
  buttonPrimary: 'bg-[#2e140c] hover:bg-[#4a2418] text-[#f7ebe1] rounded-[10px] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e0c4ae] text-[#4e2a1e] rounded-[10px] hover:bg-[#f2e1d4] hover:border-[#c4581d]/40',
  divider: 'bg-[#e7cfbd]',
  timelineLine: 'from-[#c4581d] via-[#c4581d]/40 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/** Gazete — "Kına Gazetesi": sıcak gazete kâğıdı, al manşet. */
export const KINA_GAZETE: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6ecdf]',
  page: 'text-[#3e2418]',
  surface: 'bg-[#fcf6ee]/85 backdrop-blur-sm',
  border: 'border-[#e3d0bd]',
  heading: 'text-[#21100a]',
  body: 'text-[#6e4636]',
  accent: 'text-[#a31f18]',
  accentBg: 'bg-[#a31f18]',
  accentSoft: 'bg-[#a31f18]/10',
  input:
    'w-full bg-white border border-[#e3d0bd] rounded-[10px] px-3.5 py-2.5 text-sm text-[#21100a] placeholder:text-[#7e5646] focus:outline-none focus:border-[#a31f18] focus:ring-2 focus:ring-[#a31f18]/18 transition duration-300',
  buttonPrimary: 'bg-[#21100a] hover:bg-[#3e2418] text-[#f6ecdf] rounded-[10px] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d9c2ad] text-[#3e2418] rounded-[10px] hover:bg-[#efe2d3] hover:border-[#a31f18]/40',
  divider: 'bg-[#e3d0bd]',
  timelineLine: 'from-[#a31f18] via-[#a31f18]/40 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/** Posta — al-kına şeritli zarf, sırma pul. */
export const KINA_POSTA: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f9eee3]',
  page: 'text-[#4e2418]',
  surface: 'bg-[#fffaf4]/85 backdrop-blur-sm',
  border: 'border-[#e7d0bb]',
  heading: 'text-[#2e120a]',
  body: 'text-[#74402d]',
  accent: 'text-[#a8261c]',
  accentBg: 'bg-[#a8261c]',
  accentSoft: 'bg-[#b0241c]/10',
  input:
    'w-full bg-white border border-[#e7d0bb] rounded-[10px] px-3.5 py-2.5 text-sm text-[#2e120a] placeholder:text-[#835340] focus:outline-none focus:border-[#b0241c] focus:ring-2 focus:ring-[#b0241c]/18 transition duration-300',
  buttonPrimary: 'bg-[#2e120a] hover:bg-[#4a2215] text-[#f9eee3] rounded-[10px] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e0c3a9] text-[#4e2418] rounded-[10px] hover:bg-[#f3e3d4] hover:border-[#b0241c]/40',
  divider: 'bg-[#e7d0bb]',
  timelineLine: 'from-[#b0241c] via-[#c4581d]/40 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/** Brutal — avuç zemin, kahve mürekkep, al ve kına blokları. */
export const KINA_BRUTAL: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8ebdf]',
  page: 'text-[#5a2e1e]',
  surface: 'bg-[#fffaf4]',
  border: 'border-[#2a0f08]/20',
  heading: 'text-[#2a0f08]',
  body: 'text-[#6a3a28]',
  accent: 'text-[#b0241c]',
  accentBg: 'bg-[#b0241c]',
  accentSoft: 'bg-[#b0241c]/12',
  input:
    'w-full bg-[#fffaf4] border-2 border-[#2a0f08] rounded-none px-3.5 py-2.5 text-sm text-[#2a0f08] placeholder:text-[#6a3a28] focus:outline-none focus:border-[#b0241c] focus:ring-0 transition-colors duration-200',
  buttonPrimary: 'bg-[#b0241c] hover:brightness-110 text-[#fff1e6] border-2 border-[#2a0f08] rounded-none font-black uppercase tracking-wide shadow-[4px_4px_0_0_#2a0f08]',
  buttonGhost: 'bg-[#fffaf4] border-2 border-[#2a0f08] text-[#2a0f08] rounded-none font-black uppercase tracking-wide hover:bg-[#e8894a] hover:text-[#2a0f08]',
  divider: 'bg-[#2a0f08]/20',
  timelineLine: 'from-[#b0241c] via-[#b0241c]/40 to-transparent',
  envelope: { ...ZARF_AVUC, card: 'bg-[#fffaf4] border-2 border-[#2a0f08]' },
  mapHeader: 'bg-[#e8894a]'
};

/** Terrazzo — al, kına, sırma ve yaprak çakılları. */
export const KINA_TERRAZZO: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8ebdf]',
  page: 'text-[#52261a]',
  surface: 'bg-[#fffaf5]/85 backdrop-blur-sm',
  border: 'border-[#e8cdb6]',
  heading: 'text-[#33140c]',
  body: 'text-[#76412e]',
  accent: 'text-[#a8261c]',
  accentBg: 'bg-[#a8261c]',
  accentSoft: 'bg-[#b0241c]/12',
  input:
    'w-full bg-[#fffaf5] border border-[#e8cdb6] rounded-2xl px-4 py-2.5 text-sm text-[#33140c] placeholder:text-[#865642] focus:outline-none focus:border-[#b0241c] focus:ring-2 focus:ring-[#b0241c]/20 transition duration-300',
  buttonPrimary: 'bg-[#33140c] hover:bg-[#52261a] text-[#f8ebdf] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e8cdb6] text-[#33140c] hover:bg-[#b0241c]/10 hover:border-[#b0241c]/50 rounded-full',
  divider: 'bg-[#e8cdb6]',
  timelineLine: 'from-[#b0241c] via-[#c4581d]/40 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/** Herbaryum — "Lawsonia": kuru kına yaprağı numunesi. */
export const KINA_HERBARYUM: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8ecdf]',
  page: 'text-[#4a2a1c]',
  surface: 'bg-[#fffaf3]/85 backdrop-blur-sm',
  border: 'border-[#666a2c]/25',
  heading: 'text-[#2c160c]',
  body: 'text-[#6e4434]',
  accent: 'text-[#565a1f]',
  accentBg: 'bg-[#565a1f]',
  accentSoft: 'bg-[#666a2c]/10',
  input:
    'w-full bg-[#fffaf3] border border-[#666a2c]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#2c160c] placeholder:text-[#7e5646] focus:outline-none focus:border-[#666a2c] focus:ring-2 focus:ring-[#666a2c]/15 transition duration-300',
  buttonPrimary: 'bg-[#2c160c] hover:bg-[#4a2a1c] text-[#f8ecdf] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#666a2c]/40 text-[#2c160c] hover:bg-[#666a2c]/10 hover:border-[#666a2c]/70 rounded-sm',
  divider: 'bg-[#666a2c]/20',
  timelineLine: 'from-[#666a2c] via-[#c4581d]/40 to-transparent',
  envelope: { ...ZARF_AVUC, seal: 'bg-[#565a1f] text-[#f8ecdf]' },
  mapHeader: HARITA_AVUC
};

/** Çini — kına kahvesi kontur, kına-al-yaprak sırları. */
export const KINA_CINI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8ebdf]',
  page: 'text-[#52261a]',
  surface: 'bg-[#fdf6ef]/90 backdrop-blur-sm',
  border: 'border-[#7a2a12]/25',
  heading: 'text-[#3a140a]',
  body: 'text-[#76412e]',
  accent: 'text-[#a8261c]',
  accentBg: 'bg-[#7a2a12]',
  accentSoft: 'bg-[#b0241c]/10',
  input:
    'w-full bg-[#fdf6ef] border border-[#7a2a12]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#3a140a] placeholder:text-[#865642] focus:outline-none focus:border-[#b0241c] focus:ring-2 focus:ring-[#b0241c]/15 transition duration-300',
  buttonPrimary: 'bg-[#7a2a12] hover:bg-[#93351a] text-[#fdf6ef] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#7a2a12]/40 text-[#3a140a] hover:bg-[#7a2a12]/10 hover:border-[#7a2a12]/70 rounded-sm',
  divider: 'bg-[#7a2a12]/20',
  timelineLine: 'from-[#b0241c] via-[#7a2a12]/40 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/** Ebru — kına ve al boyaları, sırma kenar. */
export const KINA_EBRU: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6e6d6]',
  page: 'text-[#4e2418]',
  surface: 'bg-[#fdf5ec]/90 backdrop-blur-sm',
  border: 'border-[#b8843a]/30',
  heading: 'text-[#36120a]',
  body: 'text-[#74402d]',
  accent: 'text-[#9c2a18]',
  accentBg: 'bg-[#8c2414]',
  accentSoft: 'bg-[#9c2a18]/10',
  input:
    'w-full bg-[#fdf5ec] border border-[#b8843a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#36120a] placeholder:text-[#835340] focus:outline-none focus:border-[#9c2a18] focus:ring-2 focus:ring-[#9c2a18]/15 transition duration-300',
  buttonPrimary: 'bg-[#8c2414] hover:bg-[#a52e1b] text-[#fdf5ec] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#b8843a]/45 text-[#36120a] hover:bg-[#b8843a]/10 hover:border-[#b8843a]/70 rounded-sm',
  divider: 'bg-[#b8843a]/22',
  timelineLine: 'from-[#9c2a18] via-[#b8843a]/40 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/** Takvim — avuç kâğıdı, al işaret, bakır halka. */
export const KINA_TAKVIM: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5e4d4]',
  page: 'text-[#52261a]',
  surface: 'bg-[#fdf5ec]/90 backdrop-blur-sm',
  border: 'border-[#a87a5c]/25',
  heading: 'text-[#33140c]',
  body: 'text-[#74402d]',
  accent: 'text-[#a8261c]',
  accentBg: 'bg-[#8c1d16]',
  accentSoft: 'bg-[#b0241c]/10',
  input:
    'w-full bg-[#fdf5ec] border border-[#a87a5c]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#33140c] placeholder:text-[#835340] focus:outline-none focus:border-[#b0241c] focus:ring-2 focus:ring-[#b0241c]/15 transition duration-300',
  buttonPrimary: 'bg-[#8c1d16] hover:bg-[#a5261d] text-[#fdf5ec] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#a87a5c]/40 text-[#33140c] hover:bg-[#a87a5c]/10 hover:border-[#a87a5c]/70 rounded-sm',
  divider: 'bg-[#a87a5c]/20',
  timelineLine: 'from-[#b0241c] via-[#a87a5c]/40 to-transparent',
  envelope: ZARF_AVUC,
  mapHeader: HARITA_AVUC
};

/* ————— Ortak hero'lu şablonlar: koyu aile ————— */

/** Noir — sıcak siyah, al çizgi. */
export const KINA_NOIR: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0c0604]',
  page: 'text-[#e6d6cc]',
  surface: 'bg-white/[0.035] backdrop-blur-md',
  border: 'border-[#e2533f]/20',
  heading: 'text-[#fbf0e8]',
  body: 'text-[#ab9184]',
  accent: 'text-[#ee6d55]',
  accentBg: 'bg-[#ee6d55]',
  accentSoft: 'bg-[#ee6d55]/10',
  input:
    'w-full bg-white/[0.035] border border-[#e2533f]/22 rounded-none px-3.5 py-2.5 text-sm text-[#f3e6de] placeholder:text-[#9a8074] focus:outline-none focus:border-[#ee6d55]/60 focus:ring-0 transition duration-300',
  buttonPrimary: 'rounded-none bg-[#b0241c] hover:bg-[#c4301f] text-[#fdf0e6] shadow-none',
  buttonGhost: 'rounded-none border border-[#e2533f]/28 text-[#e6d6cc] hover:bg-[#e2533f]/10 hover:border-[#e2533f]/50',
  divider: 'bg-[#e2533f]/20',
  timelineLine: 'from-[#ee6d55] via-[#ee6d55]/30 to-transparent',
  envelope: { ...ZARF_IS, paper: 'bg-gradient-to-b from-[#1e0e09] to-[#0c0604]', flap: 'bg-[#2a140c]', seal: 'bg-[#b0241c] text-[#fdf0e6]' },
  mapHeader: 'bg-[#160a06]'
};

/** Deco — kına kahvesi zemin, bakır yelpaze. */
export const KINA_DECO: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#1c0d08]',
  page: 'text-[#f0ddd0]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-[#e09a68]/24',
  heading: 'text-[#fdeee2]',
  body: 'text-[#c39f8c]',
  accent: 'text-[#eaa676]',
  accentBg: 'bg-[#eaa676]',
  accentSoft: 'bg-[#eaa676]/10',
  input:
    'w-full bg-white/[0.05] border border-[#e09a68]/24 rounded-[10px] px-3.5 py-2.5 text-sm text-[#fdeee2] placeholder:text-[#b8927f] focus:outline-none focus:border-[#eaa676] focus:ring-2 focus:ring-[#eaa676]/20 transition duration-300',
  buttonPrimary: 'bg-gradient-to-r from-[#d98652] to-[#f2c3a0] hover:brightness-110 text-[#1c0d08] rounded-[10px] shadow-lg shadow-[#d98652]/20',
  buttonGhost: 'border border-[#e09a68]/28 text-[#f0ddd0] rounded-[10px] hover:bg-[#e09a68]/10 hover:border-[#e09a68]/50',
  divider: 'bg-[#e09a68]/22',
  timelineLine: 'from-[#eaa676] via-[#b0241c]/45 to-transparent',
  envelope: { ...ZARF_IS, seal: 'bg-[#d98652] text-[#1c0d08]', glow: 'bg-[#d98652]/15' },
  mapHeader: HARITA_IS
};

/** Vitray — al, kına ve sırma camlar; mum sıcaklığında ışık. */
export const KINA_VITRAY: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#140906]',
  page: 'text-[#f0dcd0]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#fdf0e6]',
  body: 'text-[#c29e8c]',
  accent: 'text-[#f2a066]',
  accentBg: 'bg-[#f2a066]',
  accentSoft: 'bg-[#f2a066]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-[10px] px-3.5 py-2.5 text-sm text-[#fdf0e6] placeholder:text-[#b8988a] focus:outline-none focus:border-[#f2a066]/60 focus:ring-2 focus:ring-[#f2a066]/15 transition duration-300',
  buttonPrimary: 'bg-gradient-to-r from-[#f2a066] to-[#e8c27a] hover:brightness-110 text-[#1b0c07] rounded-[10px] shadow-lg shadow-[#f2a066]/20',
  buttonGhost: 'border border-white/16 text-[#f0dcd0] rounded-[10px] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f2a066] via-[#b0241c]/45 to-transparent',
  envelope: ZARF_IS,
  mapHeader: HARITA_IS
};

/** Kinetik — al zemin üstünde akan krem yazı. */
export const KINA_KINETIK: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#8c1a14]',
  page: 'text-[#fde9dc]',
  surface: 'bg-[#5c0e0a]/45 backdrop-blur-md',
  border: 'border-[#ffd2b0]/22',
  heading: 'text-[#fff4ea]',
  body: 'text-[#f6c8b4]',
  accent: 'text-[#ffc58f]',
  accentBg: 'bg-[#ffc58f]',
  accentSoft: 'bg-[#ffc58f]/14',
  input:
    'w-full bg-[#5c0e0a]/45 border border-[#ffd2b0]/25 rounded-[10px] px-3.5 py-2.5 text-sm text-[#fff4ea] placeholder:text-[#f0b9a2] focus:outline-none focus:border-[#ffc58f]/70 focus:ring-2 focus:ring-[#ffc58f]/20 transition duration-300',
  buttonPrimary: 'bg-[#ffc58f] hover:bg-[#ffd3a8] text-[#3a0a06] rounded-[10px] shadow-lg shadow-black/25',
  buttonGhost: 'border border-[#ffd2b0]/35 text-[#fde9dc] rounded-[10px] hover:bg-white/[0.08] hover:border-[#ffd2b0]/60',
  divider: 'bg-[#ffd2b0]/20',
  timelineLine: 'from-[#ffc58f] via-[#ffc58f]/40 to-transparent',
  envelope: {
    paper: 'bg-gradient-to-b from-[#a32019] to-[#7a1510]',
    flap: 'bg-[#b52a20]',
    seal: 'bg-[#ffc58f] text-[#3a0a06]',
    glow: 'bg-[#ffc58f]/15',
    card: 'bg-[#8c1a14] border border-[#ffd2b0]/25'
  },
  mapHeader: 'bg-[#6e130e]'
};

/** Plak — ıs zemin, al etiket. */
export const KINA_PLAK: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#1b0c07]',
  page: 'text-[#f0dccd]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#fdeee2]',
  body: 'text-[#c29c88]',
  accent: 'text-[#f2a066]',
  accentBg: 'bg-[#f2a066]',
  accentSoft: 'bg-[#f2a066]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-[10px] px-3.5 py-2.5 text-sm text-[#fdeee2] placeholder:text-[#b8988a] focus:outline-none focus:border-[#f2a066]/60 focus:ring-2 focus:ring-[#f2a066]/15 transition duration-300',
  buttonPrimary: 'bg-[#f2a066] hover:bg-[#f6b383] text-[#1b0c07] rounded-[10px] shadow-lg shadow-[#f2a066]/20',
  buttonGhost: 'border border-white/16 text-[#f0dccd] rounded-[10px] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f2a066] via-[#b0241c]/45 to-transparent',
  envelope: ZARF_IS,
  mapHeader: HARITA_IS
};

/** Pano — kahve kanatlar, krem harfler. */
export const KINA_PANO: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#160a05]',
  page: 'text-[#f0dccd]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#fdeee2]',
  body: 'text-[#c29c88]',
  accent: 'text-[#f2a066]',
  accentBg: 'bg-[#f2a066]',
  accentSoft: 'bg-[#f2a066]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-[10px] px-3.5 py-2.5 text-sm text-[#fdeee2] placeholder:text-[#b8988a] focus:outline-none focus:border-[#f2a066]/60 focus:ring-2 focus:ring-[#f2a066]/15 transition duration-300',
  buttonPrimary: 'bg-[#f2a066] hover:bg-[#f6b383] text-[#160a05] rounded-[10px] shadow-lg shadow-[#f2a066]/20',
  buttonGhost: 'border border-white/16 text-[#f0dccd] rounded-[10px] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f2a066] via-[#7a2a12]/50 to-transparent',
  envelope: ZARF_IS,
  mapHeader: HARITA_IS
};

/** Yıldız Haritası — kına gecesinin gökyüzü: kahve-erik, krem yıldız. */
export const KINA_YILDIZ: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#150a0b]',
  page: 'text-[#f0dcd2]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#fdeee6]',
  body: 'text-[#c29e92]',
  accent: 'text-[#f2a87a]',
  accentBg: 'bg-[#f2a87a]',
  accentSoft: 'bg-[#f2a87a]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-[10px] px-3.5 py-2.5 text-sm text-[#fdeee6] placeholder:text-[#b8988e] focus:outline-none focus:border-[#f2a87a]/60 focus:ring-2 focus:ring-[#f2a87a]/15 transition duration-300',
  buttonPrimary: 'bg-[#f2a87a] hover:bg-[#f6ba94] text-[#150a0b] rounded-[10px] shadow-lg shadow-[#f2a87a]/20',
  buttonGhost: 'border border-white/16 text-[#f0dcd2] rounded-[10px] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f2a87a] via-[#b0241c]/45 to-transparent',
  envelope: ZARF_IS,
  mapHeader: HARITA_IS
};

/** Film — kahve şerit, kına ışığı. */
export const KINA_FILM: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#120805]',
  page: 'text-[#f0dccd]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#fdeee2]',
  body: 'text-[#c29c88]',
  accent: 'text-[#f2a066]',
  accentBg: 'bg-[#f2a066]',
  accentSoft: 'bg-[#f2a066]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-[10px] px-3.5 py-2.5 text-sm text-[#fdeee2] placeholder:text-[#b8988a] focus:outline-none focus:border-[#f2a066]/60 focus:ring-2 focus:ring-[#f2a066]/15 transition duration-300',
  buttonPrimary: 'bg-[#f2a066] hover:brightness-110 text-[#120805] rounded-[10px] shadow-lg shadow-[#f2a066]/20',
  buttonGhost: 'border border-white/16 text-[#f0dccd] rounded-[10px] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f2a066] via-[#f2a066]/40 to-transparent',
  envelope: ZARF_IS,
  mapHeader: HARITA_IS
};

/** Teknik Çizim — kına kahvesi pafta, krem çizgi. */
export const KINA_BLUEPRINT: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#3a170e]',
  page: 'text-[#fbe3cf]/80',
  surface: 'bg-white/[0.04] backdrop-blur-sm',
  border: 'border-[#fbe3cf]/25',
  heading: 'text-[#fbe3cf]',
  body: 'text-[#fbe3cf]/72',
  accent: 'text-[#ffb27a]',
  accentBg: 'bg-[#ffb27a]',
  accentSoft: 'bg-[#ffb27a]/12',
  input:
    'w-full bg-white/[0.04] border border-[#fbe3cf]/30 rounded-none px-3.5 py-2.5 text-sm text-[#fbe3cf] placeholder:text-[#fbe3cf]/60 focus:outline-none focus:border-[#ffb27a] focus:ring-1 focus:ring-[#ffb27a]/30 transition-colors duration-200',
  buttonPrimary: 'bg-[#ffb27a] hover:brightness-110 text-[#3a170e] rounded-none font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/25',
  buttonGhost: 'border border-[#fbe3cf]/35 text-[#fbe3cf] rounded-none uppercase tracking-[0.12em] hover:bg-[#fbe3cf]/10 hover:border-[#fbe3cf]/60',
  divider: 'bg-[#fbe3cf]/20',
  timelineLine: 'from-[#ffb27a] via-[#ffb27a]/40 to-transparent',
  envelope: {
    ...ZARF_IS,
    paper: 'bg-gradient-to-b from-[#4a2014] to-[#33140c]',
    card: 'bg-[#3a170e] border border-[#fbe3cf]/25'
  },
  mapHeader: 'bg-[#2e120a]'
};

/** Ufuk — kına akşamı: kahve gökten kına turuncusu ufka. */
export const KINA_UFUK: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b0503]',
  page: 'text-[#f6e8de]',
  // Bölümler hareketli bir sahnenin önünden akar: kartlar koyu ve yoğun cam
  // taşır ki arkadaki ışık metnin kontrastını hiçbir an düşürmesin.
  surface: 'bg-[#170b06]/75 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-white',
  body: 'text-[#d8bcae]',
  accent: 'text-[#ffbe76]',
  accentBg: 'bg-[#ffbe76]',
  accentSoft: 'bg-[#ffbe76]/12',
  input:
    'w-full bg-white/[0.06] border border-white/15 rounded-[10px] px-3.5 py-2.5 text-sm text-white placeholder:text-white/55 focus:outline-none focus:border-[#ffbe76]/70 focus:ring-2 focus:ring-[#ffbe76]/20 transition duration-300',
  buttonPrimary: 'bg-[#ffbe76] hover:brightness-110 text-[#2a0f08] rounded-[10px] shadow-lg shadow-black/30',
  buttonGhost: 'border border-white/20 text-white rounded-[10px] hover:bg-white/10 hover:border-white/35',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ffbe76] via-[#ffbe76]/40 to-transparent',
  envelope: ZARF_IS,
  mapHeader: HARITA_IS
};

/** Monogram — kına kahvesi kart, bakır varak. */
export const KINA_MONOGRAM: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#2a0e08]',
  page: 'text-[#e8c9b8]',
  surface: 'bg-[#40160c]/90 backdrop-blur-sm',
  border: 'border-[#e0955a]/25',
  heading: 'text-[#fbe8d8]',
  body: 'text-[#dcb4a0]',
  accent: 'text-[#eea56c]',
  accentBg: 'bg-[#eea56c]',
  accentSoft: 'bg-[#eea56c]/10',
  input:
    'w-full bg-[#40160c] border border-[#e0955a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#fbe8d8] placeholder:text-[#c79c86] focus:outline-none focus:border-[#eea56c] focus:ring-2 focus:ring-[#eea56c]/15 transition duration-300',
  buttonPrimary: 'bg-[#eea56c] hover:brightness-110 text-[#2a0e08] rounded-sm shadow-lg shadow-black/30',
  buttonGhost: 'border border-[#e0955a]/40 text-[#fbe8d8] hover:bg-[#e0955a]/10 hover:border-[#e0955a]/70 rounded-sm',
  divider: 'bg-[#e0955a]/20',
  timelineLine: 'from-[#eea56c] via-[#e0955a]/40 to-transparent',
  envelope: {
    ...ZARF_IS,
    paper: 'bg-gradient-to-b from-[#5a2012] to-[#3a140a]',
    seal: 'bg-[#e0955a] text-[#2a0e08]',
    glow: 'bg-[#e0955a]/15',
    card: 'bg-[#2a0e08] border border-[#e0955a]/25'
  },
  mapHeader: 'bg-[#40160c]'
};
