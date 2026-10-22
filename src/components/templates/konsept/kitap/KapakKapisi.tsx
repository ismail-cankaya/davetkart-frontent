import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { EnvelopeRenderProps } from '../../shared/InvitationComposition';
import { ease } from '../../../../utils/motion';
import { BezKapak } from './BezKapak';
import { KITAP_SURE } from './hareket';
import { YAN_KAGIDI, type BezAdi } from './palet';

/**
 * Kapak kapısı (`renderEnvelope`): zarf modülü açıkken giriş kapısı kitabın
 * kapağıdır. Dokununca kapak sol menteşeden açılır (`rotateY` 0 → −160°),
 * altından ilk sayfa (hero) görünür.
 *
 * Zamanlama (s) — dokunuştan kapının kalkmasına ≤ 1 s:
 *   0.00      `onRevealStart` — hero kapağın altında girişine başlar
 *   0.00–0.80 kapak açılır (`ease.inOut`); kapağın düşürdüğü gölge söner
 *   0.80      `onOpened` — kapı kalkar
 *
 * Eğri `ease.inOut`: kapak yavaş kalkar, ortada hızlanır, yavaşça iner.
 * `ease.out` hareketin çoğunu başa yığıyor, kapak ~130 ms'de 90°'yi geçip
 * ekrandan çıkıyordu (KITAP-KONSEPTI §6, §11).
 *
 * Kapak izleyiciye doğru döner; perspektif kap genişliğinin 2.5 katıdır
 * (`250cqi`), geniş ekranda da kapak dönerken aşırı büyümez.
 * "Hareketi azalt": dokunuş kapıyı anında kaldırır; hiçbir şey dönmez.
 */
export interface KapakKapisiProps extends EnvelopeRenderProps {
  bez: BezAdi;
  etiket: string;
  altSatir?: string;
}

const YUZ_SINIFI = 'absolute inset-0 [backface-visibility:hidden]';

export function KapakKapisi({ invitation, onRevealStart, onOpened, bez, etiket, altSatir }: KapakKapisiProps) {
  const [aciliyor, setAciliyor] = useState(false);
  const reduced = useReducedMotion();
  const bitti = useRef(false);

  const onRevealStartRef = useRef(onRevealStart);
  const onOpenedRef = useRef(onOpened);
  useEffect(() => {
    onRevealStartRef.current = onRevealStart;
    onOpenedRef.current = onOpened;
  }, [onRevealStart, onOpened]);

  const kaldir = () => {
    if (bitti.current) return;
    bitti.current = true;
    onOpenedRef.current();
  };

  useEffect(() => {
    if (!aciliyor) return;
    onRevealStartRef.current();
    if (reduced) kaldir();
  }, [aciliyor, reduced]);

  const ac = () => {
    if (!aciliyor) setAciliyor(true);
  };

  const donuyor = aciliyor && !reduced;
  const gecis = { duration: KITAP_SURE.kapak, ease: ease.inOut };

  const dugme = (
    <button
      type="button"
      onClick={(olay) => {
        olay.stopPropagation();
        ac();
      }}
      className="min-h-11 px-5 text-[12px] uppercase tracking-[0.26em] text-[#C9A35C] underline decoration-[#C9A35C]/60 underline-offset-[6px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A35C]"
    >
      Kapağı açın
    </button>
  );

  return (
    <div
      className="absolute inset-0 z-40 cursor-pointer select-none overflow-hidden"
      style={{ perspective: 'max(1400px, 250cqi)' }}
      onClick={ac}
    >
      {/* Kapağın ilk sayfaya düşürdüğü gölge; kapak kalktıkça söner. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black/25"
        initial={false}
        animate={{ opacity: donuyor ? 0 : 1 }}
        transition={gecis}
      />

      <motion.div
        className="absolute inset-0 origin-left [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: donuyor ? -160 : 0 }}
        transition={gecis}
        onAnimationComplete={() => {
          if (aciliyor) kaldir();
        }}
      >
        <BezKapak
          invitation={invitation}
          bez={bez}
          etiket={etiket}
          altSatir={altSatir}
          adlarEtiketi="p"
          className={YUZ_SINIFI}
          alt={dugme}
        />
        {/* İç yüz: yan kâğıdı. Kapak 90°'yi geçince görünür. */}
        <div
          aria-hidden="true"
          className={YUZ_SINIFI}
          style={{ backgroundColor: YAN_KAGIDI, transform: 'rotateY(180deg)' }}
        />
      </motion.div>
    </div>
  );
}
