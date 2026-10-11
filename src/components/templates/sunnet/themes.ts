import { SectionTheme } from '../shared/palette';

/**
 * "Şehzade Şenliği" — sünnet kategorisinin renk ailesi.
 *
 * Kaynağı sünnet kıyafetidir: saten mavi pelerin (sax), kırmızı "Maşallah"
 * kuşağı (nar), üstündeki sırma ve pullar (pirinç), yakadaki nazar boncuğu
 * (lacivert + turkuaz). Koyu zemin + şampanya altın varsayılanından bilerek
 * ayrılır: pirinç yalnızca süs ve koyu zeminde vurgu, açık zeminde asla metin.
 *
 * Bu nesne hero parametreleri (SVG, parçacık, kuşak) içindir. Tema sınıfları
 * Tailwind'in tarayabilmesi için aşağıda değerleriyle açık yazılır.
 */
export const SEHZADE = {
  /** Pelerin satenı — ana mavi. */
  sax: '#2348c6',
  /** Nazar laciverti — mürekkep, başlıklar. */
  lacivert: '#101a4a',
  /** Maşallah kuşağı — dolgu ve süs kırmızısı. */
  nar: '#c3263c',
  /** Açık zeminde metin olarak kullanılan nar (AA). */
  narMetin: '#b8233a',
  /** Sırma ve pul — açık zeminde yalnızca süs. */
  pirinc: '#e9b23a',
  /** Koyu zeminde metin olarak kullanılan pirinç. */
  fener: '#f2c14e',
  /** Nazar halkası. */
  turkuaz: '#2aa7b8',
  /** Açık zeminde metin olarak kullanılan turkuaz (AA). */
  turkuazMetin: '#0d6f80',
  /** Gündüz zemini: soğuk şeker beyazı (fildişi değil). */
  seker: '#f5f7fd',
  /** Gece zemini: doygun kraliyet mavisi (slate lacivert değil). */
  gece: '#0e1650'
} as const;

/* ————— Gündüz şenliği: şeker beyazı zemin, saten gölge, hap düğmeler ————— */

/** Klasik — otağ: nar vurgu, sax düğme, sırma halkalı hap. */
export const SUNNET_KLASIK: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f7fd]',
  page: 'text-[#101a4a]',
  surface: 'bg-white/90 backdrop-blur-sm shadow-[0_14px_34px_-22px_rgba(35,72,198,0.45)]',
  border: 'border-[#d6ddf3]',
  heading: 'text-[#101a4a]',
  body: 'text-[#4b557a]',
  accent: 'text-[#b8233a]',
  accentBg: 'bg-[#b8233a]',
  accentSoft: 'bg-[#c3263c]/10',
  input:
    'w-full bg-white border border-[#d6ddf3] rounded-xl px-4 py-2.5 text-sm text-[#101a4a] placeholder:text-[#5f6890] focus:outline-none focus:border-[#2348c6] focus:ring-2 focus:ring-[#2348c6]/20 transition duration-300',
  buttonPrimary:
    'bg-[#2348c6] hover:bg-[#1c3aa6] text-white rounded-full ring-1 ring-inset ring-[#e9b23a]/60 shadow-lg shadow-[#2348c6]/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300',
  buttonGhost:
    'border border-[#2348c6]/30 text-[#101a4a] rounded-full hover:bg-[#2348c6]/[0.06] hover:border-[#2348c6]/55 transition-all duration-300',
  divider: 'bg-[#d6ddf3]',
  timelineLine: 'from-[#c3263c] via-[#2348c6]/45 to-transparent'
};

/** Modern — ferah turkuaz: nazar halkalarının sakin tonu. */
export const SUNNET_MODERN: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f3f8fb]',
  page: 'text-[#0c2340]',
  surface: 'bg-white/85 backdrop-blur-xl shadow-[0_14px_34px_-22px_rgba(13,111,128,0.45)]',
  border: 'border-[#d3e6ec]',
  heading: 'text-[#0c2340] tracking-tight',
  body: 'text-[#4a5b70]',
  accent: 'text-[#0d6f80]',
  accentBg: 'bg-[#0d6f80]',
  accentSoft: 'bg-[#2aa7b8]/12',
  input:
    'w-full bg-white border border-[#d3e6ec] rounded-xl px-4 py-2.5 text-sm text-[#0c2340] placeholder:text-[#5a6b80] focus:outline-none focus:border-[#0d6f80] focus:ring-2 focus:ring-[#2aa7b8]/20 transition duration-300',
  buttonPrimary:
    'bg-[#0d6f80] hover:bg-[#0a5d6c] text-white rounded-full shadow-lg shadow-[#0d6f80]/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300',
  buttonGhost:
    'border border-[#0d6f80]/30 text-[#0c2340] rounded-full hover:bg-[#2aa7b8]/10 hover:border-[#0d6f80]/55 transition-all duration-300',
  divider: 'bg-[#d3e6ec]',
  timelineLine: 'from-[#0d6f80] via-[#2348c6]/40 to-transparent'
};

