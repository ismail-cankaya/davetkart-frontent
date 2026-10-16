import React from 'react';
import { motion } from 'motion/react';
import type { Invitation } from '../../../../types';
import { cn } from '../../../../utils/cn';
import { useCountdown } from '../../shared/useCountdown';
import { KAGIT_TEMASI, belirmeGirisi } from '../../shared/paper';

const iki = (n: number) => String(n).padStart(2, '0');

/**
 * Geri sayım: ana kartın altında üç küçük ek kart (gün, saat, dakika).
 *
 * Saniye yok: her saniye değişen bir rakam "bir kez oynayan" hareket dilini
 * bozar. Kendi bileşeni olduğu için her dakika yalnızca bu satır yeniden çizilir;
 * hero çizilmez. Sayaç kapalıysa ya da tarih yoksa hiç yer kaplamaz.
 */
export function KagitSayac({ invitation, gecikme = 0.6 }: { invitation: Invitation; gecikme?: number }) {
  const { valid, days, hours, minutes } = useCountdown(invitation.date, invitation.timezone);
  if (!invitation.showTimer || !valid) return null;

  const birimler = [
    { deger: days, ad: 'gün' },
    { deger: hours, ad: 'saat' },
    { deger: minutes, ad: 'dakika' }
  ];

  return (
    <motion.div {...belirmeGirisi(gecikme)} className="flex justify-center gap-2.5">
      {birimler.map((b) => (
        <div key={b.ad} className={cn(KAGIT_TEMASI.surface, 'w-[4.6rem] py-2.5 flex flex-col items-center')}>
          <span className="font-serif text-2xl leading-none [font-variant-numeric:lining-nums_tabular-nums] text-[var(--kg-baslik)]">{iki(b.deger)}</span>
          <span className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--kg-govde)]">{b.ad}</span>
        </div>
      ))}
    </motion.div>
  );
}
