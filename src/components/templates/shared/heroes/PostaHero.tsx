import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Posta Damgası hero — davetin YOL ALMIŞ olduğu düzen.
 *
 * Kağıt & Mühür daveti henüz açılmamış bir kart olarak sunar; Bilet ise
 * girişte yırtılacak bir koçan. Posta ikisinden de farklı bir zaman kipi
 * taşır: bu davet zaten yollandı, damgalandı ve size ulaştı. Bu yüzden
 * kompozisyonun merkezinde isim değil, ADRES BLOĞU var.
 *
 * Damga girişte tek seferlik BASILIR: büyükten küçüğe, hafif dönerek.
 * Sürekli animasyon eklenmedi — damga bir kez vurulur.
 */

/** Uçak postası zarfının kenarındaki kırmızı-mavi eğik şerit. */
function AirmailBorder({ a, b }: { a: string; b: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        padding: '7px',
        background: `repeating-linear-gradient(45deg, ${a} 0 8px, transparent 8px 16px, ${b} 16px 24px, transparent 24px 32px)`,
        WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude'
      }}
    />
  );
}

export interface PostaHeroProps extends HeroRenderProps {
  /** Şeridin iki rengi (klasik uçak postası: kırmızı + lacivert). */
  stripe?: readonly [string, string];
  /** Pulun zemin rengi. */
  stamp?: string;
  /** Damga mürekkebi. */
  postmark?: string;
}

export function PostaHero({
  invitation,
  theme,
  flavor,
  stripe = ['#b8323f', '#1f4e8c'],
  stamp = '#c9a961',
  postmark = '#2f4f6b'
}: PostaHeroProps) {
  const { Ornament } = flavor;
  const { valid, days, hours } = useCountdown(invitation.date);
  const arcId = React.useId().replace(/:/g, '');

  const dateParts = formatDateStr(invitation.date).split(' ');
  const dateText = dateParts.slice(0, 3).join(' ');

  return (
    <section className="relative flex-1 flex items-center justify-center px-5 @sm:px-8 py-12 @sm:py-16">
      <motion.article
        initial={{ opacity: 0, y: 24, rotate: -0.8 }}
        animate={{ opacity: 1, y: 0, rotate: -0.8 }}
        transition={{ duration: 1, ease: EASE_LUXE }}
        className={cn('relative w-full max-w-[22rem] @sm:max-w-sm rounded-[3px] border', theme.border, theme.surface)}
        style={{ boxShadow: '0 20px 40px -24px rgba(0,0,0,0.45)' }}
      >
        <AirmailBorder a={stripe[0]} b={stripe[1]} />

        <div className="relative px-6 @sm:px-8 py-7 @sm:py-9">
          {/* Üst şerit: sol "PAR AVION" etiketi, sağda pul. */}
          <div className="flex items-start justify-between gap-4">
            <span
              className="text-[7.5px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-[2px]"
              style={{ background: stripe[1], color: '#f4f7fb' }}
            >
              Uçak Postası
            </span>

            {/* Pul: tırtıllı kenar radial-gradient ile kesilir. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: 8 }}
              animate={{ opacity: 1, scale: 1, rotate: 2.5 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.35 }}
              className="relative w-14 h-16 @sm:w-16 @sm:h-[4.6rem] shrink-0 flex flex-col items-center justify-center gap-1"
              style={{
                background: stamp,
                WebkitMaskImage:
                  'radial-gradient(circle at 50% 0, transparent 3px, #000 3.2px), radial-gradient(circle at 50% 100%, transparent 3px, #000 3.2px)',
                maskImage:
                  'radial-gradient(circle at 50% 0, transparent 3px, #000 3.2px), radial-gradient(circle at 50% 100%, transparent 3px, #000 3.2px)',
                WebkitMaskSize: '8px 100%, 8px 100%',
                maskSize: '8px 100%, 8px 100%',
                WebkitMaskRepeat: 'repeat-x',
                maskRepeat: 'repeat-x'
              }}
            >
              <span className="text-[#2b2318]/80">
                <Ornament size={22} />
              </span>
              <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#2b2318]/75">Davet</span>
            </motion.div>
          </div>

          {/* Adres bloğu: kompozisyonun merkezi. Yazı çizgilerin ÜSTÜNE
              oturur, elle doldurulmuş gibi. */}
          <div className="mt-6 @sm:mt-7">
            <span className={cn('text-[8px] font-semibold uppercase tracking-[0.24em]', theme.body)}>Alıcı</span>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.25 }}
              className={cn('font-serif font-normal leading-[1.15] mt-1.5 text-[1.7rem] @sm:text-[2.1rem] break-words', theme.heading)}
            >
              {invitation.names || 'Davetlisiniz'}
            </motion.h1>

            <div className={cn('mt-3 space-y-2.5')}>
              {[invitation.venue, `${dateText} · ${dateParts.slice(-1)[0]}`].map((line, i) => (
                <div key={i} className="relative">
                  <span className={cn('block text-[11.5px] font-medium pb-1 leading-snug', theme.heading)}>{line}</span>
                  <span className={cn('block h-px', theme.divider)} />
                </div>
              ))}
            </div>
          </div>

          <p className={cn('text-[11.5px] leading-relaxed font-light mt-5 max-w-[17rem]', theme.body)}>
            {invitation.subtitle}
          </p>

          {/* Damga: adres bloğunun sağ altına, kısmen taşarak basılır.
              Tam ortaya hizalansaydı "logo" gibi okunurdu. */}
          <motion.div
            initial={{ opacity: 0, scale: 1.6, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: -11 }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay: 0.9 }}
            className="absolute -bottom-2 right-4 @sm:right-6 w-24 h-24 @sm:w-28 @sm:h-28 pointer-events-none"
            style={{ opacity: 0.78 }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
              <defs>
                <path id={arcId} d="M18 50 A32 32 0 0 1 82 50" fill="none" />
                <path id={`${arcId}-b`} d="M20 52 A30 30 0 0 0 80 52" fill="none" />
              </defs>
              <circle cx="50" cy="50" r="38" fill="none" stroke={postmark} strokeWidth={2.2} strokeOpacity={0.85} />
              <circle cx="50" cy="50" r="31" fill="none" stroke={postmark} strokeWidth={1} strokeOpacity={0.6} />
              <text fill={postmark} fillOpacity={0.9} style={{ fontSize: '7.5px', letterSpacing: '1px', fontWeight: 700 }}>
                <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
                  DAVETKART
                </textPath>
              </text>
              <text fill={postmark} fillOpacity={0.85} style={{ fontSize: '6.5px', letterSpacing: '0.6px' }}>
                <textPath href={`#${arcId}-b`} startOffset="50%" textAnchor="middle">
                  {dateText}
                </textPath>
              </text>
              {/* Damganın iptal çizgileri. */}
              {[44, 50, 56].map((y) => (
                <line key={y} x1="26" y1={y} x2="74" y2={y} stroke={postmark} strokeWidth={1.4} strokeOpacity={0.55} />
              ))}
            </svg>
          </motion.div>

          {invitation.showTimer && valid && (
            <div className={cn('mt-6 pt-4 border-t flex items-baseline gap-2', theme.border)}>
              <span className={cn('font-serif font-bold tabular-nums text-xl', theme.accent)}>{days}</span>
              <span className={cn('text-[10px] font-semibold uppercase tracking-[0.16em]', theme.body)}>
                gün {String(hours).padStart(2, '0')} saat kaldı
              </span>
            </div>
          )}
        </div>
      </motion.article>
    </section>
  );
}
