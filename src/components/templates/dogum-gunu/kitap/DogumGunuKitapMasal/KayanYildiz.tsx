import React from 'react';

/**
 * Kayan yıldız: masal kapağının figürü (özgün SVG). Doğum gününde dilek
 * tutulur; yıldız sağ üstte, ardında üç yay biçimli iz sola aşağı iner.
 * Düz yaldız (`currentColor`), degrade ve parlama yok. Süstür — rengi ve
 * `aria-hidden`'ı MasalKapak'ın figür yuvası verir.
 *
 * Ay + yıldız birlikte kullanılmaz (bayrak çağrışımı); taç sünnete ayrılır.
 */
export function KayanYildiz({ genislik = 112 }: { genislik?: number }) {
  return (
    <svg viewBox="0 0 96 64" width={genislik} height={(genislik * 64) / 96} className="block" fill="none" stroke="currentColor" strokeLinecap="round">
      <path
        fill="currentColor"
        stroke="none"
        d="M66.0 7.0 L69.6 17.0 L80.3 17.4 L71.9 23.9 L74.8 34.1 L66.0 28.2 L57.2 34.1 L60.1 23.9 L51.7 17.4 L62.4 17.0 Z"
      />
      <path d="M53 30 C 40 40, 26 46, 8 48" strokeWidth="1.6" />
      <path d="M55 35.5 C 44 46, 32 53, 18 56.5" strokeWidth="1.2" opacity="0.8" />
      <path d="M58.5 39 C 51 49, 42 56, 31 60.5" strokeWidth="0.9" opacity="0.6" />
      <circle cx="84" cy="44" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="40" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
