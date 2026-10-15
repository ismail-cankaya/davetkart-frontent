import type { SectionTheme } from '../palette';

/**
 * "Davetiye seti" teması: bölümler birer ek karttır.
 *
 * Mevcut kâğıt dilleri kâğıdı yalnızca hero'ya koyar; altındaki program,
 * mekân ve LCV sıradan dijital kartlar olarak kalır. Burada her `surface`
 * kesilmiş bir karttır (dokulu, gölgeli, köşesi keskin), LCV alanları cevap
 * kartının kesik çizgileridir, düğme mürekkeple doldurulmuş bir bloktur.
 *
 * Bütün renkler `KagitKok`'un yazdığı değişkenlerden gelir; bu yüzden tema
 * paletten bağımsız tek bir sabittir ve Tailwind sınıfları derleme anında
 * üretilebilir. Ek kartların kenarı DÜZ kesimdir — tırtıklı kenar ana karta
 * (KagitLevha) ayrılmıştır, gerçek davetiye setlerinde olduğu gibi.
 */

/** Dokulu kâğıt yüzeyi: renk × gri doku (`multiply`). */
const KAGIT_YUZEYI =
  'bg-[var(--kg-kart)] [background-image:var(--kg-doku)] [background-size:var(--kg-doku-boy)] [background-blend-mode:multiply]';

/**
 * Kök: masa da kâğıttır. Gövde yazısı serif; bölümlerin `font-serif`
 * başlıkları Cormorant'a çevrilir (utilities katmanında, iki sınıflı seçici
 * `.font-serif`'i her sırada yener).
 */
const KOK =
  'bg-[var(--kg-masa)] [background-image:var(--kg-doku)] [background-size:var(--kg-doku-boy)] [background-blend-mode:multiply] [font-family:var(--kg-govde-font)] [&_.font-serif]:[font-family:var(--kg-baslik-font)]';

export const KAGIT_TEMASI: SectionTheme = {
  id: 'stone',
  base: KOK,
  page: 'text-[var(--kg-govde)]',
  surface: `${KAGIT_YUZEYI} rounded-[3px] [box-shadow:var(--kg-golge)]`,
  border: 'border-[var(--kg-cizgi)]',
  heading: 'text-[var(--kg-baslik)]',
  body: 'text-[var(--kg-govde)]',
  accent: 'text-[var(--kg-vurgu)]',
  accentBg: 'bg-[var(--kg-vurgu)]',
  accentSoft: 'bg-[color-mix(in_srgb,var(--kg-vurgu)_9%,transparent)]',
  input:
    'w-full bg-transparent border-0 border-b border-dashed border-[var(--kg-govde)] rounded-none px-1 py-2.5 text-[15px] text-[var(--kg-baslik)] placeholder:text-[var(--kg-govde)] placeholder:italic focus:outline-none focus:border-solid focus:border-[var(--kg-vurgu)] focus-visible:bg-[color-mix(in_srgb,var(--kg-vurgu)_6%,transparent)] transition-colors duration-300',
  buttonPrimary:
    'bg-[var(--kg-vurgu)] hover:bg-[var(--kg-vurgu-koyu)] text-[var(--kg-vurgu-ustu)] rounded-[3px] [box-shadow:var(--kg-golge)]',
  buttonGhost:
    'border border-[var(--kg-vurgu)] text-[var(--kg-vurgu)] hover:bg-[color-mix(in_srgb,var(--kg-vurgu)_8%,transparent)] rounded-[3px]',
  divider: 'bg-[var(--kg-cizgi)]',
  timelineLine: 'from-[var(--kg-vurgu)] via-[var(--kg-cizgi-guclu)] to-transparent',
  envelope: {
    paper: KAGIT_YUZEYI,
    flap: 'bg-[var(--kg-kart-koyu)]',
    seal: 'bg-[var(--kg-mum)] text-[#FAF6EE]',
    glow: 'bg-transparent',
    card: `${KAGIT_YUZEYI} border border-[var(--kg-cizgi)]`
  },
  mapHeader: 'bg-[var(--kg-kart-koyu)]'
};

/** Koyu karton seti. Renkler yine değişkenden; `id` paylaşılan bölümlerin koyu dallarını açar. */
export const KAGIT_TEMASI_KOYU: SectionTheme = {
  ...KAGIT_TEMASI,
  id: 'midnight'
};
