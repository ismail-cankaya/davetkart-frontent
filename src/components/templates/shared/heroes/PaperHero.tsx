import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { PaperGrain, DeckleEdge, WaxSeal } from '../effects';

/**
 * Kağıt & Mühür hero — ekranda duran bir NESNE.
 *
 * Diğer tüm hero'lar tam ekran kaplar; bu bilinçli olarak kaplamıyor.
 * Kenar boşluğu bırakılmış, zemin üzerinde gölge düşüren, deckle kenarlı
 * bir kart. Fiziksel davetiyenin en güçlü sinyali "sayfanın tamamı
 * olmaması"dır — kenar boşluğu olmadan kağıt hissi kurulamaz.
 *
 * Tipografi kabartma (letterpress): zıt yönde iki gölge, biri açık biri
 * koyu. Tek gölge kullanılsaydı yazı kağıdın üstüne düşmüş gibi görünürdü;
 * iki gölge onu kağıdın İÇİNE bastırır.
 */
export function PaperHero({ invitation, theme, flavor }: HeroRenderProps) {
  const { Ornament } = flavor;
  const names = invitation.names || 'Davetlisiniz';

  // Mühür monogramı: iki ismin baş harfleri, yoksa tek harf.
  const initials = names
    .split(/\s*&\s*|\s+ve\s+/i)
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toLocaleUpperCase('tr-TR');

  const emboss = {
    textShadow: '0 1px 0 rgba(255,255,255,0.75), 0 -1px 0 rgba(0,0,0,0.16)'
  };

  return (
    <section className="relative flex-1 flex items-center justify-center px-5 @sm:px-8 py-10 @sm:py-14">
      <motion.article
        initial={{ opacity: 0, y: 26, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: EASE_LUXE }}
        className="relative w-full max-w-md"
        style={{ filter: 'drop-shadow(0 18px 34px rgba(60,42,28,0.22))' }}
      >
        {/* Kartın kendisi — düzensiz kenarlı kağıt yüzeyi. */}
        <DeckleEdge color={theme.id === 'midnight' ? '#16130f' : '#fdfaf3'} amplitude={5} seed={9} />
        <PaperGrain opacity={theme.id === 'midnight' ? 0.35 : 0.55} />

        {/* İnce çift kural çerçevesi — klasik gravür davetiyenin işareti. */}
        <div className={cn('absolute inset-[14px] border', theme.border)} />
        <div className={cn('absolute inset-[19px] border-t border-b opacity-50', theme.border)} />

        <div className="relative px-8 @sm:px-11 py-11 @sm:py-14 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.25 }}
            className={theme.accent}
          >
            <Ornament size={30} />
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 0.4 }}
            className={cn('mt-5 text-[9px] font-semibold uppercase tracking-[0.42em]', theme.body)}
            style={emboss}
          >
            {invitation.title}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE_LUXE, delay: 0.55 }}
            className={cn('font-serif font-normal leading-[1.08] mt-4 text-3xl @sm:text-[2.6rem]', theme.heading)}
            style={emboss}
          >
            {names}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 0.85 }}
            className={cn('h-px w-20 my-6', theme.divider)}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 0.95 }}
            className={cn('text-[13px] leading-relaxed font-light max-w-[16rem]', theme.body)}
            style={emboss}
          >
            {invitation.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 1.1 }}
            className="mt-7 flex flex-col items-center gap-1.5"
          >
            <span className={cn('font-serif italic text-lg @sm:text-xl', theme.heading)} style={emboss}>
              {formatDateStr(invitation.date)}
            </span>
            <span className={cn('text-[10px] uppercase tracking-[0.26em]', theme.body)} style={emboss}>
              {invitation.venue}
            </span>
          </motion.div>

          {/* Mühür kartın alt kenarına BİNER — üstüne basılmış, içine
              yerleştirilmemiş gibi görünsün diye taşma bilinçli. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: -7 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 1.35 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.28))' }}
          >
            <WaxSeal color={theme.id === 'midnight' ? '#8c6a2f' : '#8e1b2e'} size={58} initials={initials} />
          </motion.div>
        </div>
      </motion.article>
    </section>
  );
}
