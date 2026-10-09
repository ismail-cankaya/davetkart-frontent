import React, { useId } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { SunnetMotionStyles } from './motion';

interface SacakProps {
  /** Her dilimin iki yarısı: pelerin ve astar. */
  stripes: readonly [string, string];
  /** Üst bant ve dilim kenarındaki sırma. */
  trim: string;
  /** Püskül ve pullar. */
  tassel: string;
  /** Zarf açılınca yukarıdan sarkar. */
  revealed: boolean;
  /** Saçağa asılan öğeler (fener) — saçakla birlikte iner. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Otağ saçağı: dilimli, iki renk şeritli tente kenarı; dilim aralarında püskül.
 *
 * Desen `userSpaceOnUse` döşemedir: kadraj ne kadar geniş olursa olsun
 * dilimler 44 px kalır, çoğalır; esneyip yayvanlaşmaz. Döşemenin başlangıcı
 * ortaya alınır ki tam ortada bir dilim dursun ve iki kenar simetrik kesilsin.
 */
export function Sacak({ stripes, trim, tassel, revealed, children, className }: SacakProps) {
  const id = `sunnet-sacak-${useId().replace(/:/g, '')}`;

  return (
    <motion.div
      aria-hidden="true"
      className={cn('absolute inset-x-0 top-0 h-[60px] pointer-events-none', className)}
      initial={{ y: '-110%' }}
      animate={{ y: revealed ? '0%' : '-110%' }}
      transition={{ type: 'spring', stiffness: 70, damping: 13, delay: 0.15 }}
    >
      <SunnetMotionStyles />
      {/* Asılı öğeler kumaşın arkasından sarkar: ipleri dilimlerin altında başlar. */}
      {children}
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        style={{ filter: 'drop-shadow(0 8px 10px rgba(10,16,50,0.22))' }}
      >
        <defs>
          <pattern
            id={id}
            x="50%"
            y="0"
            width="44"
            height="60"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(-22 0)"
          >
            <path d="M0 0H22V58A22 22 0 0 1 0 36Z" fill={stripes[0]} />
            <path d="M22 0H44V36A22 22 0 0 1 22 58Z" fill={stripes[1]} />
            <path d="M0 36A22 22 0 0 0 44 36" stroke={trim} strokeWidth="2" fill="none" />
            <rect width="44" height="7" fill={trim} />
            <circle cx="11" cy="3.5" r="1.3" fill={tassel} />
            <circle cx="33" cy="3.5" r="1.3" fill={tassel} />
            {/* Püskül dilim birleşiminde: döşeme kenarı onu ikiye böler,
                komşu döşemenin yarısıyla tamamlanır. */}
            {[0, 44].map((x) => (
              <g key={x} fill={tassel}>
                <rect x={x - 0.6} y="36" width="1.2" height="10" />
                <path d={`M${x} 45c-2.6 0-3.4 3.8-3 8.2h6c.4-4.4-.4-8.2-3-8.2Z`} />
              </g>
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </motion.div>
  );
}

interface FenerProps {
  /** Pirinç gövde (kapak, kaburga, ip). */
  metal: string;
  /** Cam rengi. */
  glass: string;
  /** Işık halesi (rgb üçlüsü). */
  light: string;
  /** İp uzunluğu (px) — fenerler farklı boyda asılır. */
  cord: number;
  /** Salınım faz kayması (s); iki fener aynı anda sallanmasın. */
  phase?: number;
  className?: string;
}

/** Saçaktan sarkan kandil feneri: ipinden sallanır, camı nefes alır. */
export function Fener({ metal, glass, light, cord, phase = 0, className }: FenerProps) {
  return (
    <div
      data-atmosphere=""
      className={cn('sunnet-sway-hang absolute top-7 flex flex-col items-center', className)}
      style={{ animationDelay: `${-phase}s` }}
    >
      <span className="block w-px" style={{ height: cord, background: metal }} />
      <div className="relative">
        <span
          data-atmosphere=""
          className="sunnet-glow absolute left-1/2 top-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
          style={{ background: `radial-gradient(circle, rgba(${light},0.55), rgba(${light},0) 70%)` }}
        />
        <svg width="26" height="46" viewBox="0 0 26 46" fill="none" className="relative">
          <path d="M9 1h8l-1.2 4.5h-5.6Z" fill={metal} />
          <path
            d="M13 5.5C6 8.5 3.2 15 3.2 21.5c0 7 3.8 12.2 9.8 15.5 6-3.3 9.8-8.5 9.8-15.5 0-6.5-2.8-13-9.8-16Z"
            fill={glass}
            stroke={metal}
            strokeWidth="1.2"
          />
          <path
            d="M13 8.5v26M8 13c1.8 5.5 1.8 12 0 17.5M18 13c-1.8 5.5-1.8 12 0 17.5"
            stroke={metal}
            strokeWidth="0.8"
            strokeOpacity="0.7"
          />
          <path d="M10.2 37.5h5.6l-1 4h-3.6Z" fill={metal} />
          <circle cx="13" cy="44" r="1.3" fill={metal} />
        </svg>
      </div>
    </div>
  );
}
