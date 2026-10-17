import type { SectionTheme } from '../../shared/palette';

/**
 * "Aynı duvar" teması: ortak bölümler (program, mekân, galeri, hediye, LCV)
 * kapakla aynı beyaz duvarda asılı durur.
 *
 * Kartlar paspartudur: beyaz, ince kenar, tek yumuşak gölge, köşesiz. Köşe
 * sıfırlaması `surface`, `border` ve dolguların içindedir; bölümlerin kendi
 * `rounded-*` sınıfları `cn` ile bunların altında kalır. Bütün renkler
 * `SergiKok`'un yazdığı değişkenlerden gelir, tema tek bir sabittir.
 */

/** Kök: düz duvar, gövde Instrument Sans; `font-serif` başlıklar Instrument Serif 400. */
const KOK =
  'bg-[var(--sg-duvar)] [font-family:var(--sg-govde-font)] [&_.font-serif]:[font-family:var(--sg-baslik-font)] [&_.font-serif]:font-normal';

export const SERGI_TEMASI: SectionTheme = {
  id: 'stone',
  base: KOK,
  page: 'text-[var(--sg-etiket)]',
  surface: 'bg-[var(--sg-cerceve)] rounded-none [box-shadow:var(--sg-kart-golge)]',
  border: 'border-[var(--sg-kenar)] rounded-none',
  heading: 'text-[var(--sg-murekkep)]',
  body: 'text-[var(--sg-etiket)]',
  accent: 'text-[var(--sg-vurgu)]',
  accentBg: 'bg-[var(--sg-vurgu-zemin)] rounded-none',
  accentSoft: 'bg-[color-mix(in_srgb,var(--sg-vurgu)_8%,transparent)] rounded-none',
  input:
    'w-full bg-[var(--sg-cerceve)] border border-[var(--sg-kenar-guclu)] rounded-none px-3.5 py-3 text-[15px] text-[var(--sg-murekkep)] placeholder:text-[var(--sg-etiket)] focus:outline-none focus:border-[var(--sg-vurgu)] focus-visible:[box-shadow:0_0_0_1px_var(--sg-vurgu)] transition-colors duration-200',
  // Dokunma hedefi: ortak bölümlerin düğmeleri 28–40 px; tema en az 44 px'e çıkarır.
  buttonPrimary:
    'min-h-11 bg-[var(--sg-eser)] hover:bg-[var(--sg-eser-hover)] text-[var(--sg-eser-ustu)] rounded-none tracking-[0.08em]',
  buttonGhost:
    'min-h-11 min-w-11 justify-center border border-[var(--sg-vurgu)] text-[var(--sg-vurgu)] hover:bg-[color-mix(in_srgb,var(--sg-vurgu)_7%,transparent)] rounded-none',
  divider: 'bg-[var(--sg-kenar)]',
  // Degrade yalnızca spot ışığındadır (§2.2 kural 3): program hattı düz bir çizgi.
  timelineLine: 'from-[var(--sg-vurgu)] via-[var(--sg-vurgu)] to-[var(--sg-vurgu)]',
  envelope: {
    paper: 'bg-[var(--sg-cerceve)]',
    flap: 'bg-[var(--sg-duvar-koyu)]',
    seal: 'bg-[var(--sg-vurgu-zemin)] text-[var(--sg-cerceve)]',
    glow: 'bg-transparent',
    card: 'bg-[var(--sg-cerceve)] border border-[var(--sg-kenar)]'
  },
  mapHeader: 'bg-[var(--sg-duvar-koyu)]',
  // Ortak alt bilgi opaklıkla soluklaşıyor (duvarda %40 → AA altı); burada tam etiket rengi: 6.05.
  footer: { names: 'text-[var(--sg-etiket)]', branding: 'text-[var(--sg-etiket)]' }
};
