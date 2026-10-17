import React from 'react';
import { motion } from 'motion/react';
import type { Invitation } from '../../../../types';
import { cn } from '../../../../utils/cn';
import { useCountdown } from '../../shared/useCountdown';
import { displayText } from '../../utils';
import { Igne } from './Igne';
import { Simge } from './simgeler';
import type { GirisProps } from './hareket';
import type { Durak, LejantVerisi } from './veri';

/**
 * Lejant: haritanın "ne zaman, nerede, hangi sırayla" kutusu. Satırlar
 * veriden gelir (bkz. `lejantKur`); boş satır çizilmez, hiçbir satır yoksa
 * kutu da çizilmez. Yol tarifi düğmesi `mapUrl` varsa her durumda kalır.
 */

const ETIKET = '[font-family:var(--hr-etiket)] font-semibold uppercase tracking-[0.18em]';

function Rozet({ durak }: { durak: Durak }) {
  return (
    <span className="mt-[1px] flex size-[26px] shrink-0 items-center justify-center rounded-full border-[1.75px] border-[#A8321F] bg-white text-[#A8321F]">
      {durak.simge ? (
        <Simge ad={durak.simge} boyut={15} />
      ) : (
        <span className="[font-family:var(--hr-etiket)] text-[14px] font-semibold leading-none">{durak.sira}</span>
      )}
    </span>
  );
}

/** "Varışa 120 gün 04 saat 12 dakika": geri sayım haritanın diliyle. Saniye yok. */
function Varisa({ invitation }: { invitation: Invitation }) {
  const { valid, days, hours, minutes } = useCountdown(invitation.date, invitation.timezone);
  if (!invitation.showTimer || !valid) return null;
  const birimler = [
    { deger: String(days), ad: 'gün' },
    { deger: String(hours).padStart(2, '0'), ad: 'saat' },
    { deger: String(minutes).padStart(2, '0'), ad: 'dakika' }
  ];
  return (
    <p className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 border-t border-dashed border-[#23303A]/40 pt-2.5 text-[#23303A]">
      <span className={cn(ETIKET, 'text-[12px] text-[#A8321F] mr-0.5')}>Varışa</span>
      {birimler.map((b) => (
        <span key={b.ad} className="inline-flex items-baseline gap-1">
          <span className="[font-family:var(--hr-etiket)] text-[22px] @3xl:text-[26px] font-semibold leading-none [font-variant-numeric:lining-nums_tabular-nums]">
            {b.deger}
          </span>
          <span className="text-[14px] text-[#4E5B63]">{b.ad}</span>
        </span>
      ))}
    </p>
  );
}

export function YolTarifi({ mapUrl, className }: { mapUrl: string; className?: string }) {
  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'pointer-events-auto flex min-h-[44px] items-center justify-center gap-2 rounded-[3px] bg-[#A8321F] px-4 text-white transition-colors duration-200 hover:bg-[#8F2A1A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23303A]',
        ETIKET,
        'text-[15px] tracking-[0.12em]',
        className
      )}
    >
      <Simge ad="ok" boyut={18} />
      Yol tarifi
      <span className="sr-only"> (yeni sekmede açılır)</span>
    </a>
  );
}

export interface LejantProps {
  veri: LejantVerisi;
  invitation: Invitation;
  giris: GirisProps;
  className?: string;
}

export function Lejant({ veri, invitation, giris, className }: LejantProps) {
  const mapUrl = displayText(invitation.mapUrl);
  if (veri.bos) {
    return mapUrl ? (
      <motion.div {...giris} className={className}>
        <YolTarifi mapUrl={mapUrl} />
      </motion.div>
    ) : null;
  }

  return (
    <motion.div {...giris} className={cn('bg-white border-[1.5px] border-[#23303A] px-4 pt-3 pb-4 @3xl:px-5 @3xl:pt-4 @3xl:pb-5', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-[#23303A] pb-2">
        <h2 className={cn(ETIKET, 'text-[12px] @3xl:text-[13px] text-[#23303A]')}>Lejant</h2>
        {veri.kalan > 0 ? (
          <span className="text-[13px] text-[#4E5B63]">+{veri.kalan} durak programda</span>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 46 6" width="46" height="6">
            {Array.from({ length: 5 }, (_, i) => (
              <circle key={i} cx={3 + i * 10} cy="3" r="2.2" fill="#C8402F" />
            ))}
          </svg>
        )}
      </div>

      <ul className="mt-2.5 flex flex-col gap-2 text-[15px] @3xl:text-[16px] leading-snug text-[#23303A]">
        {veri.duraklar.map((durak) => (
          <li key={durak.anahtar} className="flex items-start gap-3">
            <Rozet durak={durak} />
            <span className="flex min-w-0 flex-1 items-baseline gap-2.5 pt-[3px]">
              {durak.saat && <span className="w-[3.1rem] shrink-0 font-medium [font-variant-numeric:lining-nums_tabular-nums]">{durak.saat}</span>}
              <span className="min-w-0 break-words">{durak.ad}</span>
            </span>
          </li>
        ))}
        {veri.tarihSatiri && (
          <li className="flex items-start gap-3">
            <span className="flex size-[26px] shrink-0 items-center justify-center text-[#23303A]">
              <Simge ad="takvim" boyut={19} />
            </span>
            <span className="pt-[3px] font-medium [font-variant-numeric:lining-nums_tabular-nums]">{veri.tarihSatiri}</span>
          </li>
        )}
        {veri.mekan && (
          <li className="flex items-start gap-3">
            <span className="flex size-[26px] shrink-0 items-start justify-center">
              <Igne olcek={0.5} />
            </span>
            <span className="min-w-0 break-words pt-[3px] font-medium">{veri.mekan}</span>
          </li>
        )}
      </ul>

      <Varisa invitation={invitation} />
      {mapUrl && <YolTarifi mapUrl={mapUrl} className="mt-3" />}
    </motion.div>
  );
}

/** Lejantın altındaki not: temsilî harita (zorunlu) ve isteğe bağlı ölçek esprisi. */
export function Dipnot({ olcek, giris, className }: { olcek: boolean; giris: GirisProps; className?: string }) {
  return (
    <motion.p
      {...giris}
      className={cn('inline-flex items-center gap-2 bg-white px-2 py-1 text-[12px] leading-none text-[#4E5B63]', className)}
    >
      {olcek && (
        <>
          <svg aria-hidden="true" viewBox="0 0 48 6" width="48" height="6" className="shrink-0">
            <rect x="0.5" y="0.5" width="47" height="5" fill="#FFFFFF" stroke="#23303A" />
            <rect x="0.5" y="0.5" width="12" height="5" fill="#23303A" />
            <rect x="24.5" y="0.5" width="12" height="5" fill="#23303A" />
          </svg>
          <span>1 cm = bir ömür</span>
          <span aria-hidden="true">·</span>
        </>
      )}
      <span className={cn(ETIKET, 'text-[11px] tracking-[0.16em]')}>Temsilî harita</span>
    </motion.p>
  );
}
