import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { ease } from '../../../../utils/motion';
import { displayText } from '../../utils';
import { HeroRenderProps } from '../../shared/InvitationComposition';
import { ChevronDownIcon, MapPinIcon } from '../../shared/icons';
import { BindalliDal } from './BindalliDal';
import { DAMGA_KINA, DamgaColors, KinaDamga } from './KinaDamga';
import { MumSayac } from './MumSayac';
import { SatirSayac } from './SatirSayac';
import { kinaDateParts, splitKinaNames } from './heroText';

export interface KinaHeroProps extends HeroRenderProps {
  /** Ortalı tören düzeni ya da sola yaslı afiş düzeni. */
  align?: 'center' | 'start';
  /** Adlar alt alta (damga arada) ya da tek satırda; tek satır hero'yu ~130 px kısaltır. */
  names?: 'stack' | 'line';
  /** Geri sayım: dört mum ya da kıl çizgiler arasında tek satır. */
  timer?: 'mum' | 'satir';
  /** Tepedeki süs (kına tepsisi); sahnesi zaten tepsi olan şablonda kapatılır. */
  ornament?: boolean;
  /** Metnin oturduğu yüzey: yok, kemer pencere ya da buzlu cam. */
  panel?: 'none' | 'kemer' | 'cam';
  /** Okuma halesi (rgb üçlüsü): video ya da yoğun zeminde metnin arkasını kısar. */
  halo?: string;
  /** Ampersan lekesinin tonları ve üstündeki "&" rengi (hex). */
  damga?: DamgaColors;
  damgaInk?: string;
  /** Mum sayacının alev rengi (hex). */
  flame?: string;
  /** Bölüme eklenen sınıflar (ör. alttaki sahne için boşluk); twMerge ile birleşir. */
  className?: string;
}

const PANEL: Record<NonNullable<KinaHeroProps['panel']>, string> = {
  none: '',
  kemer: 'rounded-t-[999px] rounded-b-[18px] border px-6 @sm:px-12 pt-16 @sm:pt-20 pb-10',
  cam: 'rounded-[28px] border px-6 @sm:px-10 py-10 shadow-2xl shadow-black/30'
};

/**
 * Kına hero'su — kategorinin ön planı (Summary yerine).
 *
 * Düzen tören sırasını izler: tepsi yakılır, başlık, gelin ve damadın adları
 * arasında avuca konan kına damgası (&), bindallı dalı, künye ve mum sayacı.
 * Hareket "yakılma ve titreme"dir: öğeler bulanıktan netleşerek yükselir, leke
 * ortadan yayılır, alevler titrer. Boş alanlar çizilmez.
 */
