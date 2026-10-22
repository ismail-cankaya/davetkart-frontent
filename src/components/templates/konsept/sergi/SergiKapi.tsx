import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ease } from '../../../../utils/motion';
import type { EnvelopeRenderProps } from '../../shared/InvitationComposition';

/**
 * Zarf kapısı: salonun ışığı kapalı. Dokunuşla ışık yanar, karanlık çekilir
 * ve altında kapak (spot, eser, etiket) kendi girişini oynar. Zarf modülü
 * kapalıyken kompozisyon bunu hiç çağırmaz.
 *
 * Zamanlama (s) — dokunuştan içeriğe erişim ≤ 1 s:
 *   0.00–0.15 yazı ve düğme söner
 *   0.10      `onRevealStart` — kapak girişini başlatır
 *   0.10–0.60 karanlık katman solar → `onOpened`
 *
 * "Hareketi azalt": dokunuş kapıyı anında kaldırır.
 */
const ZAMAN = { acilis: 0.1, cikis: 0.1, cikisSure: 0.5 };

interface SergiKapiProps extends EnvelopeRenderProps {
  /**
   * Karanlıkta seçilen eserin silueti: `true` tek çerçeve, `false` hiçbiri;
   * bir öğe verilirse preset'in kendi silueti (diptik, vinil yazı) çizilir.
   * Öğe süstür: `aria-hidden` taşımalıdır.
   */
  siluet?: boolean | React.ReactElement;
}

/** Işık anahtarı: düğmenin küçük işareti. */
function Anahtar() {
  return (
    <svg aria-hidden="true" width="14" height="22" viewBox="0 0 14 22" className="shrink-0">
      <rect x="0.75" y="0.75" width="12.5" height="20.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="4" width="6" height="7" fill="currentColor" />
    </svg>
  );
}

export function SergiKapi({ invitation, flavor, onRevealStart, onOpened, siluet = true }: SergiKapiProps) {
  const [aciliyor, setAciliyor] = useState(false);
  const reduced = useReducedMotion();
  const adlar = invitation.names || 'Davetlisiniz';

  const onRevealStartRef = useRef(onRevealStart);
  const onOpenedRef = useRef(onOpened);
  useEffect(() => {
    onRevealStartRef.current = onRevealStart;
    onOpenedRef.current = onOpened;
  }, [onRevealStart, onOpened]);

  useEffect(() => {
    if (!aciliyor) return;
    if (reduced) {
      onRevealStartRef.current();
      onOpenedRef.current();
      return;
    }
    const id = window.setTimeout(() => onRevealStartRef.current(), ZAMAN.acilis * 1000);
    return () => window.clearTimeout(id);
  }, [aciliyor, reduced]);

  const ac = () => {
    if (!aciliyor) setAciliyor(true);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={flavor.envelopeLabel}
      className="absolute inset-0 z-40 overflow-hidden cursor-pointer select-none bg-[var(--sg-karanlik)] text-[var(--sg-duvar)]"
      onClick={ac}
      initial={{ opacity: 1 }}
      animate={{ opacity: aciliyor && !reduced ? 0 : 1 }}
      transition={{ duration: ZAMAN.cikisSure, ease: ease.out, delay: aciliyor ? ZAMAN.cikis : 0 }}
      onAnimationComplete={() => {
        if (aciliyor) onOpenedRef.current();
      }}
    >
      {/* Karanlıkta asılı bekleyen çerçeve: yalnızca kenarı seçilir. */}
      {siluet === true ? (
        <div
          aria-hidden="true"
          className="absolute right-[10%] top-[14%] w-[54%] max-w-[19rem] aspect-[4/5] border border-white/[0.09] bg-white/[0.025]"
        />
      ) : (
        siluet || null
      )}

      <motion.div
        className="absolute left-6 right-6 bottom-12 flex flex-col items-start gap-5 @md:left-12 @md:bottom-16 max-w-[24rem]"
        animate={{ opacity: aciliyor ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <p lang="tr" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--sg-karanlik-etiket)]">
          {flavor.envelopeLabel}
        </p>
        <p className="font-serif italic text-[36px] leading-[1.04] [text-wrap:balance] [overflow-wrap:break-word]">{adlar}</p>
        <button
          type="button"
          aria-label="Işığı yakın, davetiyeyi açın"
          onClick={(event) => {
            event.stopPropagation();
            ac();
          }}
          // Kapı kalkana kadar odak arkadaki bölümlere kaçmasın (kalıcı tuzak değil: Enter açar).
          onKeyDown={(event) => {
            if (event.key === 'Tab') event.preventDefault();
          }}
          className="mt-1 inline-flex min-h-12 items-center gap-3 border border-white/40 px-5 text-[13px] font-semibold tracking-[0.08em] text-[var(--sg-duvar)] transition-colors duration-200 hover:bg-white/[0.06] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--sg-duvar)]"
        >
          <Anahtar />
          Işığı yakın
        </button>
      </motion.div>
    </motion.div>
  );
}