export const SUNNET_BENTO: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f6fc]',
  page: 'text-[#101a4a]',
  surface: 'bg-white/90 backdrop-blur-sm',
  border: 'border-[#dbe1f2]',
  heading: 'text-[#101a4a]',
  body: 'text-[#4b557a]',
  accent: 'text-[#2348c6]',
  accentBg: 'bg-[#2348c6]',
  accentSoft: 'bg-[#2348c6]/10',
  input:
    'w-full bg-white border border-[#dbe1f2] rounded-xl px-4 py-2.5 text-sm text-[#101a4a] placeholder:text-[#5f6890] focus:outline-none focus:border-[#2348c6] focus:ring-2 focus:ring-[#2348c6]/18 transition duration-300',
  buttonPrimary: 'bg-[#101a4a] hover:bg-[#1c2a6b] text-[#f5f7fd] rounded-full shadow-lg shadow-[#101a4a]/15',
  buttonGhost: 'border border-[#c9d1ec] text-[#2b3563] rounded-full hover:bg-[#e8ecf9] hover:border-[#a3afd9]',
  divider: 'bg-[#dbe1f2]',
  timelineLine: 'from-[#2348c6] via-[#c3263c]/40 to-transparent'
};

/** Brutal — kendi sert dili korunur (köşesiz, kalın kenar); renkler aileye geçer. */
export const SUNNET_BRUTAL: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f7fd]',
  page: 'text-[#2b3563]',
  surface: 'bg-white',
  border: 'border-[#101a4a]/25',
  heading: 'text-[#101a4a]',
  body: 'text-[#4b557a]',
  accent: 'text-[#b8233a]',
  accentBg: 'bg-[#b8233a]',
  accentSoft: 'bg-[#e9b23a]/25',
  input:
    'w-full bg-white border-2 border-[#101a4a] rounded-none px-3.5 py-2.5 text-sm text-[#101a4a] placeholder:text-[#5f6890] focus:outline-none focus:border-[#c3263c] focus:ring-0 transition-colors duration-200',
  buttonPrimary:
    'bg-[#c3263c] hover:brightness-110 text-white border-2 border-[#101a4a] rounded-none font-black uppercase tracking-wide shadow-[4px_4px_0_0_#101a4a]',
  buttonGhost:
    'bg-white border-2 border-[#101a4a] text-[#101a4a] rounded-none font-black uppercase tracking-wide hover:bg-[#e9b23a] hover:text-[#101a4a]',
  divider: 'bg-[#101a4a]/20',
  timelineLine: 'from-[#c3263c] via-[#2348c6]/40 to-transparent'
};

export const SUNNET_CIZGI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f7fb]',
  page: 'text-[#101a4a]',
  surface: 'bg-white/90',
  border: 'border-[#dcdfee]',
  heading: 'text-[#101a4a]',
  body: 'text-[#4f5878]',
  accent: 'text-[#b8233a]',
  accentBg: 'bg-[#b8233a]',
  accentSoft: 'bg-[#c3263c]/10',
  input:
    'w-full bg-white border border-[#dcdfee] rounded-xl px-4 py-2.5 text-sm text-[#101a4a] placeholder:text-[#5f6890] focus:outline-none focus:border-[#b8233a] focus:ring-2 focus:ring-[#c3263c]/18 transition duration-300',
  buttonPrimary: 'bg-[#101a4a] hover:bg-[#1c2a6b] text-[#f6f7fb] rounded-full shadow-lg shadow-[#101a4a]/15',
  buttonGhost: 'border border-[#cfd4ea] text-[#2b3563] rounded-full hover:bg-[#eceef7] hover:border-[#a8b0d2]',
  divider: 'bg-[#dcdfee]',
  timelineLine: 'from-[#c3263c] via-[#e7b7bf]/60 to-transparent'
};

