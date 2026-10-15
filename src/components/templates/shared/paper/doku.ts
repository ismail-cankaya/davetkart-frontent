import lif from './doku/lif.webp';
import keten from './doku/keten.webp';
import murekkep from './doku/murekkep.webp';
import leke from './doku/leke.webp';

/**
 * Önceden üretilmiş dokular (scripts/temalar/kagit-dokulari.ts).
 *
 * 🔴 Çalışma anında SVG `feTurbulence` yok: filtre, kaydırmanın her
 * karesinde yeniden boyanır ve telefonda kaydırmayı takıltır. Bunlar gri
 * tonlu döşemelerdir; kâğıt rengiyle `multiply` karışarak her paletin
 * rengini alır. En koyu %1'leri: lif 0.937, keten 0.906 (kontrast hesabında
 * kâğıt rengi bu çarpanla koyultulur).
 */
export const DOKULAR = {
  /** Pamuk lifi: bulutlu hamur, kısa lifler, seyrek kalıntı. 256 px döşeme. */
  lif: { url: lif, boy: 256 },
  /** Keten: dalgalanan atkı ve çözgü. 256 px döşeme. */
  keten: { url: keten, boy: 256 }
} as const;

export type DokuAdi = keyof typeof DOKULAR;

/** Mürekkep damgasının eşit dağılmayan boyası (alfa maskesi, 128 px döşeme). */
export const MUREKKEP_MASKESI = murekkep;

/** Suluboya lekesinin biçimi (alfa maskesi, 200 px; büyütülerek kullanılır). */
export const LEKE_MASKESI = leke;
