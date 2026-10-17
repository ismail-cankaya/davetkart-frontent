import type React from 'react';
import { BASLIK_YIGINI, GOVDE_YIGINI } from './fontlar';

/**
 * "Sergi Açılışı" konseptinin renk kaynağı. Kontrast tablosu ve kurallar:
 * docs/rehber/tasarim/SERGI-KONSEPTI.md §2.
 *
 * Renkler CSS değişkeni olarak dağıtılır (`SergiKok`): tema dizgileri sabit
 * kalır, Tailwind sınıfları derleme anında üretilir. Preset yalnızca eser
 * rengini seçer; duvar ve yazı her preset'te aynıdır.
 */

/** Duvar ve yazı — her preset'te aynı. */
export const DUVAR = {
  duvar: '#F7F7F5',
  /** Harita başlığı gibi duvarın gölgede kalan yüzeyleri. */
  duvarKoyu: '#EDEDEA',
  murekkep: '#1C1C1C',
  etiket: '#5E5E5E',
  cerceve: '#FFFFFF',
  kenar: '#D6D6D2',
  /** Form alanı sınırı: beyazda 3.47, duvarda 3.23 (WCAG 1.4.11). */
  kenarGuclu: '#8A8A86',
  /** Zarf kapısı: ışığı kapalı duvar. */
  karanlik: '#222221',
  /** Karanlık duvarda ikincil yazı (6.67). */
  karanlikEtiket: '#A8A8A3'
} as const;

interface EserRengiTanimi {
  renk: string;
  /** Düğme üzerine gelince. */
  hover: string;
  /** Eser renginin üstündeki yazı. */
  ustu: string;
  /** Duvarda yazı olabilir mi (≥ 4.5)? Olamıyorsa vurgu yazısı mürekkeptir. */
  yazi: boolean;
}

/** Eser renkleri — preset başına bir tane (§2.2). */
export const ESER_RENKLERI = {
  kobalt: { renk: '#2A4BA0', hover: '#223E83', ustu: '#FFFFFF', yazi: true },
  fusya: { renk: '#A72D63', hover: '#892551', ustu: '#FFFFFF', yazi: true },
  safran: { renk: '#E0A526', hover: '#E6B54D', ustu: DUVAR.murekkep, yazi: false },
  gece: { renk: '#1C1C1C', hover: '#373737', ustu: '#FFFFFF', yazi: true }
} as const satisfies Record<string, EserRengiTanimi>;

export type EserRengi = keyof typeof ESER_RENKLERI;

/** Kitin dağıttığı CSS değişkenleri. */
export type SergiDegiskeni =
  | '--sg-duvar'
  | '--sg-duvar-koyu'
  | '--sg-murekkep'
  | '--sg-etiket'
  | '--sg-cerceve'
  | '--sg-kenar'
  | '--sg-kenar-guclu'
  | '--sg-karanlik'
  | '--sg-karanlik-etiket'
  | '--sg-eser'
  | '--sg-eser-hover'
  | '--sg-eser-ustu'
  | '--sg-vurgu'
  | '--sg-vurgu-zemin'
  | '--sg-spot'
  | '--sg-cerceve-golge'
  | '--sg-kart-golge'
  | '--sg-govde-font'
  | '--sg-baslik-font';

/** Preset'in eser rengine göre bütün değişkenler — `SergiKok` kökün `style`'ına yazar. */
export function sergiDegiskenleri(eser: EserRengi): React.CSSProperties {
  const e = ESER_RENKLERI[eser];
  const degiskenler: Record<SergiDegiskeni, string> = {
    '--sg-duvar': DUVAR.duvar,
    '--sg-duvar-koyu': DUVAR.duvarKoyu,
    '--sg-murekkep': DUVAR.murekkep,
    '--sg-etiket': DUVAR.etiket,
    '--sg-cerceve': DUVAR.cerceve,
    '--sg-kenar': DUVAR.kenar,
    '--sg-kenar-guclu': DUVAR.kenarGuclu,
    '--sg-karanlik': DUVAR.karanlik,
    '--sg-karanlik-etiket': DUVAR.karanlikEtiket,
    '--sg-eser': e.renk,
    '--sg-eser-hover': e.hover,
    '--sg-eser-ustu': e.ustu,
    // Safran duvarda yazı olamaz (2.04): vurgu yazısı ve küçük dolgular mürekkebe döner.
    '--sg-vurgu': e.yazi ? e.renk : DUVAR.murekkep,
    '--sg-vurgu-zemin': e.yazi ? e.renk : DUVAR.murekkep,
    '--sg-spot': 'rgba(255,252,244,0.95)',
    '--sg-cerceve-golge': '0 1px 2px rgba(0,0,0,0.10), 0 24px 36px -22px rgba(0,0,0,0.35)',
    '--sg-kart-golge': '0 1px 2px rgba(0,0,0,0.05), 0 16px 30px -24px rgba(0,0,0,0.35)',
    '--sg-govde-font': GOVDE_YIGINI,
    '--sg-baslik-font': BASLIK_YIGINI
  };
  return degiskenler as React.CSSProperties;
}