/** Dokuma — kilim iplikleri sax/nar/pirinç; zemin krem değil, soğuk beyaz. */
export const SUNNET_DOKUMA: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f3f4fa]',
  page: 'text-[#2b3563]',
  surface: 'bg-white/90',
  border: 'border-[#d9ddee]',
  heading: 'text-[#101a4a]',
  body: 'text-[#4f5878]',
  accent: 'text-[#2348c6]',
  accentBg: 'bg-[#2348c6]',
  accentSoft: 'bg-[#2348c6]/10',
  input:
    'w-full bg-white border border-[#d9ddee] rounded-xl px-4 py-2.5 text-sm text-[#101a4a] placeholder:text-[#5f6890] focus:outline-none focus:border-[#2348c6] focus:ring-2 focus:ring-[#2348c6]/18 transition duration-300',
  buttonPrimary: 'bg-[#101a4a] hover:bg-[#1c2a6b] text-[#f3f4fa] rounded-full shadow-lg shadow-[#101a4a]/15',
  buttonGhost: 'border border-[#cfd4ea] text-[#2b3563] rounded-full hover:bg-[#eaecf6] hover:border-[#a8b0d2]',
  divider: 'bg-[#d9ddee]',
  timelineLine: 'from-[#2348c6] via-[#c3263c]/45 to-transparent'
};

/** Gazete — kırmızı manşet mürekkebi. */
export const SUNNET_GAZETE: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f5f9]',
  page: 'text-[#2b3563]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#dcdfeb]',
  heading: 'text-[#101a4a]',
  body: 'text-[#50587a]',
  accent: 'text-[#b8233a]',
  accentBg: 'bg-[#b8233a]',
  accentSoft: 'bg-[#c3263c]/10',
  input:
    'w-full bg-white border border-[#dcdfeb] rounded-xl px-4 py-2.5 text-sm text-[#101a4a] placeholder:text-[#5f6890] focus:outline-none focus:border-[#b8233a] focus:ring-2 focus:ring-[#c3263c]/18 transition duration-300',
  buttonPrimary: 'bg-[#101a4a] hover:brightness-125 text-[#f4f5f9] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#cfd3e4] text-[#2b3563] rounded-full hover:bg-[#eceef5] hover:border-[#b8233a]/40',
  divider: 'bg-[#dcdfeb]',
  timelineLine: 'from-[#c3263c] via-[#c3263c]/40 to-transparent'
};

/** Herbaryum — nazar turkuazı mürekkep; kendi köşeli düğme dili korunur. */
export const SUNNET_HERBARYUM: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f2f7f8]',
  page: 'text-[#3f5260]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#0d6f80]/25',
  heading: 'text-[#0c2340]',
  body: 'text-[#46596a]',
  accent: 'text-[#0d6f80]',
  accentBg: 'bg-[#0d6f80]',
  accentSoft: 'bg-[#2aa7b8]/10',
  input:
    'w-full bg-white border border-[#0d6f80]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#0c2340] placeholder:text-[#58697a] focus:outline-none focus:border-[#0d6f80] focus:ring-2 focus:ring-[#2aa7b8]/20 transition duration-300',
  buttonPrimary: 'bg-[#0c2340] hover:brightness-125 text-[#f2f7f8] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#0d6f80]/35 text-[#0c2340] hover:bg-[#2aa7b8]/10 hover:border-[#0d6f80]/60 rounded-sm',
  divider: 'bg-[#0d6f80]/20',
  timelineLine: 'from-[#0d6f80] via-[#2aa7b8]/40 to-transparent'
};

export const SUNNET_KAGIT: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f1f4fb]',
  page: 'text-[#2b3563]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#d3dbf0]',
  heading: 'text-[#101a4a]',
  body: 'text-[#4b557a]',
  accent: 'text-[#2348c6]',
  accentBg: 'bg-[#2348c6]',
  accentSoft: 'bg-[#2348c6]/10',
  input:
    'w-full bg-white/90 border border-[#d3dbf0] rounded-xl px-4 py-2.5 text-sm text-[#101a4a] placeholder:text-[#5f6890] focus:outline-none focus:border-[#2348c6] focus:ring-2 focus:ring-[#2348c6]/20 transition duration-300',
  buttonPrimary: 'bg-[#101a4a] hover:bg-[#1c2a6b] text-[#f1f4fb] rounded-full shadow-lg shadow-[#101a4a]/15',
  buttonGhost: 'border border-[#c5cfea] text-[#2b3563] rounded-full hover:bg-[#e4e9f6] hover:border-[#9daad6]',
  divider: 'bg-[#d3dbf0]',
  timelineLine: 'from-[#2348c6] via-[#c3263c]/40 to-transparent'
};

