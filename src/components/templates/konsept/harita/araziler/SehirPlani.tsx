import React, { useId } from 'react';
import { HARITA_RENK as R } from '../palet';
import { lekeYolu } from './cizim';

/**
 * Şehir planı ekseni: kurgusal bir kıyı kenti. Tonlar: arazi (zemin ve
 * bloklar), yol (sokaklar, kordon), su; rota kapakta ayrı katmandır.
 * Sokakların ince kenarı mürekkebin şeffaf hâlidir (ton değil, çizgi).
 *
 * Çizim 1200 × 1500'lük bir tuvaldir ve `slice` ile kadrajı doldurur:
 * dikey telefonda x 307–893, yatay ekranda y 307–1192 her zaman görünür;
 * kıyı, bulvar ve meydan bu çekirdektedir. Gerçek bir yer değildir.
 */

const BULVAR = 'M-20 1240L1220 120';
const DIK_CADDE = 'M180 330L760 980';
const CEVRE_YOLU = 'M-20 560C200 520 380 380 470 160C510 60 520 0 520-20';
const GUNEY_CADDESI = 'M150 1520C300 1330 470 1190 790 1150';
const KIYI =
  'M1220 300C1100 330 1000 420 940 520C890 600 900 680 840 760C790 830 730 880 730 980C730 1060 800 1090 790 1160C780 1240 690 1280 620 1340C570 1385 540 1440 530 1520';
const DENIZ = `${KIYI}L1220 1520Z`;
const ADA = lekeYolu({ cx: 1060, cy: 900, rx: 72, ry: 40, aci: -20, tohum: 7, puruz: 0.14 });
const DALGALAR: [number, number][] = [
  [960, 760], [1100, 560], [1010, 1210], [1130, 1040], [935, 1010], [1120, 1380], [720, 1450], [880, 1330], [1080, 440]
];
const TEKNELER: [number, number][] = [[1000, 1110], [1125, 760]];

/** Bir caddeyi kenarıyla çizer: önce mürekkep kenar, üstüne beyaz. */
function Cadde({ d, en }: { d: string; en: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={R.murekkep} strokeOpacity="0.2" strokeWidth={en + 4} strokeLinecap="round" />
      <path d={d} fill="none" stroke={R.yol} strokeWidth={en} strokeLinecap="round" />
    </>
  );
}

export function SehirPlani({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const izgaraA = `hr-sa-${uid}`;
  const izgaraB = `hr-sb-${uid}`;
  const bolgeA = `hr-ka-${uid}`;
  const bolgeB = `hr-kb-${uid}`;

  return (
    <svg aria-hidden="true" viewBox="0 0 1200 1500" preserveAspectRatio="xMidYMid slice" className={className ?? 'absolute inset-0 h-full w-full'}>
      <defs>
        {/* Eski şehir: uzun bloklar, hafif eğik. */}
        <pattern id={izgaraA} width="62" height="94" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
          <path d="M31 0V94M0 47H62" stroke={R.murekkep} strokeOpacity="0.2" strokeWidth="9.5" />
          <path d="M31 0V94M0 47H62" stroke={R.yol} strokeWidth="7" />
        </pattern>
        {/* Kıyı mahallesi: bulvara dik, enli bloklar. */}
        <pattern id={izgaraB} width="84" height="58" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
          <path d="M42 0V58M0 29H84" stroke={R.murekkep} strokeOpacity="0.2" strokeWidth="9.5" />
          <path d="M42 0V58M0 29H84" stroke={R.yol} strokeWidth="7" />
        </pattern>
        <clipPath id={bolgeA}>
          <path d="M-20-20H1220V120L-20 1240Z" />
        </clipPath>
        <clipPath id={bolgeB}>
          <path d="M-20 1240L1220 120V1520H-20Z" />
        </clipPath>
      </defs>

      <rect x="-20" y="-20" width="1240" height="1540" fill={R.arazi} />
      <rect x="-20" y="-20" width="1240" height="1540" fill={`url(#${izgaraA})`} clipPath={`url(#${bolgeA})`} />
      <rect x="-20" y="-20" width="1240" height="1540" fill={`url(#${izgaraB})`} clipPath={`url(#${bolgeB})`} />

      {/* Meydanlar ızgarayı kırar. */}
      <g fill={R.yol} stroke={R.murekkep} strokeOpacity="0.2" strokeWidth="2">
        <rect x="350" y="450" width="74" height="50" transform="rotate(-8 387 475)" />
        <rect x="258" y="1100" width="64" height="44" transform="rotate(42 290 1122)" />
      </g>

      <Cadde d={CEVRE_YOLU} en={14} />
      <Cadde d={GUNEY_CADDESI} en={14} />
      <Cadde d={DIK_CADDE} en={16} />
      <Cadde d={BULVAR} en={18} />

      {/* Göbek: bulvarla dik caddenin kesiştiği yer. */}
      <circle cx="540" cy="734" r="45" fill="none" stroke={R.murekkep} strokeOpacity="0.2" strokeWidth="22" />
      <circle cx="540" cy="734" r="45" fill="none" stroke={R.yol} strokeWidth="18" />
      <circle cx="540" cy="734" r="35" fill={R.arazi} />
      <circle cx="540" cy="734" r="11" fill="none" stroke={R.murekkep} strokeOpacity="0.3" strokeWidth="2" />

      {/* Kordon: kıyı çizgisinin geniş beyaz izi; denizin altında kalan yarısı örtülür. */}
      <path d={KIYI} fill="none" stroke={R.murekkep} strokeOpacity="0.2" strokeWidth="40" />
      <path d={KIYI} fill="none" stroke={R.yol} strokeWidth="36" />
      <path d={DENIZ} fill={R.su} />
      <path d={KIYI} fill="none" stroke={R.murekkep} strokeOpacity="0.35" strokeWidth="1.6" />

      <path d={ADA} fill={R.arazi} stroke={R.murekkep} strokeOpacity="0.35" strokeWidth="1.6" />

      {/* İskele ve ucundaki fener. */}
      <Cadde d="M902 596L1030 582" en={12} />
      <g transform="translate(1016 548) scale(1.4)" fill="none" stroke={R.murekkep} strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9.5 21 1.2-11h2.6l1.2 11z M9 10h6M10.5 6.5h3V10h-3zM12 4v2.5" />
      </g>

      <g fill="none" stroke={R.yol} strokeOpacity="0.75" strokeWidth="2.4" strokeLinecap="round">
        {DALGALAR.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y}q6-5 12 0t12 0`} />
        ))}
      </g>
      <g fill={R.murekkep} fillOpacity="0.5">
        {TEKNELER.map(([x, y]) => (
          <path key={`${x}-${y}`} transform={`translate(${x} ${y})`} d="M-11 0h22l-5 6h-12zM-1-3V-22L10-4z" />
        ))}
      </g>

      {/* Su adı: süs metni, kıyı boyunca döndürülmüş italik (bilgi değil). */}
      <text
        transform="translate(830 1262) rotate(-58)"
        textAnchor="middle"
        fill={R.murekkep}
        fillOpacity="0.5"
        style={{ fontFamily: 'var(--hr-italik)', fontStyle: 'italic', fontSize: 30, letterSpacing: '0.32em' }}
      >
        Sakin Sular
      </text>
    </svg>
  );
}
