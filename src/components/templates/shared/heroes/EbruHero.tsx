import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { displayText, formatDateStr } from '../../utils';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';
import { PaperGrain } from '../effects';
import { ease } from '../../../../utils/motion';

/**
 * Ebru hero — bir hat levhasının KOLTUĞU.
 *
 * Klasik bir hat levhasında yazı, ebrulu bir pervazın ortasındaki açık
 * renkli kağıda yazılır; ikisini altın "cetvel" çizgileri ayırır. Ebru
 * süslemedir, yazı ise sükûnettir — göz önce rengin hareketini, sonra
 * ortadaki durgun alanı görür. Bu düzen o ilişkiyi korur: ebru tüm hero'yu
 * kaplar (bkz. effects/ebru), metin ise cetvelle çevrili sakin bir panelde
 * durur.
 *
 * Cetveller cetvelle çekilmiş gibi belirir: her kenar bir köşeden öbürüne
 * uzar. Köşelerdeki küçük altın köşebentler tezhibin en sade hâlidir.
 */

/** Panelin köşesindeki altın köşebent; dört köşe aynı parçanın dönmüş hâli. */
function Kosebent({ color, className, rotate }: { color: string; className: string; rotate: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('absolute w-5 h-5 pointer-events-none', className)}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <path d="M2 22 V9 C2 5 5 2 9 2 H22" fill="none" stroke={color} strokeWidth="0.9" />
      <path d="M6 6 C9 3 13 4 13 7 C10 6 8 7 6 10 Z" fill={color} fillOpacity="0.85" />
      <path d="M6 6 C3 9 4 13 7 13 C6 10 7 8 10 6 Z" fill={color} fillOpacity="0.85" />
      <circle cx="5" cy="5" r="1.4" fill={color} />
    </svg>
  );
}

/** Tek bir cetvel kenarı: başladığı köşeden uzayarak çizilir. */
function Rule({
  side,
  inset,
  weight,
  color,
  delay
}: {
  side: 'top' | 'right' | 'bottom' | 'left';
  inset: number;
  weight: number;
  color: string;
  delay: number;
}) {
  const horizontal = side === 'top' || side === 'bottom';
  const style: React.CSSProperties = horizontal
    ? { left: inset, right: inset, height: weight, [side]: inset }
    : { top: inset, bottom: inset, width: weight, [side]: inset };

  return (
    <motion.span
      aria-hidden="true"
      className="absolute block pointer-events-none"
      style={{
        ...style,
        background: color,
        // Saat yönünde dolaşan kalem: üst soldan, sağ yukarıdan, alt sağdan, sol aşağıdan.
        originX: side === 'bottom' ? 1 : 0,
        originY: side === 'left' ? 1 : 0
      }}
      initial={horizontal ? { scaleX: 0 } : { scaleY: 0 }}
      animate={horizontal ? { scaleX: 1 } : { scaleY: 1 }}
      transition={{ duration: 0.7, ease: ease.inOut, delay }}
    />
  );
}

export interface EbruHeroProps extends HeroRenderProps {
  /** Koltuk (yazı kağıdı) rengi. */
  paper?: string;
  /** Cetvel ve köşebent altını. */
  gold?: string;
  /** "&" ve ara süs için mürekkep vurgusu. */
  ink?: string;
}

