import React from 'react';
import { motion } from 'motion/react';
import type { Invitation } from '../../../../types';
import { cn } from '../../../../utils/cn';
import { useBaslikFontuHazir } from './fontlar';
import { kapakBelirir } from './hareket';
import { SAYFA } from './palet';
import { kitapTarihi } from './tarih';

/** Yaldız: düz renk, parlama yok (BezKapak ile aynı). */
const YALDIZ = 'text-[#C9A35C] [text-shadow:0_-1px_0_rgba(0,0,0,0.35)]';

/**
 * Etiket kâğıdının köşeleri pahlı (6 px): matbaa etiketi. Tırtık yok
 * (Kâğıt kitinin imzası), kenar düz.
 */
const PAH = 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)';

interface DefterKapakProps {
  invitation: Invitation;
  /** Kapağın rengi (hex). Varsayılan mürekkep: kara kaplı defter. */
  renk?: string;
  /** Etiketin üst satırı (ör. "Yeni Bölüm"); büyük harfe çevrilir. */
  etiket: string;
  /** Etiketin başlığı — adlar ya da kategorinin ad dizgisi. */
  baslik: React.ReactNode;
  /** Etiketin altındaki italik satır (flavor.tagline), yaldız. */
  altSatir?: string;
  /** En alttaki yuva: "Sayfayı çevirin" ya da "Kapağı açın". */
  alt?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Anı defteri kapağı (KITAP-KONSEPTI §4.3): kara kaplı sert defter, sağ
 * kenarından dikine geçen kurdele renkli lastik, ortasında şamua etiket
 * kâğıdı. El yazısı yok — etikette serif dizgi.
 *
 * Bez kapaktan (BezKapak) farkı düzende: orada adlar bezin üstünde yaldızdır;
 * burada kapak boştur, adlar etikette mürekkeptir. Tarih yukarıda, italik
 * satır ve ipucu aşağıda. Kapak dokusuz (mat mukavva): bezle karışmasın.
 *
 * Lastik metne girmez: etiket kabın en çok %76'sıdır, lastik sağ kenardan
 * 22 px içeride. Lastik, oluk ve gölge süstür (`aria-hidden`).
 */
export function DefterKapak({ invitation, renk = SAYFA.murekkep, etiket, baslik, altSatir, alt, className, style }: DefterKapakProps) {
  const hazir = useBaslikFontuHazir();
  const { gun } = kitapTarihi(invitation.date);

  return (
    <div className={cn('relative flex flex-col items-center px-8 py-12 text-center @3xl:py-16', className)} style={style}>
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden" style={{ backgroundColor: renk }}>
        {/* Sırt oluğu: BezYuzey'deki gibi, kapağın menteşesi. */}
        <div
          className="absolute inset-y-0 left-[14px] w-[8px] @3xl:left-[26px]"
          style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.4), rgba(0,0,0,0.16) 50%, transparent)' }}
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(130% 95% at 50% 45%, transparent 60%, rgba(0,0,0,0.32) 100%)' }} />
        {/* Lastik: kurdele renkli dikine bant; kenarlarında koyu kılçizgi, kapağa ince gölge. */}
        <div
          className="absolute inset-y-0 right-[22px] w-[11px] bg-[#8C2F2F] @3xl:right-[40px]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(0,0,0,0.3) 0 1px, transparent 1px calc(100% - 1px), rgba(0,0,0,0.3) calc(100% - 1px))',
            boxShadow: '2px 0 3px rgba(0,0,0,0.35)'
          }}
        />
      </div>

      <motion.div {...kapakBelirir(hazir)} className="relative flex w-full max-w-[34rem] flex-1 flex-col items-center justify-between gap-10">
        {gun ? <p className={cn('text-[13px] uppercase tracking-[0.26em]', YALDIZ)}>{gun}</p> : <span aria-hidden="true" />}

        <div className="flex w-full flex-col items-center">
          {/* Etiket kâğıdı: pahlı köşe, içinde ince matbaa çizgisi. */}
          <div className="relative w-[min(76cqi,23rem)] bg-[#F2EAD3] px-6 py-8" style={{ clipPath: PAH }}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-[6px] border border-[#231F1A]/30" />
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#8C2F2F]">{etiket}</p>
            <span aria-hidden="true" className="mx-auto mt-4 block h-px w-10 bg-[#231F1A]/40" />
            <div className="mt-5">{baslik}</div>
          </div>
          {altSatir && <p className={cn('mt-8 text-[18px] italic leading-snug', YALDIZ)}>{altSatir}</p>}
        </div>

        <div className="flex flex-col items-center gap-6">{alt}</div>
      </motion.div>
    </div>
  );
}

/**
 * Çizgili sayfa: anı defterinin iç sayfası. Şamua üstünde 32 px aralıklı
 * soluk satır çizgileri ve solda kurdele renkli kenar boşluğu çizgisi. Geniş
 * ekranda (kap ≥ 64 rem) çizgiler 48 rem'lik ortalı bir sayfadadır: iki
 * yandaki sayfa başlarının (SayfaBasi) üstünden geçmez. Süstür
 * (`aria-hidden`); çizgiler metnin altında kalır ve metnin zemini en kötü
 * noktasında çizginin rengidir (DefterKapak.md, ölçüm).
 */
export function CizgiliSayfa({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative flex flex-col', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 @5xl:inset-x-[calc(50%-24rem)]"
        style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 31px, rgba(94,84,70,0.16) 31px 32px)' }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[12px] w-px bg-[#8C2F2F]/40 @3xl:left-[calc(50%-21rem)]" />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}
