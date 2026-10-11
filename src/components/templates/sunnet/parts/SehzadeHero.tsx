import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { ease } from '../../../../utils/motion';
import { displayText } from '../../utils';
import { HeroRenderProps } from '../../shared/InvitationComposition';
import { ChevronDownIcon, MapPinIcon } from '../../shared/icons';
import { KandilCountdown } from './KandilCountdown';
import { Kusak, KusakColors } from './Kusak';
import { eventDateParts, splitSehzadeNames } from './heroText';

export interface SehzadeHeroProps extends HeroRenderProps {
  /** Başlığın taşındığı kuşak. */
  sash: KusakColors;
  /** Sorguç rengi (hex); verilmezse `theme.accent`. */
  ornament?: string;
  /**
   * Okuma halesi (rgb üçlüsü). Video ya da yoğun parçacıklı zeminde metnin
   * arkasındaki ışığı kısar ve başlıklara gölge verir; sakin zeminde verilmez.
   */
  halo?: string;
  /** Arka planda saçak asılıysa blok onun altından başlar. */
  canopy?: boolean;
}

/**
 * Şehzade hero'su — sünnet kategorisinin varsayılan ön planı (Summary yerine).
 *
 * Düzen kıyafetten okunur: tepede sorguç, altında başlığı taşıyan kuşak,
 * ortada şehzadenin adı (Playfair italik, iri), adın altında aile adı küçük
 * büyük harfle. Sihirbazın iki alanı ("Çocuğun Adı", "Aile Adı") böylece
 * iki ayrı rol olarak okunur. Künye ve kandil pencereli sayaç en altta.
 *
 * Hareket "şenlik sallantısı"dır: sorguç yukarıdan yaylanarak oturur, kuşak
 * ortadan açılır, ad maskesinin altından yaylı yükselir. Boş alanlar çizilmez.
 */
export function SehzadeHero({ invitation, theme, flavor, sash, ornament, halo, canopy = false }: SehzadeHeroProps) {
  const { Ornament } = flavor;
  const { prince, family } = splitSehzadeNames(invitation.names);
  const { weekday, day, time } = eventDateParts(invitation.date);
  const title = displayText(invitation.title);
  const subtitle = displayText(invitation.subtitle);
  const venue = displayText(invitation.venue);
  const glow = halo ? { textShadow: `0 2px 22px rgba(${halo},0.6), 0 1px 2px rgba(${halo},0.45)` } : undefined;
  // bg-clip-text başlıkta (Krom) gölge degradenin ÜSTÜNE boyanır ve adı karartır.
  const headingGlow = theme.heading.includes('bg-clip-text') ? undefined : glow;

  return (
    <section
      className={cn(
        'relative flex-1 flex flex-col items-center justify-center px-6 @sm:px-10 pb-20 overflow-hidden',
        canopy ? 'pt-28 @sm:pt-32' : 'pt-16',
        theme.page
      )}
    >
      <div className="relative z-10 w-full max-w-md @2xl:max-w-xl flex flex-col items-center text-center">
        {halo && (
          <motion.div
            aria-hidden="true"
            className="absolute -inset-x-12 -inset-y-10 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(closest-side, rgba(${halo},0.58), rgba(${halo},0.34) 60%, rgba(${halo},0) 100%)`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: ease.out }}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: -28, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 110, damping: 11, delay: 0.1 }}
          className={ornament ? undefined : theme.accent}
          style={ornament ? { color: ornament } : undefined}
        >
          <Ornament size={48} />
        </motion.div>

        {title && (
          <Kusak colors={sash} delay={0.35} className="mt-5">
            {title}
          </Kusak>
        )}

        <h1
          className="font-serif italic font-semibold leading-[1.04] tracking-[-0.01em] mt-6 break-words text-[2.6rem] @sm:text-6xl @2xl:text-7xl"
          style={headingGlow}
        >
          {/* Maske: ad kendi satırının altından yükselir. İtalik taşmalar ve
              Türkçe büyük harf işaretleri (İ, Ğ) için dört yönde pay var. */}
          <span className="block overflow-hidden px-[0.12em] -mx-[0.12em] pt-[0.14em] -mt-[0.14em] pb-[0.2em] -mb-[0.2em]">
            <motion.span
              className={cn('block', theme.heading)}
              initial={{ y: '115%' }}
              animate={{ y: '0%' }}
              transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.55 }}
            >
              {prince}
            </motion.span>
          </span>
        </h1>

        {family && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: ease.out, delay: 0.95 }}
            className={cn(
              'mt-4 flex items-center justify-center gap-3 text-[11px] @sm:text-xs font-semibold uppercase tracking-[0.3em]',
              theme.accent
            )}
            style={glow}
          >
            <span aria-hidden="true" className="h-px w-6 shrink-0 bg-current opacity-60" />
            <span className="mr-[-0.3em]">{family}</span>
            <span aria-hidden="true" className="h-px w-6 shrink-0 bg-current opacity-60" />
          </motion.p>
        )}

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: 1.05 }}
            className={cn('mt-6 text-sm @md:text-base leading-relaxed font-light max-w-xs', theme.body)}
            style={glow}
          >
            {subtitle}
          </motion.p>
        )}

        {(day || venue) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: 1.2 }}
            className="mt-8 flex flex-col items-center gap-2"
            style={headingGlow}
          >
            <span
              aria-hidden="true"
              className={cn('block h-px w-24 mb-2 bg-gradient-to-r from-transparent via-current to-transparent opacity-70', theme.accent)}
            />
            {day && (
              <div className="flex flex-col items-center">
                {weekday && (
                  <span className={cn('text-[10px] font-semibold uppercase tracking-[0.32em] mr-[-0.32em]', theme.accent)}>
                    {weekday}
                  </span>
                )}
                <span className={cn('font-serif text-xl @sm:text-2xl mt-1', theme.heading)}>{day}</span>
                {time && (
                  <span className={cn('text-xs font-medium tracking-[0.24em] mt-1 mr-[-0.24em]', theme.body)}>{time}</span>
                )}
              </div>
            )}
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
            delay={1.35}
            className="mt-8"
          />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className={cn('absolute bottom-6 left-1/2 -translate-x-1/2', theme.body)}
      >
        {/* Döngü index.css'te; "hareketi azalt"ta durur. */}
        <div className="animate-bob-down-6">
          <ChevronDownIcon size={20} />
        </div>
      </motion.div>
    </section>
  );
}
