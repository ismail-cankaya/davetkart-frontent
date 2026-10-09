import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { hasText } from '../../../../utils/text';
import { displayText, formatDateStr } from '../../utils';
import { HeroRenderProps } from '../InvitationComposition';
import { TrackingReveal } from '../TrackingReveal';
import { useCountdown } from '../useCountdown';
import { ease } from '../../../../utils/motion';

/**
 * Ufuk hero — bir filmin açılış jeneriği.
 *
 * Görselin kendisi arkadaki sahnededir (scenes/ufuk); bu katman yalnızca
 * tipografidir ve tek bir işi vardır: manzaranın ÖNÜNDE okunmak. Bunun için
 * üç önlem alınır:
 *
 *  1. Metin bloğunun arkasında, bloğun biçimini izleyen yumuşak bir okuma
 *     halesi durur. Kutu değildir — manzarayı kesmez, yalnızca metnin
 *     arkasındaki ışığı kısar. Ufuk parladığında beyaz başlık erimez.
 *  2. Başlıklar kendi gölgesini taşır; hale bittiği yerde de kenar korunur.
 *  3. Gövde metni 15 px'in altına inmez; sayaç ve künye koyu cam üzerindedir.
 *
 * ——— Geçişler ———
 *
 *  - Açılış: zarf yoksa ekran iki siyah perdeyle kapalı başlar ve perdeler
 *    ortadan ayrılır (sinema perdesi). Zarf varsa geçişi zarf yapar; perde
 *    ikinci kez kapanıp açılmaz.
 *  - İsimler maskeden yükselir: her satır kendi çizgisinin altından çıkar,
 *    jenerikteki gibi. Yalnızca transform — yeniden dizgi yok.
 *  - Çıkış kaydırmaya bağlıdır: blok sayfadan daha yavaş kayar, hafifçe
 *    küçülür ve söner; arkada sahne aynı anda geceye döner.
 */

const COUNTDOWN_LABELS = ['Gün', 'Saat', 'Dk', 'Sn'] as const;

/** "Cumartesi" — tarih ayrıştırılamazsa boş. */
function weekdayOf(value: string): string {
  if (!hasText(value)) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('tr-TR', { weekday: 'long' });
}

export interface UfukHeroProps extends HeroRenderProps {
  /** Okuma halesinin rengi (rgb üçlüsü) — sahnenin en koyu tonu. */
  scrim?: string;
  /** Açılış perdesinin rengi. */
  shutter?: string;
}

