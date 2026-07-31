import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';
import { Perforation, Barcode } from '../effects';

/**
 * Etkinlik Bileti hero — yerleşim süs değil, İŞLEV taşır.
 *
 * Bilet anatomisi: ana gövde (kim, ne zaman, nerede) + perforasyon +
 * koparılabilir koçan (barkod, sıra no). Bilgi kutulara değil, gerçek
 * biletlerde olduğu gibi etiketli alanlara dizilir.
 *
 * Perforasyonun iki ucundaki yarım daireler kartın DIŞINA taşar; bu çentik
 * olmadan çizgi sadece kesik bir kenarlık gibi okunur, "koparılabilir"
 * hissi kurulmaz.
 */

function Field({
  label,
  value,
  theme,
  className
}: {
  label: string;
  value: React.ReactNode;
  theme: HeroRenderProps['theme'];
  className?: string;
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <span className={cn('block text-[8px] font-semibold uppercase tracking-[0.2em] opacity-70', theme.body)}>
        {label}
      </span>
      <span className={cn('block text-xs @sm:text-sm font-medium mt-1 truncate', theme.heading)}>{value}</span>
    </div>
  );
}

export function TicketHero({ invitation, theme, flavor }: HeroRenderProps) {
  const { valid, days } = useCountdown(invitation.date);
  const { Ornament } = flavor;

  // Deterministik "sıra no": aynı davetiye hep aynı numarayı gösterir.
  const serial = String(
    Math.abs(
      (invitation.names || 'DK').split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)
    ) % 100000
  ).padStart(5, '0');

  return (
    <section className="relative flex-1 flex items-center justify-center px-4 @sm:px-6 py-10 @sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: EASE_LUXE }}
        className={cn(
          'relative w-full max-w-md rounded-xl overflow-hidden border',
          theme.surface,
          theme.border
        )}
        style={{ boxShadow: '0 20px 44px -14px rgba(0,0,0,0.45)' }}
      >
        {/* ——— Ana gövde ——— */}
        <div className="px-5 @sm:px-7 pt-6 @sm:pt-7 pb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className={cn('text-[9px] font-semibold uppercase tracking-[0.3em]', theme.accent)}>
                {invitation.title}
              </span>
              <h1
                className={cn(
                  'font-serif font-bold leading-[1.05] mt-2 break-words text-2xl @sm:text-3xl',
                  theme.heading
                )}
              >
                {invitation.names || 'Davetlisiniz'}
              </h1>
            </div>
            <span className={cn('shrink-0 mt-0.5', theme.accent)}>
              <Ornament size={26} />
            </span>
          </div>

          <p className={cn('text-[12px] leading-relaxed font-light mt-3', theme.body)}>
            {invitation.subtitle}
          </p>

          {/* Etiketli alanlar — biletin okunabilir veri bloğu. */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <Field label="Tarih" value={formatDateStr(invitation.date).split(' ').slice(0, 3).join(' ')} theme={theme} />
            <Field label="Saat" value={formatDateStr(invitation.date).split(' ').slice(-1)[0]} theme={theme} />
            <Field
              label="Kalan"
              value={invitation.showTimer && valid ? `${days} gün` : '—'}
              theme={theme}
            />
          </div>

          <div className="mt-3">
            <Field label="Mekân" value={invitation.venue} theme={theme} />
          </div>
        </div>

        {/* ——— Perforasyon ——— */}
        <div className="relative h-0">
          {/* Kenardan taşan çentikler: "koparılabilir" sinyalini bunlar verir. */}
          <span
            className={cn('absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full', theme.base)}
            aria-hidden="true"
          />
          <span
            className={cn('absolute -right-2.5 -top-2.5 w-5 h-5 rounded-full', theme.base)}
            aria-hidden="true"
          />
          <Perforation orientation="horizontal" color="currentColor" className={cn('top-0', theme.body)} />
        </div>

        {/* ——— Koçan ——— */}
        <div className="px-5 @sm:px-7 pt-5 pb-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <span className={cn('block text-[8px] font-semibold uppercase tracking-[0.2em] opacity-70', theme.body)}>
              Davet No
            </span>
            <span className={cn('block font-mono text-base @sm:text-lg tracking-widest mt-1', theme.heading)}>
              {serial}
            </span>
          </div>
          <div className={cn('w-28 @sm:w-36 h-9 @sm:h-10 shrink-0', theme.heading)}>
            <Barcode color="currentColor" bars={38} seed={11} className="w-full h-full" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
