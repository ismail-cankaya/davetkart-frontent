import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Noir Minimal hero — sessiz lüks: tek bir dev serif başlık, ince kurallar
 * ve çok fazla boşluk.
 *
 * Tasarım kararı: burada süsleme YOK. Ne parıltı, ne kart, ne ikon yığını.
 * Sessiz lüksün kuralı, bir öğe eklemenin bedelinin diğer her şeyin
 * ağırlığını düşürmesidir; bu yüzden hero tek bir odak taşır (isim) ve geri
 * kalan bilgi en ince tipografik ağırlıkla kenara çekilir.
 *
 * Başlık harf harf değil, kelime kelime belirir ve harf aralığı geniş
 * başlayıp normale oturur — metin "yazılıyor" değil, "yerleşiyor" hissi.
 */
export function NoirHero({ invitation, theme }: HeroRenderProps) {
  const { valid, days } = useCountdown(invitation.date);
  const words = (invitation.names || 'Davetlisiniz').split(' ');

  return (
    <section
      className={cn(
        'relative flex-1 flex flex-col justify-center items-center text-center',
        'px-6 @sm:px-10 py-16 @sm:py-24',
        theme.page
      )}
    >
      <div className="w-full max-w-xl mx-auto">
        {/* Üst kural + etiket: başlığın üstünde ince bir zemin çizgisi. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE_LUXE }}
          className="flex items-center justify-center gap-4 mb-8 @sm:mb-12"
        >
          <span className={cn('h-px w-8 @sm:w-14', theme.divider)} />
          <span className={cn('text-[9px] font-medium uppercase tracking-[0.4em]', theme.accent)}>
            {invitation.title}
          </span>
          <span className={cn('h-px w-8 @sm:w-14', theme.divider)} />
        </motion.div>

        {/* Dev serif başlık — sayfanın tek odağı. */}
        <h1
          className={cn(
            'font-serif font-normal leading-[0.95] tracking-[-0.02em]',
            'text-[2.75rem] @sm:text-6xl @lg:text-7xl',
            theme.heading
          )}
        >
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="inline-block mr-[0.22em] last:mr-0"
              initial={{ opacity: 0, y: 18, letterSpacing: '0.18em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '-0.02em' }}
              transition={{ duration: 1.2, ease: EASE_LUXE, delay: 0.25 + i * 0.12 }}
            >
              {word === '&' ? <span className={cn('italic', theme.accent)}>&amp;</span> : word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.9 }}
          className={cn('font-light leading-relaxed mt-7 @sm:mt-9 text-sm max-w-sm mx-auto', theme.body)}
        >
          {invitation.subtitle}
        </motion.p>

        {/* Alt bilgi şeridi: tarih · mekân · kalan gün, hepsi aynı ağırlıkta.
            Hiçbiri diğerinden önemli değil, hepsi başlıktan sonra gelir. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: EASE_LUXE, delay: 1.15 }}
          className="mt-10 @sm:mt-14"
        >
          <span className={cn('block h-px w-full mb-5', theme.divider)} />

          <div
            className={cn(
              'flex flex-wrap items-center justify-center gap-x-5 @sm:gap-x-8 gap-y-2',
              'text-[10px] @sm:text-[11px] uppercase tracking-[0.22em]',
              theme.body
            )}
          >
            <span className={cn('font-serif italic normal-case tracking-normal text-base @sm:text-lg', theme.heading)}>
              {formatDateStr(invitation.date)}
            </span>
            <span className={cn('h-3 w-px', theme.divider)} />
            <span>{invitation.venue}</span>
            {invitation.showTimer && valid && (
              <>
                <span className={cn('h-3 w-px', theme.divider)} />
                <span className={theme.accent}>
                  <span className="tabular-nums">{days}</span> gün kaldı
                </span>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