export const SUNNET_MERMER: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f3f5fa]',
  page: 'text-[#2b3563]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#dbdfee]',
  heading: 'text-[#101a4a]',
  body: 'text-[#4f5878]',
  accent: 'text-[#2348c6]',
  accentBg: 'bg-[#2348c6]',
  accentSoft: 'bg-[#2348c6]/10',
  input:
    'w-full bg-white border border-[#dbdfee] rounded-xl px-4 py-2.5 text-sm text-[#101a4a] placeholder:text-[#5f6890] focus:outline-none focus:border-[#2348c6] focus:ring-2 focus:ring-[#2348c6]/18 transition duration-300',
  buttonPrimary: 'bg-[#101a4a] hover:brightness-125 text-[#f3f5fa] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#cfd4ea] text-[#2b3563] rounded-full hover:bg-[#eaedf6] hover:border-[#2348c6]/40',
  divider: 'bg-[#dbdfee]',
  timelineLine: 'from-[#2348c6] via-[#2348c6]/40 to-transparent'
};

/** Posta — uçak postası şeridi sax + nar; pul pirinç. */
export const SUNNET_POSTA: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f7fd]',
  page: 'text-[#2b3563]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#d6ddf3]',
  heading: 'text-[#101a4a]',
  body: 'text-[#4b557a]',
  accent: 'text-[#b8233a]',
  accentBg: 'bg-[#b8233a]',
  accentSoft: 'bg-[#c3263c]/10',
  input:
    'w-full bg-white border border-[#d6ddf3] rounded-xl px-4 py-2.5 text-sm text-[#101a4a] placeholder:text-[#5f6890] focus:outline-none focus:border-[#2348c6] focus:ring-2 focus:ring-[#2348c6]/18 transition duration-300',
  buttonPrimary: 'bg-[#2348c6] hover:bg-[#1c3aa6] text-white rounded-full shadow-lg shadow-[#2348c6]/20',
  buttonGhost: 'border border-[#c9d1ec] text-[#2b3563] rounded-full hover:bg-[#e8ecf9] hover:border-[#c3263c]/40',
  divider: 'bg-[#d6ddf3]',
  timelineLine: 'from-[#c3263c] via-[#2348c6]/40 to-transparent'
};

/** Riso — iki mürekkep: sax mavisi ve pirinç sarısı, krem baskı kağıdında. */
export const SUNNET_RISO: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f4ec]',
  page: 'text-[#22264a]',
  surface: 'bg-white/85',
  border: 'border-[#14183a]/15',
  heading: 'text-[#14183a]',
  body: 'text-[#4a4d66]',
  accent: 'text-[#2348c6]',
  accentBg: 'bg-[#2348c6]',
  accentSoft: 'bg-[#f2c14e]/45',
  input:
    'w-full bg-white/85 border border-[#14183a]/15 rounded-xl px-4 py-2.5 text-sm text-[#22264a] placeholder:text-[#5c5f78] focus:outline-none focus:border-[#2348c6] focus:ring-2 focus:ring-[#2348c6]/20 transition duration-300',
  buttonPrimary: 'bg-[#14183a] hover:bg-[#2a2f5c] text-[#f6f4ec] rounded-full shadow-none',
  buttonGhost: 'border-2 border-[#14183a] text-[#14183a] rounded-full hover:bg-[#14183a] hover:text-[#f6f4ec]',
  divider: 'bg-[#14183a]/15',
  timelineLine: 'from-[#2348c6] via-[#f2c14e]/60 to-transparent'
};

