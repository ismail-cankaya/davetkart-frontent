import { useMemo } from 'react';
import { useReducedMotion } from 'motion/react';
import { ease } from '../../../../utils/motion';

/**
 * "İğne düşer, rota ilerler" (HARITA-KONSEPTI §6). Yalnızca `transform` ve
 * `opacity`; her giriş bir kez oynar. Kapakta son öğenin gecikme + süresi
 * `ust`'ü geçmez.
 */
export const HARITA_SURE = {
  kutu: 0.4,
  igne: 0.35,
  /** Rota parçalarının hepsinin görünmesi (ilk gecikme dahil). */
  rota: 0.9,
  ust: 1.0
} as const;

export interface GirisProps {
  initial: false | Record<string, number>;
  animate: Record<string, number>;
  transition: { duration: number; ease: typeof ease.out; delay: number };
}

const giris = (bas: Record<string, number>, son: Record<string, number>, sure: number, gecikme: number, azalt: boolean): GirisProps => ({
  // Hareket azaltıldığında hiçbir şey oynamaz: öğe son hâliyle çizilir.
  initial: azalt ? false : bas,
  animate: son,
  transition: { duration: sure, ease: ease.out, delay: gecikme }
});

/**
 * `girisBitti`: kapağın giriş penceresi (`ust`) kapandı mı? Fontlar geç gelip
 * kartuşun boyu değişince rota yeniden ölçülür ve yeni parçalar doğar; pencere
 * kapandıktan sonra doğan öğe oynamaz, yerinde belirir — giriş 1 s'yi aşmaz.
 */
export function useHaritaHareketi(girisBitti = false) {
  const azalt = (useReducedMotion() ?? false) || girisBitti;
  return useMemo(
    () => ({
      azalt,
      /** Kartuş, lejant: opaklık + y 8 → 0. */
      kutu: (gecikme = 0) => giris({ opacity: 0, y: 8 }, { opacity: 1, y: 0 }, HARITA_SURE.kutu, gecikme, azalt),
      /** İğne: y −16 → 0, ölçek 1.2 → 1. */
      igne: (gecikme = 0) => giris({ opacity: 0, y: -16, scale: 1.2 }, { opacity: 1, y: 0, scale: 1 }, HARITA_SURE.igne, gecikme, azalt),
      /** Yalnızca opaklık (rota parçaları, etiketler). */
      belir: (gecikme = 0, sure = 0.3) => giris({ opacity: 0 }, { opacity: 1 }, sure, gecikme, azalt)
    }),
    [azalt]
  );
}
