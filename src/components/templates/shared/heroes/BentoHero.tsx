import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Bento Editorial hero — bilgiyi tek bir merkezî bloka yığmak yerine
 * ağırlığına göre farklı boyutta hücrelere dağıtan yapılandırılmış ızgara.
 *
 * Neden bento: davetiyede beş ayrı bilgi türü var (isim, tarih, mekân,
 * sayaç, mesaj). Klasik hero hepsini alt alta dizer ve hiyerarşi yalnızca
 * font boyutuyla kurulur. Bento'da hiyerarşiyi hücre ALANI taşır — isim iki
 * sütun kaplar, tarih tek. Göz önce alana, sonra yazıya bakar.
 *
 * Izgara @container sorgularına bağlıdır: dar telefon simülatöründe tek
 * sütuna iner, geniş kadrajda üç sütuna açılır.
 */

interface CellProps {
  children: React.ReactNode;
  className?: string;
  /** Girişte sıralı belirme gecikmesi. */
  delay?: number;
  surface: string;
  border: string;
}

function Cell({ children, className, delay = 0, surface, border }: CellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE_LUXE, delay }}
      className={cn(
        'relative rounded-2xl border p-4 @sm:p-5 flex flex-col justify-between overflow-hidden',
        surface,
        border,
        className
      )}
    >
      {/* Cam kalınlığı: üstte parlak hairline. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20"
      />
      {children}
    </motion.div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('text-[9px] font-semibold uppercase tracking-[0.22em] opacity-70', className)}>
      {children}
    </span>
  );
}

export function BentoHero({ invitation, theme, flavor }: HeroRenderProps) {
  const { valid, days, hours, minutes } = useCountdown(invitation.date);
  const { Ornament } = flavor;

  return (
    <section className={cn('relative flex-1 flex flex-col justify-center px-4 @sm:px-6 py-10 @sm:py-14', theme.page)}>
      <div className="w-full max-w-2xl mx-auto">
        {/* Üst şerit: kategori etiketi + ornament, ızgaranın dışında kalır ki
            ızgara saf bilgi taşısın. */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_LUXE }}
          className="flex items-center justify-between mb-3 @sm:mb-4"
        >
          <span className={cn('text-[10px] font-semibold uppercase tracking-[0.3em]', theme.accent)}>
            {invitation.title}
          </span>
          <span className={theme.accent}>
            <Ornament size={22} />
          </span>
        </motion.div>

        <div className="grid grid-cols-2 @lg:grid-cols-3 gap-2.5 @sm:gap-3">
          {/* İsim — en büyük hücre, iki satır iki sütun. Alanı en fazla olan
              bilgi hiyerarşinin tepesindedir. */}
          <Cell
            surface={theme.surface}
            border={theme.border}
            delay={0.1}
            className="col-span-2 @lg:col-span-2 row-span-2 min-h-[136px] @sm:min-h-[168px] justify-center"
          >
            <div>
              <Label className={theme.body}>Davetliler</Label>
              <h1
                className={cn(
                  'font-serif font-bold leading-[1.05] mt-2 break-words',
                  'text-3xl @sm:text-4xl @lg:text-5xl',
                  theme.heading
                )}
              >
                {invitation.names || 'Davetlisiniz'}
              </h1>
              <p className={cn('text-xs @sm:text-sm font-light mt-3 leading-relaxed', theme.body)}>
                {invitation.subtitle}
              </p>
            </div>
          </Cell>

          {/* Tarih */}
          <Cell surface={theme.surface} border={theme.border} delay={0.2} className="min-h-[64px] @sm:min-h-[78px]">
            <Label className={theme.body}>Tarih</Label>
            <span className={cn('font-serif italic text-base @sm:text-lg leading-tight mt-1.5', theme.heading)}>
              {formatDateStr(invitation.date)}
            </span>
          </Cell>

          {/* Mekân */}
          <Cell surface={theme.surface} border={theme.border} delay={0.28} className="min-h-[64px] @sm:min-h-[78px]">
            <Label className={theme.body}>Mekân</Label>
            <span className={cn('text-[11px] @sm:text-xs font-medium leading-snug mt-1.5', theme.heading)}>
              {invitation.venue}
            </span>
          </Cell>

          {/* Sayaç — tam genişlik şerit. Rakamlar tabular-nums ile sabit
              genişlikte, saniye başı zıplama olmaz. */}
          {invitation.showTimer && valid && (
            <Cell
              surface={theme.surface}
              border={theme.border}
              delay={0.36}
              className="col-span-2 @lg:col-span-3 flex-row items-center justify-between gap-3"
            >
              <Label className={theme.body}>Kalan Süre</Label>
              <div className="flex items-baseline gap-3 @sm:gap-5">
                {[
                  { v: days, l: 'Gün' },
                  { v: hours, l: 'Saat' },
                  { v: minutes, l: 'Dakika' }
                ].map((unit) => (
                  <span key={unit.l} className="flex items-baseline gap-1">
                    <span className={cn('font-serif font-bold tabular-nums text-lg @sm:text-2xl', theme.heading)}>
                      {String(unit.v).padStart(2, '0')}
                    </span>
                    <span className={cn('text-[8px] @sm:text-[9px] uppercase tracking-[0.15em]', theme.body)}>
                      {unit.l}
                    </span>
                  </span>
                ))}
              </div>
            </Cell>
          )}
        </div>
      </div>
    </section>
  );
}
