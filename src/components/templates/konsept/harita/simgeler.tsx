import React from 'react';

/**
 * Haritanın özgün piktogramları. Hepsi 24 px ızgarada, tek renk
 * (`currentColor`), 2 px kontur ya da düz dolgu. Harita üstünde yalnızca
 * bunlar kullanılır; Lucide bölümlere kalır (HARITA-KONSEPTI §4.4).
 */

export type DurakSimgeAdi =
  | 'yuzuk'
  | 'kadeh'
  | 'yemek'
  | 'muzik'
  | 'pasta'
  | 'halka'
  | 'kahve'
  | 'cay'
  | 'tatli'
  | 'kurdele'
  | 'kamera'
  | 'balon'
  | 'hediye'
  | 'zar';
export type SimgeAdi = DurakSimgeAdi | 'takvim' | 'ok' | 'agac' | 'fener';

const CIZGI = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
} as const;

const CIZIMLER: Record<SimgeAdi, React.ReactNode> = {
  yuzuk: (
    <>
      <circle cx="12" cy="15" r="6" {...CIZGI} />
      <path d="M9.5 6 12 3l2.5 3L12 9z" {...CIZGI} />
    </>
  ),
  kadeh: (
    <>
      <path d="M7 3h10v3.5a5 5 0 0 1-10 0z" {...CIZGI} />
      <path d="M12 11.5V20M8.5 20h7" {...CIZGI} />
    </>
  ),
  yemek: (
    <>
      <path d="M6 3v4.5M8 3v4.5M10 3v4.5M6 7.5a2 2 0 0 0 4 0M8 9.5V21" {...CIZGI} />
      <path d="M17 21V3c-2.2 1.6-3 4.5-3 8.5h3" {...CIZGI} />
    </>
  ),
  muzik: (
    <>
      <ellipse cx="9" cy="17.5" rx="3.4" ry="2.6" transform="rotate(-20 9 17.5)" fill="currentColor" />
      <path d="M12.2 16.6V4c.6 2.6 4.8 3.2 5.6 6.6" {...CIZGI} />
    </>
  ),
  pasta: (
    <>
      <path d="M4 21h16M6 21v-7h12v7M6 16.6c1.4 1 2.6 1 4 0s2.6-1 4 0 2.6 1 4 0M12 14v-3.6" {...CIZGI} />
      <path d="M12 8.2c-1-.9-1-2.1 0-3.4 1 1.3 1 2.5 0 3.4z" fill="currentColor" />
    </>
  ),
  // Nişan sözlüğü (2026-10-22): söz, ikram, kurdele, fotoğraf.
  halka: (
    <>
      <circle cx="9" cy="13.5" r="5.5" {...CIZGI} />
      <circle cx="15" cy="10.5" r="5.5" {...CIZGI} />
    </>
  ),
  kahve: (
    <>
      <path d="M5.5 10.5h10l-1 5.4a3 3 0 0 1-3 2.6h-2a3 3 0 0 1-3-2.6z" {...CIZGI} />
      <path d="M15.3 12h1.6a1.8 1.8 0 0 1 0 3.6h-2.2M3.5 21h14" {...CIZGI} />
      <path d="M9 3.5c-.9.9.9 1.8 0 3M12.5 3.5c-.9.9.9 1.8 0 3" {...CIZGI} />
    </>
  ),
  cay: (
    <>
      <path d="M8 3.5h8c0 3.2-2.4 4.6-2.4 7.5 0 2.2 2.4 3.6 2.4 7H8c0-3.4 2.4-4.8 2.4-7C10.4 8.1 8 6.7 8 3.5z" {...CIZGI} />
      <path d="M5 21h14" {...CIZGI} />
    </>
  ),
  tatli: (
    <>
      <path d="M4.5 13 8 9l3.5 4L8 17zM12.5 13 16 9l3.5 4L16 17z" {...CIZGI} />
      <path d="M3 20.5h18" {...CIZGI} />
    </>
  ),
  kurdele: (
    <>
      <path d="M12 11c-3-3.5-7.5-5-7.5-2.5v5c0 2.5 4.5 1 7.5-2.5zM12 11c3-3.5 7.5-5 7.5-2.5v5c0 2.5-4.5 1-7.5-2.5z" {...CIZGI} />
      <path d="m10.6 12.6-2.4 7.9M13.4 12.6l2.4 7.9" {...CIZGI} />
    </>
  ),
  kamera: (
    <>
      <path d="M4 8h3.5L9 5.5h6L16.5 8H20a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" {...CIZGI} />
      <circle cx="12" cy="13.5" r="3.5" {...CIZGI} />
    </>
  ),
  // Doğum günü sözlüğü (2026-10-23): balon (çocuk karşılaması), hediye, oyun (zar).
  balon: (
    <>
      <ellipse cx="12" cy="9" rx="6" ry="6.8" {...CIZGI} />
      <path d="M10.7 17.6h2.6L12 15.8z" fill="currentColor" />
      <path d="M12 17.6c-1.3 1.4 1.3 2.3 0 4" {...CIZGI} />
    </>
  ),
  hediye: (
    <>
      <path d="M4.5 11h15v9.5h-15zM3.5 7.5h17V11h-17zM12 7.5v13" {...CIZGI} />
      <path d="M12 7.5C10.6 4.6 7 4.2 7 6s3 1.5 5 1.5zM12 7.5c1.4-2.9 5-3.3 5-1.5s-3 1.5-5 1.5z" {...CIZGI} />
    </>
  ),
  zar: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" {...CIZGI} />
      <circle cx="8.6" cy="8.6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="15.4" cy="15.4" r="1.5" fill="currentColor" />
    </>
  ),
  takvim: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="1.5" {...CIZGI} />
      <path d="M4 10h16M8.5 3v4M15.5 3v4" {...CIZGI} />
    </>
  ),
  ok: <path d="M7 17 17 7M9 7h8v8" {...CIZGI} />,
  agac: (
    <>
      <circle cx="12" cy="10" r="6" {...CIZGI} />
      <path d="M12 16v5" {...CIZGI} />
    </>
  ),
  fener: (
    <>
      <path d="m9.5 21 1.2-11h2.6l1.2 11z M9 10h6M10.5 6.5h3V10h-3zM12 4v2.5" {...CIZGI} />
      <path d="m16 7 3-1.2M8 7 5 5.8" {...CIZGI} />
    </>
  )
};

