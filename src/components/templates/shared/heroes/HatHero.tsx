import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Tek Çizgi hero — davetiyenin gözünüzün önünde ÇİZİLDİĞİ düzen.
 *
 * Diğer dillerde hareket ya atmosferdedir (Aurora'nın mesh'i, Vitray'ın
 * ışığı) ya da tipografidedir (Kinetik'in şeritleri). Burada hareket
 * çizginin KENDİSİDİR: kartuş tek bir sürekli hatla, mürekkep kağıda
 * akıyormuş gibi çizilir; metin ancak çizgi tamamlandıktan sonra belirir.
 *
 * Bunu mümkün kılan tek şey `pathLength` animasyonu: motion, yol uzunluğunu
 * 0'dan 1'e götürürken stroke-dasharray'i kendisi hesaplar, bu yüzden
 * yolun gerçek piksel uzunluğunu bilmemize gerek kalmaz — kadraj
 * değiştiğinde çizim hızı bozulmaz.
 *
 * Palet bilinçli olarak iki renkten ibaret (mürekkep + tek vurgu) ve boşluk
 * cömerttir; monoline dilin tamamı "az çizgi, çok boşluk" üzerine kuruludur.
 */

export interface HatHeroProps extends HeroRenderProps {
  /** Kartuşun çizilme süresi (saniye). */
  drawDuration?: number;
}

export function HatHero({ invitation, theme, flavor, drawDuration = 2.6 }: HatHeroProps) {
  const reduced = useReducedMotion();
  const { valid, days, hours, minutes } = useCountdown(invitation.date);
  const { Ornament } = flavor;

  // Hareketi azaltma tercihinde çizim atlanır ve kartuş TAM çizilmiş
  // başlar: animasyonu silmek kompozisyonu eksik bırakmamalı.
  const drawProps = (delay: number) =>
    reduced
      ? { initial: { pathLength: 1, opacity: 1 }, animate: { pathLength: 1, opacity: 1 } }
      : {
          initial: { pathLength: 0, opacity: 0.9 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: drawDuration, ease: EASE_LUXE, delay }
        };

  // Metin çizgiden SONRA gelir; gecikmeler çizim süresine bağlı.
  const textDelay = reduced ? 0 : drawDuration * 0.55;

  return (
    <section className="relative flex-1 flex items-center justify-center px-6 @sm:px-10 py-14 @sm:py-20">
      <div className="relative w-full max-w-[20rem] @sm:max-w-sm">
        {/* Kartuş: dikeyde gerilen tek bir SVG. `non-scaling-stroke` olmasa
            uzun isimlerde kutu uzadıkça yatay çizgiler dikeylerden ince
            görünürdü. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={cn('absolute inset-0 w-full h-full', theme.accent)}
        >
          <motion.path
            d="M50 3 L92 3 Q97 3 97 8 L97 92 Q97 97 92 97 L8 97 Q3 97 3 92 L3 8 Q3 3 8 3 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={0.55}
            vectorEffect="non-scaling-stroke"
            {...drawProps(0.15)}
          />
          {/* İç hat: dışarıdakinin yarısı opaklıkta ve ters yönde çizilir.
              Tek çizgi yalnız kalsaydı kartuş "kutu", iki çizgiyle
              "gravür" okunur. */}
          <motion.path
            d="M50 7 L88 7 Q93 7 93 12 L93 88 Q93 93 88 93 L12 93 Q7 93 7 88 L7 12 Q7 7 12 7 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={0.22}
            vectorEffect="non-scaling-stroke"
            {...drawProps(0.4)}
          />
        </svg>

        {/* Madalyon kartuşun üst kenarına BİNER ve zemin rengiyle çizgiyi
            keser — süsleme çerçevenin içine sıkışmak yerine onu deler. */}
        <div
          className={cn(
            'absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center border',
            theme.base,
            theme.border
          )}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: EASE_LUXE, delay: textDelay }}
            className={theme.accent}
          >
            <Ornament size={26} />
          </motion.span>
        </div>

        <div className="relative px-8 @sm:px-10 pt-16 @sm:pt-20 pb-12 @sm:pb-14 flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: textDelay + 0.1 }}
            className={cn('text-[9px] font-semibold uppercase tracking-[0.44em]', theme.accent)}
          >
            {invitation.title}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE_LUXE, delay: textDelay + 0.24 }}
            className={cn(
              'font-serif font-light leading-[1.12] mt-5 text-[1.8rem] @sm:text-[2.4rem] break-words',
              theme.heading
            )}
          >
            {invitation.names || 'Davetlisiniz'}
          </motion.h1>

          {/* Ayırıcı da çizilir: kompozisyondaki her çizgi aynı kurala uyar. */}
          <motion.span
            initial={{ scaleX: reduced ? 1 : 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: textDelay + 0.4 }}
            className={cn('block h-px w-20 my-6 origin-center', theme.divider)}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: textDelay + 0.5 }}
            className={cn('text-[12.5px] leading-[1.9] font-light max-w-[15rem]', theme.body)}
          >
            {invitation.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: textDelay + 0.62 }}
            className="mt-8 flex flex-col items-center gap-2"
          >
            <span className={cn('font-serif italic text-lg @sm:text-xl', theme.heading)}>
              {formatDateStr(invitation.date)}
            </span>
            <span className={cn('text-[9.5px] uppercase tracking-[0.3em]', theme.body)}>
              {invitation.venue}
            </span>
          </motion.div>

          {invitation.showTimer && valid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: EASE_LUXE, delay: textDelay + 0.75 }}
              className="mt-7 flex items-center gap-3"
            >
              {[
                { v: days, l: 'gün' },
                { v: hours, l: 'saat' },
                { v: minutes, l: 'dk' }
              ].map((unit, i) => (
                <React.Fragment key={unit.l}>
                  {i > 0 && <span className={cn('w-px h-3', theme.divider)} aria-hidden="true" />}
                  <span className="flex items-baseline gap-1">
                    <span className={cn('font-serif tabular-nums text-base', theme.heading)}>
                      {String(unit.v).padStart(2, '0')}
                    </span>
                    <span className={cn('text-[9px] uppercase tracking-[0.2em]', theme.body)}>{unit.l}</span>
                  </span>
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
