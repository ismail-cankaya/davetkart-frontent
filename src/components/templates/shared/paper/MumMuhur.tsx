import React, { useId } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { ease } from '../../../../utils/motion';

/**
 * Mum mühür — SVG, renk ve baş harf parametreli.
 *
 * Katmanlar: taşmış mumun düzensiz kenarı → ışık/gölge yuvarlaması →
 * mührün bastırdığı çukur (iç halka) → kabartma nokta halkası → harfler.
 * Kabartma filtreyle değil, harfin üç kopyasıyla yapılır (koyu alt-sağ,
 * açık üst-sol, mum renginde üst yüz): filtre her boyamada yeniden hesaplanır.
 *
 * Kırılma: mühür iki kez çizilir ve zikzak bir çatlaktan iki parçaya kesilir.
 * `kirik` olunca parçalar ayrılıp söner — yalnızca transform ve opaklık.
 */

const BICIMLER = [
  { a: 3.2, b: 2.2, c: 1.4, f1: 5, f2: 9, f3: 17, faz: 0.4 },
  { a: 2.6, b: 2.8, c: 1.2, f1: 6, f2: 11, f3: 19, faz: 1.7 },
  { a: 3.6, b: 1.6, c: 1.6, f1: 4, f2: 7, f3: 15, faz: 2.9 }
] as const;

/** Taşmış mumun kenarı: üç frekanslı dalgalı bir daire, yumuşak eğrilerle. */
const KENARLAR = BICIMLER.map(({ a, b, c, f1, f2, f3, faz }) => {
  const n = 72;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    const r = 50 + a * Math.sin(f1 * t + faz) + b * Math.sin(f2 * t + faz * 2) + c * Math.sin(f3 * t + faz * 3);
    return [60 + Math.cos(t) * r, 60 + Math.sin(t) * r] as const;
  });
  const orta = (p: readonly [number, number], q: readonly [number, number]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const bas = orta(pts[n - 1], pts[0]);
  let d = `M${bas[0].toFixed(1)} ${bas[1].toFixed(1)}`;
  pts.forEach((p, i) => {
    const m = orta(p, pts[(i + 1) % n]);
    d += ` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  });
  return d + ' Z';
});

/** Çatlak: yukarıdan aşağı zikzak (yüzde). Sol parça çatlağı 0.6 birim aşar, dikiş görünmez. */
const CATLAK = [
  [52, 0], [47, 17], [55, 33], [46, 51], [54, 68], [48, 85], [51, 100]
] as const;
const SOL_PARCA = `polygon(0 0, ${CATLAK.map(([x, y]) => `${x + 0.6}% ${y}%`).join(', ')}, 0 100%)`;
const SAG_PARCA = `polygon(${CATLAK.map(([x, y]) => `${x}% ${y}%`).join(', ')}, 100% 100%, 100% 0)`;

function Muhur({ harfler, renk, bicim, uid }: { harfler: string; renk: string; bicim: 0 | 1 | 2; uid: string }) {
  const harfBoyu = harfler.length > 1 ? 29 : 36;
  const harfStili = { fontFamily: 'var(--kg-baslik-font, "Cormorant Garamond", Georgia, serif)', fontWeight: 600 };

  return (
    <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full overflow-visible">
      <defs>
        <radialGradient id={`${uid}-isik`} cx="36%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-golge`} cx="66%" cy="72%" r="65%">
          <stop offset="35%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
        </radialGradient>
        <linearGradient id={`${uid}-cukur`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.32" />
        </linearGradient>
      </defs>
      <path d={KENARLAR[bicim]} style={{ fill: renk }} />
      <path d={KENARLAR[bicim]} fill={`url(#${uid}-isik)`} />
      <path d={KENARLAR[bicim]} fill={`url(#${uid}-golge)`} />
      {/* Bastırılmış çukur: üst-sol iç kenar gölgede, alt-sağ ışıkta. */}
      <circle cx="60" cy="60" r="35" fill="#000" fillOpacity="0.09" />
      <circle cx="60" cy="60" r="35" fill="none" stroke={`url(#${uid}-cukur)`} strokeWidth="2.6" />
      {/* Kabartma nokta halkası. */}
      <circle cx="60.5" cy="60.6" r="29.5" fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="1.6" strokeDasharray="0.01 3.85" strokeLinecap="round" />
      <circle cx="60" cy="60" r="29.5" fill="none" stroke="#fff" strokeOpacity="0.32" strokeWidth="1.4" strokeDasharray="0.01 3.85" strokeLinecap="round" />
      {harfler && (
        <g textAnchor="middle" dominantBaseline="central" fontSize={harfBoyu} style={harfStili}>
          <text x="61.3" y="61.6" fill="#000" fillOpacity="0.55">{harfler}</text>
          <text x="59.1" y="59" fill="#fff" fillOpacity="0.5">{harfler}</text>
          <text x="60" y="60" style={{ fill: renk }}>{harfler}</text>
          <text x="60" y="60" fill="#fff" fillOpacity="0.14">{harfler}</text>
        </g>
      )}
    </svg>
  );
}

interface MumMuhurProps {
  /** Ortadaki 1–2 harf; `basHarfler()` ile üretin. Boşsa yalnızca desen. */
  harfler?: string;
  /** Mum rengi; verilmezse setin mumu. */
  renk?: string;
  /** px. */
  boyut?: number;
  /** Mum kenarının biçimi; aynı sayfadaki iki mühür farklı olmalı. */
  bicim?: 0 | 1 | 2;
  /** `true` olunca mühür ikiye ayrılıp söner. */
  kirik?: boolean;
  className?: string;
}

export function MumMuhur({ harfler = '', renk = 'var(--kg-mum)', boyut = 72, bicim = 0, kirik = false, className }: MumMuhurProps) {
  const uid = useId().replace(/:/g, '');
  const parcaGecisi = { duration: 0.3, ease: ease.out };

  return (
    <div aria-hidden="true" className={cn('relative shrink-0', className)} style={{ width: boyut, height: boyut }}>
      {/* Bütün mühür: kırılınca anında gizlenir, yerini parçalar alır. */}
      <div className="absolute inset-0" style={{ opacity: kirik ? 0 : 1 }}>
        <Muhur harfler={harfler} renk={renk} bicim={bicim} uid={`${uid}a`} />
      </div>
      {kirik && (
        <>
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: SOL_PARCA }}
            initial={{ opacity: 1, x: 0, rotate: 0 }}
            animate={{ opacity: 0, x: -boyut * 0.14, y: boyut * 0.04, rotate: -14 }}
            transition={parcaGecisi}
          >
            <Muhur harfler={harfler} renk={renk} bicim={bicim} uid={`${uid}b`} />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: SAG_PARCA }}
            initial={{ opacity: 1, x: 0, rotate: 0 }}
            animate={{ opacity: 0, x: boyut * 0.12, y: boyut * 0.06, rotate: 11 }}
            transition={parcaGecisi}
          >
            <Muhur harfler={harfler} renk={renk} bicim={bicim} uid={`${uid}c`} />
          </motion.div>
        </>
      )}
    </div>
  );
}
