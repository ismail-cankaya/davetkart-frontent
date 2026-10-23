import React from 'react';
import { motion } from 'motion/react';
import type { Invitation } from '../../../../types';
import { cn } from '../../../../utils/cn';
import { KitapAdlar } from './Adlar';
import { BEZ_DOKUSU } from './doku';
import { useBaslikFontuHazir } from './fontlar';
import { kapakBelirir } from './hareket';
import { BEZLER, type BezAdi } from './palet';
import { kisiler, kitapTarihi } from './tarih';

/**
 * Koyu bez yüzey: bez rengi × gri dokuma dokusu (`multiply`), sırt tarafında
 * içe basılmış menteşe oluğu, kenarlara doğru hafif koyulaşma. Hepsi CSS;
 * çalışma anında filtre yok. Doku ve kenar gölgesi yalnızca koyulaştırır —
 * yaldızın en kötü noktası bezin kendi rengidir.
 */
export function BezYuzey({ bez, className }: { bez: BezAdi; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{
        backgroundColor: BEZLER[bez],
        backgroundImage: `url("${BEZ_DOKUSU.url}")`,
        backgroundSize: `${BEZ_DOKUSU.boy}px`,
        backgroundBlendMode: 'multiply'
      }}
    >
      <div
        className="absolute inset-y-0 left-[14px] w-[8px] @3xl:left-[26px]"
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.34), rgba(0,0,0,0.14) 50%, transparent)' }}
      />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(130% 95% at 50% 45%, transparent 58%, rgba(0,0,0,0.3) 100%)' }} />
    </div>
  );
}

/** Yaldız: düz renk, parlama yok. Hafif üst gölge baskının bezde çukur durduğunu söyler. */
const YALDIZ = 'text-[#C9A35C] [text-shadow:0_-1px_0_rgba(0,0,0,0.35)]';

interface BezKapakProps {
  invitation: Invitation;
  bez: BezAdi;
  /** Üstteki aralıklı büyük harf etiket (ör. "Bölüm I"). */
  etiket: string;
  /** Çizginin altındaki italik satır (ör. flavor.tagline). */
  altSatir?: string;
  /** Adlar hero'da başlıktır (`h1`); kapak kapısında yalnızca metin (`p`). */
  adlarEtiketi?: 'h1' | 'p';
  /** En alttaki yuva: kaydırma ipucu ya da "kapağı açın" düğmesi. */
  alt?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Bez cilt kapak: simetrik, dikey eksende. Üstte etiket, ortada adlar, altında
 * ince yaldız çizgi ve italik satır, en altta tarih (KITAP-KONSEPTI §4.1).
 * Yalnızca iki ton: bez ve yaldız.
 *
 * İçerik başlık fontunu bekler (en çok 400 ms), sonra 0.5 s'de belirir.
 */
export function BezKapak({ invitation, bez, etiket, altSatir, adlarEtiketi = 'h1', alt, className, style }: BezKapakProps) {
  const hazir = useBaslikFontuHazir();
  const { gun } = kitapTarihi(invitation.date);

  return (
    <div className={cn('relative flex flex-col items-center px-8 py-12 text-center @3xl:py-16', className)} style={style}>
      <BezYuzey bez={bez} />
      <motion.div {...kapakBelirir(hazir)} className="relative flex w-full max-w-[34rem] flex-1 flex-col items-center justify-between gap-12">
        <p className={cn('text-[11px] uppercase tracking-[0.34em]', YALDIZ)}>{etiket}</p>

        <div className="flex flex-col items-center">
          <KitapAdlar adlar={kisiler(invitation.names)} as={adlarEtiketi} className={YALDIZ} />
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
