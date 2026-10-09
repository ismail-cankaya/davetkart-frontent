import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { ease } from '../../../../utils/motion';
import { displayText, formatDateStr } from '../../utils';
import { HeroRenderProps } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { useCountdown } from '../../shared/useCountdown';
import { KurdeleCizim } from './Kurdele';
import { splitCouple, splitDateLabel } from './heroText';

export type KurdeleDensity = 'default' | 'compact';

export interface KurdeleHeroProps extends HeroRenderProps {
  /** 'compact': süslerin metin kolonunu daralttığı şablonlar (Dugun1, Dugun4, Dugun5). */
  density?: KurdeleDensity;
  /** 'upper': alt kenarı görselle dolu hero'larda metin bloğu üstten başlar (Dugun5). */
  placement?: 'center' | 'upper';
}

/** Görünür olurken aşağıdan süzülen öğe — tüm hero aynı eğriyle konuşur. */
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: ease.out, delay }
});

/**
 * Düğün kartı tarih düzeni: ay üstte, gün iri rakamla ortada; saat ve yıl
 * iki yanda üst-alt kıl çizgiler arasında. Biçim tanınmazsa tek satır.
 */
function DateBand({ label, theme, compact }: { label: string; theme: SectionTheme; compact: boolean }) {
  const parts = splitDateLabel(label);
  if (!parts) {
    return <span className={cn('font-serif italic text-lg @sm:text-xl', theme.heading)}>{label}</span>;
  }

  const side = cn(
    'border-y py-1.5 text-[10px] @sm:text-[11px] font-medium uppercase tracking-[0.26em] lining-nums tabular-nums',
    compact ? 'min-w-[3.75rem]' : 'min-w-[4.5rem] @sm:min-w-[5.5rem]',
    theme.border,
    theme.body
  );

  return (
    <div className="flex flex-col items-center">
      <span className={cn('text-[10px] @sm:text-[11px] font-semibold uppercase tracking-[0.42em] pl-[0.42em]', theme.accent)}>
        {parts.month}
      </span>
      <div className={cn('mt-2 flex items-center', compact ? 'gap-3' : 'gap-4 @sm:gap-5')}>
        <span className={side}>{parts.time}</span>
        <span
          className={cn(
            'font-serif font-medium leading-none lining-nums tabular-nums',
            compact ? 'text-4xl' : 'text-5xl @sm:text-6xl',
            theme.heading
          )}
        >
          {parts.day}
        </span>
        <span className={side}>{parts.year}</span>
      </div>
    </div>
  );
}

