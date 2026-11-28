import type { SergiMetinleri } from '../../konsept/sergi';

/**
 * Nişanın sergi preset'lerinin (Bir Ömür, Diptik) ortak metinleri. Nişan,
 * "Bir Ömür" sergisinin önizlemesidir (SERGI-KONSEPTI §7): açılış düğündür,
 * bu akşam önizleme. Taban flavor `NISAN_FLAVOR`'dır; zarf etiketi
 * ("Nişan Davetiyesi") ondan gelir.
 */
export const NISAN_SERGI_METINLERI: SergiMetinleri = { kapsam: 'nisan-sergi' };

/** Kapakta tekrar eden sözlerin anahtarları (`useInvText` ile okunur). */
export const ONIZLEME = {
  /** Etiketin tarih/mekân başlığı. */
  baslik: 'design.nisan-sergi.onizleme',
  /** Geri sayımın üst satırı. */
  sayac: 'design.nisan-sergi.onizlemeyeKalan',
  /** Sergi adı: nişanın önizlediği. */
  sergi: 'design.nisan-sergi.birOmur',
  /** Sergi adının durumu. */
  durum: 'design.nisan-sergi.yakinda'
} as const;
