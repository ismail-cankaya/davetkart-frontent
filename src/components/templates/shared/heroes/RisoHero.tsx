import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';
import { Halftone } from '../effects';

/**
 * Risograph Poster hero — düz renk, tram dokusu, kayık baskı.
 *
 * Risograph'ı tanımlayan üç şey burada birebir taklit edilir:
 *  1. Degrade YOK. Renkler düz spot mürekkep gibi basılır.
 *  2. Her renk kendi tram açısıyla basılır (15° ve 75°); aynı açı
 *     kullanılsaydı moiré oluşurdu — gerçek baskıda da böyledir.
 *  3. Misregistration: başlık iki kez, birkaç piksel kaymış olarak basılır.
 *     Bu "hata" risograph'ın imzasıdır; düzeltmek dili yok eder.
 *
 * Yerleşim afiş mantığında: sola yaslı, iri, hiyerarşi keskin.
 */
export function RisoHero({ invitation, theme, flavor }: HeroRenderProps) {
  const { valid, days, hours } = useCountdown(invitation.date);
  const { Ornament } = flavor;
  const names = invitation.names || 'Davetlisiniz';

  return (
    <section className="relative flex-1 flex flex-col justify-center px-6 @sm:px-9 py-12 @sm:py-16 overflow-hidden">
      {/* Düz renk kütleleri — poster kompozisyonunun iskeleti. */}
      <motion.span
        aria-hidden="true"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: EASE_LUXE }}
        className={cn('absolute -top-16 -right-14 w-56 h-56 rounded-full', theme.accentBg)}
        style={{ opacity: 0.9 }}
      />
      <Halftone color="0,0,0" size={5} angle={15} opacity={0.14} />
      <motion.span
        aria-hidden="true"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: EASE_LUXE, delay: 0.15 }}
        className={cn('absolute -bottom-20 -left-16 w-64 h-40 rounded-[50%]', theme.accentSoft)}
      />
      <Halftone color="0,0,0" size={7} angle={75} opacity={0.1} />

      <div className="relative z-10 w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE_LUXE, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <span className={theme.accent}>
            <Ornament size={24} />
          </span>
          <span className={cn('text-[10px] font-bold uppercase tracking-[0.26em]', theme.heading)}>
            {invitation.title}
          </span>
        </motion.div>

        {/* Kayık baskı: alttaki kopya vurgu renginde ve 3px kaymış. */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.35 }}
          className="relative mt-5"
        >
          <h1
            aria-hidden="true"
            className={cn(
              'absolute left-0 top-0 font-serif font-black leading-[0.92] uppercase select-none',
              'text-4xl @sm:text-6xl',
              theme.accent
            )}
            style={{ transform: 'translate(3px, 3px)', opacity: 0.55 }}
          >
            {names}
          </h1>
          <h1
            className={cn(
              'relative font-serif font-black leading-[0.92] uppercase',
              'text-4xl @sm:text-6xl',
              theme.heading
            )}
          >
            {names}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.6 }}
          className={cn('text-sm leading-relaxed font-medium mt-6 max-w-sm', theme.body)}
        >
          {invitation.subtitle}
        </motion.p>

        {/* Kalın kural: poster tipografisinin bilgi ayırıcısı. */}
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.75 }}
          className={cn('block h-1 w-24 mt-7 origin-left', theme.accentBg)}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.9 }}
          className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2"
        >
          <span className={cn('font-serif font-bold text-xl @sm:text-2xl', theme.heading)}>
            {formatDateStr(invitation.date)}
          </span>
          <span className={cn('text-[11px] font-bold uppercase tracking-[0.18em]', theme.body)}>
            {invitation.venue}
          </span>
        </motion.div>

        {invitation.showTimer && valid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 1.05 }}
            className="mt-6 flex items-baseline gap-2"
          >
            <span className={cn('font-serif font-black tabular-nums text-3xl @sm:text-4xl leading-none', theme.accent)}>
              {days}
            </span>
            <span className={cn('text-[11px] font-bold uppercase tracking-[0.18em]', theme.heading)}>
              gün {String(hours).padStart(2, '0')} saat kaldı
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