/** Kalan süre: karo yok; iki kıl çizgi arasında tek bir kurdele bandı. */
function CountdownRibbon({ invitation, theme, compact }: { invitation: HeroRenderProps['invitation']; theme: SectionTheme; compact: boolean }) {
  const { valid, days, hours, minutes, seconds } = useCountdown(invitation.date, invitation.timezone);
  if (!valid) return null;

  const units: Array<[number, string]> = [
    [days, 'Gün'],
    [hours, 'Saat'],
    [minutes, 'Dakika'],
    [seconds, 'Saniye']
  ];

  return (
    <div className={cn('flex items-stretch justify-center border-y', compact ? 'py-2' : 'py-3', theme.border)}>
      {units.map(([value, label], i) => (
        <React.Fragment key={label}>
          {i > 0 && <span aria-hidden="true" className={cn('w-px my-1', theme.divider)} />}
          <div className={cn('flex flex-col items-center', compact ? 'px-2 @sm:px-3 min-w-[3rem]' : 'px-3 @sm:px-5 min-w-[3.5rem]')}>
            <span
              className={cn(
                'font-serif font-medium leading-none lining-nums tabular-nums',
                compact ? 'text-xl @sm:text-2xl' : 'text-2xl @sm:text-3xl',
                theme.heading
              )}
            >
              {String(value).padStart(2, '0')}
            </span>
            <span className={cn('mt-1.5 text-[8px] @sm:text-[9px] font-semibold uppercase tracking-[0.22em]', theme.body)}>
              {label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Düğün kategorisinin hero'su — "Kurdele".
 *
 * Kategori dili üç fikirden kurulur: iki kurdele ucunun ortada buluşup
 * düğüm atması (açılış imzası), iki ismin karşı yanlardan gelip `&` işaretinde
 * buluşması ve düğün kartı tipografisi (italik serif isimler, geniş aralıklı
 * küçük başlıklar, ay-gün-yıl tarih düzeni). Summary'nin gösterdiği her bilgiyi
 * gösterir ve boş alanları onun gibi atlar; ek olarak kategori sloganı yazılır.
 *
 * `lang="tr"`: büyük harfe çevrilen satırlar (ay, mekân) arayüz dili ne olursa
 * olsun Türkçe kuralla yazılsın — "İstanbul" "ISTANBUL" olmasın.
 */
export function KurdeleHero({ invitation, theme, flavor, density = 'default', placement = 'center' }: KurdeleHeroProps) {
  const compact = density === 'compact';
  const couple = splitCouple(invitation.names);
  const title = displayText(invitation.title);
  const subtitle = displayText(invitation.subtitle);
  const dateLabel = formatDateStr(invitation.date);
  const venue = displayText(invitation.venue);

  const nameSize = compact
    ? 'text-[2.1rem] @sm:text-4xl @2xl:text-5xl'
    : 'text-[2.6rem] @sm:text-5xl @lg:text-6xl';

  return (
    <section
      lang="tr"
      className={cn(
        'relative flex-1 flex flex-col items-center text-center',
        placement === 'upper' ? 'justify-start' : 'justify-center',
        compact ? 'px-3 @sm:px-4 pt-10 pb-16' : 'px-6 pt-16 pb-20 @sm:pt-20',
        placement === 'upper' && 'pt-12 @sm:pt-16',
        theme.page
      )}
    >
      <div className={cn('relative z-10 flex flex-col items-center w-full', compact ? 'max-w-sm' : 'max-w-md')}>
        <KurdeleCizim
          size={compact ? 44 : 58}
          lineClassName={compact ? 'w-10 @sm:w-16' : 'w-14 @sm:w-24'}
          className={theme.accent}
          delay={0.1}
        />

        {title && (
          <motion.p
            {...rise(0.35)}
            className={cn(
              'mt-4 text-[10px] @sm:text-[11px] font-semibold uppercase tracking-[0.42em] pl-[0.42em] leading-relaxed max-w-[19rem]',
              theme.accent
            )}
          >
            {title}
          </motion.p>
        )}

        {/* İsimler: gelin soldan, damat sağdan gelir; `&` ortada buluştukları yerde belirir. */}
        <h1 className={cn('font-serif italic font-medium leading-[1.04] break-words w-full', compact ? 'mt-4' : 'mt-6', nameSize)}>
          {couple.kind === 'pair' ? (
            <>
              <motion.span
                className={cn('block', theme.heading)}
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.3, ease: ease.out, delay: 0.5 }}
              >
                {couple.first}
              </motion.span>
              <span className={cn('flex items-center justify-center', compact ? 'gap-2.5 my-0.5' : 'gap-3 @sm:gap-4 my-1')}>
                <motion.span
                  aria-hidden="true"
                  className={cn('h-px w-8 @sm:w-12 origin-left', theme.divider)}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, ease: ease.out, delay: 0.85 }}
                />
                <motion.span
                  className={cn('font-normal text-[0.72em] leading-none', theme.accent)}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: ease.out, delay: 1.05 }}
                >
                  &amp;
                </motion.span>
                <motion.span
                  aria-hidden="true"
                  className={cn('h-px w-8 @sm:w-12 origin-right', theme.divider)}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, ease: ease.out, delay: 0.85 }}
                />
              </span>
              <motion.span
                className={cn('block', theme.heading)}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.3, ease: ease.out, delay: 0.5 }}
              >
                {couple.second}
              </motion.span>
            </>
          ) : (
            <motion.span
              className={cn('block', theme.heading)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: ease.out, delay: 0.5 }}
            >
              {couple.text}
            </motion.span>
          )}
        </h1>

        <motion.p
          {...rise(1.15)}
          className={cn('font-serif italic', compact ? 'mt-3 text-lg' : 'mt-4 text-lg @sm:text-xl', theme.accent)}
        >
          {flavor.tagline}
        </motion.p>

        {subtitle && (
          <motion.p
            {...rise(1.25)}
            className={cn(
              'font-light leading-relaxed max-w-xs',
              compact ? 'mt-3 text-[13px]' : 'mt-5 text-sm @md:text-[15px]',
              theme.body
            )}
          >
            {subtitle}
          </motion.p>
        )}

        {(dateLabel || venue) && (
          <motion.div {...rise(1.4)} className={cn('flex flex-col items-center', compact ? 'mt-6 gap-3' : 'mt-8 gap-4')}>
            {dateLabel && <DateBand label={dateLabel} theme={theme} compact={compact} />}
            {venue && (
              <span
                className={cn(
                  'max-w-xs text-[11px] @sm:text-xs font-medium uppercase tracking-[0.2em] leading-relaxed',
                  theme.body
                )}
              >
                {venue}
              </span>
            )}
          </motion.div>
        )}

        {invitation.showTimer && (
          <motion.div {...rise(1.6)} className={compact ? 'mt-6' : 'mt-8'}>
            <CountdownRibbon invitation={invitation} theme={theme} compact={compact} />
          </motion.div>
        )}
      </div>

      {/* Kaydırma işareti: ipliğe dizili tek inci. Döngü CSS'te (index.css
          `animate-bob-down-6`), "hareketi azalt"ta orada durur. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className={cn('absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center', theme.body)}
      >
        <span className="h-7 w-px bg-current opacity-40" />
        <span className="block mt-1 w-1.5 h-1.5 rounded-full bg-current animate-bob-down-6" />
      </motion.div>
    </section>
  );
}
