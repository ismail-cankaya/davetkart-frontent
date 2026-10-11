import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { ease } from '../../../../utils/motion';
import { SectionTheme } from '../../shared/palette';
import { useCountdown } from '../../shared/useCountdown';

const UNITS = ['Gün', 'Saat', 'Dakika', 'Saniye'] as const;

interface KandilCountdownProps {
  date: string;
  timeZone: string;
  theme: SectionTheme;
  delay?: number;
  className?: string;
}

/**
 * Geri sayım, dört kemerli pencere (kandil camı) olarak.
 *
 * Kemer `rounded-t-[999px]` ile kurulur: yarıçap karonun yarı genişliğinde
 * sınırlanır, karo daraldıkça kemer de daralır — dar telefonda da tek satır.
 * İçteki ikinci kemer çini pencerenin pervazıdır. Tarih geçersizse hiç çizilmez.
 */
export function KandilCountdown({ date, timeZone, theme, delay = 0, className }: KandilCountdownProps) {
  const { valid, days, hours, minutes, seconds } = useCountdown(date, timeZone);
  if (!valid) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: ease.out, delay }}
      className={cn('grid grid-cols-4 gap-2 @sm:gap-3 w-full max-w-[320px] @sm:max-w-[360px] mx-auto', className)}
    >
      {[days, hours, minutes, seconds].map((value, i) => (
        <div
          key={UNITS[i]}
          className={cn(
            'relative min-w-0 flex flex-col items-center justify-end border rounded-t-[999px] rounded-b-xl pt-7 pb-2.5 @sm:pt-8 @sm:pb-3',
            theme.surface,
            theme.border
          )}
        >
          <span
            aria-hidden="true"
            className={cn('absolute inset-[3px] rounded-t-[999px] rounded-b-[9px] border opacity-70', theme.border)}
          />
          <span
            aria-hidden="true"
            className={cn('absolute top-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full', theme.accentBg)}
          />
          <span className={cn('relative font-serif font-semibold tabular-nums leading-none text-xl @sm:text-2xl', theme.heading)}>
            {String(value).padStart(2, '0')}
          </span>
          <span
            className={cn(
              'relative mt-1.5 text-[8px] @sm:text-[9px] font-semibold uppercase tracking-[0.12em] @sm:tracking-[0.2em]',
              theme.body
            )}
          >
            {UNITS[i]}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
