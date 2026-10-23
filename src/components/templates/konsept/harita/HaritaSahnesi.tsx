import React from 'react';
import { motion, useReducedMotion, useTransform } from 'motion/react';
import type { BackdropState } from '../../shared/InvitationComposition';
import { useHaritaBaglami } from './baglam';
import { HARITA_RENK } from './palet';

/**
 * Davetiyenin arkasında sabit duran harita (`renderBackdrop`).
 *
 * Kapakta harita tam görünür. Kapağın altında arazi renginde düz bir perde
 * başlar ve kapağın alt kenarıyla birlikte yukarı kayar (`translateY`):
 * bölüm başlıkları her kaydırma anında perdelenmiş haritanın üstündedir,
 * kartlar kendi beyaz zemininde okunur. Perde %80: harita kaybolmaz, ama en
 * koyu çizginin üstünde de başlık AA'yı geçer (ölçüm: kılavuz).
 *
 * Harita ayrıca belgeyle birlikte yavaşça kayar (paralaks); hareket
 * azaltıldığında kaymaz. Perde içeriğin kenarını izlediği için (hareket
 * değil, kaydırmanın kendisi) azaltılmış harekette de izler.
 */
export const PERDE_OPAKLIGI = 0.8;

export function HaritaSahnesi({
  heroExit,
  progress,
  children,
  zemin = HARITA_RENK.arazi,
  perde = PERDE_OPAKLIGI
}: BackdropState & {
  children: React.ReactNode;
  /** Sayfa ve perde rengi; temanın `base` zeminiyle aynı olmalı (hazine: `araziSicak`). */
  zemin?: string;
  /** Perdenin opaklığı; varsayılan %80. Koyu çizgili arazide (hazine adası) %86. */
  perde?: number;
}) {
  const durgun = useReducedMotion();
  const baglam = useHaritaBaglami();
  const y = useTransform(progress, [0, 1], ['0%', durgun ? '0%' : '-14%']);
  // Bağlam yoksa (kök dışında kullanım) eski yol: perde kapak çıkarken solar.
  const yedekPerde = useTransform(heroExit, [0.1, 0.85], [0, perde]);

  return (
    <div aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: zemin }}>
      <motion.div className="absolute inset-x-0 top-0 h-[118%] will-change-transform" style={{ y }}>
        {children}
      </motion.div>
      {baglam ? (
        <motion.div className="absolute inset-0" style={{ y: baglam.kapakAlti, opacity: perde, backgroundColor: zemin }} />
      ) : (
        <motion.div className="absolute inset-0" style={{ opacity: yedekPerde, backgroundColor: zemin }} />
      )}
    </div>
  );
}
