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

export interface SoyutEserTanimi {
  Bilesen: React.ComponentType<EserProps>;
  /** Etiketteki eser adı. */
  ad: string;
  /** Etiketteki teknik satırı. */
  teknik: string;
}

export const SOYUT_ESERLER = {
  esik: { Bilesen: EserEsik, ad: 'Eşik', teknik: 'Tuval üzerine akrilik' }
} as const satisfies Record<string, SoyutEserTanimi>;

export type SoyutEserAdi = keyof typeof SOYUT_ESERLER;
