import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Kinetik Tipografi hero — hareketin SÜS değil, kompozisyonun kendisi olduğu düzen.
 *
 * Diğer hero'larda hareket girişte olur ve biter: metin belirir, yerine
 * oturur, sahne durur. Burada iki dev yazı şeridi ters yönde sonsuz akar;
 * ortadaki bilgi bloğu bu akışın içinde duran tek sabit nesnedir. Kontrast
 * hareket–durgunluk üzerinden kurulur, renk ya da çerçeveyle değil.
 *
 * Şeritler kontur (outline) tipografiyle basılır: dolu olsalardı ortadaki
 * isimle yarışır, kadraj okunamaz hale gelirdi. Kontur "arka plan sesi"
 * seviyesinde kalır.
 *
 * Erişilebilirlik: `useReducedMotion` açıkken şeritler donar — hareketi
 * azaltma tercihinde sürekli kayan yazı en rahatsız edici katmandır.
 */

interface BandProps {
  text: string;
  /** Akış yönü. */
  direction: 'left' | 'right';
  /** Tam turun saniyesi; büyük değer = yavaş akış. */
  duration: number;
  /** Kontur mu dolu mu basılacak. */
  variant: 'outline' | 'solid';
  /** Şeridin rengini taşıyan sınıf (theme.heading / theme.accent). */
  colorClass: string;
  /** Hafif eğim — mükemmel yatay iki şerit tabela gibi durur. */
  tilt: number;
  className?: string;
}

function Band({ text, direction, duration, variant, colorClass, tilt, className }: BandProps) {
  const reduced = useReducedMotion();

  // Aynı içerik iki kez basılır ve şerit tam yarısı kadar kaydırılır:
  // döngü başa döndüğünde ikinci kopya birincinin yerine oturduğu için
  // dikiş yeri görünmez.
  const half = (
    <span className="flex shrink-0 items-center">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          {text}
          <span className="mx-5 @sm:mx-8 text-[0.5em] align-middle opacity-70">◆</span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      aria-hidden="true"
      className={cn('relative w-full overflow-hidden select-none pointer-events-none', className)}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <motion.div
        className={cn(
          'flex w-max will-change-transform font-serif font-black uppercase leading-none',
          'text-[2.75rem] @sm:text-[4.5rem] @lg:text-[5.5rem]',
          colorClass
        )}
        style={
          variant === 'outline'
            ? {
                WebkitTextStrokeWidth: '1px',
                WebkitTextStrokeColor: 'currentColor',
                WebkitTextFillColor: 'transparent'
              }
            : undefined
        }
        animate={
          reduced
            ? undefined
            : { x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }
        }
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {half}
        {half}
      </motion.div>
    </div>
  );
}

export interface KinetikHeroProps extends HeroRenderProps {
  /**
   * Üst şeritte akan kelime. Verilmezse davetin başlığı kullanılır —
   * ama başlık uzun bir cümleyse şerit okunmaz hale geldiği için şablon
   * tek kelimelik bir alternatif geçebilir ("DÜĞÜN", "GALA").
   */
  topWord?: string;
}

export function KinetikHero({ invitation, theme, flavor, topWord }: KinetikHeroProps) {
  const { valid, days, hours, minutes } = useCountdown(invitation.date);
  const { Ornament } = flavor;
  const names = invitation.names || 'Davetlisiniz';

  const top = (topWord || invitation.title || 'Davetlisiniz').toLocaleUpperCase('tr-TR');
  const bottom = (invitation.venue || formatDateStr(invitation.date)).toLocaleUpperCase('tr-TR');

  return (
    <section className="relative flex-1 flex flex-col justify-center gap-7 @sm:gap-10 py-12 @sm:py-16 overflow-hidden">
      <Band
        text={top}
        direction="left"
        duration={30}
        variant="outline"
        colorClass={theme.heading}
        tilt={-1.6}
      />

      {/* Sabit çekirdek — akışın içindeki tek durgun nesne. */}
      <div className="relative z-10 px-6 @sm:px-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE_LUXE, delay: 0.15 }}
          className={theme.accent}
        >
          <Ornament size={26} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.28 }}
          className={cn(
            'font-serif font-normal leading-[1.02] mt-4 break-words',
            'text-[2.1rem] @sm:text-5xl @lg:text-6xl',
            theme.heading
          )}
        >
          {names}
        </motion.h1>

        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.5 }}
          className={cn('block h-0.5 w-16 my-5', theme.accentBg)}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.6 }}
          className={cn('text-[13px] @sm:text-sm leading-relaxed font-light max-w-sm', theme.body)}
        >
          {invitation.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.72 }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <span className={cn('font-serif italic text-lg @sm:text-2xl', theme.heading)}>
            {formatDateStr(invitation.date)}
          </span>
          <span className={cn('text-[10px] font-semibold uppercase tracking-[0.28em]', theme.accent)}>
            {invitation.venue}
          </span>
        </motion.div>

        {invitation.showTimer && valid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.86 }}
            className="mt-6 flex items-baseline gap-4 @sm:gap-6"
          >
            {[
              { v: days, l: 'Gün' },
              { v: hours, l: 'Saat' },
              { v: minutes, l: 'Dk' }
            ].map((unit) => (
              <span key={unit.l} className="flex items-baseline gap-1.5">
                <span className={cn('font-serif font-black tabular-nums text-2xl @sm:text-3xl', theme.heading)}>
                  {String(unit.v).padStart(2, '0')}
                </span>
                <span className={cn('text-[9px] font-bold uppercase tracking-[0.18em]', theme.body)}>
                  {unit.l}
                </span>
              </span>
            ))}
          </motion.div>
        )}
      </div>

      {/* Alt şerit dolu basılır ve ters yönde akar: iki şerit aynı yöne
          gitseydi kadraj tek parça kayıyormuş gibi görünür, kinetik gerilim
          oluşmazdı. */}
      <Band
        text={bottom}
        direction="right"
        duration={38}
        variant="solid"
        colorClass={cn(theme.accent, 'opacity-25')}
        tilt={1.6}
      />
    </section>
  );
}