export function KinaHero({
  invitation,
  theme,
  flavor,
  align = 'center',
  names = 'stack',
  timer = 'mum',
  ornament = true,
  panel = 'none',
  halo,
  damga = DAMGA_KINA,
  damgaInk = '#fff4ea',
  flame,
  className
}: KinaHeroProps) {
  const { Ornament } = flavor;
  const { first, second } = splitKinaNames(invitation.names);
  const { weekday, day, time } = kinaDateParts(invitation.date);
  const title = displayText(invitation.title);
  const subtitle = displayText(invitation.subtitle);
  const venue = displayText(invitation.venue);
  const center = align === 'center';
  const line = names === 'line';
  const when = [weekday, time && `Saat ${time}`].filter(Boolean).join(' · ');
  // bg-clip-text başlıkta (Krom) gölge degradenin üstüne boyanır; orada verilmez.
  const glow = halo && !theme.heading.includes('bg-clip-text')
    ? { textShadow: `0 2px 20px rgba(${halo},0.55), 0 1px 2px rgba(${halo},0.4)` }
    : undefined;

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 1.1, ease: ease.out, delay }
  });

  return (
    <section
      lang="tr"
      className={cn(
        'relative flex-1 flex flex-col justify-center pt-20 pb-24 overflow-hidden',
        panel === 'none' ? 'px-6 @sm:px-10' : 'px-4 @sm:px-10',
        center ? 'items-center' : 'items-start @md:px-16',
        theme.page,
        className
      )}
    >
      <div
        className={cn(
          'relative z-10 w-full flex flex-col',
          center ? 'items-center text-center max-w-md @2xl:max-w-xl' : 'items-start text-left max-w-lg',
          PANEL[panel],
          panel !== 'none' && cn(theme.surface, theme.border)
        )}
      >
        {panel === 'kemer' && (
          <span aria-hidden="true" className={cn('absolute inset-[7px] rounded-t-[999px] rounded-b-[12px] border pointer-events-none', theme.border)} />
        )}
        {halo && (
          <motion.div
            aria-hidden="true"
            className="absolute -inset-x-14 -inset-y-12 -z-10 pointer-events-none"
            style={{ background: `radial-gradient(closest-side, rgba(${halo},0.62), rgba(${halo},0.36) 62%, rgba(${halo},0) 100%)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: ease.out }}
          />
        )}

        {ornament && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, ease: ease.out }}
            className={theme.accent}
          >
            <Ornament size={46} />
          </motion.div>
        )}

        {title && (
          <motion.p
            {...rise(0.25)}
            className={cn(ornament && 'mt-5', 'text-[10px] @sm:text-[11px] font-semibold uppercase tracking-[0.34em] leading-relaxed', center && 'mr-[-0.34em]', theme.accent)}
            style={glow}
          >
            {title}
          </motion.p>
        )}

        <h1
          className={cn(
            'mt-4 font-serif font-medium leading-[1.04] tracking-[-0.01em] [overflow-wrap:anywhere] w-full',
            line
              ? 'text-[2.3rem] @sm:text-[3.4rem] @2xl:text-6xl'
              : center
                ? 'text-[2.6rem] @sm:text-6xl @2xl:text-7xl'
                : 'text-[2.9rem] @sm:text-7xl @2xl:text-8xl',
            line && cn('flex flex-wrap items-center gap-x-3 @sm:gap-x-4 gap-y-1', center ? 'justify-center' : 'justify-start'),
            theme.heading
          )}
          style={glow}
        >
          <motion.span {...rise(0.45)} className={line ? 'min-w-0' : 'block'}>
            {first}
          </motion.span>
          {second && (
            <span className={cn('flex items-center', line ? 'contents' : center ? 'flex-col' : 'flex-row gap-3 @sm:gap-4 mt-1')}>
              <motion.span
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.3, ease: ease.out, delay: 0.7 }}
                className={cn('inline-flex shrink-0', center && !line && 'my-2.5')}
              >
                <KinaDamga colors={damga} className={line ? 'w-10 h-10 @sm:w-12 @sm:h-12' : 'w-12 h-12 @sm:w-14 @sm:h-14'}>
                  <span
                    className={cn(
                      'block font-cormorant italic font-semibold leading-none translate-y-[-0.04em]',
                      line ? 'text-[1.6rem] @sm:text-[1.9rem]' : 'text-[1.9rem] @sm:text-[2.2rem]'
                    )}
                    style={{ color: damgaInk, textShadow: 'none' }}
                  >
                    &amp;
                  </span>
                </KinaDamga>
              </motion.span>
              <motion.span {...rise(0.85)} className={line ? 'min-w-0' : 'block min-w-0'}>
                {second}
              </motion.span>
            </span>
          )}
        </h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, ease: ease.out, delay: 1 }}
          className={cn('mt-6', center ? 'origin-center' : 'origin-left', theme.accent)}
        >
          <BindalliDal className="block w-40 @sm:w-48 h-auto" />
        </motion.div>

        {subtitle && (
          <motion.p
            {...rise(1.05)}
            className={cn('mt-5 text-sm @md:text-base leading-relaxed font-light max-w-xs', theme.body)}
            style={glow}
          >
            {subtitle}
          </motion.p>
        )}

        {(day || venue) && (
          <motion.div
            {...rise(1.2)}
            className={cn('mt-7 flex flex-col gap-1.5', center ? 'items-center' : 'items-start')}
            style={glow}
          >
            {day && (
              <>
                {when && (
                  <span className={cn('text-[10px] @sm:text-[11px] font-semibold uppercase tracking-[0.3em]', center && 'mr-[-0.3em]', theme.accent)}>
                    {when}
                  </span>
                )}
                <span className={cn('font-serif text-2xl @sm:text-[1.75rem] leading-tight', theme.heading)}>{day}</span>
              </>
            )}
            {venue && (
              <span className={cn('mt-1.5 block max-w-[20rem] text-[11px] @md:text-xs font-medium uppercase tracking-[0.16em] leading-snug', theme.body)}>
                {/* Satır içi: uzun mekân kırılsa da iğne ilk kelimeye yapışık kalır. */}
                <MapPinIcon size={13} className={cn('inline-block align-[-2px] mr-1.5', theme.accent)} />
                {venue}
              </span>
            )}
          </motion.div>
        )}

        {invitation.showTimer && timer === 'satir' && (
          <SatirSayac date={invitation.date} timeZone={invitation.timezone} theme={theme} delay={1.35} className="mt-8" />
        )}
        {invitation.showTimer && timer === 'mum' && (
          <MumSayac
            date={invitation.date}
            timeZone={invitation.timezone}
            theme={theme}
            flame={flame}
            delay={1.35}
            className="mt-8"
          />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className={cn('absolute bottom-6 left-1/2 -translate-x-1/2 z-10', theme.body)}
      >
        {/* Döngü index.css'te; "hareketi azalt"ta durur. */}
        <div className="animate-bob-down-6">
          <ChevronDownIcon size={20} />
        </div>
      </motion.div>
    </section>
  );
}
