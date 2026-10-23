import React from 'react';
import { motion } from 'motion/react';
import type { Invitation } from '../../../../types';
import { cn } from '../../../../utils/cn';
import { BezYuzey } from './BezKapak';
import { useBaslikFontuHazir } from './fontlar';
import { kapakBelirir } from './hareket';
import type { BezAdi } from './palet';
import { kitapTarihi } from './tarih';

/** Yaldız: düz renk, parlama yok (BezKapak ile aynı). */
const YALDIZ = 'text-[#C9A35C] [text-shadow:0_-1px_0_rgba(0,0,0,0.35)]';

/** Köşe süsü: dört kollu ışıltı (özgün). */
function KoseYildizi({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" className={cn('absolute', className)} fill="currentColor">
      <path d="M10 0.5 L11.7 8.3 L19.5 10 L11.7 11.7 L10 19.5 L8.3 11.7 L0.5 10 L8.3 8.3 Z" />
    </svg>
  );
}

/**
 * Masal çerçevesi (KITAP-KONSEPTI §5: çerçeve yalnızca masal kitabı
 * ekseninde): ince çift çizgi, dört köşede ışıltı. Rengi `className`'deki
 * `text-*` ile verilir; çizgiler `currentColor`. Süstür (`aria-hidden`);
 * kabı `relative` olmalıdır. `kenar` kabın kenarından içeri mesafedir.
 */
export function MasalCercevesi({ className, kenar = 'inset-[14px] left-[30px] @3xl:inset-[22px] @3xl:left-[44px]' }: { className?: string; kenar?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute', kenar, className)}>
      <div className="absolute inset-0 border border-current opacity-80" />
      <div className="absolute inset-[5px] border border-current opacity-50" />
      <KoseYildizi className="left-[10px] top-[10px]" />
      <KoseYildizi className="right-[10px] top-[10px]" />
      <KoseYildizi className="bottom-[10px] left-[10px]" />
      <KoseYildizi className="bottom-[10px] right-[10px]" />
    </div>
  );
}

interface MasalKapakProps {
  invitation: Invitation;
  bez: BezAdi;
  /** Üstteki italik açılış satırı (ör. "Bir varmış, bir yokmuş…"). */
  acilis: string;
  /** Başlığın üstündeki yaldız figür (taç, yıldız, ay — özgün SVG). */
  figur: React.ReactNode;
  /** Başlık — adlar ya da kategorinin ad dizgisi; yaldız rengi çağırandan. */
  baslik: React.ReactNode;
  /** Çizginin altındaki italik satır (flavor.tagline). */
  altSatir?: string;
  /** En alttaki yuva: "Sayfayı çevirin" ya da "Kapağı açın". */
  alt?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Masal kitabı kapağı (KITAP-KONSEPTI §4.3): bez kapak, yaldız çift çizgi
 * çerçeve, köşelerde ışıltı; ortada basit özgün figür ve başlık. Simetrik,
 * dikey eksende. Düz yaldız; degrade, parlama yok.
 *
 * Bez kapaktan farkı: çerçeve ve figür (yalnızca bu eksende), üstte etiket
 * yerine italik masal açılışı.
 */
export function MasalKapak({ invitation, bez, acilis, figur, baslik, altSatir, alt, className, style }: MasalKapakProps) {
  const hazir = useBaslikFontuHazir();
  const { gun } = kitapTarihi(invitation.date);

  return (
    <div className={cn('relative flex flex-col items-center px-12 pb-14 pt-16 text-center @3xl:py-20', className)} style={style}>
      <BezYuzey bez={bez} />
      <MasalCercevesi className="text-[#C9A35C]" />
      <motion.div {...kapakBelirir(hazir)} className="relative flex w-full max-w-[34rem] flex-1 flex-col items-center justify-between gap-10">
        <p className={cn('text-[17px] italic leading-snug', YALDIZ)}>{acilis}</p>

        <div className="flex w-full flex-col items-center">
          <div aria-hidden="true" className="mb-7 text-[#C9A35C]">
            {figur}
          </div>
          {baslik}
          <span aria-hidden="true" className="mt-7 block h-px w-12 bg-[#C9A35C]" />
          {altSatir && <p className={cn('mt-5 text-[18px] italic leading-snug', YALDIZ)}>{altSatir}</p>}
        </div>

        <div className="flex flex-col items-center gap-6">
          {gun && <p className={cn('text-[13px] uppercase tracking-[0.26em]', YALDIZ)}>{gun}</p>}
          {alt}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Masal sayfası: kapağın ardındaki ilk sayfa da çerçevelidir — kurdele
 * renginde, kapaktakinden ince. Çocuk kitabının resimli sayfası gibi.
 */
export function MasalSayfasi({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative flex flex-col px-3', className)}>
      <MasalCercevesi className="text-[#8C2F2F]/70" kenar="inset-[12px] @3xl:inset-x-[calc(50%-21rem)] @3xl:inset-y-[24px]" />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}
