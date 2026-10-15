import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Invitation } from '../../../../types';
import { cn } from '../../../../utils/cn';
import { ease } from '../../../../utils/motion';
import type { SectionTheme } from '../palette';
import type { TemplateFlavor } from '../flavor';
import { MumMuhur } from './MumMuhur';
import { basHarfler, type BasHarfKurali } from './basHarfler';
import { Kabartma } from './Baski';
import { Adlar } from './Adlar';
import { kaymaGirisi } from './hareket';

/**
 * Kâğıt zarf kapısı: mühür kırılır, kapak açılır, kart yükselir, zarf çekilir.
 *
 * Ortak `Envelope` ile aynı sözleşmeyi taşır (aynı props, aynı iki geri
 * çağrı) ki kompozisyon hangisini çizdiğini bilmek zorunda kalmasın.
 *
 * Zamanlama (s) — dokunuştan içeriğe erişim ≤ 1 s:
 *   0.00–0.30 mühür ikiye ayrılıp söner
 *   0.12–0.54 kapak 180° açılır (0.33'te kartın arkasına geçer)
 *   0.34–0.74 kart zarftan yükselir
 *   0.50      `onRevealStart` — hero girişini başlatır
 *   0.55–0.95 kapı solar → `onOpened` (ölçülen 956–969 ms, headless Chrome)
 *
 * "Hareketi azalt": dokunuş kapıyı anında kaldırır; hiçbir şey kaymaz, dönmez.
 */
const ZAMAN = { kapak: 0.12, kapakSure: 0.42, arkaya: 0.33, kart: 0.34, kartSure: 0.4, acilis: 0.5, cikis: 0.55, cikisSure: 0.4 };

export interface KagitZarfProps {
  invitation: Invitation;
  theme: SectionTheme;
  flavor: TemplateFlavor;
  onRevealStart?: () => void;
  onOpened: () => void;
  /** Mühürdeki harfler; verilmezse adlardan `kural`a göre üretilir. */
  harfler?: string;
  kural?: BasHarfKurali;
  /** Kapağın iç yüzü (astar). Verilmezse vurgu mürekkebinin açık bir tonu. */
  astar?: string;
}

/** Zarfın arkası; kapak üçgeni ve cep (yan + alt kanatlar) ayrı çizilir. */
const KAPAK = 'polygon(0 0, 100% 0, 50% 60%)';
const CEP = 'polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)';
const YUZEY =
  'bg-[var(--kg-kart)] [background-image:var(--kg-doku)] [background-size:var(--kg-doku-boy)] [background-blend-mode:multiply]';