export const SUNNET_SULUBOYA: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f8fd]',
  page: 'text-[#2b3563]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#dbe1f2]',
  heading: 'text-[#101a4a]',
  body: 'text-[#4f5878]',
  accent: 'text-[#2348c6]',
  accentBg: 'bg-[#2348c6]',
  accentSoft: 'bg-[#2348c6]/10',
  input:
    'w-full bg-white border border-[#dbe1f2] rounded-xl px-4 py-2.5 text-sm text-[#101a4a] placeholder:text-[#5f6890] focus:outline-none focus:border-[#2348c6] focus:ring-2 focus:ring-[#2348c6]/18 transition duration-300',
  buttonPrimary: 'bg-[#101a4a] hover:bg-[#1c2a6b] text-[#f6f8fd] rounded-full shadow-lg shadow-[#101a4a]/15',
  buttonGhost: 'border border-[#c9d1ec] text-[#2b3563] rounded-full hover:bg-[#e9edf9] hover:border-[#a3afd9]',
  divider: 'bg-[#dbe1f2]',
  timelineLine: 'from-[#2348c6] via-[#ee8f9c]/60 to-transparent'
};

/** Terrazzo — kendi yuvarlak dili korunur; çakıllar sax/nar/pirinç. */
export const SUNNET_TERRAZZO: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f6fc]',
  page: 'text-[#2b3563]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#d9dff1]',
  heading: 'text-[#101a4a]',
  body: 'text-[#4f5878]',
  accent: 'text-[#b8233a]',
  accentBg: 'bg-[#b8233a]',
  accentSoft: 'bg-[#c3263c]/10',
  input:
    'w-full bg-white border border-[#d9dff1] rounded-2xl px-4 py-2.5 text-sm text-[#101a4a] placeholder:text-[#5f6890] focus:outline-none focus:border-[#2348c6] focus:ring-2 focus:ring-[#2348c6]/20 transition duration-300',
  buttonPrimary: 'bg-[#101a4a] hover:brightness-125 text-[#f4f6fc] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d9dff1] text-[#101a4a] hover:bg-[#2348c6]/10 hover:border-[#2348c6]/50 rounded-full',
  divider: 'bg-[#d9dff1]',
  timelineLine: 'from-[#c3263c] via-[#2348c6]/40 to-transparent'
};

/* ————— Gece şenliği: kraliyet mavisi zemin, fener pirinci, nar ve turkuaz ————— */

/** Blueprint — ozalit sax'a döner; kendi köşesiz dili korunur. */
export const SUNNET_BLUEPRINT: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#132a7a]',
  page: 'text-[#e6ecff]',
  surface: 'bg-white/[0.06] backdrop-blur-sm',
  border: 'border-[#e6ecff]/25',
  heading: 'text-[#f5f7ff]',
  body: 'text-[#c9d3f5]',
  accent: 'text-[#f2c14e]',
  accentBg: 'bg-[#f2c14e]',
  accentSoft: 'bg-[#f2c14e]/12',
  input:
    'w-full bg-white/[0.06] border border-[#e6ecff]/30 rounded-none px-3.5 py-2.5 text-sm text-[#f5f7ff] placeholder:text-[#b4c0ea] focus:outline-none focus:border-[#f2c14e] focus:ring-1 focus:ring-[#f2c14e]/30 transition-colors duration-200',
  buttonPrimary:
    'bg-[#f2c14e] hover:brightness-110 text-[#0e1d57] rounded-none font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/25',
  buttonGhost:
    'border border-[#e6ecff]/35 text-[#f5f7ff] rounded-none uppercase tracking-[0.12em] hover:bg-[#e6ecff]/10 hover:border-[#e6ecff]/60',
  divider: 'bg-[#e6ecff]/20',
  timelineLine: 'from-[#f2c14e] via-[#f2c14e]/40 to-transparent'
};

/** Yıldız — videolu şato gecesi; fener pirinci + nar kıvılcım. */
export const SUNNET_YILDIZ: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b1240]',
  page: 'text-[#e8ecff]',
  surface: 'bg-[#16206a]/55 backdrop-blur-md',
  border: 'border-[#8ea2ff]/20',
  heading: 'text-white',
  body: 'text-[#aab4dc]',
  accent: 'text-[#f2c14e]',
  accentBg: 'bg-[#f2c14e]',
  accentSoft: 'bg-[#f2c14e]/12',
  input:
    'w-full bg-white/[0.06] border border-[#8ea2ff]/25 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#9aa6d8] focus:outline-none focus:border-[#f2c14e]/70 focus:ring-2 focus:ring-[#f2c14e]/20 transition duration-300',
  buttonPrimary:
    'bg-[#f2c14e] hover:bg-[#f7cf6c] text-[#0e1650] rounded-full shadow-lg shadow-black/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300',
  buttonGhost:
    'border border-white/20 text-white rounded-full hover:bg-white/10 hover:border-white/35 transition-all duration-300',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f2c14e] via-[#ff7a8a]/45 to-transparent'
};

