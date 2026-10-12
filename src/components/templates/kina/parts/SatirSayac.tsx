import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { ease } from '../../../../utils/motion';
import { SectionTheme } from '../../shared/palette';
import { useCountdown } from '../../shared/useCountdown';

const UNITS = [
  { key: 'days', label: 'Gün' },
  { key: 'hours', label: 'Saat' },
  { key: 'minutes', label: 'Dakika' }
] as const;

/**
 * Satır sayacı — iki kıl çizgi arasında üç birim, aralarında sırma pulu.
 * Mum sayacının yerine, hero'yu kısa tutması gereken şablonlarda. Tarih
 * geçersizse hiç çizilmez.
 */
export function SatirSayac({
  date,
  timeZone,
  theme,
  delay = 0,
  className
}: {
  date: string;
  timeZone: string;
  theme: SectionTheme;
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
      className={cn('flex items-center justify-center gap-4 @sm:gap-6 border-y py-3.5 px-2 w-full max-w-[300px] @sm:max-w-[340px]', theme.border, className)}
    >
      {UNITS.map((unit, i) => (
        <React.Fragment key={unit.key}>
          {i > 0 && <span aria-hidden="true" className={cn('w-1.5 h-1.5 rotate-45 bg-current opacity-70 shrink-0', theme.accent)} />}
          <span className="flex flex-col items-center min-w-0">
            <span className={cn('font-serif font-semibold tabular-nums leading-none text-2xl @sm:text-3xl', theme.heading)}>
              {String(countdown[unit.key]).padStart(2, '0')}
            </span>
            <span className={cn('mt-1.5 text-[9px] @sm:text-[10px] font-semibold uppercase tracking-[0.18em]', theme.body)}>
              {unit.label}
            </span>
          </span>
        </React.Fragment>
      ))}
    </motion.div>
  );
}
