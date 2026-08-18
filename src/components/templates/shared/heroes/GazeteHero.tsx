import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';
import { Halftone } from '../effects';

/**
 * Gazete Manşeti hero — davetin HABER olarak sunulduğu düzen.
 *
 * Diğer diller daveti bir nesne (kart, bilet, plak) ya da bir yüzey (cam,
 * taş, kumaş) olarak kurar. Gazete bunun yerine bir SES tonu getirir:
 * duyuru. Bu yüzden tipografi hiyerarşisi gazete kurallarını birebir izler —
 * logotype, künye satırı, manşet, spot, sütun.
 *
 * Manşet `text-balance` ile dengelenir: gazete manşetinde son satırda tek
 * kelime kalması (dul satır) en görünür dizgi hatasıdır.
 */
export interface GazeteHeroProps extends HeroRenderProps {
  /** Logotype yerine basılacak kısa gazete adı; verilmezse davetin başlığı. */
  masthead?: string;
}

export function GazeteHero({ invitation, theme, flavor, masthead }: GazeteHeroProps) {
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date);

  const dateParts = formatDateStr(invitation.date).split(' ');
  const dateText = dateParts.slice(0, 3).join(' ');
  const timeText = dateParts.slice(-1)[0];

  return (
    <section className="relative flex-1 flex items-center justify-center px-4 @sm:px-7 py-10 @sm:py-14">
      <motion.article
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_LUXE }}
        className={cn('relative w-full max-w-md px-5 @sm:px-7 py-6 @sm:py-8 border', theme.border, theme.surface)}
        style={{ boxShadow: '0 16px 34px -22px rgba(0,0,0,0.4)' }}
      >
        {/* Gazete kağıdının tram dokusu. */}
        <Halftone color="0,0,0" size={4} angle={18} opacity={0.07} />

        <div className="relative">
          {/* ——— Logotype ——— */}
          <motion.h2
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.12em' }}
            transition={{ duration: 1.1, ease: EASE_LUXE, delay: 0.15 }}
            className={cn(
              'font-serif font-black uppercase text-center leading-none text-[1.15rem] @sm:text-[1.5rem]',
              theme.heading
            )}
          >
            {masthead || invitation.title}
          </motion.h2>

          {/* Künye satırı: iki kalın kural arasına sıkışmış ince bilgi. */}
          <div className={cn('mt-3 border-t-2 border-b', theme.border)}>
            <div className={cn('flex items-center justify-between gap-2 py-1.5 text-[7.5px] @sm:text-[8.5px] font-semibold uppercase tracking-[0.16em]', theme.body)}>
              <span>Yıl 1 · Sayı 1</span>
              <span className={theme.accent}>{dateText}</span>
              <span>Fiyatsız</span>
            </div>
          </div>

          {/* ——— Manşet ——— */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.35 }}
            className={cn(
              'font-serif font-black uppercase text-center leading-[0.95] mt-5 text-[2rem] @sm:text-[2.7rem] break-words text-balance',
              theme.heading
            )}
          >
            {invitation.names || 'Davetlisiniz'}
          </motion.h1>

          {/* Spot: manşetin altındaki italik özet. */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.5 }}
            className={cn('font-serif italic text-center text-[13px] @sm:text-sm mt-3 leading-snug', theme.accent)}
          >
            {invitation.venue}
          </motion.p>

          <div className={cn('my-4 h-px', theme.divider)} />

          {/* ——— Sütunlar ——— */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.62 }}
            className="grid grid-cols-2 gap-4"
          >
            <p className={cn('text-[11px] leading-[1.7] text-justify hyphens-auto', theme.body)}>
              <span className={cn('float-left font-serif font-black text-[1.9rem] leading-[0.8] mr-1.5 mt-0.5', theme.heading)}>
                {(invitation.subtitle || 'D').trim().charAt(0).toLocaleUpperCase('tr-TR')}
              </span>
              {(invitation.subtitle || '').trim().slice(1)}
            </p>

            <div className="space-y-2.5">
              <div className={cn('border p-2.5', theme.border)}>
                <span className={cn('block text-[7.5px] font-bold uppercase tracking-[0.18em]', theme.accent)}>
                  Program
                </span>
                <span className={cn('block text-[11px] font-semibold mt-1', theme.heading)}>{timeText}</span>
                <span className={cn('block text-[10px] mt-0.5 leading-snug', theme.body)}>{dateText}</span>
              </div>

              {invitation.showTimer && valid && (
                <div className={cn('border p-2.5', theme.border)}>
                  <span className={cn('block text-[7.5px] font-bold uppercase tracking-[0.18em]', theme.accent)}>
                    Geri Sayım
                  </span>
                  <span className={cn('block font-serif font-black tabular-nums text-lg leading-none mt-1', theme.heading)}>
                    {days}
                  </span>
                  <span className={cn('block text-[9px] uppercase tracking-[0.14em] mt-0.5', theme.body)}>
                    gün {String(hours).padStart(2, '0')}s {String(minutes).padStart(2, '0')}dk
                  </span>
                </div>
              )}

              <div className="flex justify-center pt-0.5">
                <span className={theme.accent}>
                  <Ornament size={22} />
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.article>
    </section>
  );
}
