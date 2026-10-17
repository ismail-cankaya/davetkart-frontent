import React, { useId } from 'react';
import { HARITA_RENK as R } from '../palet';
import { lekeIciNoktalar, lekeYolu, type Leke } from './cizim';

/**
 * Arazi ekseni: kurgusal bir kır. Tonlar: arazi, park (koru), su (dere ve
 * gölet); rota kapakta ayrı katmandır. Eş yükselti eğrileri, tarla sıraları
 * ve ağaç simgeleri mürekkebin şeffaf hâliyle çizilmiş çizgilerdir.
 *
 * Tuval 1200 × 1500, `slice`: tepe, dere ve gölet her kadrajda görünen
 * çekirdektedir (x 307–893, y 307–1192). Gerçek bir yer değildir.
 */

interface Tepe extends Leke {
  halka: number;
  /** Halka başına merkez kayması: yamaçlar eşit eğimli değil. */
  kayma: [number, number];
}

const TEPELER: Tepe[] = [
  { cx: 520, cy: 560, rx: 250, ry: 185, aci: -12, tohum: 11, puruz: 0.1, halka: 7, kayma: [6, -4] },
  { cx: 1000, cy: 300, rx: 200, ry: 150, aci: 18, tohum: 23, puruz: 0.12, halka: 5, kayma: [-5, 4] },
  { cx: 860, cy: 1310, rx: 230, ry: 160, aci: -6, tohum: 31, puruz: 0.11, halka: 5, kayma: [4, 5] },
  { cx: 120, cy: 1000, rx: 170, ry: 130, aci: 30, tohum: 41, puruz: 0.12, halka: 4, kayma: [-4, -3] }
];

const KORULAR: Leke[] = [
  { cx: 250, cy: 240, rx: 210, ry: 125, aci: -8, tohum: 51, puruz: 0.16 },
  { cx: 1010, cy: 1010, rx: 150, ry: 115, aci: 12, tohum: 52, puruz: 0.18 },
  { cx: 330, cy: 1320, rx: 220, ry: 115, aci: -4, tohum: 53, puruz: 0.16 },
  { cx: 860, cy: 600, rx: 85, ry: 120, aci: 10, tohum: 54, puruz: 0.18 }
];

/** Tarlalar: köşeler + sıra açısı. Biri bağ (sık sıra). */
const TARLALAR: { kose: string; aci: number; aralik: number }[] = [
  { kose: 'M420 1060L690 1020L720 1190L450 1240Z', aci: 12, aralik: 11 },
  { kose: 'M40 560L260 520L290 760L60 800Z', aci: -8, aralik: 14 },
  { kose: 'M560 120L760 90L790 260L590 290Z', aci: 30, aralik: 14 }
];

const DERE =
  'M1220 700C1150 720 1100 770 1040 765C960 758 920 710 860 760C810 800 800 850 720 880C660 902 600 890 540 935C490 972 450 930 400 940C340 952 310 1000 250 1050C190 1100 150 1160 90 1230C50 1276 10 1300-20 1320';
const GOLET = lekeYolu({ cx: 640, cy: 902, rx: 82, ry: 44, aci: -14, tohum: 61, puruz: 0.12 });
const TOPRAK_YOL = 'M-20 450C120 470 250 430 330 380C400 336 470 330 560 350C640 368 700 330 760 270';

const HALKALAR = TEPELER.flatMap((tepe) =>
  Array.from({ length: tepe.halka }, (_, i) => ({
    d: lekeYolu(tepe, 1 - (i / tepe.halka) * 0.82, [tepe.kayma[0] * i, tepe.kayma[1] * i]),
    // Her üçüncü halka kalın: ana eş yükselti eğrisi.
    ana: i % 3 === 0
  }))
);
const KORU_YOLLARI = KORULAR.map((k) => lekeYolu(k));
const AGACLAR = KORULAR.flatMap((k) => lekeIciNoktalar(k, 30));

export function KirArazisi({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const sira = (i: number) => `hr-ts${i}-${uid}`;

  return (
    <svg aria-hidden="true" viewBox="0 0 1200 1500" preserveAspectRatio="xMidYMid slice" className={className ?? 'absolute inset-0 h-full w-full'}>
      <defs>
        {TARLALAR.map((t, i) => (
          <pattern key={i} id={sira(i)} width="40" height={t.aralik} patternUnits="userSpaceOnUse" patternTransform={`rotate(${t.aci})`}>
            <path d={`M0 ${t.aralik / 2}H40`} stroke={R.murekkep} strokeOpacity="0.16" strokeWidth="1.6" />
          </pattern>
        ))}
      </defs>

      <rect x="-20" y="-20" width="1240" height="1540" fill={R.arazi} />

      {TARLALAR.map((t, i) => (
        <path
          key={i}
          d={t.kose}
          fill={`url(#${sira(i)})`}
          stroke={R.murekkep}
          strokeOpacity="0.3"
          strokeWidth="1.5"
          strokeDasharray="7 6"
        />
      ))}

      <g fill={R.park}>
        {KORU_YOLLARI.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g fill="none" stroke={R.murekkep} strokeOpacity="0.24" strokeWidth="1.6">
        {AGACLAR.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x - 6} ${y + 2}a6 6 0 1 1 12 0M${x} ${y + 2}v6`} strokeLinecap="round" />
        ))}
      </g>

      <g fill="none" stroke={R.murekkep} strokeLinejoin="round">
        {HALKALAR.map((h, i) => (
          <path key={i} d={h.d} strokeOpacity={h.ana ? 0.3 : 0.2} strokeWidth={h.ana ? 2.2 : 1.4} />
        ))}
      </g>

      {/* Toprak yol: kesikli ince çizgi (rota değil, arazinin dokusu). */}
      <path d={TOPRAK_YOL} fill="none" stroke={R.murekkep} strokeOpacity="0.32" strokeWidth="2" strokeDasharray="10 7" strokeLinecap="round" />

      <path d={DERE} fill="none" stroke={R.su} strokeWidth="18" strokeLinecap="round" />
      <path d={GOLET} fill={R.su} />
      <path d={DERE} fill="none" stroke={R.murekkep} strokeOpacity="0.12" strokeWidth="1" strokeDasharray="1 9" strokeLinecap="round" />

      {/* Su adı: süs metni, dere boyunca döndürülmüş italik (bilgi değil). */}
      <text
        transform="translate(322 952) rotate(-36)"
        textAnchor="middle"
        fill={R.murekkep}
        fillOpacity="0.5"
        style={{ fontFamily: 'var(--hr-italik)', fontStyle: 'italic', fontSize: 26, letterSpacing: '0.3em' }}
      >
        Serin Dere
      </text>
    </svg>
  );
}
