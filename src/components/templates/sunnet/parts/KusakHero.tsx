import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { ease } from '../../../../utils/motion';
import { displayText } from '../../utils';
import { HeroRenderProps } from '../../shared/InvitationComposition';
import { ChevronDownIcon, MapPinIcon } from '../../shared/icons';
import { KandilCountdown } from './KandilCountdown';
import { eventDateParts, splitSehzadeNames } from './heroText';
import { SunnetMotionStyles } from './motion';

export interface KusakHeroProps extends HeroRenderProps {
  /** Kuşağın saten degradesi (CSS background). */
  band: string;
  /** Sırma: kenar dikişleri ve "Maşallah" nakışı. */
  thread: string;
}

/** Nakışın iki yanındaki sekiz köşeli yıldız. */
function Yildiz({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="-7 -7 14 14" aria-hidden="true" className="shrink-0">
      <path d="M0-6.5 1.9-1.9 6.5 0 1.9 1.9 0 6.5-1.9 1.9-6.5 0-1.9-1.9Z" fill={color} />
      <path d="M-4.6-4.6 0-2.6 4.6-4.6 2.6 0 4.6 4.6 0 2.6-4.6 4.6-2.6 0Z" fill={color} fillOpacity="0.55" />
    </svg>
  );
}

/**
 * Kuşak hero'su — Maşallah şablonunun ön planı.
 *
 * Kompozisyonun omurgası kadrajı boydan boya kesen, hafif eğik kırmızı
 * saten kuşaktır; üstünde sırmayla işlenmiş "Maşallah". Şehzadenin adı
 * kuşağın ÜSTÜNDE (kuşağı takan o), aile adı ALTINDA durur. Kuşak soldan
 * sağa açılır (scaleX — "hareketi azalt"ta atlanır), nakış açılış bitince
 * belirir. Nakış süstür: ekran okuyucudan gizlenir.
 */
export function KusakHero({ invitation, theme, flavor, band, thread }: KusakHeroProps) {
  const { Ornament } = flavor;
  const { prince, family } = splitSehzadeNames(invitation.names);
  const { weekday, day, time } = eventDateParts(invitation.date);
  const title = displayText(invitation.title);
  const subtitle = displayText(invitation.subtitle);
  const venue = displayText(invitation.venue);

  return (
    <section className={cn('relative flex-1 flex flex-col items-center justify-center pt-16 pb-20 overflow-hidden', theme.page)}>
      <SunnetMotionStyles />

      <div className="relative z-10 w-full max-w-md @2xl:max-w-xl px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -24, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 110, damping: 11, delay: 0.1 }}
          className={theme.accent}
        >
          <Ornament size={44} />
        </motion.div>

        {title && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: ease.out, delay: 0.3 }}
            className={cn('mt-4 text-[10px] @sm:text-[11px] font-semibold uppercase tracking-[0.3em] leading-relaxed text-balance', theme.accent)}
          >
            {title}
          </motion.p>
        )}

        <h1 className="font-serif italic font-semibold leading-[1.04] tracking-[-0.01em] mt-5 break-words text-[2.6rem] @sm:text-6xl @2xl:text-7xl">
          <span className="block overflow-hidden px-[0.12em] -mx-[0.12em] pt-[0.14em] -mt-[0.14em] pb-[0.2em] -mb-[0.2em]">
            <motion.span
              className={cn('block', theme.heading)}
              initial={{ y: '115%' }}
              animate={{ y: '0%' }}
              transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.45 }}
            >
              {prince}
            </motion.span>
          </span>
        </h1>
      </div>

      {/* Kuşak: eğim dış sarmalayıcıda sabit, açılış içte — ikisi aynı
          transform'u paylaşıp birbirini ezmesin. */}
      <div aria-hidden="true" className="relative z-0 w-full h-[70px] @sm:h-[84px] my-7 -rotate-3">
        <motion.div
          className="absolute inset-y-0 -left-[8%] -right-[8%] origin-left overflow-hidden"
          style={{ background: band, boxShadow: '0 16px 30px -14px rgba(0,0,0,0.6)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.15, ease: ease.out, delay: 0.75 }}
        >
          <span className="absolute inset-x-0 top-[16%] h-[24%] bg-gradient-to-b from-white/20 to-transparent" />
          <span className="absolute inset-x-0 top-[5px] border-t border-dashed" style={{ borderColor: thread }} />
          <span className="absolute inset-x-0 top-[9px] h-px opacity-50" style={{ background: thread }} />
          <span className="absolute inset-x-0 bottom-[9px] h-px opacity-50" style={{ background: thread }} />
          <span className="absolute inset-x-0 bottom-[5px] border-b border-dashed" style={{ borderColor: thread }} />
          <motion.span
            className="absolute inset-0 flex items-center justify-center gap-3 @sm:gap-4 font-serif italic font-semibold text-[2rem] @sm:text-[2.6rem] leading-none"
            style={{ color: thread, textShadow: '0 1px 0 rgba(40,4,12,0.55), 0 0 18px rgba(255,214,120,0.25)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 1.5 }}
          >
            <Yildiz color={thread} />
            Maşallah
            <Yildiz color={thread} />
          </motion.span>
          <span
            data-atmosphere=""
            className="sunnet-sheen absolute inset-y-0 left-0 w-1/4"
            style={{ background: 'linear-gradient(100deg, transparent, rgba(255,236,190,0.3), transparent)' }}
          />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-md @2xl:max-w-xl px-6 flex flex-col items-center text-center">
        {family && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: ease.out, delay: 1.25 }}
            className={cn('text-[11px] @sm:text-xs font-semibold uppercase tracking-[0.3em] mr-[-0.3em]', theme.accent)}
          >
            {family}
          </motion.p>
        )}

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: 1.35 }}
            className={cn('mt-5 text-sm @md:text-base leading-relaxed font-light max-w-xs', theme.body)}
          >
            {subtitle}
          </motion.p>
        )}

        {(day || venue) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: 1.5 }}
            className="mt-7 flex flex-col items-center gap-1.5"
          >
            {day && (
              <span className={cn('font-serif text-xl @sm:text-2xl', theme.heading)}>
                {weekday && <span className={cn('italic', theme.accent)}>{weekday}, </span>}
                {day}
              </span>
            )}
            {time && <span className={cn('text-xs font-medium tracking-[0.24em] mr-[-0.24em]', theme.body)}>{time}</span>}
            {venue && (
              <span
                className={cn(
                  'mt-1 block max-w-[22rem] text-center text-[11px] @md:text-xs font-medium uppercase tracking-[0.16em] leading-snug',
                  theme.body
                )}
              >
                {/* Satır içi: uzun mekân kırılsa da iğne ilk kelimeye yapışık kalır. */}
                <MapPinIcon size={13} className={cn('inline-block align-[-2px] mr-1.5', theme.accent)} />
                {venue}
              </span>
            )}
          </motion.div>
        )}

        {invitation.showTimer && (
          <KandilCountdown
            date={invitation.date}
            timeZone={invitation.timezone}
            theme={theme}
            delay={1.65}
            className="mt-8"
          />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className={cn('absolute bottom-6 left-1/2 -translate-x-1/2', theme.body)}
      >
        <div className="animate-bob-down-6">
          <ChevronDownIcon size={20} />
        </div>
      </motion.div>
    </section>
  );
}