export function EbruHero({
  invitation,
  theme,
  flavor,
  paper = '#fbf6ea',
  gold = '#b08a4a',
  ink = '#8e3b46'
}: EbruHeroProps) {
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date, invitation.timezone);
  const dateLabel = formatDateStr(invitation.date);
  const venue = displayText(invitation.venue);
  const nameParts = (invitation.names || 'Davetlisiniz').split(/\s*&\s*/);
  const sides = ['top', 'right', 'bottom', 'left'] as const;

  return (
    <section className="relative flex-1 flex items-center justify-center px-7 @sm:px-10 py-16 @sm:py-20">
      <motion.article
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: ease.out, delay: 0.5 }}
        className="relative w-full max-w-[20rem] @sm:max-w-[22rem]"
        style={{
          background: paper,
          boxShadow: `0 0 0 1px ${gold}, 0 30px 60px -28px rgba(0,0,0,0.55)`
        }}
      >
        {/* Koyu kağıtta lif dokusu çamur gibi okunur; orada yalnızca bir iz. */}
        <PaperGrain opacity={theme.id === 'midnight' ? 0.12 : 0.4} />

        {/* Çift cetvel: kalın dış, ince iç. */}
        {sides.map((side, i) => (
          <React.Fragment key={side}>
            <Rule side={side} inset={9} weight={1.6} color={gold} delay={0.9 + i * 0.18} />
            <Rule side={side} inset={13} weight={0.6} color={gold} delay={1 + i * 0.18} />
          </React.Fragment>
        ))}

        {[
          { c: 'top-[17px] left-[17px]', r: 0 },
          { c: 'top-[17px] right-[17px]', r: 90 },
          { c: 'bottom-[17px] right-[17px]', r: 180 },
          { c: 'bottom-[17px] left-[17px]', r: 270 }
        ].map(({ c, r }, i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: ease.out, delay: 1.7 + i * 0.06 }}
          >
            <Kosebent color={gold} className={c} rotate={r} />
          </motion.div>
        ))}

        <div className="relative px-9 @sm:px-11 py-14 @sm:py-16 flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: ease.out, delay: 1.1 }}
            className={cn('text-[9px] font-semibold uppercase tracking-[0.36em]', theme.body)}
          >
            {invitation.title}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: ease.out, delay: 1.25 }}
            className={cn('font-serif font-normal leading-[1.12] mt-4 text-[1.85rem] @sm:text-[2.3rem] break-words', theme.heading)}
          >
            {nameParts.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span className="block italic text-[0.62em] my-1" style={{ color: ink }}>
                    &amp;
                  </span>
                )}
                {part}
              </React.Fragment>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 1.45 }}
            className="flex items-center gap-2.5 my-6"
            style={{ color: gold }}
          >
            <span className="w-1 h-1 rotate-45" style={{ background: gold }} />
            <span style={{ color: ink }}>
              <Ornament size={18} />
            </span>
            <span className="w-1 h-1 rotate-45" style={{ background: gold }} />
          </motion.div>

          {invitation.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: ease.out, delay: 1.55 }}
              className={cn('text-[12.5px] leading-[1.85] font-light max-w-[15rem]', theme.body)}
            >
              {invitation.subtitle}
            </motion.p>
          )}

          {(dateLabel || venue) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: ease.out, delay: 1.7 }}
              className="mt-7 flex flex-col items-center gap-1.5"
            >
              {dateLabel && <span className={cn('font-serif italic text-lg @sm:text-xl', theme.heading)}>{dateLabel}</span>}
              {venue && <span className={cn('text-[10px] uppercase tracking-[0.24em]', theme.body)}>{venue}</span>}
            </motion.div>
          )}

          {invitation.showTimer && valid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: ease.out, delay: 1.85 }}
              className="mt-7 flex items-stretch"
            >
              {[
                { v: days, l: 'Gün' },
                { v: hours, l: 'Saat' },
                { v: minutes, l: 'Dakika' }
              ].map((unit, i) => (
                <div
                  key={unit.l}
                  className="flex flex-col items-center px-4"
                  style={i > 0 ? { borderLeft: `1px solid ${gold}66` } : undefined}
                >
                  <span className={cn('font-serif tabular-nums text-xl leading-none', theme.heading)}>
                    {String(unit.v).padStart(2, '0')}
                  </span>
                  <span className={cn('mt-1.5 text-[8px] font-semibold uppercase tracking-[0.22em]', theme.body)}>{unit.l}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.article>
    </section>
  );
}