export function UfukHero({
  invitation,
  theme,
  flavor,
  scrollContainer,
  scrim = '8,8,20',
  shutter = '#05050b'
}: UfukHeroProps) {
  const { Ornament } = flavor;
  const sectionRef = useRef<HTMLElement>(null);
  const still = useReducedMotion();

  const { valid, days, hours, minutes, seconds } = useCountdown(invitation.date, invitation.timezone);

  // 🔴 `target` + `offset` ile izlenmez. Motion o biçimi tarayıcının yerel
  // ViewTimeline'ına devreder; davetiyenin iç kaydırma kabında bu zaman
  // çizelgesi ilerlemiyor ve blok açılıştan itibaren çıkışın SON karesinde
  // (aşağı kaymış, küçülmüş) donup kalıyordu. Hero kabın en üstünde durduğu
  // için ['start start', 'end start'] aralığı zaten "kaydırılan piksel / hero
  // yüksekliği"dir; işlev biçimindeki dönüşüm de hızlandırılamaz, JS'de kalır.
  const { scrollY } = useScroll({ container: scrollContainer });
  const exit = useTransform(scrollY, (y) => {
    const height = sectionRef.current?.offsetHeight || 1;
    return Math.min(1, Math.max(0, y / height));
  });
  const contentY = useTransform(exit, [0, 1], ['0%', still ? '0%' : '28%']);
  const contentScale = useTransform(exit, [0, 1], [1, still ? 1 : 0.94]);
  const contentOpacity = useTransform(exit, [0, 0.6], [1, 0]);
  const cueOpacity = useTransform(exit, [0, 0.12], [1, 0]);

  // Zarf açılışı zaten bir geçiş; perde yalnızca zarfsız davetiyede iner.
  const withShutter = !invitation.showEnvelope;
  const t0 = withShutter ? 0.9 : 0.35;

  const title = hasText(invitation.title) ? invitation.title : flavor.tagline;
  const names = invitation.names || 'Davetlisiniz';
  const parts = names.split(/\s+&\s+/);
  const lines = parts.length > 1 ? [parts[0], '&', parts.slice(1).join(' & ')] : [names];

  const dateParts = formatDateStr(invitation.date).split(' ');
  const dateText = dateParts.slice(0, 3).join(' ');
  const timeText = dateParts.length > 3 ? dateParts[dateParts.length - 1] : '';
  const weekday = weekdayOf(invitation.date);
  const venue = displayText(invitation.venue);

  const glowText = { textShadow: `0 2px 28px rgba(${scrim},0.65), 0 1px 2px rgba(${scrim},0.4)` };

  return (
    <section
      ref={sectionRef}
      className="relative flex-1 flex flex-col items-center justify-center px-6 @sm:px-10 pt-20 pb-32 @sm:pt-24 overflow-hidden"
    >
      {withShutter && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1/2 z-30 origin-top pointer-events-none"
            style={{ background: shutter }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 1.5, ease: ease.inOut, delay: 0.25 }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 z-30 origin-bottom pointer-events-none"
            style={{ background: shutter }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 1.5, ease: ease.inOut, delay: 0.25 }}
          />
          {/* Perdeler ayrılmadan önce aralıkta beliren ışık çizgisi. */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 h-px z-30 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,240,215,0.85), transparent)' }}
            initial={{ opacity: 0, scaleX: 0.15 }}
            animate={{ opacity: [0, 1, 0], scaleX: 1 }}
            transition={{ duration: 1.1, ease: ease.out }}
          />
        </>
      )}

      <motion.div
        style={{ y: contentY, scale: contentScale, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-md @2xl:max-w-xl flex flex-col items-center text-center"
      >
        {/* Okuma halesi: metnin arkasındaki ışığı kısar, manzarayı kesmez. */}
        <motion.div
          aria-hidden="true"
          className="absolute -inset-x-14 -inset-y-12 -z-10 pointer-events-none"
          style={{
            background: `radial-gradient(closest-side, rgba(${scrim},0.62), rgba(${scrim},0.4) 55%, rgba(${scrim},0) 100%)`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: ease.out, delay: t0 - 0.2 }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: ease.out, delay: t0 }}
          className={cn('text-[10px] @sm:text-[11px] font-semibold uppercase tracking-[0.34em] leading-relaxed', theme.accent)}
          style={glowText}
        >
          <TrackingReveal text={title} spread={0.18} duration={1.4} delay={t0} />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: ease.out, delay: t0 + 0.2 }}
          className={cn('flex items-center gap-3 mt-5', theme.accent)}
        >
          <span className="h-px w-10 bg-current opacity-50" />
          <Ornament size={22} />
          <span className="h-px w-10 bg-current opacity-50" />
        </motion.div>

        <h1
          className={cn(
            'font-serif font-medium leading-[1.02] tracking-[-0.01em] mt-5 break-words',
            'text-[2.6rem] @sm:text-[3.4rem] @2xl:text-7xl',
            theme.heading
          )}
          style={glowText}
        >
          {lines.map((line, i) => (
            // Maske: satır kendi kutusunun altından yükselir.
            <span key={`${line}-${i}`} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.2, ease: ease.out, delay: t0 + 0.35 + i * 0.16 }}
              >
                {line === '&' ? (
                  <span className={cn('italic font-normal text-[0.62em]', theme.accent)}>&amp;</span>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: ease.out, delay: t0 + 0.9 }}
          className={cn('block h-px w-28 mt-6 bg-gradient-to-r from-transparent via-current to-transparent', theme.accent)}
        />

        {hasText(invitation.subtitle) && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: t0 + 1 }}
            className={cn('mt-6 text-[15px] @md:text-base leading-relaxed font-light max-w-[20rem]', theme.page)}
            style={glowText}
          >
            {invitation.subtitle}
          </motion.p>
        )}

        {/* Künye: jeneriğin son kartı — ne zaman, nerede. */}
        {(dateText || venue) && (
          <motion.dl
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: t0 + 1.2 }}
            className="mt-8 flex flex-col @md:flex-row items-center @md:items-stretch justify-center gap-4 @md:gap-8"
            style={glowText}
          >
            {dateText && (
              <div className="flex flex-col items-center">
                <dt className={cn('text-[9px] font-semibold uppercase tracking-[0.32em]', theme.accent)}>
                  {weekday || 'Tarih'}
                </dt>
                <dd className={cn('font-serif text-lg @sm:text-xl mt-1.5', theme.heading)}>{dateText}</dd>
                {timeText && (
                  <dd className={cn('text-xs font-medium tracking-[0.2em] mt-1', theme.page)}>{timeText}</dd>
                )}
              </div>
            )}

            {dateText && venue && (
              <span aria-hidden="true" className={cn('w-8 h-px @md:w-px @md:h-auto', theme.divider)} />
            )}

            {venue && (
              <div className="flex flex-col items-center max-w-[17rem]">
                <dt className={cn('text-[9px] font-semibold uppercase tracking-[0.32em]', theme.accent)}>Mekân</dt>
                <dd className={cn('font-serif text-lg @sm:text-xl mt-1.5 leading-snug', theme.heading)}>{venue}</dd>
              </div>
            )}
          </motion.dl>
        )}

        {/* Sayaç: film zaman kodu gibi, koyu cam üzerinde. */}
        {invitation.showTimer && valid && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: t0 + 1.4 }}
            className={cn('mt-8 inline-flex items-center gap-2.5 @sm:gap-3.5 rounded-full border px-5 @sm:px-6 py-2.5', theme.surface, theme.border)}
          >
            {[days, hours, minutes, seconds].map((value, i) => (
              <React.Fragment key={COUNTDOWN_LABELS[i]}>
                {i > 0 && <span className={cn('font-serif text-lg -mt-3 opacity-60', theme.accent)}>:</span>}
                <span className="flex flex-col items-center min-w-[2.1rem]">
                  <span className={cn('font-serif text-xl @sm:text-2xl leading-none tabular-nums', theme.heading)}>
                    {String(value).padStart(2, '0')}
                  </span>
                  <span className={cn('text-[8px] font-semibold uppercase tracking-[0.2em] mt-1.5', theme.body)}>
                    {COUNTDOWN_LABELS[i]}
                  </span>
                </span>
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Kaydırma işareti: ilk kaydırmada söner. */}
      <motion.div style={{ opacity: cueOpacity }} className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: ease.out, delay: t0 + 2 }}
          className={cn('flex flex-col items-center gap-2', theme.page)}
        >
          <span className="text-[9px] font-medium uppercase tracking-[0.36em] opacity-80" style={glowText}>
            Kaydırın
          </span>
          <span className="relative block w-px h-9 overflow-hidden bg-current/20">
            <span
              data-atmosphere=""
              className="absolute inset-x-0 top-0 h-1/2 animate-ufuk-cue"
              style={{ background: 'linear-gradient(to bottom, transparent, currentColor)' }}
            />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
