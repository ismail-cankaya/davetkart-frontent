import type { SergiMetinleri } from '../../konsept/sergi';

/**
 * Nişanın sergi preset'lerinin (Bir Ömür, Diptik) ortak metinleri. Nişan,
 * "Bir Ömür" sergisinin önizlemesidir (SERGI-KONSEPTI §7): açılış düğündür,
 * bu akşam önizleme. Taban flavor `NISAN_FLAVOR`'dır; zarf etiketi
 * ("Nişan Davetiyesi") ondan gelir.
 */
export const NISAN_SERGI_METINLERI: SergiMetinleri = { kapsam: 'nisan-sergi' };

/** Kapakta tekrar eden sabit sözler. */
export const ONIZLEME = {
  /** Etiketin tarih/mekân başlığı. */
  baslik: 'Önizleme',
  /** Geri sayımın üst satırı. */
  sayac: 'Önizlemeye kalan',
  /** Sergi adı: nişanın önizlediği. */
  sergi: 'Bir Ömür',
  /** Sergi adının durumu. */
  durum: 'Yakında'
} as const;
