import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { ease } from '../../../../utils/motion';
import { SectionTheme } from '../../shared/palette';
import { useCountdown } from '../../shared/useCountdown';
import { KinaMotionStyles } from './motion';
import { KINA } from './palette';

/** Mum alevi: dış alev + açık çekirdek; titreme iç <g>'de, tabandan. */
export function Alev({ color = KINA.mum, delay = 0, className }: { color?: string; delay?: number; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('relative block w-3 h-5', className)}>
      <span
        data-atmosphere=""
        className="kina-glow absolute left-1/2 top-[30%] w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
        style={{ backgroundColor: color, opacity: 0.45, animationDelay: `${delay}s` }}
      />
      <svg viewBox="0 0 12 20" className="relative w-full h-full overflow-visible">
        <g data-atmosphere="" className="kina-flicker" style={{ animationDelay: `${delay}s` }}>
          <path d="M6 1C9 5 10 9.5 9 13C8.2 16 7 17.5 6 18C5 17.5 3.8 16 3 13C2 9.5 3 5 6 1Z" fill={color} />
          <path d="M6 8C7.4 10 7.6 12.4 6 15C4.4 12.4 4.6 10 6 8Z" fill="#fff6dc" fillOpacity="0.85" />
        </g>
      </svg>
    </span>
  );
}

const UNITS = [
  { key: 'days', label: 'Gün' },
  { key: 'hours', label: 'Saat' },
  { key: 'minutes', label: 'Dakika' },
  { key: 'seconds', label: 'Saniye' }
] as const;

/**
 * Mum sayacı — kına tepsisinde yanan dört mum: her birim bir mum gövdesi,
 * tepesinde titreyen alev. Tarih geçersizse hiç çizilmez.
 */
export function MumSayac({
  date,
  timeZone,
  theme,
  flame,
  delay = 0,
  className
}: {
  date: string;
  timeZone: string;
  theme: SectionTheme;
  /** Alev rengi (hex). */
  flame?: string;
  delay?: number;
  className?: string;
}) {
  const countdown = useCountdown(date, timeZone);
  if (!countdown.valid) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: ease.out, delay }}
      className={cn('grid grid-cols-4 gap-2 @sm:gap-3 w-full max-w-[300px] @sm:max-w-[336px]', className)}
    >
      <KinaMotionStyles />
      {UNITS.map((unit, i) => (
        <div key={unit.key} className="relative flex flex-col items-center pt-5">
          <Alev color={flame} delay={-i * 0.7} className="absolute top-0 left-1/2 -translate-x-1/2" />
          <div
            className={cn(
              'relative w-full min-w-0 rounded-t-[12px] rounded-b-md border flex flex-col items-center px-1 pt-3 pb-2.5',
              theme.surface,
              theme.border
            )}
          >
            <span aria-hidden="true" className={cn('absolute -top-1 left-1/2 -translate-x-1/2 w-px h-1.5 opacity-60 bg-current', theme.body)} />
            <span className={cn('font-serif font-semibold tabular-nums leading-none text-xl @sm:text-2xl', theme.heading)}>
              {String(countdown[unit.key]).padStart(2, '0')}
            </span>
            <span className={cn('mt-1.5 text-[8px] @sm:text-[9px] font-semibold uppercase tracking-[0.16em]', theme.body)}>
              {unit.label}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
