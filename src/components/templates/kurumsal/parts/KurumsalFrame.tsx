import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { KURUMSAL_EASE } from './theme';

interface KurumsalFrameProps {
  /** Çizgi rengi (CSS rengi). Koyu zeminde açık, açık zeminde koyu verilir. */
  color: string;
  /** Zarf açılmaya başladığında `true`; işaretler o anda yerine oturur. */
  revealed?: boolean;
  /** Kenar cetvelini çizer; kendi çerçevesi olan hero'larda kapatılır. */
  ruler?: boolean;
  className?: string;
}

const CORNERS = [
  { key: 'tl', className: 'top-0 left-0', d: 'M1 17V1h16' },
  { key: 'tr', className: 'top-0 right-0', d: 'M1 1h16v16' },
  { key: 'br', className: 'bottom-0 right-0', d: 'M17 1v16H1' },
  { key: 'bl', className: 'bottom-0 left-0', d: 'M17 17H1V1' }
] as const;

/** Cetvel çentikleri: her 2.5 %'te bir, her dördüncüsü uzun. */
const TICKS = Array.from({ length: 41 }, (_, i) => ({ y: i * 2.5, long: i % 4 === 0 }));

/**
 * Kesim işaretli kadraj — kategorinin imza katmanı.
 *
 * Baskı provasındaki köşe kesim işaretleri ve kenar cetveli: davetin
 * "ölçülüp biçilmiş" bir belge olduğunu söyler. Hero arka planında, metnin
 * ARKASINDA durur; içerikle hiçbir zaman yarışmaz.
 */
export function KurumsalFrame({ color, revealed = true, ruler = true, className }: KurumsalFrameProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-3 @sm:inset-5 pointer-events-none', className)}
      style={{ color }}
    >
      {CORNERS.map((corner, i) => (
        <motion.svg
          key={corner.key}
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className={cn('absolute', corner.className)}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.7, ease: KURUMSAL_EASE, delay: 0.15 + i * 0.06 }}
        >
          <path d={corner.d} stroke="currentColor" strokeWidth="1" />
        </motion.svg>
      ))}

      {ruler && (
        <motion.svg
          viewBox="0 0 10 100"
          preserveAspectRatio="none"
          className="absolute right-0 top-[12%] h-[76%] w-2.5 origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: revealed ? 1 : 0 }}
          transition={{ duration: 1.2, ease: KURUMSAL_EASE, delay: 0.35 }}
        >
          <path d="M10 0V100" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {TICKS.map((tick) => (
            <path
              key={tick.y}
              d={`M${tick.long ? 2 : 6} ${tick.y}H10`}
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </motion.svg>
      )}
    </div>
  );
}
