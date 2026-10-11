import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { ease } from '../../../../utils/motion';
import { SunnetMotionStyles } from './motion';

/** Kuşak renkleri: saten zemin, üstündeki yazı, kenardaki sırma dikiş. */
export interface KusakColors {
  /** CSS background — düz renk ya da degrade. */
  fill: string;
  ink: string;
  stitch: string;
}

/** Kırlangıç kuyruklu uçlar; yükseklik ne olursa olsun çentik aynı derinlikte. */
const NOTCHED = 'polygon(0 0, 100% 0, calc(100% - 12px) 50%, 100% 100%, 0 100%, 12px 50%)';

interface KusakProps {
  colors: KusakColors;
  children: React.ReactNode;
  /** Açılma gecikmesi (s). */
  delay?: number;
  className?: string;
}

/**
 * Maşallah kuşağından türetilen etiket şeridi — kategorinin tipografik aygıtı.
 *
 * Ortadan iki yana açılır (scaleX; "hareketi azalt"ta MotionConfig atlar),
 * yazı açılış bitince belirir. Kenarlarda kesikli sırma, üstünden arada bir
 * saten parıltısı geçer. Uzun başlık iki satıra kırılır; çentik bozulmaz.
 */
export function Kusak({ colors, children, delay = 0, className }: KusakProps) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: ease.out, delay }}
      className={cn('relative inline-flex max-w-full', className)}
      style={{ filter: 'drop-shadow(0 6px 10px rgba(10,14,40,0.2))' }}
    >
      <SunnetMotionStyles />
      <span
        className="relative block overflow-hidden px-8 @sm:px-10 py-2.5 text-center text-[10px] @sm:text-[11px] font-semibold uppercase tracking-[0.28em] leading-relaxed text-balance"
        style={{ background: colors.fill, color: colors.ink, clipPath: NOTCHED }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-3.5 top-[3px] border-t border-dashed"
          style={{ borderColor: colors.stitch }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-3.5 bottom-[3px] border-b border-dashed"
          style={{ borderColor: colors.stitch }}
        />
        <span
          aria-hidden="true"
          data-atmosphere=""
          className="sunnet-sheen absolute inset-y-0 left-0 w-1/3 pointer-events-none"
          style={{ background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.32), transparent)' }}
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: ease.out, delay: delay + 0.45 }}
          // Son harfin izleme boşluğu metni sola kaydırır; negatif pay ortalar.
          className="relative inline-block mr-[-0.28em]"
        >
          {children}
        </motion.span>
      </span>
    </motion.div>
  );
}
