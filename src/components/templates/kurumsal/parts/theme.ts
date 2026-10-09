import { cn } from '../../../../utils/cn';
import { SectionTheme } from '../../shared/palette';

/**
 * Kurumsal kimliğin renk sabitleri — "Grafit & Sinyal".
 *
 * Nötr zeminler (grafit/kâğıt) üstünde tek bir sinyal rengi: kobalt. Gala
 * dilindeki şablonlar kobalt yerine platin, afiş dilindekiler işaret
 * kırmızısı taşır. Değerler hero parametrelerinde ve stil nesnelerinde
 * kullanılır; Tailwind sınıfları şablon dosyalarında açık yazılır.
 */
export const KURUMSAL_INK = {
  grafit: '#0D0F13',
  antrasit: '#161A20',
  kagit: '#F1F1ED',
  beton: '#E4E4DE',
  murekkep: '#101216',
  kobalt: '#2B3FE0',
  kobaltIsik: '#8F9CFF',
  platin: '#C5CBD3',
  isaret: '#F0442A'
} as const;

/** Bölüm kartlarının köşe tavrı. */
export type KurumsalEdge = 'kesin' | 'sert' | 'serbest';

/** Ortak bölümlerin başlık yazısı: grotesk (Inter) ya da şablonun serifi. */
export type KurumsalType = 'grotesk' | 'serif';

/**
 * Köşe sınıfları. `surface` ve `border` ortak bölümlerde `rounded-3xl`'den
 * SONRA birleştiği için buradaki yarıçap onu ezer (bkz. cn/twMerge).
 * 'serbest' hero'nun kendi yuvarlaklığını koruyan şablonlar içindir.
 */
const EDGE_CLASS: Record<KurumsalEdge, { card: string; control: string }> = {
  kesin: { card: 'rounded-[4px]', control: 'rounded-[2px]' },
  sert: { card: 'rounded-none', control: 'rounded-none' },
  serbest: { card: '', control: '' }
};

/**
 * Grotesk takası: şablonun içindeki `font-serif` başlıklar Inter'e döner ve
 * dik yazılır. Seçici iki sınıflı olduğu için (0,2,0) tekil yardımcıları ezer.
 */
const GROTESK = '[&_.font-serif]:font-sans [&_.font-serif]:not-italic';

/** Düğme yazısı: aralıklı büyük harf — kayıt masası etiketi gibi. */
const BUTTON_TYPE = 'uppercase tracking-[0.16em]';

/**
 * Şablonun renk sınıflarına kategori biçimini ekler: köşe, düğme yazısı ve
 * başlık takası. Renkler şablonda kalır; biçim tek yerden gelir.
 */
export function kurumsalTheme(
  colors: SectionTheme,
  { edge = 'kesin', type = 'grotesk' }: { edge?: KurumsalEdge; type?: KurumsalType } = {}
): SectionTheme {
  const shape = EDGE_CLASS[edge];
  return {
    ...colors,
    base: cn(colors.base, type === 'grotesk' && GROTESK),
    surface: cn(colors.surface, shape.card),
    border: cn(colors.border, shape.card),
    input: cn(colors.input, shape.control),
    buttonPrimary: cn(colors.buttonPrimary, shape.control, BUTTON_TYPE),
    buttonGhost: cn(colors.buttonGhost, shape.control, BUTTON_TYPE)
  };
}

/** Kurumsal hareket eğrisi: hızlı çıkış, kısa kuyruk — süzülmez, yerine oturur. */
export const KURUMSAL_EASE = [0.16, 1, 0.3, 1] as const;
