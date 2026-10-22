import React from 'react';
import { motion } from 'motion/react';
import type { Invitation } from '../../../../../types';
import { cn } from '../../../../../utils/cn';
import {
  BezYuzey,
  Fleuron,
  KitapAdlar,
  kapakBelirir,
  kisiler,
  kitapTarihi,
  useBaslikFontuHazir,
  type BezAdi
} from '../../../konsept/kitap';

/** Yaldız: düz renk, parlama yok (BezKapak ile aynı). */
const YALDIZ = 'text-[#C9A35C] [text-shadow:0_-1px_0_rgba(0,0,0,0.35)]';

/** Pencerenin genişliği: dar ekranda kabın %80'i, genişte 22 rem. */
const PENCERE = 'min(80cqi, 22rem)';

/**
 * Pencerenin kesik kenarı. Bez + mukavvanın kalınlığı sayfaya üstten gölge
 * düşürür (içe gölge); kesik kenar bezde ince koyu bir çizgi, altta mukavvanın
 * açık kesiti. Hepsi `box-shadow`: filtre yok.
 */
const KESIK =
  'inset 0 6px 10px -4px rgba(35,31,26,0.5), inset 0 0 0 1px rgba(35,31,26,0.14), 0 0 0 1px rgba(0,0,0,0.55), 0 1.5px 0 1px rgba(242,234,211,0.1)';

interface PencereliKapakProps {
  invitation: Invitation;
  bez: BezAdi;
  /** Üstteki aralıklı büyük harf etiket ("Önsöz"). */
  etiket: string;
  /** Pencerenin altındaki italik satır (flavor.tagline). */
  altSatir?: string;
  /** Adlar hero'da başlıktır (`h1`); kapak kapısında yalnızca metin (`p`). */
  adlarEtiketi?: 'h1' | 'p';
  /** En alttaki yuva: "Sayfayı çevirin" ya da "Kapağı açın". */
  alt?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Pencereli kapak (bez cilt ekseninin nişan yorumu): koyu bez kapağın
 * ortasında oval bir pencere kesilmiştir; pencereden ilk sayfa — şamua
 * üstünde mürekkeple adlar — görünür. Kitap henüz açılmadı, hikâye yalnızca
 * görünüyor: önsöz.
 *
 * Düğünün kapağından (BezKapak) farkı düzende: orada adlar yaldızla bezin
 * üstündedir; burada bezde yalnızca etiket, italik satır ve tarih vardır,
 * adlar kapağın İÇİNDE, kâğıttadır. Pencere bir çerçeve değildir — kenarında
 * yaldız ya da çizgi yok, yalnızca kesik (KITAP-KONSEPTI §5: çerçeve masal
 * kitabına özgü).
 *
 * Simetrik, dikey eksende. İçerik başlık fontunu bekler (≤ 400 ms), sonra
 * 0.5 s'de belirir.
 */
export function PencereliKapak({
  invitation,
  bez,
  etiket,
  altSatir,
  adlarEtiketi = 'h1',
  alt,
  className,
  style
}: PencereliKapakProps) {
  const hazir = useBaslikFontuHazir();
  const { gun } = kitapTarihi(invitation.date);

  return (
    <div className={cn('relative flex flex-col items-center px-8 py-12 text-center @3xl:py-16', className)} style={style}>
      <BezYuzey bez={bez} />
      <motion.div {...kapakBelirir(hazir)} className="relative flex w-full max-w-[34rem] flex-1 flex-col items-center justify-between gap-10">
        <p className={cn('text-[11px] uppercase tracking-[0.34em]', YALDIZ)}>{etiket}</p>

        <div className="flex w-full flex-col items-center">
          {/* Pencere: oval kesik; içi kapağın altındaki sayfa. Uzun adda boyu uzar, oval kalır. */}
          <div
            className="flex flex-col items-center justify-center rounded-[50%] bg-[#F2EAD3]"
            style={{
              width: PENCERE,
              aspectRatio: '5 / 6',
              paddingInline: `calc(${PENCERE} * 0.13)`,
              paddingBlock: `calc(${PENCERE} * 0.17)`,
              boxShadow: KESIK
            }}
          >
            <KitapAdlar
              adlar={kisiler(invitation.names)}
              as={adlarEtiketi}
              enCok={46}
              akis={10}
              className="text-[#231F1A]"
              baglacClassName="text-[#8C2F2F]"
            />
            <Fleuron boyut={26} className="mt-5 text-[#8C2F2F]" />
          </div>
          {altSatir && (
            <>
              <span aria-hidden="true" className="mt-8 block h-px w-12 bg-[#C9A35C]" />
              <p className={cn('mt-5 text-[18px] italic leading-snug', YALDIZ)}>{altSatir}</p>
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-6">
          {gun && <p className={cn('text-[13px] uppercase tracking-[0.26em]', YALDIZ)}>{gun}</p>}
          {alt}
        </div>
      </motion.div>
    </div>
  );
}
