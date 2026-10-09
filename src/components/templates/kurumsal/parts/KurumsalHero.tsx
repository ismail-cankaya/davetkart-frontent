import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { displayText, formatDateStr } from '../../utils';
import { HeroRenderProps } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { useCountdown } from '../../shared/useCountdown';
import { KURUMSAL_EASE } from './theme';
import { splitHostAndEvent } from './eventName';

export interface KurumsalHeroProps extends HeroRenderProps {
  /** start: sola yaslı editoryal künye; center: sahnenin ekseninde. */
  align?: 'start' | 'center';
}

/** "14 Kasım 2026 19:00" → gün ve saat; saat ayrışmazsa metnin tamamı gündür. */
function splitDateTime(label: string): { day: string; time: string } {
  const match = /^(.*\S)[\s,]+(\d{1,2}[:.]\d{2})$/.exec(label);
  return match ? { day: match[1], time: match[2] } : { day: label, time: '' };
}

/** Başlık ölçüsü ada göre: kısa ad dev basılır, 40+ karakter satırı zorlamaz. */
function titleSize(text: string): string {
  const length = Array.from(text).length;
  if (length <= 14) return 'text-[clamp(2.6rem,13cqw,5.5rem)]';
  if (length <= 26) return 'text-[clamp(2.15rem,9.5cqw,4.25rem)]';
  if (length <= 42) return 'text-[clamp(1.8rem,7.4cqw,3.25rem)]';
  return 'text-[clamp(1.5rem,5.8cqw,2.6rem)]';
}

/** Künye satırının kıl çizgisi: soldan sağa çizilir. */
function Rule({ theme, delay, center, edge = 'top' }: { theme: SectionTheme; delay: number; center?: boolean; edge?: 'top' | 'bottom' }) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        'absolute inset-x-0 h-px',
        edge === 'top' ? 'top-0' : 'bottom-0',
        center ? 'origin-center' : 'origin-left',
        theme.divider
      )}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, ease: KURUMSAL_EASE, delay }}
    />
  );
}

