import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Invitation } from '../../../../types';
import { cn } from '../../../../utils/cn';
import { useCountdown } from '../useCountdown';
import { eventDateParts } from '../eventDate';

export interface DateCountdownClasses {
  /** Bölüm kabı (yükseklik, boşluk). */
  root?: string;
  eyebrow?: string;
  /** Büyük gün rakamı / tarih satırı. */
  date?: string;
  meta?: string;
  cell?: string;
  number?: string;
  label?: string;
  divider?: string;
}

const UNITS = [
  ['days', 'Gün'],
  ['hours', 'Saat'],
  ['minutes', 'Dakika'],
  ['seconds', 'Saniye']
] as const;

/**
 * Hero'nun ikinci ekranı: tarih + geri sayım. Tarih yoksa hiç çizilmez;
 * sayaç `showTimer` kapalıysa ya da tarih geçersizse gizlenir, tarih kalır.
 * Görünüm tamamen sınıflarla şablona bırakılır; giriş kaydırmayla tetiklenir.
 */
export function DateCountdown({
  invitation,
  eyebrow = 'Geri sayım',
  classes = {},
  ornament
}: {
  invitation: Invitation;
  eyebrow?: string;
  classes?: DateCountdownClasses;
  ornament?: React.ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  const d = eventDateParts(invitation.date);
  const countdown = useCountdown(invitation.date, invitation.timezone);
  if (!d.day) return null;
  const showTimer = invitation.showTimer && countdown.valid;
  const inView = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const }
        };
  return (
    <section dir="auto" className={cn('relative flex flex-col items-center justify-center text-center px-6 py-24', classes.root)}>
      {ornament}
      <motion.p {...inView(0)} className={cn('text-[10px] tracking-[0.45em] uppercase', classes.eyebrow)}>
        {eyebrow}
      </motion.p>
      <motion.p {...inView(0.12)} className={cn('mt-5', classes.date)}>
        {d.dayMonth || d.day}
        {d.year && <span className="block text-[0.42em] tracking-[0.3em] mt-2 opacity-80">{d.year}</span>}
      </motion.p>
      {(d.weekday || d.time) && (
        <motion.p {...inView(0.22)} className={cn('mt-4 text-sm tracking-[0.25em] uppercase', classes.meta)}>
          {[d.weekday, d.time].filter(Boolean).join(' · ')}
        </motion.p>
      )}
      {showTimer && (
        <motion.div {...inView(0.34)} className="mt-10 flex items-start justify-center gap-2.5 sm:gap-5" role="timer" aria-label="Etkinliğe kalan süre">
          {UNITS.map(([key, label], i) => (
            <React.Fragment key={key}>
              {i > 0 && <span aria-hidden="true" className={cn('mt-3 w-px h-8', classes.divider)} />}
              <div className={cn('flex flex-col items-center min-w-[3.6rem]', classes.cell)}>
                <span className={cn('tabular-nums text-3xl sm:text-4xl leading-none', classes.number)}>
                  {String(countdown[key]).padStart(2, '0')}
                </span>
                <span className={cn('mt-2 text-[9px] sm:text-[10px] uppercase tracking-[0.25em]', classes.label)}>{label}</span>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      )}
    </section>
  );
}
