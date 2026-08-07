import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Suluboya hero — kenarı DÜZGÜN OLMAYAN tek dil.
 *
 * Katalogdaki bütün açık şablonlar geometriyle kurulu: kutu, ızgara, kemer,
 * çerçeve. Suluboyanın imzası ise kontrolsüzlüktür — boya kağıtta yayılırken
 * kenarı düzensizleşir, pigment kenara doğru toplanır (ıslak kenar), ve iki
 * leke üst üste bindiğinde üçüncü bir ton doğar.
 *
 * Üçü de gerçek filtrelerle üretiliyor, görsel dosya YOK:
 *  1. Düzensiz kenar → feTurbulence + feDisplacementMap (elips bozulur).
 *  2. Islak kenar → aynı filtreden geçen ikinci bir KONTURLU kopya.
 *  3. Bindirme tonu → lekeler multiply (açık tema) / screen (koyu tema)
 *     ile üst üste basılır; ayrı ayrı boyanmış gibi durmazlar.
 */

interface WashProps {
  color: string;
  /** Deseni sabitleyen tohum — aynı şablon her açılışta aynı lekeyi verir. */
  seed: number;
  /** Bozulma şiddeti; büyük değer daha "sulu" kenar. */
  spread?: number;
  className?: string;
  blend: 'multiply' | 'screen';
  delay?: number;
}

function Wash({ color, seed, spread = 26, className, blend, delay = 0 }: WashProps) {
  const uid = React.useId().replace(/:/g, '');
  const filterId = `wash-${uid}`;

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      preserveAspectRatio="none"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      // Uzun süre bilinçli: boya "belirmez", yayılır.
      transition={{ duration: 2.2, ease: EASE_LUXE, delay }}
      className={cn('absolute pointer-events-none', className)}
      style={{ mixBlendMode: blend }}
    >
      <defs>
        <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves={4} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={spread} xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {/* Gövde: soluk yayılma. */}
      <ellipse cx="100" cy="100" rx="74" ry="60" fill={color} fillOpacity={0.34} filter={`url(#${filterId})`} />
      {/* Islak kenar: pigmentin kenarda toplandığı koyu halka. Bu olmadan
          leke suluboya değil, blur'lanmış bir daire gibi okunur. */}
      <ellipse
        cx="100"
        cy="100"
        rx="74"
        ry="60"
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeOpacity={0.4}
        filter={`url(#${filterId})`}
      />
    </motion.svg>
  );
}

export interface SuluboyaHeroProps extends HeroRenderProps {
  /** Üç boya tonu; kategori kimliğini taşıyan tek parametre. */
  washes?: readonly [string, string, string];
  /** Desen tohumu — aynı dilin iki kategorisi aynı lekeyi tekrarlamasın. */
  seed?: number;
}

export function SuluboyaHero({
  invitation,
  theme,
  flavor,
  washes = ['#c98fa8', '#e8c89a', '#8fa8c9'],
  seed = 7
}: SuluboyaHeroProps) {
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date);
  const dark = theme.id === 'midnight';
  const blend = dark ? 'screen' : 'multiply';

  return (
    <section className="relative flex-1 flex items-center justify-center px-6 @sm:px-10 py-14 @sm:py-20 overflow-hidden">
      {/* Üç leke, üç farklı boyut ve konum. Simetrik yerleştirilselerdi
          fırça değil şablon izlenimi verirlerdi. */}
      <Wash
        color={washes[0]}
        seed={seed}
        spread={30}
        blend={blend}
        className="-top-[12%] -left-[18%] w-[85%] h-[62%]"
      />
      <Wash
        color={washes[1]}
        seed={seed + 13}
        spread={24}
        blend={blend}
        delay={0.25}
        className="top-[18%] -right-[22%] w-[80%] h-[55%]"
      />
      <Wash
        color={washes[2]}
        seed={seed + 29}
        spread={34}
        blend={blend}
        delay={0.5}
        className="-bottom-[16%] left-[4%] w-[92%] h-[58%]"
      />

      <div className="relative z-10 w-full max-w-[19rem] @sm:max-w-sm flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.7 }}
          className={theme.accent}
        >
          <Ornament size={28} />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.85 }}
          className={cn('mt-5 text-[9px] font-semibold uppercase tracking-[0.38em]', theme.body)}
        >
          {invitation.title}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE_LUXE, delay: 0.95 }}
          className={cn(
            'font-serif font-normal leading-[1.1] mt-4 text-[2rem] @sm:text-[2.6rem] break-words',
            theme.heading
          )}
        >
          {invitation.names || 'Davetlisiniz'}
        </motion.h1>

        {/* Fırça darbesi ayırıcı: düz çizgi yerine uçları incelen bir iz. */}
        <motion.span
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 1.15 }}
          className="block h-[3px] w-24 my-6 rounded-full origin-center"
          style={{
            background: `linear-gradient(90deg, transparent, ${washes[0]}, ${washes[2]}, transparent)`,
            mixBlendMode: blend
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 1.25 }}
          className={cn('text-[12.5px] leading-[1.85] font-light max-w-[16rem]', theme.body)}
        >
          {invitation.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 1.4 }}
          className="mt-7 flex flex-col items-center gap-2"
        >
          <span className={cn('font-serif italic text-lg @sm:text-2xl', theme.heading)}>
            {formatDateStr(invitation.date)}
          </span>
          <span className={cn('text-[10px] uppercase tracking-[0.26em]', theme.body)}>{invitation.venue}</span>
        </motion.div>

        {invitation.showTimer && valid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 1.55 }}
            className="mt-6 flex items-baseline gap-4"
          >
            {[
              { v: days, l: 'gün' },
              { v: hours, l: 'saat' },
              { v: minutes, l: 'dk' }
            ].map((unit) => (
              <span key={unit.l} className="flex items-baseline gap-1">
                <span className={cn('font-serif tabular-nums text-xl @sm:text-2xl', theme.heading)}>
                  {String(unit.v).padStart(2, '0')}
                </span>
                <span className={cn('text-[9px] uppercase tracking-[0.18em]', theme.body)}>{unit.l}</span>
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