/** Maşallah — gece nar kırmızısı; kuşağın sırması tek vurgu. */
export const SUNNET_MASALLAH: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#1d0910]',
  page: 'text-[#f6e4dc]',
  surface: 'bg-[#4a1220]/45 backdrop-blur-md',
  border: 'border-[#f2c45a]/22',
  heading: 'text-[#fff3e2]',
  body: 'text-[#d6b4ab]',
  accent: 'text-[#f2c45a]',
  accentBg: 'bg-[#f2c45a]',
  accentSoft: 'bg-[#f2c45a]/10',
  input:
    'w-full bg-white/[0.06] border border-[#f2c45a]/22 rounded-xl px-4 py-2.5 text-sm text-[#fff3e2] placeholder:text-[#b9958c] focus:outline-none focus:border-[#f2c45a]/60 focus:ring-2 focus:ring-[#f2c45a]/15 transition duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#e9b23a] to-[#f6cf6a] hover:brightness-110 text-[#2a0c12] rounded-full shadow-lg shadow-black/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300',
  buttonGhost:
    'border border-[#f2c45a]/30 text-[#f6e4dc] rounded-full hover:bg-[#f2c45a]/10 hover:border-[#f2c45a]/50 transition-all duration-300',
  divider: 'bg-[#f2c45a]/18',
  timelineLine: 'from-[#f2c45a] via-[#c3263c]/55 to-transparent'
};

/** Lunapark — gece panayırı: menekşe gece, fener pirinci, nar ışıklar. */
export const SUNNET_LUNAPARK: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#120f3d]',
  page: 'text-[#ece8ff]',
  surface: 'bg-[#2a2273]/45 backdrop-blur-md',
  border: 'border-[#a99bff]/22',
  heading: 'text-white',
  body: 'text-[#bcb5e4]',
  accent: 'text-[#ffc456]',
  accentBg: 'bg-[#ffc456]',
  accentSoft: 'bg-[#ffc456]/12',
  input:
    'w-full bg-white/[0.07] border border-[#a99bff]/25 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#9f97cc] focus:outline-none focus:border-[#ffc456]/60 focus:ring-2 focus:ring-[#ffc456]/15 transition duration-300',
  buttonPrimary:
    'bg-[#ffc456] hover:bg-[#ffd27a] text-[#1a1240] rounded-full shadow-lg shadow-black/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300',
  buttonGhost:
    'border border-[#a99bff]/30 text-[#ece8ff] rounded-full hover:bg-[#a99bff]/12 hover:border-[#a99bff]/50 transition-all duration-300',
  divider: 'bg-[#a99bff]/20',
  timelineLine: 'from-[#ffc456] via-[#ff6b7d]/50 to-transparent'
};

export const SUNNET_AURORA: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a1242]',
  page: 'text-[#e3e9ff]',
  surface: 'bg-white/[0.07] backdrop-blur-xl',
  border: 'border-white/14',
  heading: 'text-white',
  body: 'text-[#a9b4dc]',
  accent: 'text-[#6fd6e2]',
  accentBg: 'bg-[#6fd6e2]',
  accentSoft: 'bg-[#6fd6e2]/12',
  input:
    'w-full bg-white/[0.06] border border-white/14 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#9aa6d8] focus:outline-none focus:border-[#6fd6e2]/60 focus:ring-2 focus:ring-[#6fd6e2]/15 transition duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#6fd6e2] to-[#a5b4ff] hover:brightness-110 text-[#0a1242] rounded-full shadow-lg shadow-[#6fd6e2]/20',
  buttonGhost: 'border border-white/18 text-[#e3e9ff] rounded-full hover:bg-white/[0.08] hover:border-white/32',
  divider: 'bg-white/12',
  timelineLine: 'from-[#6fd6e2] via-[#8ea2ff]/50 to-transparent'
};

