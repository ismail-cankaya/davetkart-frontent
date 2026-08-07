import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Vinil Plak hero — kompozisyonun DAİRESEL olduğu tek düzen.
 *
 * Bütün diğer hero'lar dikdörtgen bir hiyerarşi kurar: üstte etiket, ortada
 * isim, altta bilgi. Plak bunu merkezden dışa doğru çözer — bilgi
 * halkalarda taşınır, göz merkeze kilitlenir. Davetin "an"ı bir şarkının
 * başlangıcı gibi okunur.
 *
 * Bir tasarım kararı fizikle çelişiyor ve bilinçli: DÖNEN yalnızca tırnak
 * halkalarıdır, etiket sabittir. Gerçek plakta etiket de dönerdi ama o
 * zaman isim ve tarih okunamazdı; hareketi tırnaklara bırakmak dönme
 * hissini korurken metni sabit tutuyor.
 */

export interface PlakHeroProps extends HeroRenderProps {
  /** Etiket (merkez daire) rengi — kategori kimliğini taşıyan asıl renk. */
  label?: string;
  /** Etiket üzerindeki metin rengi. */
  labelInk?: string;
  /** Plak gövdesinin rengi; varsayılan neredeyse siyah. */
  disc?: string;
  /** Tam turun saniyesi. Küçük değer = hızlı dönüş. */
  spinDuration?: number;
}

export function PlakHero({
  invitation,
  theme,
  flavor,
  label = '#b8323f',
  labelInk = '#fdf6ec',
  disc = '#141416',
  spinDuration = 46
}: PlakHeroProps) {
  const reduced = useReducedMotion();
  const { valid, days, hours } = useCountdown(invitation.date);
  const { Ornament } = flavor;

  // Kavisli başlık için benzersiz path kimliği: aynı sayfada iki plak
  // olursa textPath'ler birbirine bağlanmasın.
  const arcId = React.useId().replace(/:/g, '');

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center px-5 @sm:px-8 py-12 @sm:py-16 gap-8 @sm:gap-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE_LUXE }}
        className="relative w-[min(76%,19rem)] @sm:w-[min(70%,21rem)] aspect-square"
      >
        {/* Tırnaklar: dönen tek katman. Eş aralıklı halkalar yerine
            merkeze doğru sıklaşan iki ayrı repeating-gradient — gerçek
            plakta da tırnak aralığı sabit değildir. */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: spinDuration, ease: 'linear', repeat: Infinity }}
          style={{
            background: `
              repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.07) 0 1px, rgba(255,255,255,0) 1px 4px),
              repeating-radial-gradient(circle at 50% 50%, rgba(0,0,0,0.35) 0 2px, rgba(0,0,0,0) 2px 7px),
              radial-gradient(circle at 50% 50%, ${disc} 38%, #0b0b0d 72%, ${disc} 100%)
            `,
            boxShadow: '0 24px 48px -18px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.06)'
          }}
        />

        {/* Parlama SABİT: ışık plağa değil odaya aittir, plak dönerken
            highlight yerinde kalır. Dönen katmana konsaydı efekt
            "boyanmış" görünürdü. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen"
          style={{
            background:
              'conic-gradient(from 210deg at 50% 50%, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.14) 32deg, rgba(255,255,255,0) 74deg, rgba(255,255,255,0) 180deg, rgba(255,255,255,0.1) 212deg, rgba(255,255,255,0) 252deg)'
          }}
        />

        {/* Etiket çevresinde kavisli başlık — plak kapağının imzası.
            Yay bilinçli olarak YALNIZCA ÜST YARIM daire: tam çember
            kullanılsaydı alt yaydaki harfler baş aşağı dönerdi (gerçek
            plakta öyledir ama ekranda hata gibi okunur). Başlık yay
            uzunluğunu aşarsa SVG kalanını sessizce kırpacağı için metin
            önceden kısaltılıyor — eksik kelime yerine görünür bir "…". */}
        <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <defs>
            <path id={arcId} d="M11 50 A39 39 0 0 1 89 50" fill="none" />
          </defs>
          <text
            fill={labelInk}
            fillOpacity={0.75}
            style={{ fontSize: '4.4px', letterSpacing: '1.2px', textTransform: 'uppercase' }}
          >
            <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
              {invitation.title.length > 30 ? `${invitation.title.slice(0, 29).trimEnd()}…` : invitation.title}
            </textPath>
          </text>
        </svg>

        {/* Etiket: sabit merkez. */}
        <div
          className="absolute inset-[29%] rounded-full flex flex-col items-center justify-center text-center px-3 overflow-hidden"
          style={{ background: label, color: labelInk }}
        >
          <span className="opacity-80">
            <Ornament size={18} />
          </span>

          <h1 className="font-serif font-bold leading-[1.05] mt-1.5 text-[0.95rem] @sm:text-lg break-words line-clamp-2">
            {invitation.names || 'Davetlisiniz'}
          </h1>

          <span className="mt-1 text-[7.5px] @sm:text-[8.5px] font-semibold uppercase tracking-[0.16em] opacity-80">
            {formatDateStr(invitation.date).split(' ').slice(0, 3).join(' ')}
          </span>

          {/* İğne deliği: merkezdeki boşluk plağın en tanıdık detayı. */}
          <span
            aria-hidden="true"
            className={cn('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[7%] aspect-square rounded-full', theme.base)}
            style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.35)' }}
          />
        </div>

        {/* Pikap iğnesi: sağ üstten etikete uzanan ince kol. Plağın
            "çalıyor" olduğunu anlatan tek işaret. */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, rotate: -14 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: EASE_LUXE, delay: 0.5 }}
          className="absolute -top-3 -right-2 w-1/2 origin-top-right"
        >
          <div className={cn('h-px w-full rotate-[38deg] origin-right', theme.divider)} />
          <span className={cn('absolute right-0 top-0 w-1.5 h-1.5 rounded-full', theme.accentBg)} />
        </motion.div>
      </motion.div>

      {/* Künye şeridi — plak kapağının arka yüzündeki bilgi satırı. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.35 }}
        className="w-full max-w-sm"
      >
        <p className={cn('text-[12px] leading-relaxed font-light text-center', theme.body)}>
          {invitation.subtitle}
        </p>

        <div className={cn('mt-5 grid grid-cols-3 border-t border-b divide-x', theme.border)}>
          {[
            { l: 'Saat', v: formatDateStr(invitation.date).split(' ').slice(-1)[0] },
            { l: 'Mekân', v: invitation.venue },
            { l: 'Kalan', v: invitation.showTimer && valid ? `${days}g ${String(hours).padStart(2, '0')}s` : '—' }
          ].map((cell) => (
            <div key={cell.l} className={cn('px-3 py-3 text-center min-w-0', theme.border)}>
              <span className={cn('block text-[8px] font-semibold uppercase tracking-[0.2em]', theme.accent)}>
                {cell.l}
              </span>
              <span className={cn('block text-[11px] font-medium mt-1 truncate', theme.heading)}>{cell.v}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
