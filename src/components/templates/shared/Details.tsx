import React from 'react';
import { motion } from 'motion/react';
import { Invitation } from '../../../types';
import { cn } from '../../../utils/cn';
import { displayText, formatDateStr } from '../utils';
import { SectionTheme } from './palette';
import { TemplateFlavor } from './flavor';
import { CalendarIcon, MapPinIcon, ExternalLinkIcon } from './icons';
import { ease } from '../../../utils/motion';
import { SectionHeading, sectionMotion } from './SectionHeading';

interface DetailsProps {
  invitation: Invitation;
  theme: SectionTheme;
  flavor: TemplateFlavor;
}

/**
 * Venue & directions — an elegant card pairing the date with the venue and a
 * one-tap Google Maps directions button.
 *
 * Yalnızca girilmiş bilgiler çizilir; tarih, mekân ve ulaşım bağlantısının
 * hiçbiri yoksa bölüm tamamen gizlenir.
 */
export function Details({ invitation, theme, flavor }: DetailsProps) {
  const isDark = theme.id === 'midnight';
  const dateLabel = formatDateStr(invitation.date);
  const venue = displayText(invitation.venue);
  const mapUrl = displayText(invitation.mapUrl);

  if (!dateLabel && !venue && !mapUrl) return null;

  const card = sectionMotion(theme, { duration: 0.95, distance: 30 });

  return (
    <section className={cn('relative px-6 py-16', theme.page)}>
      <SectionHeading
        theme={theme}
        eyebrow={flavor.eyebrows?.details ?? 'Ne Zaman & Nerede'}
        title={flavor.headings.details}
        amount={0.4}
        className="mb-10"
      />

      <motion.div
        initial={{ opacity: 0, y: card.distance, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: card.duration, ease: ease.out, delay: 0.1 }}
        className={cn('max-w-md mx-auto rounded-3xl border overflow-hidden', theme.surface, theme.border)}
      >
        {/* Decorative abstract map header — tema kapatabilir (hideMapHeader). */}
        {!theme.hideMapHeader && (
          <div className={cn('relative h-28 overflow-hidden', theme.mapHeader ?? (isDark ? 'bg-slate-900' : 'bg-stone-100'))}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
              <g stroke={isDark ? 'rgba(148,163,184,0.25)' : 'rgba(120,113,108,0.3)'} strokeWidth="1.5" fill="none">
                <path d="M-10 30 C 80 20, 140 70, 220 55 S 360 20, 410 45" />
                <path d="M-10 80 C 60 95, 150 60, 240 85 S 340 100, 410 80" />
                <path d="M120 -10 C 110 40, 140 80, 125 130" />
                <path d="M280 -10 C 290 30, 260 90, 275 130" />
              </g>
            </svg>
            <motion.span
              initial={{ y: -14, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.4 }}
              className={cn(
                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg',
                theme.accentBg,
                isDark ? 'text-slate-950' : 'text-stone-50'
              )}
            >
              <MapPinIcon size={19} />
            </motion.span>
          </div>
        )}

        <div className="p-6 space-y-5">
          {dateLabel && (
            <div className="flex items-start gap-3.5">
              <span className={cn('mt-0.5 shrink-0', theme.accent)}>
                <CalendarIcon size={17} />
              </span>
              <div>
                <p className={cn('text-[10px] font-semibold tracking-[0.2em] uppercase', theme.body)}>Tarih &amp; Saat</p>
                <p className={cn('font-serif text-base font-semibold mt-0.5', theme.heading)}>{dateLabel}</p>
              </div>
            </div>
          )}

          {dateLabel && venue && <div className={cn('h-px w-full', theme.divider)} />}

          {venue && (
            <div className="flex items-start gap-3.5">
              <span className={cn('mt-0.5 shrink-0', theme.accent)}>
                <MapPinIcon size={17} />
              </span>
              <div>
                <p className={cn('text-[10px] font-semibold tracking-[0.2em] uppercase', theme.body)}>Mekan</p>
                <p className={cn('font-serif text-base font-semibold mt-0.5', theme.heading)}>{venue}</p>
              </div>
            </div>
          )}

          {mapUrl && (
            <motion.a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-wide transition-colors duration-300',
                // Dokunma hedefi ≥ 44 px (kenarlık 2 px olsa da); görünen düğme aynı (40 px).
                'relative before:absolute before:inset-x-0 before:-inset-y-1',
                theme.buttonPrimary
              )}
            >
              <ExternalLinkIcon size={14} />
              Yol Tarifi Al
            </motion.a>
          )}
        </div>
      </motion.div>
    </section>
  );
}