/** Krom — başlık metalik degradeden kesilir; sax burada yansıyan ışık. */
export const SUNNET_KROM: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#090d24]',
  page: 'text-[#dfe6f6]',
  surface: 'bg-white/[0.07] backdrop-blur-2xl backdrop-saturate-150',
  border: 'border-white/16',
  heading: 'text-transparent bg-clip-text bg-gradient-to-br from-[#f4f7ff] via-[#b7c8f4] to-[#8fe3ec]',
  body: 'text-[#a3acc5]',
  accent: 'text-[#9fd8f0]',
  accentBg: 'bg-[#9fd8f0]',
  accentSoft: 'bg-[#9fd8f0]/12',
  input:
    'w-full bg-white/[0.07] border border-white/16 rounded-xl px-4 py-2.5 text-sm text-[#eef2fb] placeholder:text-[#8d97b2] focus:outline-none focus:border-[#9fd8f0]/60 focus:ring-2 focus:ring-[#9fd8f0]/15 transition duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#e6eeff] via-[#b7c8f4] to-[#8fe3ec] hover:brightness-110 text-[#0a1018] rounded-full shadow-lg shadow-[#8fe3ec]/20',
  buttonGhost: 'border border-white/18 text-[#dfe6f6] rounded-full hover:bg-white/[0.08] hover:border-white/32',
  divider: 'bg-white/14',
  timelineLine: 'from-[#9fd8f0] via-[#b7c8f4]/50 to-transparent'
};

/** Deco — siyah değil kraliyet gecesi; yelpaze pirinç. */
export const SUNNET_DECO: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b1240]',
  page: 'text-[#e6e9f8]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-[#e9b23a]/25',
  heading: 'text-[#fbf6e6]',
  body: 'text-[#aab2d4]',
  accent: 'text-[#f2c14e]',
  accentBg: 'bg-[#f2c14e]',
  accentSoft: 'bg-[#f2c14e]/12',
  input:
    'w-full bg-white/[0.06] border border-[#e9b23a]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#fbf6e6] placeholder:text-[#9aa3c8] focus:outline-none focus:border-[#f2c14e]/60 focus:ring-2 focus:ring-[#f2c14e]/15 transition duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#e9b23a] to-[#f6d77e] hover:brightness-110 text-[#0b1240] shadow-lg shadow-black/30',
  buttonGhost: 'border border-[#e9b23a]/30 text-[#e6e9f8] hover:bg-[#e9b23a]/10 hover:border-[#e9b23a]/50',
  divider: 'bg-[#e9b23a]/22',
  timelineLine: 'from-[#f2c14e] via-[#f2c14e]/35 to-transparent'
};

export const SUNNET_FILM: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0c1236]',
  page: 'text-[#e3e7f7]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-white',
  body: 'text-[#a6aecd]',
  accent: 'text-[#ff8a96]',
  accentBg: 'bg-[#ff8a96]',
  accentSoft: 'bg-[#ff8a96]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#959dc0] focus:outline-none focus:border-[#ff8a96]/60 focus:ring-2 focus:ring-[#ff8a96]/15 transition duration-300',
  buttonPrimary: 'bg-[#ff8a96] hover:bg-[#ffa0aa] text-[#1a0b18] rounded-full shadow-lg shadow-[#ff8a96]/20',
  buttonGhost: 'border border-white/16 text-[#e3e7f7] rounded-full hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ff8a96] via-[#ff8a96]/40 to-transparent'
};

/** Kinetik — zemin pelerinin kendisi: doygun sax üzerinde pirinç. */
export const SUNNET_KINETIK: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#1b2f9e]',
  page: 'text-[#eef1ff]',
  surface: 'bg-[#0e1a66]/40 backdrop-blur-md',
  border: 'border-white/20',
  heading: 'text-white',
  body: 'text-[#d3dbff]',
  accent: 'text-[#ffc94a]',
  accentBg: 'bg-[#ffc94a]',
  accentSoft: 'bg-[#ffc94a]/15',
  input:
    'w-full bg-white/[0.08] border border-white/22 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#c0caf5] focus:outline-none focus:border-[#ffc94a]/70 focus:ring-2 focus:ring-[#ffc94a]/20 transition duration-300',
  buttonPrimary: 'bg-[#ffc94a] hover:bg-[#ffd673] text-[#101a4a] rounded-full shadow-lg shadow-black/25',
  buttonGhost: 'border border-white/25 text-white rounded-full hover:bg-white/10 hover:border-white/45',
  divider: 'bg-white/18',
  timelineLine: 'from-[#ffc94a] via-[#ff8a96]/50 to-transparent'
};