interface SimgeProps {
  ad: SimgeAdi;
  boyut?: number;
  className?: string;
  /** İç içe SVG'de (rota durakları) konum. */
  x?: number;
  y?: number;
}

export function Simge({ ad, boyut = 24, className, x, y }: SimgeProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={boyut} height={boyut} x={x} y={y} className={className}>
      {CIZIMLER[ad]}
    </svg>
  );
}

/** Kuzey oku: sol yarı dolu, sağ yarı kontur. Altına "K" yazılır (HTML). */
export function KuzeyOku({ boyut = 24, className }: { boyut?: number; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={boyut} height={boyut} className={className}>
      <path d="M12 2.5 17 20l-5-3.6L7 20z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 2.5 7 20l5-3.6z" fill="currentColor" />
    </svg>
  );
}

/** Küçük, tek renk pusula gülü: kuzey ucu dolu. Altın ve süs yok. */
export function PusulaGulu({ boyut = 48, className }: { boyut?: number; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={boyut} height={boyut} className={className}>
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="0.75" />
      <path
        d="M12 1.5 13.5 10.5 22.5 12 13.5 13.5 12 22.5 10.5 13.5 1.5 12 10.5 10.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path d="M12 1.5 13.5 10.5h-3z" fill="currentColor" />
    </svg>
  );
}
