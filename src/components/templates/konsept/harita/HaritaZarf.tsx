import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { ease } from '../../../../utils/motion';
import type { EnvelopeRenderProps } from '../../shared/InvitationComposition';
import { Igne } from './Igne';
import { PusulaGulu } from './simgeler';
import { kisiler } from './veri';

/**
 * Zarf kapısı: katlanmış harita. Kapak kartuşun küçüğüdür; dokununca kapak
 * sol kenarından açılır, altındaki harita görünür, kapı solar.
 *
 * Boyut (K3): telefonda 17 rem genişlik; kapının iç genişliği ≥ 42 rem iken
 * (768 px tablet dahil) kart kapının boyunun %70'idir (en çok genişliğin
 * −6 rem'i). Kapı bir boyut kabıdır (`container-type: size`): ölçü pencereye
 * değil kapının kendisine bakar — editörün önizlemesinde de doğru oranda çizilir.
 * Yatay telefonda kart boya sığacak kadar küçülür.
 *
 * Zamanlama (s) — dokunuştan içeriğe ≤ 0.9:
 *   0.00–0.45 kapak açılır (rotateY 0 → −165°)
 *   0.40      `onRevealStart` — kapak girişini başlatır
 *   0.45–0.85 kapı solar → `onOpened`
 *
 * Hareket azaltıldığında dokunuş kapıyı anında kaldırır.
 * Kompozisyon bu bileşeni yalnızca `showEnvelope` açıkken çağırır.
 */
const ZAMAN = { kapak: 0.45, acilis: 0.4, cikis: 0.45, cikisSure: 0.4 };

export function HaritaZarf({
  invitation,
  theme,
  flavor,
  onRevealStart,
  onOpened,
  arazi
}: EnvelopeRenderProps & { arazi: React.ReactNode }) {
  const [aciliyor, setAciliyor] = useState(false);
  const azalt = useReducedMotion();
  const adlar = kisiler(invitation.names);

  const onRevealStartRef = useRef(onRevealStart);
  const onOpenedRef = useRef(onOpened);
  useEffect(() => {
    onRevealStartRef.current = onRevealStart;
    onOpenedRef.current = onOpened;
  }, [onRevealStart, onOpened]);

  useEffect(() => {
    if (!aciliyor) return;
    if (azalt) {
      onRevealStartRef.current();
      onOpenedRef.current();
      return;
    }
    const id = window.setTimeout(() => onRevealStartRef.current(), ZAMAN.acilis * 1000);
    return () => window.clearTimeout(id);
  }, [aciliyor, azalt]);

  const ac = () => {
    if (!aciliyor) setAciliyor(true);
  };

  return (
    <motion.div
      className={cn(
        'absolute inset-0 z-40 flex flex-col items-center justify-center gap-7 overflow-hidden px-6 [container-type:size]',
        theme.base,
        theme.page
      )}
      onClick={ac}
      initial={{ opacity: 1 }}
      animate={{ opacity: aciliyor && !azalt ? 0 : 1 }}
      transition={{ duration: ZAMAN.cikisSure, ease: ease.in, delay: aciliyor ? ZAMAN.cikis : 0 }}
      onAnimationComplete={() => {
        if (aciliyor) onOpenedRef.current();
      }}
    >
      <div
        className="relative aspect-[3/4] w-full max-w-[min(17rem,calc((100cqh_-_8rem)*0.75))] @2xl:w-[min(calc(70cqh*0.75),calc(100cqw_-_6rem))] @2xl:max-w-none"
        style={{ perspective: 1100 }}
      >
        {/* İç yüz: katlı haritanın açılan ilk paneli. */}
        <div className="absolute inset-0 overflow-hidden border-[1.5px] border-[#23303A] bg-[#EEF0E6] [box-shadow:4px_4px_0_#23303A] @2xl:[box-shadow:6px_6px_0_#23303A]">
          {arazi}
          <div aria-hidden="true" className="absolute inset-y-0 left-1/3 w-px bg-[#23303A]/25" />
          <div aria-hidden="true" className="absolute inset-y-0 left-2/3 w-px bg-[#23303A]/25" />
          <div aria-hidden="true" className="absolute left-[58%] top-[46%]">
            <Igne olcek={0.9} />
          </div>
        </div>

        {/* Kapak: küçük kartuş. Sol kenarından menteşeli açılır. */}
        <motion.div
          className="absolute inset-0 origin-left [backface-visibility:hidden] flex flex-col border-[1.5px] border-[#23303A] bg-white px-5 py-6 @2xl:px-9 @2xl:py-10"
          initial={false}
          animate={aciliyor && !azalt ? { rotateY: -165 } : { rotateY: 0 }}
          transition={{ duration: ZAMAN.kapak, ease: ease.inOut }}
        >
          <div>
            <p className="[font-family:var(--hr-etiket)] text-[12px] @2xl:text-[14px] font-semibold uppercase tracking-[0.18em] text-[#A8321F]">
              {flavor.envelopeLabel}
            </p>
            <p className="mt-3 @2xl:mt-4 [font-family:var(--hr-italik)] text-[30px] @2xl:text-[46px] font-medium italic leading-[1.05] text-[#23303A] [text-wrap:balance] break-words">
              {adlar.length ? (
                adlar.map((ad, i) => (
                  <span key={`${ad}-${i}`} className="block">
                    {i > 0 && (
                      <>
                        {' '}
                        <span className="text-[0.72em] text-[#A8321F]">&amp;</span>{' '}
                      </>
                    )}
                    {ad}
                  </span>
                ))
              ) : (
                'Davetlisiniz'
              )}
            </p>
          </div>
          {/* Kapak resmi: haritadan küçük bir pencere. */}
          <div aria-hidden="true" className="relative my-4 @2xl:my-6 min-h-[3.5rem] flex-1 overflow-hidden border border-[#23303A]/50">
            {arazi}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[85%] @2xl:scale-125">
              <Igne olcek={0.75} />
            </div>
          </div>
          <div className="flex items-end justify-between gap-3">
            <p className="[font-family:var(--hr-etiket)] text-[12px] @2xl:text-[14px] font-semibold uppercase tracking-[0.18em] text-[#4E5B63]">
              Günün haritası
            </p>
            <PusulaGulu boyut={40} className="text-[#23303A] @2xl:size-14" />
          </div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={(olay) => {
          olay.stopPropagation();
          ac();
        }}
        animate={{ opacity: aciliyor ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="min-h-[44px] rounded-[3px] border-[1.5px] border-[#23303A] bg-white px-5 [font-family:var(--hr-etiket)] text-[15px] font-semibold uppercase tracking-[0.16em] text-[#23303A] transition-colors hover:bg-[#23303A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8321F]"
      >
        Haritayı açın
      </motion.button>
    </motion.div>
  );
}
