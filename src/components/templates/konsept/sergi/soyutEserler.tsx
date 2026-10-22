import React from 'react';

/**
 * Özgün soyut eserler (§4.4): tek eser rengi + mürekkep + duvar beyazı;
 * dokusuz, filtresiz SVG. Kapak eseri fotoğrafa bağlı değildir — galeri
 * kapalıyken de tam çalışır. Telif notu: docs/rehber/.../soyutEserler.md.
 *
 * Her eser 400×500 tuvale çizilir ve çerçevesini `slice` ile doldurur;
 * önemli biçimler kenarlardan en az %12 içeride durur ki kırpılmasın.
 */

interface EserProps {
  className?: string;
}

/**
 * "Eşik": biri dolu ışık, biri çizgi iki kemer aynı eşiğin üstünde. Gelinin
 * eşikten geçişi ve iki kişinin aynı kapıdan girişi; ikinci kemer ilkinin
 * üstünden geçer, ikisi tek bir eşikte buluşur.
 */
export function EserEsik({ className }: EserProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className={className}>
      <rect width="400" height="500" fill="var(--sg-eser)" />
      <path d="M76 440 V200 A80 80 0 0 1 236 200 V440 Z" fill="var(--sg-duvar)" />
      <path d="M174 440 V262 A64 64 0 0 1 302 262 V440" fill="none" stroke="var(--sg-murekkep)" strokeWidth="4" />
      <rect x="48" y="440" width="286" height="9" fill="var(--sg-murekkep)" />
    </svg>
  );
}

/**
 * "İki Yarım": iki panoluk diptik (her pano 300×450). Bir daire panoların
 * arasındaki boşlukta ikiye bölünür; her yarı öbür panonun renklerini
 * taşır, alttaki mürekkep çizgi iki panodan da geçer. İki kişi, tek eser.
 *
 * Daire iç kenara yaslıdır (kenar kuralının bilinçli istisnası): kırpılmasın
 * diye sol pano sağ kenarına, sağ pano sol kenarına sabitlenir.
 */
export function EserIkiYarim({ className, pano = 'sol' }: EserProps & { pano?: 'sol' | 'sag' }) {
  const sol = pano === 'sol';
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 450"
      preserveAspectRatio={sol ? 'xMaxYMid slice' : 'xMinYMid slice'}
      className={className}
    >
      <rect width="300" height="450" fill={sol ? 'var(--sg-eser)' : 'var(--sg-duvar)'} />
      <circle cx={sol ? 300 : 0} cy="190" r="112" fill={sol ? 'var(--sg-duvar)' : 'var(--sg-eser)'} />
      <rect x={sol ? 44 : 0} y="352" width={sol ? 256 : 214} height="6" fill="var(--sg-murekkep)" />
    </svg>
  );
}

export interface SoyutEserTanimi {
  Bilesen: React.ComponentType<EserProps>;
  /** Etiketteki eser adı. */
  ad: string;
  /** Etiketteki teknik satırı. */
  teknik: string;
}

export const SOYUT_ESERLER = {
  esik: { Bilesen: EserEsik, ad: 'Eşik', teknik: 'Tuval üzerine akrilik' },
  ikiYarim: { Bilesen: EserIkiYarim, ad: 'İki Yarım', teknik: 'Diptik, tuval üzerine akrilik' }
} as const satisfies Record<string, SoyutEserTanimi>;

export type SoyutEserAdi = keyof typeof SOYUT_ESERLER;
