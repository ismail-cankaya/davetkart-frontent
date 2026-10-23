import React from 'react';
import { HARITA_RENK as R } from '../palet';
import { lekeIciNoktalar, lekeYolu, tohumlu, type Leke } from './cizim';

/**
 * Şehir planı ekseninin ikinci yorumu: kurgusal bir çarşı. Kıyı Kenti'nin
 * (`SehirPlani`) suyu ve düzenli ızgarası yok; dolu yapı adaları (`blok`),
 * düzensiz aralıklı sokaklar (bazıları kesilir, adalar birleşir), bir bulvar,
 * iki meydan ve iki park. Tonlar: blok, yol, park, arazi (meydan içi).
 *
 * Tuval 1200 × 1500, `slice`; bulvar ve meydanlar çekirdektedir
 * (x 307–893, y 307–1192). Gerçek bir yer değildir; sokak adı yoktur.
 */

const BULVAR = 'M-20 1210L1220 330';
const MEYDANLAR: [number, number, number][] = [
  [600, 787, 64],
  [330, 470, 44]
];
const PARKLAR: Leke[] = [
  { cx: 860, cy: 1090, rx: 130, ry: 92, aci: -36, tohum: 91, puruz: 0.1 },
  { cx: 300, cy: 1180, rx: 96, ry: 70, aci: 8, tohum: 92, puruz: 0.12 }
];

/**
 * Sokaklar: hafif eğik yatay çizgiler düzensiz aralıkla; dikeyler yataylar
 * arasında parça parça çizilir ve parçaların ~%22'si atlanır (iki ada birleşir).
 * Hepsi tek yol dizgisi.
 */
const SOKAKLAR = (() => {
  const r = tohumlu(93);
  const yataylar: { y: number; egim: number }[] = [];
  for (let y = -10; y < 1560; ) {
    y += 96 + r() * 84;
    yataylar.push({ y, egim: -40 + (r() - 0.5) * 50 });
  }
  const yAt = (s: { y: number; egim: number }, x: number) => s.y + s.egim * ((x + 40) / 1280);
  const parcalar: string[] = yataylar.map((s) => `M-40 ${Math.round(s.y)}L1240 ${Math.round(s.y + s.egim)}`);
  for (let x = -20; x < 1240; ) {
    x += 84 + r() * 80;
    const kayma = (r() - 0.5) * 36;
    for (let i = 0; i < yataylar.length - 1; i++) {
      if (r() < 0.22) continue;
      const x1 = x + kayma * (i / yataylar.length);
      const x2 = x + kayma * ((i + 1) / yataylar.length);
      parcalar.push(`M${Math.round(x1)} ${Math.round(yAt(yataylar[i], x1))}L${Math.round(x2)} ${Math.round(yAt(yataylar[i + 1], x2))}`);
    }
  }
  return parcalar.join('');
})();

const PARK_YOLLARI = PARKLAR.map((p) => lekeYolu(p));
const AGACLAR = PARKLAR.flatMap((p) => lekeIciNoktalar(p, 30))
  .map(([x, y]) => `M${x - 7} ${y}a7 7 0 1 0 14 0a7 7 0 1 0-14 0M${x} ${y + 7}v6`)
  .join('');

/** Bir caddeyi kenarıyla çizer: önce mürekkep kenar, üstüne beyaz. */
function Cadde({ d, en }: { d: string; en: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={R.murekkep} strokeOpacity="0.22" strokeWidth={en + 4} strokeLinecap="square" />
      <path d={d} fill="none" stroke={R.yol} strokeWidth={en} strokeLinecap="square" />
    </>
  );
}

export function CarsiPlani({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 1500" preserveAspectRatio="xMidYMid slice" className={className ?? 'absolute inset-0 h-full w-full'}>
      <rect x="-20" y="-20" width="1240" height="1540" fill={R.blok} />
      <Cadde d={SOKAKLAR} en={12} />
      <Cadde d={BULVAR} en={26} />

      {PARK_YOLLARI.map((d, i) => (
        <path key={i} d={d} fill={R.park} stroke={R.murekkep} strokeOpacity="0.25" strokeWidth="1.6" />
      ))}
      <path d={AGACLAR} fill="none" stroke={R.murekkep} strokeOpacity="0.3" strokeWidth="1.6" strokeLinecap="round" />

      {/* Meydanlar: beyaz halka, arazi renginde iç, ortada küçük anıt halkası. */}
      {MEYDANLAR.map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={r} fill={R.arazi} stroke={R.murekkep} strokeOpacity="0.22" strokeWidth="22" />
          <circle cx={x} cy={y} r={r} fill="none" stroke={R.yol} strokeWidth="18" />
          <circle cx={x} cy={y} r={r * 0.22} fill="none" stroke={R.murekkep} strokeOpacity="0.35" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}
