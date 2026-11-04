import React from 'react';
import type { Invitation } from '../../../../types';
import { cn } from '../../../../utils/cn';
import { useCountdown } from '../useCountdown';

interface HeroCountdownProps {
  invitation: Invitation;
  /** Sayı + etiket kutusu. */
  cellClassName?: string;
  numberClassName?: string;
  labelClassName?: string;
  className?: string;
}

const UNITS = [
  ['days', 'Gün'],
  ['hours', 'Saat'],
  ['minutes', 'Dakika'],
  ['seconds', 'Saniye']
] as const;

/**
 * Geri sayım: `showTimer` kapalıysa ya da tarih geçersizse hiç çizilmez.
 * Görünüm tamamen sınıflarla şablona bırakılır.
 */
export function HeroCountdown({ invitation, cellClassName, numberClassName, labelClassName, className }: HeroCountdownProps) {
  const countdown = useCountdown(invitation.date, invitation.timezone);
  if (!invitation.showTimer || !countdown.valid) return null;
  return (
    <div className={cn('flex items-start justify-center gap-3 sm:gap-5', className)} role="timer" aria-label="Etkinliğe kalan süre">
      {UNITS.map(([key, label]) => (
        <div key={key} className={cn('flex flex-col items-center min-w-[3.25rem]', cellClassName)}>
          <span className={cn('tabular-nums text-2xl sm:text-3xl leading-none', numberClassName)}>
            {String(countdown[key]).padStart(2, '0')}
          </span>
          <span className={cn('mt-1.5 text-[10px] uppercase tracking-[0.2em]', labelClassName)}>{label}</span>
        </div>
      ))}
    </div>
  );
}
