import React from 'react';
import { motion } from 'motion/react';
import { Invitation } from '../../../types';
import { cn } from '../../../utils/cn';
import { formatDateStr } from '../utils';
import { SectionTheme, EASE_LUXE } from './palette';
import { TemplateFlavor } from './flavor';
import { ChevronDownIcon } from './icons';
import { useCountdown } from './useCountdown';

/**
 * Yoğunluk modu: 'compact', süslemelerin metin alanını daralttığı şablonlarda
 * (örn. yanlardan/kemerle çerçevelenen hero'lar) boşlukları sıkılaştırır ve
 * arka plan katmanlarını (grid/glow) kapatır. Tüm ölçüler viewport'a değil
 * kök @container genişliğine göre ölçeklenir; geri sayım karoları her
 * genişlikte tek satırda kalır.
 */
export type SummaryDensity = 'default' | 'compact';

interface SummaryProps {
  invitation: Invitation;
  theme: SectionTheme;
  flavor: TemplateFlavor;
  density?: SummaryDensity;
}

function CountdownTile({
  value,
  label,
  theme,
  compact = false
}: {
  value: number;
  label: string;
  theme: SectionTheme;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        // Sabit genişlik yok: karo, grid hücresini doldurur ve kapsayıcıyla
        // birlikte daralır — dar önizleme çerçevesinde bile satır atlamaz.
        'flex flex-col items-center justify-center rounded-xl border w-full min-w-0',
        compact ? 'px-1 py-2 @sm:py-2.5' : 'px-1 py-2.5 @sm:py-3',
        theme.surface,
        theme.border
      )}
    >
      <span className={cn('font-serif font-bold tabular-nums leading-none', compact ? 'text-base @sm:text-xl' : 'text-lg @sm:text-2xl', theme.heading)}>
        {String(value).padStart(2, '0')}
      </span>
      <span
        className={cn(
          'font-semibold uppercase mt-1 @sm:mt-1.5 tracking-[0.12em] @sm:tracking-[0.2em]',
          compact ? 'text-[7px] @sm:text-[8px]' : 'text-[8px] @sm:text-[9px]',
          theme.body
        )}
      >
        {label}
      </span>
    </div>
  );
}

function Countdown({ date, theme, compact = false }: { date: string; theme: SectionTheme; compact?: boolean }) {
  const { valid, days, hours, minutes, seconds } = useCountdown(date);
  if (!valid) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_LUXE, delay: 1.6 }}
      // 4 sabit sütun: Gün/Saat/Dakika/Saniye her genişlikte tek satırda kalır.
      className={cn('grid grid-cols-4 w-full mx-auto', compact ? 'gap-1 @sm:gap-2 max-w-[300px]' : 'gap-1.5 @sm:gap-2.5 max-w-[340px]')}
    >
      <CountdownTile value={days} label="Gün" theme={theme} compact={compact} />
      <CountdownTile value={hours} label="Saat" theme={theme} compact={compact} />
      <CountdownTile value={minutes} label="Dakika" theme={theme} compact={compact} />
      <CountdownTile value={seconds} label="Saniye" theme={theme} compact={compact} />
    </motion.div>
  );
}

/**
 * Hero section — Magic UI aesthetic: names materialize word by word over a
 * soft radial glow and a faint grid, followed by the message, the date and
 * (optionally) the live countdown.
 */
export function Summary({ invitation, theme, flavor, density = 'default' }: SummaryProps) {
  const isDark = theme.id === 'midnight';
  const compact = density === 'compact';
  const { Ornament } = flavor;
  const nameWords = (invitation.names || 'Davetlisiniz').split(' ');

  return (
    <section
      className={cn(
        'relative flex-1 flex flex-col items-center justify-center',
        compact ? 'px-3 @sm:px-4 py-10 overflow-visible' : 'px-6 py-16 overflow-hidden',
        theme.page
      )}
    >
      {/* Grid ve parıltı katmanları yalnızca varsayılan modda — kompakt
          şablonların kendi zengin hero görselleri var, üstüne binmesinler. */}
      {!compact && (
        <>
          {/* Faint grid backdrop */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.35]"
            style={{
              backgroundImage: `linear-gradient(${isDark ? 'rgba(148,163,184,0.07)' : 'rgba(120,113,108,0.09)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(148,163,184,0.07)' : 'rgba(120,113,108,0.09)'} 1px, transparent 1px)`,
              backgroundSize: '44px 44px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 100%)'
            }}
          />
          {/* Radial glow */}
          <div
            className={cn(
              'absolute top-[12%] left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none',
              isDark ? 'bg-amber-300/[0.07]' : 'bg-rose-200/40'
            )}
          />
        </>
      )}

      <div
        className={cn(
          'relative z-10 flex flex-col items-center text-center w-full',
          compact ? 'max-w-sm gap-4' : 'max-w-md gap-6'
        )}
      >
        {/* Ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE }}
          className={theme.accent}
        >
          <Ornament size={compact ? 34 : 44} />
        </motion.div>

        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 1.2, ease: EASE_LUXE, delay: 0.3 }}
          className={cn('text-[10px] font-semibold uppercase', theme.accent)}
        >
          {invitation.title}
        </motion.span>

        {/* Names — staggered word reveal */}
        <h1
          className={cn(
            'font-serif font-bold leading-tight break-words',
            compact ? 'text-3xl @sm:text-4xl @2xl:text-5xl' : 'text-4xl @md:text-5xl',
            theme.heading
          )}
        >
          {nameWords.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="inline-block mr-[0.28em] last:mr-0"
              initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.5 + i * 0.14 }}
            >
              {word === '&' ? <span className={cn('italic font-medium', theme.accent)}>&amp;</span> : word}
            </motion.span>
          ))}
        </h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: EASE_LUXE, delay: 1 }}
          className={cn(
            'h-px',
            compact ? 'w-24' : 'w-40',
            isDark
              ? 'bg-gradient-to-r from-transparent via-amber-200/70 to-transparent'
              : 'bg-gradient-to-r from-transparent via-stone-400 to-transparent'
          )}
        />

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 1.2 }}
          className={cn('leading-relaxed font-light max-w-xs', compact ? 'text-sm' : 'text-sm @md:text-base', theme.body)}
        >
          {invitation.subtitle}
        </motion.p>

        {/* Date & venue line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 1.4 }}
          className="flex flex-col items-center gap-1"
        >
          <span className={cn('font-serif italic', compact ? 'text-lg @sm:text-xl' : 'text-lg @md:text-xl', theme.heading)}>
            {formatDateStr(invitation.date)}
          </span>
          <span className={cn('font-medium tracking-[0.15em] uppercase', compact ? 'text-[11px]' : 'text-[11px] @md:text-xs', theme.body)}>
            {invitation.venue}
          </span>
        </motion.div>

        {invitation.showTimer && <Countdown date={invitation.date} theme={theme} compact={compact} />}
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 2.2, duration: 0.8 }, y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } }}
        className={cn('absolute bottom-6 left-1/2 -translate-x-1/2', theme.body)}
      >
        <ChevronDownIcon size={20} />
      </motion.div>
    </section>
  );
}
