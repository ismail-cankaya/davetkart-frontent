import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Film Şeridi hero — bilgiyi KARE KARE veren düzen.
 *
 * Diğer hero'lar tüm bilgiyi tek kompozisyonda sunar; göz nereye bakacağına
 * kendi karar verir. Film şeridi bunu sıralı hale getirir: her kare tek bir
 * şey söyler ve kareler sırayla "projeksiyona düşer". Davet böylece bir
 * kompozisyon değil, kısa bir sekans olarak okunur.
 *
 * Şerit DİKEY: telefon kadrajı dar, yatay şeritte kareler okunamayacak
 * kadar küçülürdü. Perforasyon bu yüzden iki YAN kenarda.
 */

/** Şeridin kenarındaki dişli delikleri — filmin en tanıdık detayı. */
function Sprockets({ side, color }: { side: 'left' | 'right'; color: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute inset-y-0 w-5 @sm:w-6 flex flex-col items-center justify-around py-3',
        side === 'left' ? 'left-0' : 'right-0'
      )}
      style={{ background: color }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className="w-2 h-3 @sm:w-2.5 @sm:h-3.5 rounded-[2px] bg-black/55" />
      ))}
    </div>
  );
}

interface FrameProps {
  children: React.ReactNode;
  delay: number;
  className?: string;
  border: string;
}

function Frame({ children, delay, className, border }: FrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      // Kısa ve sert giriş: kare "belirmez", yerine OTURUR.
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
      className={cn('relative px-5 @sm:px-7 py-5 @sm:py-6 text-center border-b last:border-b-0', border, className)}
    >
      {children}
    </motion.div>
  );
}

export interface FilmHeroProps extends HeroRenderProps {
  /** Şeridin gövde rengi (delik bandı). */
  strip?: string;
  /** Kare zeminlerinin rengi. */
  frame?: string;
}

export function FilmHero({ invitation, theme, flavor, strip = '#17161a', frame = '#0e0d10' }: FilmHeroProps) {
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date);

  return (
    <section className="relative flex-1 flex items-center justify-center px-5 @sm:px-8 py-12 @sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 26, rotate: -1.2 }}
        animate={{ opacity: 1, y: 0, rotate: -1.2 }}
        transition={{ duration: 0.9, ease: EASE_LUXE }}
        className="relative w-full max-w-[21rem] @sm:max-w-sm"
        style={{ filter: 'drop-shadow(0 20px 38px rgba(0,0,0,0.45))' }}
      >
        <div className="relative rounded-sm overflow-hidden" style={{ background: strip }}>
          <Sprockets side="left" color={strip} />
          <Sprockets side="right" color={strip} />

          {/* Kareler dişli bandının arasında kalır. */}
          <div className="relative mx-5 @sm:mx-6" style={{ background: frame }}>
            <Frame delay={0.25} border={theme.border}>
              <span className={cn('text-[8.5px] font-semibold uppercase tracking-[0.34em]', theme.accent)}>
                {invitation.title}
              </span>
              <h1
                className={cn(
                  'font-serif font-normal leading-[1.08] mt-3 text-[1.7rem] @sm:text-[2.2rem] break-words',
                  theme.heading
                )}
              >
                {invitation.names || 'Davetlisiniz'}
              </h1>
            </Frame>

            <Frame delay={0.45} border={theme.border}>
              <span className={cn('block text-[8px] font-semibold uppercase tracking-[0.24em]', theme.body)}>
                Tarih
              </span>
              <span className={cn('block font-serif italic text-base @sm:text-lg mt-1.5', theme.heading)}>
                {formatDateStr(invitation.date)}
              </span>
            </Frame>

            <Frame delay={0.62} border={theme.border}>
              <span className={cn('block text-[8px] font-semibold uppercase tracking-[0.24em]', theme.body)}>
                Mekân
              </span>
              <span className={cn('block text-[11.5px] font-medium mt-1.5 leading-snug', theme.heading)}>
                {invitation.venue}
              </span>
            </Frame>

            <Frame delay={0.78} border={theme.border}>
              <span className={theme.accent}>
                <Ornament size={20} />
              </span>
              <p className={cn('text-[11.5px] leading-relaxed font-light mt-2.5', theme.body)}>
                {invitation.subtitle}
              </p>
            </Frame>

            {invitation.showTimer && valid && (
              <Frame delay={0.92} border={theme.border} className="flex items-center justify-center gap-4">
                {[
                  { v: days, l: 'gün' },
                  { v: hours, l: 'saat' },
                  { v: minutes, l: 'dk' }
                ].map((unit) => (
                  <span key={unit.l} className="flex items-baseline gap-1">
                    <span className={cn('font-serif tabular-nums text-lg', theme.heading)}>
                      {String(unit.v).padStart(2, '0')}
                    </span>
                    <span className={cn('text-[8.5px] uppercase tracking-[0.18em]', theme.body)}>{unit.l}</span>
                  </span>
                ))}
              </Frame>
            )}
          </div>

          {/* Kapı ışığı: projeksiyonun şerit üzerinde gezen sıcak parlaması.
              Çok yavaş ve tek yönlü; hızlandırılsa flaş efektine düşerdi. */}
          <motion.div
            aria-hidden="true"
            initial={{ y: '-60%' }}
            animate={{ y: '160%' }}
            transition={{ duration: 11, ease: 'linear', repeat: Infinity, repeatDelay: 3 }}
            className="absolute inset-x-0 h-1/4 pointer-events-none mix-blend-screen"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.09), transparent)' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
