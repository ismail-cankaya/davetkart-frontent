import React from 'react';
import type { Invitation } from '../../../../types';
import { cn } from '../../../../utils/cn';
import { useCountdown } from '../../shared/useCountdown';

const iki = (n: number) => String(n).padStart(2, '0');

/**
 * Geri sayım, kutu değil dizgi satırı: "118 GÜN · 04 SAAT · 12 DAKİKA".
 *
 * Saniye yok: her saniye değişen rakam "bir kez oynayan" hareket dilini bozar.
 * Kendi bileşeni olduğu için saniyelik yenileme yalnızca bu satırı çizer.
 * Sayaç kapalıysa ya da tarih yoksa hiç yer kaplamaz.
 */
interface KitapSayacProps {
  invitation: Invitation;
  /** Rakamların rengi. */
  sayiClassName: string;
  /** Etiket ve birimlerin rengi. */
  birimClassName: string;
  className?: string;
}

export function KitapSayac({ invitation, sayiClassName, birimClassName, className }: KitapSayacProps) {
  const { valid, days, hours, minutes } = useCountdown(invitation.date, invitation.timezone);
  if (!invitation.showTimer || !valid) return null;

  const birimler = [
    { deger: String(days), ad: 'gün' },
    { deger: iki(hours), ad: 'saat' },
    { deger: iki(minutes), ad: 'dakika' }
  ];

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      <p className={cn('text-[11px] uppercase tracking-[0.24em]', birimClassName)}>Kalan süre</p>
      <p className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
        {birimler.map((b, i) => (
          <React.Fragment key={b.ad}>
            {i > 0 && (
              <span aria-hidden="true" className={birimClassName}>
                ·
              </span>
            )}
            <span className="whitespace-nowrap">
              <span className={cn('text-[21px] leading-none [font-variant-numeric:tabular-nums]', sayiClassName)}>{b.deger}</span>{' '}
              <span className={cn('text-[11px] uppercase tracking-[0.14em]', birimClassName)}>{b.ad}</span>
            </span>
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
