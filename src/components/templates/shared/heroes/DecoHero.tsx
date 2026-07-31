import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';
import { DecoFrame, Sunburst } from '../effects';

/**
 * Art Deco Gala hero — mutlak simetri.
 *
 * Deco'nun kuralı eksenden şaşmamaktır: her öğe dikey eksene göre
 * ortalanır, süslemeler çift ve aynadır. Bu yüzden buradaki hiçbir eleman
 * sola ya da sağa yaslanmaz.
 *
 * Sayaç, kart yerine tek satırlık bir "künye" olarak dizilir — Deco
 * tipografisi bilgiyi kutulara değil, ayırıcılarla bölünmüş bantlara koyar.
 */
export function DecoHero({ invitation, theme, flavor }: HeroRenderProps) {
  const { valid, days, hours, minutes } = useCountdown(invitation.date);
  const { Ornament } = flavor;

  return (
    <section className="relative flex-1 flex items-center justify-center px-6 @sm:px-10 py-12 @sm:py-16">
      {/* Çerçeve ve yelpaze hero'nun tamamını kapsar; metin onların içinde
          ikinci bir kutuya girmez — Deco'da çerçeve zaten kompozisyondur. */}
      <DecoFrame color="212,175,95" opacity={0.55} />

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE_LUXE }}
        className="relative z-10 w-full max-w-md flex flex-col items-center text-center"
      >
        {/* Üst madalyon: yelpaze + ornament, ikisi aynı merkezde. */}
        <div className="relative w-24 h-24 @sm:w-28 @sm:h-28 flex items-center justify-center">
          <Sunburst color="212,175,95" rays={28} opacity={0.5} className="!absolute inset-0" />
          <motion.div
            initial={{ opacity: 0, rotate: -25, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 0.3 }}
            className={cn('relative', theme.accent)}
          >
            <Ornament size={34} />
          </motion.div>
        </div>

        {/* Çift kural + etiket: klasik Deco başlık bandı. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.45 }}
          className="w-full mt-4"
        >
          <span className={cn('block h-px w-full', theme.divider)} />
          <span className={cn('block text-[9px] font-semibold uppercase tracking-[0.44em] py-2.5', theme.accent)}>
            {invitation.title}
          </span>
          <span className={cn('block h-px w-full', theme.divider)} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16, letterSpacing: '0.24em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.04em' }}
          transition={{ duration: 1.3, ease: EASE_LUXE, delay: 0.6 }}
          className={cn(
            'font-serif font-bold uppercase leading-[1.06] mt-7 text-2xl @sm:text-4xl',
            theme.heading
          )}
        >
          {invitation.names || 'Davetlisiniz'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.95 }}
          className={cn('text-[13px] font-light leading-relaxed mt-5 max-w-xs', theme.body)}
        >
          {invitation.subtitle}
        </motion.p>

        {/* Künye bandı: tarih · mekân, ayırıcı elmaslarla. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 1.1 }}
          className="mt-8 flex flex-col items-center gap-2.5"
        >
          <span className={cn('font-serif italic text-lg @sm:text-xl', theme.heading)}>
            {formatDateStr(invitation.date)}
          </span>
          <span className="flex items-center gap-3">
            <span className={cn('w-1.5 h-1.5 rotate-45', theme.accentBg)} />
            <span className={cn('text-[10px] uppercase tracking-[0.28em]', theme.body)}>
              {invitation.venue}
            </span>
            <span className={cn('w-1.5 h-1.5 rotate-45', theme.accentBg)} />
          </span>
        </motion.div>

        {invitation.showTimer && valid && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 1.3 }}
            className={cn('mt-8 flex items-stretch divide-x', theme.divider.replace('bg-', 'divide-'))}
          >
            {[
              { v: days, l: 'Gün' },
              { v: hours, l: 'Saat' },
              { v: minutes, l: 'Dakika' }
            ].map((u) => (
              <span key={u.l} className="px-4 @sm:px-6 flex flex-col items-center">
                <span className={cn('font-serif font-bold tabular-nums text-xl @sm:text-2xl leading-none', theme.heading)}>
                  {String(u.v).padStart(2, '0')}
                </span>
                <span className={cn('text-[8px] uppercase tracking-[0.2em] mt-1.5', theme.body)}>{u.l}</span>
              </span>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
