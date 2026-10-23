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
  ust: 1.0,
  /**
   * Harita katmanı (rota, iğne, mekân etiketi) fontları en çok bu kadar bekler;
   * gelmezse yedek fontla ölçülüp çizilir (s).
   */
  fontBekleme: 6,
  /**
   * Katman bu andan sonra açılırsa oynamaz, yerinde belirir: kalan pencere
   * girişi sıkıştırmaya yetmez (s).
   */
  esnek: 0.5
} as const;

export interface GirisProps {
  initial: false | Record<string, number>;
  animate: Record<string, number>;
  transition: { duration: number; ease: typeof ease.out; delay: number };
}

const giris = (
  bas: Record<string, number>,
  son: Record<string, number>,
  sure: number,
  gecikme: number,
  azalt: boolean,
  olcek: number
): GirisProps => ({
  // Hareket azaltıldığında hiçbir şey oynamaz: öğe son hâliyle çizilir.
  initial: azalt ? false : bas,
  animate: son,
  transition: { duration: sure * olcek, ease: ease.out, delay: gecikme * olcek }
});

/**
 * `girisBitti`: kapağın giriş penceresi (`ust`) kapandı mı? Pencere kapandıktan
 * sonra doğan öğe (ör. ekran döndü, rota yeniden kuruldu) oynamaz, yerinde belirir.
 *
 * `olcek`: gecikme ve sürelerin çarpanı (0–1]. Harita katmanı fontları beklediği
 * için kapaktan `k` saniye sonra açılırsa çizelgesi `1 − k` ile sıkıştırılır;
 * son öğe yine `ust` içinde biter.
 */
export function useHaritaHareketi(girisBitti = false, olcek = 1) {
  const azalt = (useReducedMotion() ?? false) || girisBitti;
  return useMemo(
    () => ({
      azalt,
      /** Kartuş, lejant: opaklık + y 8 → 0. */
      kutu: (gecikme = 0) => giris({ opacity: 0, y: 8 }, { opacity: 1, y: 0 }, HARITA_SURE.kutu, gecikme, azalt, olcek),
      /** İğne: y −16 → 0, ölçek 1.2 → 1. */
      igne: (gecikme = 0) =>
        giris({ opacity: 0, y: -16, scale: 1.2 }, { opacity: 1, y: 0, scale: 1 }, HARITA_SURE.igne, gecikme, azalt, olcek),
      /** Yalnızca opaklık (rota parçaları, etiketler). */
      belir: (gecikme = 0, sure = 0.3) => giris({ opacity: 0 }, { opacity: 1 }, sure, gecikme, azalt, olcek)
    }),
    [azalt, olcek]
  );
}