function Countdown({
  date,
  timeZone,
  theme,
  center,
  delay
}: {
  date: string;
  timeZone: string;
  theme: SectionTheme;
  center: boolean;
  delay: number;
}) {
  const { valid, days, hours, minutes, seconds } = useCountdown(date, timeZone);
  if (!valid) return null;

  const units = [
    { value: days, label: 'Gün' },
    { value: hours, label: 'Saat' },
    { value: minutes, label: 'Dakika' },
    { value: seconds, label: 'Saniye' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: KURUMSAL_EASE, delay }}
      className={cn('mt-9 @sm:mt-11 w-full', center ? 'max-w-md mx-auto' : 'max-w-lg')}
    >
      <p className={cn('text-[9px] font-semibold uppercase tracking-[0.26em]', theme.body)}>Kalan Süre</p>
      {/* Dört sabit sütun: değer büyüse de satır kırılmaz; ayraçlar kart değil kıl çizgi. */}
      <div className="mt-3 grid grid-cols-4">
        {units.map((unit, i) => (
          <div key={unit.label} className={cn('relative flex flex-col min-w-0', i > 0 && 'pl-3 @sm:pl-5', center && 'items-center')}>
            {i > 0 && <span aria-hidden="true" className={cn('absolute left-0 top-0.5 bottom-0.5 w-px', theme.divider)} />}
            <span
              className={cn(
                'font-sans font-semibold tabular-nums leading-none tracking-[-0.03em]',
                'text-[clamp(1.45rem,7.2cqw,2.6rem)]',
                theme.heading
              )}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className={cn('mt-2 text-[8px] @sm:text-[9px] font-semibold uppercase tracking-[0.18em] @sm:tracking-[0.22em]', theme.body)}>
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Kurumsal kategori hero'su — "Künye".
 *
 * İsim alanı bir çift değil "Kurum & Etkinlik" taşır (sihirbaz etiketleri);
 * kurum üst raya, etkinlik dev grotesk başlığa ayrılır. Tarih, saat ve mekân
 * bir teknik künye gibi etiketli satırlara dizilir: göz önce adı, sonra
 * künyeyi okur. Hareket kesin ve kısadır — çizgi çizilir, başlık maskeden
 * yükselir; bulanıklık ya da süzülme yok.
 */
export function KurumsalHero({ invitation, theme, flavor, align = 'start' }: KurumsalHeroProps) {
  const reduceMotion = useReducedMotion();
  const center = align === 'center';
  const { Ornament } = flavor;

  // Tek ad girildiyse o etkinliğin adıdır; kurum rayı kategori etiketine düşer.
  const { host, event: eventName } = splitHostAndEvent(invitation.names);
  const event = eventName || 'Davetlisiniz';
  const eyebrow = displayText(invitation.title) || flavor.tagline;
  const subtitle = displayText(invitation.subtitle);
  const venue = displayText(invitation.venue);
  const dateLabel = formatDateStr(invitation.date);
  const { day, time } = splitDateTime(dateLabel);
  const year = /\b(\d{4})\b/.exec(dateLabel)?.[1] ?? '';

  const specs = [
    day && { key: 'day', label: 'Tarih', value: day },
    time && { key: 'time', label: 'Saat', value: time },
    venue && { key: 'venue', label: 'Mekân', value: venue }
  ].filter((spec): spec is { key: string; label: string; value: string } => Boolean(spec));

  return (
    <section
      className={cn(
        'relative flex-1 flex flex-col justify-center',
        'px-6 @sm:px-12 @lg:px-16 pt-16 pb-24 @sm:pt-20 @sm:pb-28',
        theme.page
      )}
    >
      <div className={cn('relative w-full mx-auto flex flex-col', center ? 'max-w-2xl items-center text-center' : 'max-w-3xl')}>
        {/* Yıl filigranı: tarihin kendisinden; yoksa hiç basılmaz. */}
        {year && !center && (
          <motion.span
            aria-hidden="true"
            className={cn(
              'absolute right-0 top-10 select-none pointer-events-none font-sans font-semibold leading-none',
              'text-[clamp(6rem,34cqw,15rem)] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_currentColor]',
              theme.heading
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1.4, ease: KURUMSAL_EASE, delay: 0.5 }}
          >
            {year}
          </motion.span>
        )}

        {/* Üst ray: kurum (ya da kategori etiketi) · davet türü. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: KURUMSAL_EASE }}
          className={cn('relative w-full flex items-start gap-4 pb-3', center ? 'justify-center' : 'justify-between')}
        >
          <span className={cn('flex items-start gap-2.5 min-w-0', center && 'justify-center')}>
            <span className={cn('shrink-0 -mt-0.5', theme.accent)}>
              <Ornament size={18} />
            </span>
            <span className={cn('min-w-0 break-words text-left text-[10px] @sm:text-[11px] font-semibold uppercase tracking-[0.22em] leading-snug', theme.heading)}>
              {host || flavor.envelopeLabel}
            </span>
          </span>
          {host && !center && (
            <span className={cn('hidden @sm:block shrink-0 text-[10px] font-medium uppercase tracking-[0.22em]', theme.body)}>
              {flavor.envelopeLabel}
            </span>
          )}
          <motion.span
            aria-hidden="true"
            className={cn('absolute inset-x-0 bottom-0 h-px', center ? 'origin-center' : 'origin-left', theme.divider)}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: KURUMSAL_EASE, delay: 0.1 }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, x: center ? 0 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: KURUMSAL_EASE, delay: 0.2 }}
          className={cn('relative mt-10 @sm:mt-14 text-[10px] @sm:text-[11px] font-semibold uppercase tracking-[0.3em]', theme.accent)}
        >
          {eyebrow}
        </motion.p>

        {/* Başlık maskeden yükselir; maske alt payı, ç/ş/g kuyruklarını kesmez. */}
        <h1
          className={cn(
            'relative w-full mt-4 font-sans font-semibold leading-[1.02] tracking-[-0.035em] break-words text-balance',
            titleSize(event),
            theme.heading
          )}
        >
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className="block"
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.95, ease: KURUMSAL_EASE, delay: 0.3 }}
            >
              {event}
            </motion.span>
          </span>
        </h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: KURUMSAL_EASE, delay: 0.55 }}
            className={cn(
              'relative mt-6 @sm:mt-7 max-w-md text-sm @sm:text-[15px] leading-relaxed',
              center ? 'mx-auto' : 'pl-4',
              theme.body
            )}
          >
            {!center && <span aria-hidden="true" className={cn('absolute left-0 top-1 bottom-1 w-0.5', theme.accentBg)} />}
            {subtitle}
          </motion.p>
        )}

        {/* Künye: etiketli satırlar — tarih, saat, mekân; girilmeyen satır yok. */}
        {specs.length > 0 && (
          <dl className={cn('relative mt-9 @sm:mt-11 w-full', center ? 'max-w-md mx-auto' : 'max-w-lg')}>
            {specs.map((spec, i) => (
              <motion.div
                key={spec.key}
                className="relative flex items-baseline gap-4 py-3 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: KURUMSAL_EASE, delay: 0.7 + i * 0.09 }}
              >
                <Rule theme={theme} delay={0.62 + i * 0.09} center={center} />
                <dt className={cn('w-14 shrink-0 text-[9px] font-semibold uppercase tracking-[0.24em]', theme.body)}>{spec.label}</dt>
                <dd
                  className={cn(
                    'min-w-0 break-words font-medium leading-snug',
                    spec.key === 'venue' ? 'text-sm @sm:text-[15px]' : 'text-[15px] @sm:text-base tabular-nums',
                    theme.heading
                  )}
                >
                  {spec.value}
                </dd>
              </motion.div>
            ))}
            <Rule theme={theme} delay={0.62 + specs.length * 0.09} center={center} edge="bottom" />
          </dl>
        )}

        {invitation.showTimer && (
          <Countdown
            date={invitation.date}
            timeZone={invitation.timezone}
            theme={theme}
            center={center}
            delay={0.8 + specs.length * 0.09}
          />
        )}
      </div>

      {/* Kaydırma işareti: kıl çizgide aşağı inen sinyal; hareket azaltılınca durur. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className={cn('absolute bottom-7', center ? 'left-1/2 -translate-x-1/2' : 'left-6 @sm:left-12 @lg:left-16')}
      >
        <span className={cn('relative block w-px h-10 overflow-hidden', theme.divider)}>
          <motion.span
            className={cn('absolute inset-x-0 top-0 h-3', theme.accentBg)}
            initial={{ y: reduceMotion ? 0 : -12 }}
            animate={reduceMotion ? { y: 0 } : { y: [-12, 40] }}
            transition={reduceMotion ? { duration: 0 } : { duration: 1.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5 }}
          />
        </span>
      </motion.div>
    </section>
  );
}
