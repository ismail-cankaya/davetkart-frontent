import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { useCountdown } from '../../shared/useCountdown';
import { etiketBelirir } from './hareket';

interface SergiSayacProps {
  date: string;
  timeZone: string;
  /** Üst satır; varsayılan "Açılışa kalan". */
  baslik?: string;
  gecikme?: number;
  className?: string;
}

/**
 * Geri sayım, etiket dilinde: kutusuz, rozetsiz dört sütun; üstte kıl çizgi.
 * Tarih okunamıyorsa hiç çizilmez. Saniyede bir değişen rakamlar ekran
 * okuyucuya duyurulmaz (canlı bölge yok); tarih etikette zaten yazılı.
 */
export function SergiSayac({ date, timeZone, baslik = 'Açılışa kalan', gecikme, className }: SergiSayacProps) {
  const { valid, days, hours, minutes, seconds } = useCountdown(date, timeZone);
  if (!valid) return null;
  const birimler: [string, number][] = [
    ['Gün', days],
    ['Saat', hours],
    ['Dakika', minutes],
    ['Saniye', seconds]
  ];

  return (
    <motion.div {...etiketBelirir(gecikme)} className={cn('w-full max-w-[21rem]', className)}>
      <p lang="tr" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--sg-etiket)]">
        {baslik}
      </p>
      <div className="mt-2.5 grid grid-cols-4 gap-3 border-t border-[var(--sg-kenar)] pt-3">
        {birimler.map(([ad, deger]) => (
          <div key={ad} className="flex flex-col">
            <span className="text-[22px] font-semibold leading-none tabular-nums text-[var(--sg-murekkep)]">
              {String(deger).padStart(2, '0')}
            </span>
            <span className="mt-1.5 text-[12px] text-[var(--sg-etiket)]">{ad}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
