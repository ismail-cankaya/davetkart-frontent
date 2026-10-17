import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { etiketBelirir } from './hareket';

export interface EtiketProps {
  /** Sanatçı satırı (adlar). */
  sanatci?: string;
  /** Eser adı; italik serif. */
  eser?: string;
  /** Eser adının yanındaki yıl. */
  yil?: string;
  /** Teknik ya da alt satır; konseptin tek espri satırı da buraya yazılır (§7). */
  teknik?: string;
  /** Alt bölümün küçük başlığı ("Açılış"). Bilgi satırı yoksa çizilmez. */
  bilgiBasligi?: string;
  /** Tarih, mekân satırları; boşlar atılır. İlki koyu yazılır. */
  bilgi?: string[];
  /** Küçük beyaz plaka; verilmezse etiket doğrudan duvardadır. */
  levha?: boolean;
  gecikme?: number;
  className?: string;
}

/**
 * Müze etiketi. Sıra kuraldır (§4.1): sanatçı → eser adı + yıl → teknik →
 * tarih, saat, mekân. Boş satır çizilmez; hiçbir satır yoksa etiket de yok.
 * Rakamlar `tabular-nums`; uzun ad kesilmez, satır dengelenir.
 */
export function Etiket({ sanatci, eser, yil, teknik, bilgiBasligi, bilgi = [], levha = false, gecikme, className }: EtiketProps) {
  const satirlar = bilgi.filter(Boolean);
  if (!sanatci && !eser && !teknik && satirlar.length === 0) return null;

  return (
    <motion.div
      {...etiketBelirir(gecikme)}
      className={cn(
        'text-[13px] leading-[1.45] tabular-nums [overflow-wrap:break-word]',
        levha && 'bg-[var(--sg-cerceve)] px-4 py-3.5 [box-shadow:var(--sg-kart-golge)]',
        className
      )}
    >
      {sanatci && <p className="font-semibold text-[var(--sg-murekkep)] [text-wrap:balance]">{sanatci}</p>}
      {(eser || yil) && (
        <p className={cn('text-[var(--sg-murekkep)]', sanatci && 'mt-1')}>
          {eser && <span className="font-serif italic text-[18px] leading-[1.2]">{eser}</span>}
          {eser && yil && ', '}
          {yil}
        </p>
      )}
      {teknik && <p className="mt-0.5 text-[var(--sg-etiket)]">{teknik}</p>}
      {satirlar.length > 0 && (
        <div className={cn((sanatci || eser || teknik) && 'mt-3 pt-3 border-t border-[var(--sg-kenar)]')}>
          {bilgiBasligi && (
            <p lang="tr" className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--sg-etiket)]">
              {bilgiBasligi}
            </p>
          )}
          {satirlar.map((satir, i) => (
            <p key={satir + i} className={i === 0 ? 'text-[var(--sg-murekkep)]' : 'text-[var(--sg-etiket)]'}>
              {satir}
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
