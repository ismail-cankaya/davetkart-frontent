import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Mermer & Rölyef hero — yazının yüzeyin ÜSTÜNDE değil İÇİNDE olduğu düzen.
 *
 * Kağıt & Mühür kabartma (letterpress) yapar: harf yüzeyden aşağı basılır ama
 * ışık üstten gelir, alt kenar parlar. Oyma (rölyef) bunun tam tersidir —
 * harfin ÜST kenarı gölgeli, ALT kenarı parlaktır, çünkü ışık oyuğun içine
 * düşer. İki gölgenin yönünü değiştirmek, aynı tipografiyi kağıttan taşa
 * taşıyan tek fark.
 *
 * Damarlar feTurbulence ile üretilir: mermer damarı çizilebilir bir eğri
 * değil, kendini tekrar etmeyen bir kırılmadır.
 */

function Veins({ color, seed, opacity }: { color: string; seed: number; opacity: number }) {
  const uid = React.useId().replace(/:/g, '');
  const filterId = `vein-${uid}`;

  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves={5} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={38} xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`} opacity={opacity} stroke={color} fill="none" strokeLinecap="round">
        {/* Ana damar kalın, yardımcılar ince: gerçek mermerde damar bir kez
            kırılır, gerisi onun dallarıdır. */}
        <path d="M-10 60 Q60 40 120 78 T210 66" strokeWidth={2.4} strokeOpacity={0.55} />
        <path d="M-10 100 Q70 130 130 96 T210 118" strokeWidth={1.2} strokeOpacity={0.4} />
        <path d="M-10 148 Q80 120 140 160 T210 140" strokeWidth={0.9} strokeOpacity={0.32} />
        <path d="M-10 24 Q90 52 150 20 T210 40" strokeWidth={0.7} strokeOpacity={0.25} />
      </g>
    </svg>
  );
}

export interface MermerHeroProps extends HeroRenderProps {
  /** Taş yüzeyinin degradesi (CSS background değeri). */
  slab?: string;
  /** Damar rengi. */
  vein?: string;
  /** Oyma etkisinin yönü: açık taşta beyaz alt kenar, koyu taşta tersi. */
  polish?: 'light' | 'dark';
  seed?: number;
}

export function MermerHero({
  invitation,
  theme,
  flavor,
  slab = 'linear-gradient(150deg, #f6f4f0 0%, #eceae4 45%, #e2dfd8 100%)',
  vein = '#9a958c',
  polish = 'light',
  seed = 11
}: MermerHeroProps) {
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date);

  // Oyma: üstte koyu (oyuğun gölgeli duvarı), altta açık (ışık alan taban).
  const carved =
    polish === 'light'
      ? { textShadow: '0 -1px 0 rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.85)' }
      : { textShadow: '0 -1px 0 rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.18)' };

  return (
    <section className="relative flex-1 flex items-center justify-center px-5 @sm:px-8 py-12 @sm:py-16">
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_LUXE }}
        className="relative w-full max-w-[21rem] @sm:max-w-sm rounded-sm overflow-hidden"
        style={{
          background: slab,
          // Pah (bevel): levhanın kalınlığını gösteren iç kenar.
          boxShadow:
            polish === 'light'
              ? 'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 6px rgba(0,0,0,0.14), 0 22px 44px -22px rgba(0,0,0,0.4)'
              : 'inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -2px 8px rgba(0,0,0,0.5), 0 22px 44px -20px rgba(0,0,0,0.7)'
        }}
      >
        <Veins color={vein} seed={seed} opacity={polish === 'light' ? 0.5 : 0.35} />

        {/* Cila: yüzeyde gezen çok geniş ve çok sönük parlama. */}
        <motion.div
          aria-hidden="true"
          initial={{ x: '-80%' }}
          animate={{ x: '180%' }}
          transition={{ duration: 16, ease: 'linear', repeat: Infinity, repeatDelay: 5 }}
          className="absolute inset-y-0 w-2/5 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.4), transparent)',
            mixBlendMode: polish === 'light' ? 'overlay' : 'soft-light'
          }}
        />

        {/* Oyulmuş çerçeve: taşa kazınmış ince kural. */}
        <div
          className="absolute inset-[14px] pointer-events-none rounded-[2px]"
          style={{
            boxShadow:
              polish === 'light'
                ? 'inset 0 1px 1px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.7)'
                : 'inset 0 1px 1px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.12)'
          }}
        />

        <div className="relative px-9 @sm:px-11 py-12 @sm:py-14 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.3 }}
            className={theme.accent}
            style={{ filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.7))' }}
          >
            <Ornament size={28} />
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 0.45 }}
            className={cn('mt-5 text-[9px] font-semibold uppercase tracking-[0.42em]', theme.body)}
            style={carved}
          >
            {invitation.title}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE_LUXE, delay: 0.55 }}
            className={cn(
              'font-serif font-normal uppercase leading-[1.12] mt-4 text-[1.6rem] @sm:text-[2.1rem] tracking-[0.06em] break-words',
              theme.heading
            )}
            style={carved}
          >
            {invitation.names || 'Davetlisiniz'}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.8 }}
            className="h-[3px] w-20 my-6 rounded-full"
            style={{
              background:
                polish === 'light'
                  ? 'linear-gradient(180deg, rgba(0,0,0,0.22), rgba(255,255,255,0.85))'
                  : 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(255,255,255,0.16))'
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 0.9 }}
            className={cn('text-[12.5px] leading-[1.85] font-light max-w-[15rem]', theme.body)}
            style={carved}
          >
            {invitation.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 1.02 }}
            className="mt-7 flex flex-col items-center gap-1.5"
          >
            <span className={cn('font-serif italic text-lg @sm:text-xl', theme.heading)} style={carved}>
              {formatDateStr(invitation.date)}
            </span>
            <span className={cn('text-[10px] uppercase tracking-[0.26em]', theme.body)} style={carved}>
              {invitation.venue}
            </span>
          </motion.div>

          {invitation.showTimer && valid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: EASE_LUXE, delay: 1.15 }}
              className="mt-6 flex items-baseline gap-4"
            >
              {[
                { v: days, l: 'gün' },
                { v: hours, l: 'saat' },
                { v: minutes, l: 'dk' }
              ].map((unit) => (
                <span key={unit.l} className="flex items-baseline gap-1">
                  <span className={cn('font-serif tabular-nums text-lg', theme.heading)} style={carved}>
                    {String(unit.v).padStart(2, '0')}
                  </span>
                  <span className={cn('text-[9px] uppercase tracking-[0.18em]', theme.body)} style={carved}>
                    {unit.l}
                  </span>
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </motion.article>
    </section>
  );
}
