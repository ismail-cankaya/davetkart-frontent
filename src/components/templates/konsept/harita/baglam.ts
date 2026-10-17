import { createContext, useContext } from 'react';
import type { MotionValue } from 'motion/react';

/**
 * Kapak ile arka plandaki harita arasındaki tek bağ: kapağın alt kenarının
 * ekrandaki yeri (px). Kapak her kaydırmada yazar, sahne perdesini tam o
 * kenardan başlatır — bölüm başlıkları hiçbir kaydırma anında perdesiz
 * haritanın üstüne düşmez.
 *
 * İkisi kompozisyonda kardeştir (`renderHero` / `renderBackdrop`); değer
 * prop olarak geçemediği için `HaritaKok`'un bağlamından paylaşılır. Değer
 * bir MotionValue'dur: yazmak yeniden çizim tetiklemez.
 */
export interface HaritaBaglami {
  kapakAlti: MotionValue<number>;
}

/** Kapak henüz yokken (zarf kapalı) perde ekranın dışında durur. */
export const PERDE_DISARIDA = 100000;

export const HaritaBaglamiContext = createContext<HaritaBaglami | null>(null);

export function useHaritaBaglami(): HaritaBaglami | null {
  return useContext(HaritaBaglamiContext);
}