export const SUNNET_PANO: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b1238]',
  page: 'text-[#e3e7f7]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f5f7fd]',
  body: 'text-[#a6aecd]',
  accent: 'text-[#6fd6e2]',
  accentBg: 'bg-[#6fd6e2]',
  accentSoft: 'bg-[#6fd6e2]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-xl px-4 py-2.5 text-sm text-[#f5f7fd] placeholder:text-[#959dc0] focus:outline-none focus:border-[#6fd6e2]/60 focus:ring-2 focus:ring-[#6fd6e2]/15 transition duration-300',
  buttonPrimary: 'bg-[#6fd6e2] hover:bg-[#8ee0ea] text-[#061a24] rounded-full shadow-lg shadow-[#6fd6e2]/20',
  buttonGhost: 'border border-white/16 text-[#e3e7f7] rounded-full hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#6fd6e2] via-[#2348c6]/50 to-transparent'
};

export const SUNNET_PLAK: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0c1236]',
  page: 'text-[#e3e7f7]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-white',
  body: 'text-[#a6aecd]',
  accent: 'text-[#f2c14e]',
  accentBg: 'bg-[#f2c14e]',
  accentSoft: 'bg-[#f2c14e]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#959dc0] focus:outline-none focus:border-[#f2c14e]/60 focus:ring-2 focus:ring-[#f2c14e]/15 transition duration-300',
  buttonPrimary: 'bg-[#f2c14e] hover:bg-[#f7cf6c] text-[#0e1650] rounded-full shadow-lg shadow-black/25',
  buttonGhost: 'border border-white/16 text-[#e3e7f7] rounded-full hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f2c14e] via-[#c3263c]/50 to-transparent'
};

/** Vitray — camlar sax/nar/pirinç: kuşak ve pelerin ışığa tutulmuş gibi. */
export const SUNNET_VITRAY: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a1036]',
  page: 'text-[#e3e7f7]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f5f7fd]',
  body: 'text-[#a6aecd]',
  accent: 'text-[#f2c14e]',
  accentBg: 'bg-[#f2c14e]',
  accentSoft: 'bg-[#f2c14e]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-xl px-4 py-2.5 text-sm text-[#f5f7fd] placeholder:text-[#959dc0] focus:outline-none focus:border-[#f2c14e]/60 focus:ring-2 focus:ring-[#f2c14e]/15 transition duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#f2c14e] to-[#ff9aa5] hover:brightness-110 text-[#14102e] rounded-full shadow-lg shadow-black/25',
  buttonGhost: 'border border-white/16 text-[#e3e7f7] rounded-full hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f2c14e] via-[#c3263c]/50 to-transparent'
};

export const SUNNET_YILDIZ_HARITASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#070d33]',
  page: 'text-[#e3e7f7]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f5f7fd]',
  body: 'text-[#a6aecd]',
  accent: 'text-[#6fd6e2]',
  accentBg: 'bg-[#6fd6e2]',
  accentSoft: 'bg-[#6fd6e2]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-xl px-4 py-2.5 text-sm text-[#f5f7fd] placeholder:text-[#959dc0] focus:outline-none focus:border-[#6fd6e2]/60 focus:ring-2 focus:ring-[#6fd6e2]/15 transition duration-300',
  buttonPrimary: 'bg-[#6fd6e2] hover:bg-[#8ee0ea] text-[#061a24] rounded-full shadow-lg shadow-[#6fd6e2]/20',
  buttonGhost: 'border border-white/16 text-[#e3e7f7] rounded-full hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#6fd6e2] via-[#f2c14e]/45 to-transparent'
};

/** Ufuk — sahne ortak (scenes/ufuk); bölümler koyu yoğun cam taşır. */
export const SUNNET_UFUK: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#03070f]',
  page: 'text-[#e8eef6]',
  // Bölümler hareketli bir sahnenin önünden akar: kartlar koyu ve yoğun cam
  // taşır ki arkadaki ışık metnin kontrastını hiçbir an düşürmesin.
  surface: 'bg-[#0b1550]/75 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-white',
  body: 'text-[#b6c1dc]',
  accent: 'text-[#f2c14e]',
  accentBg: 'bg-[#f2c14e]',
  accentSoft: 'bg-[#f2c14e]/12',
  input:
    'w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#f2c14e]/70 focus:ring-2 focus:ring-[#f2c14e]/20 transition duration-300',
  buttonPrimary: 'bg-[#f2c14e] hover:brightness-110 text-[#0b1a2f] rounded-full shadow-lg shadow-black/30',
  buttonGhost: 'border border-white/20 text-white rounded-full hover:bg-white/10 hover:border-white/35',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f2c14e] via-[#c3263c]/45 to-transparent'
};
