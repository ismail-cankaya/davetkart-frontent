import React, { useId } from 'react';
import { HARITA_RENK as R } from '../palet';
import { lekeIciNoktalar, lekeYolu, type Leke } from './cizim';

/**
 * Arazi ekseninin nişan yorumu: iki derenin birleştiği yer — kavuşak. İki vadi
 * ortadaki sırtın iki yanından iner, dereleri kavuşakta tek ırmak olur. Tonlar:
 * arazi, park (koru), su; rota kapakta ayrı katmandır. Kır Arazisi'yle aynı
 * çizim dili (eş yükselti, koru, tarla), başka bir yer: gölet yok, iki kol var.
 *
 * Tuval 1200 × 1500, `slice`. Kavuşak (740, 820) ve iki kolun son kıvrımları her
 * kadrajın görünen çekirdeğindedir. Gerçek bir yer değildir.
 */

interface Tepe extends Leke {
  halka: number;
  kayma: [number, number];
}

const TEPELER: Tepe[] = [
  // İki derenin arasındaki sırt.
  { cx: 690, cy: 420, rx: 230, ry: 150, aci: 8, tohum: 113, puruz: 0.1, halka: 6, kayma: [-4, 6] },
  { cx: 300, cy: 1040, rx: 260, ry: 190, aci: -18, tohum: 127, puruz: 0.11, halka: 7, kayma: [5, -4] },
  { cx: 1060, cy: 1180, rx: 210, ry: 160, aci: 14, tohum: 131, puruz: 0.12, halka: 5, kayma: [-5, -3] },
  { cx: 140, cy: 220, rx: 170, ry: 120, aci: -24, tohum: 137, puruz: 0.12, halka: 4, kayma: [4, 4] }
];

const KORULAR: Leke[] = [
  { cx: 1040, cy: 200, rx: 170, ry: 110, aci: 10, tohum: 151, puruz: 0.17 },
  { cx: 190, cy: 640, rx: 130, ry: 105, aci: -6, tohum: 152, puruz: 0.18 },
  { cx: 760, cy: 1380, rx: 200, ry: 100, aci: 4, tohum: 153, puruz: 0.16 },
  { cx: 980, cy: 700, rx: 95, ry: 80, aci: 20, tohum: 154, puruz: 0.18 }
];

const TARLALAR: { kose: string; aci: number; aralik: number }[] = [
  { kose: 'M820 900L1060 870L1090 1010L850 1050Z', aci: -14, aralik: 12 },
  { kose: 'M330 380L520 350L545 520L355 550Z', aci: 22, aralik: 14 },
  { kose: 'M40 1300L260 1270L285 1450L60 1480Z', aci: 6, aralik: 11 }
];

/** Sol kol: kuzeybatıdan iner. Sağ kol: kuzeydoğudan. Kavuşaktan sonra ırmak güneye akar. */
const SOL_KOL = 'M-20 300C120 330 200 380 280 450C360 520 420 600 520 690C600 760 680 800 740 820';
const SAG_KOL = 'M1220 360C1140 420 1080 500 1020 580C960 660 880 740 740 820';
const IRMAK = 'M740 820C720 900 700 960 640 1040C580 1120 560 1200 520 1300C490 1380 470 1450 440 1520';
const KAVUSAK = { x: 740, y: 820 };
const PATIKA = 'M-20 820C120 800 220 760 300 790C380 820 430 900 470 980';

const HALKALAR = TEPELER.flatMap((tepe) =>
  Array.from({ length: tepe.halka }, (_, i) => ({
    d: lekeYolu(tepe, 1 - (i / tepe.halka) * 0.82, [tepe.kayma[0] * i, tepe.kayma[1] * i]),
    ana: i % 3 === 0
  }))
);
const KORU_YOLLARI = KORULAR.map((k) => lekeYolu(k));
const AGACLAR = KORULAR.flatMap((k) => lekeIciNoktalar(k, 30));

export function KavusakArazisi({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const sira = (i: number) => `hr-kv${i}-${uid}`;

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
        <path key={i} d={t.kose} fill={`url(#${sira(i)})`} stroke={R.murekkep} strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="7 6" />
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

      <path d={PATIKA} fill="none" stroke={R.murekkep} strokeOpacity="0.32" strokeWidth="2" strokeDasharray="10 7" strokeLinecap="round" />

      {/* İki kol ince, ırmak kalın: kavuşakta su çoğalır. */}
      <g fill="none" stroke={R.su} strokeLinecap="round">
        <path d={SOL_KOL} strokeWidth="15" />
        <path d={SAG_KOL} strokeWidth="15" />
        <path d={IRMAK} strokeWidth="26" />
      </g>
      <circle cx={KAVUSAK.x} cy={KAVUSAK.y} r="17" fill={R.su} />
      <g fill="none" stroke={R.murekkep} strokeOpacity="0.12" strokeWidth="1" strokeDasharray="1 9" strokeLinecap="round">
        <path d={SOL_KOL} />
        <path d={SAG_KOL} />
        <path d={IRMAK} />
      </g>

      {/* Su adı: süs metni, ırmak boyunca döndürülmüş italik (bilgi değil). */}
      <text
        transform="translate(630 1150) rotate(-64)"
        textAnchor="middle"
        fill={R.murekkep}
        fillOpacity="0.5"
        style={{ fontFamily: 'var(--hr-italik)', fontStyle: 'italic', fontSize: 26, letterSpacing: '0.3em' }}
      >
        Kavuşak
      </text>
    </svg>
  );
}
