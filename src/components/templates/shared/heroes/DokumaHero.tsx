import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Dokuma hero — davetiyenin kağıt değil KUMAŞ olduğu düzen.
 *
 * Katalogdaki bütün malzemeler baskı kökenli: kağıt, mürekkep, cam, metal,
 * vinil. Dokuma bunların hiçbiri gibi davranmaz — yüzey sürekli değil,
 * iplik iplik kuruludur ve desen boyanmaz, ÖRÜLÜR. Bu yüzden motifler
 * eğri çizgi kabul etmez: kilimde her şey ipliğin yönüne uyar, yani
 * dikey, yatay ya da 45°.
 *
 * Üç katman: çözgü-atkı dokusu (SVG pattern), kilim şeridi (deterministik
 * baklava dizisi) ve dikişli kenarlı kumaş paneli.
 */

/** Küçük, tekrarlanabilir PRNG — motif dizilimi her açılışta aynı olsun. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x9e3779b9) >>> 0;
    let t = Math.imul(a ^ (a >>> 16), 0x21f0aaad);
    t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
    return ((t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

/** Çözgü (dikey) ve atkı (yatay) ipliklerinden oluşan zemin dokusu. */
function Weave({ color, opacity = 0.5 }: { color: string; opacity?: number }) {
  const uid = React.useId().replace(/:/g, '');
  const id = `weave-${uid}`;

  return (
    <svg aria-hidden="true" className="absolute inset-0 w-full h-full" style={{ opacity }}>
      <defs>
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
          {/* Çözgü ve atkı aynı kalınlıkta ama farklı opaklıkta: birinin
              diğerinin ALTINDAN geçtiği ancak bu farkla okunur. */}
          <rect x="0" y="0" width="4" height="8" fill={color} fillOpacity={0.5} />
          <rect x="0" y="0" width="8" height="4" fill={color} fillOpacity={0.28} />
          <rect x="4" y="4" width="4" height="4" fill={color} fillOpacity={0.16} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Kilim şeridi — baklava ve üçgenlerden kurulu yatay bordür. */
function KilimBand({
  colors,
  seed,
  className
}: {
  colors: readonly [string, string, string];
  seed: number;
  className?: string;
}) {
  const random = rng(seed);
  const count = 14;

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${count * 10} 20`}
      preserveAspectRatio="none"
      className={cn('absolute inset-x-0 h-5 @sm:h-6', className)}
    >
      {Array.from({ length: count }, (_, i) => {
        const x = i * 10;
        const c = colors[Math.floor(random() * colors.length)];
        const alt = colors[(i + 1) % colors.length];
        return (
          <g key={i}>
            {/* Baklava: kilimin en temel birimi. */}
            <path d={`M${x + 5} 2 L${x + 9} 10 L${x + 5} 18 L${x + 1} 10 Z`} fill={c} fillOpacity={0.85} />
            {/* Aradaki üçgen çiftleri deseni sürekli kılar. */}
            <path d={`M${x} 2 L${x + 2.5} 10 L${x} 18 Z`} fill={alt} fillOpacity={0.5} />
            <path d={`M${x + 10} 2 L${x + 7.5} 10 L${x + 10} 18 Z`} fill={alt} fillOpacity={0.5} />
          </g>
        );
      })}
    </svg>
  );
}

/** Kanaviçe çarpı — bölüm ayırıcı olarak kullanılan tek motif. */
function CrossStitch({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 10 10">
      <path d="M1 1 L9 9 M9 1 L1 9" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export interface DokumaHeroProps extends HeroRenderProps {
  /** Kilim şeridinin üç ipliği. */
  threads?: readonly [string, string, string];
  /** Zemin dokusunun iplik rengi. */
  weave?: string;
  /** Dikiş (kesikli kenar) rengi. */
  stitch?: string;
  seed?: number;
}

export function DokumaHero({
  invitation,
  theme,
  flavor,
  threads = ['#b8433f', '#1f6f6a', '#d8a838'],
  weave = '#8a7a66',
  stitch,
  seed = 5
}: DokumaHeroProps) {
  const reduced = useReducedMotion();
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date);
  const stitchColor = stitch ?? threads[0];

  return (
    <section className="relative flex-1 flex items-center justify-center px-5 @sm:px-8 py-12 @sm:py-16 overflow-hidden">
      <Weave color={weave} opacity={0.4} />

      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_LUXE }}
        className={cn('relative w-full max-w-[21rem] @sm:max-w-sm rounded-sm overflow-hidden', theme.surface)}
        style={{ boxShadow: '0 18px 36px -20px rgba(0,0,0,0.45)' }}
      >
        <KilimBand colors={threads} seed={seed} className="top-0" />
        <KilimBand colors={threads} seed={seed + 11} className="bottom-0" />

        {/* Dikiş: paneli kumaşa TUTTURAN kesikli kenar. Düz bir kenarlık
            olsaydı panel kumaşın üstünde değil, önünde dururdu. */}
        <motion.div
          aria-hidden="true"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.5 }}
          className="absolute inset-x-3 inset-y-8 pointer-events-none"
          style={{
            border: `1.5px dashed ${stitchColor}`,
            opacity: 0.45,
            borderRadius: 2
          }}
        />

        <div className="relative px-8 @sm:px-10 pt-14 @sm:pt-16 pb-14 @sm:pb-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE_LUXE, delay: 0.25 }}
            className={theme.accent}
          >
            <Ornament size={26} />
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.35 }}
            className={cn('mt-4 text-[9px] font-semibold uppercase tracking-[0.36em]', theme.body)}
          >
            {invitation.title}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 0.45 }}
            className={cn(
              'font-serif font-normal leading-[1.1] mt-3.5 text-[1.8rem] @sm:text-[2.3rem] break-words',
              theme.heading
            )}
          >
            {invitation.names || 'Davetlisiniz'}
          </motion.h1>

          {/* Ayırıcı: çizgi değil, üç kanaviçe. Dokumada süsleme dikişten
              çıkar. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.6 }}
            className="flex items-center gap-2 my-5"
          >
            {/* Fragment sarmalayıcı: projede @types/react kurulu olmadığından
                özel bileşenler JSX'te `key` kabul etmiyor. */}
            {[threads[0], threads[1], threads[2]].map((c, i) => (
              <React.Fragment key={i}>
                <CrossStitch color={c} size={i === 1 ? 12 : 9} />
              </React.Fragment>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.7 }}
            className={cn('text-[12.5px] leading-[1.85] font-light max-w-[15rem]', theme.body)}
          >
            {invitation.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.82 }}
            className="mt-6 flex flex-col items-center gap-1.5"
          >
            <span className={cn('font-serif italic text-lg @sm:text-xl', theme.heading)}>
              {formatDateStr(invitation.date)}
            </span>
            <span className={cn('text-[10px] uppercase tracking-[0.24em]', theme.body)}>{invitation.venue}</span>
          </motion.div>

          {invitation.showTimer && valid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.95 }}
              className="mt-6 flex items-baseline gap-4"
            >
              {[
                { v: days, l: 'gün' },
                { v: hours, l: 'saat' },
                { v: minutes, l: 'dk' }
              ].map((unit) => (
                <span key={unit.l} className="flex items-baseline gap-1">
                  <span className={cn('font-serif tabular-nums text-lg', theme.heading)}>
                    {String(unit.v).padStart(2, '0')}
                  </span>
                  <span className={cn('text-[9px] uppercase tracking-[0.18em]', theme.body)}>{unit.l}</span>
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </motion.article>
    </section>
  );
}