export function KagitZarf({ invitation, theme, flavor, onRevealStart, onOpened, harfler, kural = 'cift', astar }: KagitZarfProps) {
  const [aciliyor, setAciliyor] = useState(false);
  const reduced = useReducedMotion();
  const muhurHarfi = harfler ?? basHarfler(invitation.names, kural);
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
      onRevealStartRef.current?.();
      onOpenedRef.current();
      return;
    }
    const id = window.setTimeout(() => onRevealStartRef.current?.(), ZAMAN.acilis * 1000);
    return () => window.clearTimeout(id);
  }, [aciliyor, reduced]);

  const ac = () => {
    if (!aciliyor) setAciliyor(true);
  };

  return (
    <motion.div
      className={cn('absolute inset-0 z-40 flex flex-col items-center justify-center gap-7 px-6 overflow-hidden cursor-pointer select-none', theme.base, theme.page)}
      onClick={ac}
      initial={{ opacity: 1 }}
      animate={{ opacity: aciliyor && !reduced ? 0 : 1 }}
      transition={{ duration: ZAMAN.cikisSure, ease: ease.in, delay: aciliyor ? ZAMAN.cikis : 0 }}
      onAnimationComplete={() => {
        if (aciliyor) onOpenedRef.current();
      }}
    >
      {/* Kime: etiket ve adlar zarfın üstünde, gerçek metin olarak. Açılan
          kapak yukarı kalktığında adların ARKASINDA kalsın diye z-10. */}
      <motion.div {...kaymaGirisi(0)} className="relative z-10 w-full max-w-[20rem] text-center">
        <p className={cn('text-[11px] font-semibold uppercase tracking-[0.32em]', theme.accent)}>{flavor.envelopeLabel}</p>
        <Adlar adlar={adlar} boy={36} as="p" className={cn('mt-3', theme.heading)} />
      </motion.div>

      <motion.div {...kaymaGirisi(0.08)} className="relative w-full max-w-[19rem] aspect-[1.42]" style={{ perspective: 900 }}>
        {/* Arka panel: zarfın içi, kapak açılınca görünür. */}
        <div className="absolute inset-0 rounded-[3px] bg-[var(--kg-kart-koyu)] [box-shadow:var(--kg-golge)]" />

        {/* Kart: cebin arkasında durur, açılınca yükselir. */}
        <motion.div
          className={cn('absolute left-[6%] right-[6%] top-[7%] h-[84%] rounded-[2px] flex items-center justify-center', YUZEY)}
          initial={false}
          animate={aciliyor && !reduced ? { y: '-46%' } : { y: 0 }}
          transition={{ duration: ZAMAN.kartSure, ease: ease.out, delay: ZAMAN.kart }}
          style={{ zIndex: 2 }}
        >
          {muhurHarfi && <Kabartma metin={muhurHarfi} boyut={44} />}
        </motion.div>

        {/* Cep: yan ve alt kanatlar; katlama çizgileri ince gölge. */}
        <div className={cn('absolute inset-0 rounded-[3px]', YUZEY)} style={{ clipPath: CEP, zIndex: 3 }}>
          <svg aria-hidden="true" viewBox="0 0 100 70" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <path d="M0 70 L50 37.8 L100 70" fill="none" stroke="var(--kg-cizgi-guclu)" strokeWidth="0.35" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        {/* Kapağın cebe düşürdüğü gölge; kapak kalkarken söner. */}
        <motion.div
          className="absolute inset-0 bg-black/[0.07]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 64%)', zIndex: 3 }}
          initial={false}
          animate={{ opacity: aciliyor && !reduced ? 0 : 1 }}
          transition={{ duration: 0.15, delay: aciliyor ? ZAMAN.kapak : 0 }}
        />

        {/* Kapak: ön yüz kâğıt, arka yüz astar. 90°'yi geçince kartın arkasına iner. */}
        <motion.div
          className="absolute inset-x-0 top-0 h-full origin-top"
          style={{ transformStyle: 'preserve-3d' }}
          initial={false}
          animate={aciliyor && !reduced ? { rotateX: 180, zIndex: 1 } : { rotateX: 0, zIndex: 4 }}
          transition={{
            rotateX: { duration: ZAMAN.kapakSure, ease: ease.inOut, delay: ZAMAN.kapak },
            zIndex: { duration: 0, delay: aciliyor ? ZAMAN.arkaya : 0 }
          }}
        >
          <div className={cn('absolute inset-0 [backface-visibility:hidden]', YUZEY)} style={{ clipPath: KAPAK }}>
            <svg aria-hidden="true" viewBox="0 0 100 70" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              <path d="M0 0 L50 42 L100 0" fill="none" stroke="var(--kg-cizgi-guclu)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div
            className="absolute inset-0 [backface-visibility:hidden]"
            style={{
              clipPath: KAPAK,
              transform: 'rotateX(180deg)',
              background: astar ?? 'color-mix(in srgb, var(--kg-vurgu) 22%, var(--kg-kart))'
            }}
          />
        </motion.div>

        {/* Mühür kapağın ucunda; dokunma hedefi 72 px. */}
        <button
          type="button"
          aria-label="Davetiyeyi aç"
          onClick={(event) => {
            event.stopPropagation();
            ac();
          }}
          className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 z-10 rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--kg-vurgu)]"
          style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.28))' }}
        >
          <MumMuhur harfler={muhurHarfi} boyut={72} kirik={aciliyor && !reduced} />
        </button>
      </motion.div>

      {/* İpucu durağandır: sonsuz nabız hem "bir kez" kuralını bozar hem de
          opaklığı düştüğü anda metni 4.5:1'in altına indirir. */}
      <motion.p
        className={cn('text-[12px] font-medium tracking-[0.2em] uppercase', theme.body)}
        animate={{ opacity: aciliyor ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        Mühre dokunarak açın
      </motion.p>
    </motion.div>
  );
}
