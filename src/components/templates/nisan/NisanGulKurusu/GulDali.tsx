import React from 'react';
import { PIGMENTLER } from '../../shared/paper';

/**
 * Kurutulmuş tek bir gül dalı: ince mürekkep çizgisi + suluboya dolgu.
 *
 * Özgün çizim (bu dosyadaki yollar); bir görselden ya da çizimden
 * kopyalanmadı. Kalıp çiçek kümesi yerine TEK dal: kurutulmuş çiçek kartın
 * köşesine iliştirilir, kartı süslemez.
 *
 * Mürekkep ve boya ayrı katmanlardır ve boya 2 px kaydırılmıştır: elle
 * boyanmış bir çizimde fırça çizginin tam içine düşmez. Dolgular `multiply`
 * ile üst üste biner; iki yaprağın kesiştiği yerde boya koyulaşır.
 */

/** Uzunluğu 1 olan yaprak; `transform` ile yerleştirilir ve boylanır. */
const YAPRAK = 'M0 0 C0.3 -0.34 0.72 -0.27 1 0 C0.72 0.25 0.3 0.31 0 0 Z';
const DAMAR = 'M0.04 0 C0.4 -0.03 0.7 -0.02 0.94 0';

const YAPRAKLAR = [
  { x: 140, y: 110, aci: -156, boy: 40 },
  { x: 113, y: 89, aci: -32, boy: 34 },
  { x: 87, y: 67, aci: -172, boy: 26 }
] as const;

const SAP = 'M182 144 C152 120 126 98 105 81 S73 57 59 45';

/** Tomurcuk parçaları; tomurcuk yukarı (−y) bakar, sonra dal ucuna döndürülür. */
const CANAK = [
  'M0 2 C-7 3 -10 -2 -8 -7 C-5 -3 -3 -1 0 0 Z',
  'M0 2 C7 3 10 -2 8 -7 C5 -3 3 -1 0 0 Z',
  'M0 2 C-1 -3 0 -7 2 -9 C2 -5 2 -2 0 2 Z'
];
const TAC = [
  'M0 0 C-12 -3 -14 -19 -2 -29 C4 -23 11 -17 10 -6 C9 -2 4 0 0 0 Z',
  'M-1 -4 C-8 -11 -7 -24 1 -28 C7 -21 7 -10 -1 -4 Z',
  'M0 0 C-10 -5 -10 -15 -5 -19 C-1 -13 5 -9 11 -8 C9 -2 4 0 0 0 Z'
];
const TOMURCUK = 'translate(59 45) rotate(-50) scale(1.45)';

export function GulDali({ className }: { className?: string }) {
  const murekkep = { fill: 'none', stroke: 'var(--kg-baslik)', strokeOpacity: 0.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <svg aria-hidden="true" viewBox="0 0 200 150" className={className} style={{ overflow: 'visible' }}>
      {/* Boya katmanı — çizgiden kaymış. */}
      <g transform="translate(2.2 1.6)" style={{ mixBlendMode: 'multiply' }}>
        {YAPRAKLAR.map((y) => (
          <path key={`${y.x}`} d={YAPRAK} transform={`translate(${y.x} ${y.y}) rotate(${y.aci}) scale(${y.boy})`} fill={PIGMENTLER.adacayi} fillOpacity="0.85" />
        ))}
        <g transform={TOMURCUK}>
          {CANAK.map((d) => (
            <path key={d} d={d} fill={PIGMENTLER.adacayi} fillOpacity="0.9" />
          ))}
          {TAC.map((d, i) => (
            <path key={d} d={d} fill={PIGMENTLER.gul} fillOpacity={i === 1 ? 0.95 : 0.8} />
          ))}
        </g>
      </g>

      {/* Mürekkep katmanı. */}
      <g>
        <path d={SAP} {...murekkep} strokeWidth="1.2" />
        <path d="M181 146 C151 122 125 100 104 83 S72 59 58 47" {...murekkep} strokeOpacity={0.25} strokeWidth="0.8" />
        <path d="M137 107 l5 -7 l-1 8 z M114 89 l-2 -8 l5 6 z M86 64 l5 -6 l-1 7 z" fill="var(--kg-baslik)" fillOpacity="0.5" />
        {YAPRAKLAR.map((y) => (
          <g key={`${y.x}`} transform={`translate(${y.x} ${y.y}) rotate(${y.aci}) scale(${y.boy})`}>
            <path d={YAPRAK} {...murekkep} strokeOpacity={0.55} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
            <path d={DAMAR} {...murekkep} strokeOpacity={0.35} strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
          </g>
        ))}
        <g transform={TOMURCUK}>
          {[...CANAK, TAC[0], TAC[2]].map((d) => (
            <path key={d} d={d} {...murekkep} strokeOpacity={0.6} strokeWidth="0.6" />
          ))}
          <path d="M-2 -29 C1 -27 3 -25 4 -22" {...murekkep} strokeOpacity={0.6} strokeWidth="0.6" />
        </g>
      </g>
    </svg>
  );
}
