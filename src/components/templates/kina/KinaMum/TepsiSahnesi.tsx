import React, { useId } from 'react';
import { motion } from 'motion/react';
import { ease } from '../../../../utils/motion';
import { KinaMotionStyles } from '../parts/motion';

/** [x, taban y, boy, en, renk] — arka sıra, orta, ön sıra (çizim sırası). */
type Mum = readonly [number, number, number, number, string];
const ARKA: Mum[] = [
  [95, 156, 34, 9, '#fbe9d2'],
  [140, 150, 40, 10, '#c8402f'],
  [260, 150, 40, 10, '#fbe9d2'],
  [305, 156, 34, 9, '#c8402f']
];
const ORTA: Mum = [200, 140, 46, 12, '#fbe9d2'];
const ON: Mum[] = [
  [62, 172, 38, 11, '#fbe9d2'],
  [120, 182, 44, 12, '#c8402f'],
  [280, 182, 44, 12, '#fbe9d2'],
  [338, 172, 38, 11, '#c8402f']
];

function Mumlar({ list, glow }: { list: Mum[]; glow: string }) {
  return (
    <>
      {list.map(([x, y, h, w, color], i) => (
        <g key={x}>
          <rect x={x - w / 2} y={y - h} width={w} height={h} rx={1.5} fill={color} />
          <rect x={x - w / 2} y={y - h} width={w * 0.32} height={h} rx={1.5} fill="#000" fillOpacity="0.12" />
          <ellipse cx={x} cy={y - h} rx={w / 2} ry={1.6} fill="#fff8ec" fillOpacity="0.6" />
          <path d={`M${x} ${y - h}v-3`} stroke="#3a1a0e" strokeWidth="1" />
          <circle data-atmosphere="" className="kina-glow" cx={x} cy={y - h - 9} r={16} fill={`url(#${glow})`} style={{ animationDelay: `${-i * 0.8}s` }} />
          <g transform={`translate(${x} ${y - h - 2})`}>
            <g data-atmosphere="" className="kina-flicker" style={{ animationDelay: `${-i * 0.6}s` }}>
              <path d="M0-13C3.8-8.4 4.4-3.8 0 0C-4.4-3.8-3.8-8.4 0-13Z" fill="#ffc35f" />
              <path d="M0-7C1.8-4.6 2-2.4 0 0C-2-2.4-1.8-4.6 0-7Z" fill="#fff4d6" />
            </g>
          </g>
        </g>
      ))}
    </>
  );
}

/**
 * "Kına Tepsisi" — bakır tepside yoğrulmuş kına ve çevresinde yanan mumlar.
 * Tepsi tepede sabit boyda durur (`meet`: genişlikle büyümez), ilk ekranda
 * görünür; metin altındaki karanlıkta. Alevler titrer.
 */
export function TepsiSahnesi({ revealed }: { revealed: boolean }) {
  const uid = useId().replace(/:/g, '');
  const copper = `kina-bakir-${uid}`;
  const henna = `kina-hamur-${uid}`;
  const glow = `kina-alev-${uid}`;
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'radial-gradient(110% 45% at 50% 12%, #4a1e0c 0%, #261008 50%, #170a05 100%)' }}
    >
      <KinaMotionStyles />
      {/* Mumların tavana vuran ışığı. */}
      <div
        data-atmosphere=""
        className="kina-glow absolute left-1/2 top-[130px] @md:top-[160px] w-[520px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{ background: 'radial-gradient(closest-side, rgba(255,170,90,0.35), rgba(255,170,90,0))', animationDuration: '5s' }}
      />
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-x-0 top-6 @md:top-10 w-full h-[170px] @md:h-[220px]"
        initial={{ y: -20, opacity: 0 }}
        animate={revealed ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
        transition={{ duration: 1.4, ease: ease.out }}
      >
        <defs>
          <linearGradient id={copper} x1="0" x2="1">
            <stop offset="0%" stopColor="#7a3a18" />
            <stop offset="45%" stopColor="#e0955a" />
            <stop offset="70%" stopColor="#b8642e" />
            <stop offset="100%" stopColor="#6a3014" />
          </linearGradient>
          <radialGradient id={henna} cx="45%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#d06a2a" />
            <stop offset="70%" stopColor="#a8461a" />
            <stop offset="100%" stopColor="#6e2a0e" />
          </radialGradient>
          <radialGradient id={glow}>
            <stop offset="0%" stopColor="#ffc35f" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffc35f" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M30 168Q30 188 200 196Q370 188 370 168Z" fill="#5a2810" />
        <ellipse cx="200" cy="168" rx="170" ry="26" fill={`url(#${copper})`} />
        <ellipse cx="200" cy="166" rx="152" ry="20" fill="#3e1a0c" />
        <ellipse cx="200" cy="166" rx="152" ry="20" fill="none" stroke="#f2b07a" strokeOpacity="0.35" strokeWidth="0.8" />
        <Mumlar list={ARKA} glow={glow} />
        <path d="M148 168Q158 138 200 134Q242 138 252 168Z" fill={`url(#${henna})`} />
        <Mumlar list={[ORTA]} glow={glow} />
        <Mumlar list={ON} glow={glow} />
      </motion.svg>
    </div>
  );
}
