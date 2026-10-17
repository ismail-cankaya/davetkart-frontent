import { ease } from '../../../../utils/motion';

/**
 * Kitabın hareket dili: kapak açılır, sayfa çevrilir. Ağır, kâğıt gibi; her
 * hareket bir kez oynar (KITAP-KONSEPTI §6). Yalnızca `transform` ve
 * `opacity`. "Hareketi azalt"ta App'in `MotionConfig reducedMotion="user"`'ı
 * transform'ları atlar; kapak kapısı kendi kısa yolunu kullanır.
 */
export const KITAP_SURE = {
  /** Kapağın sol menteşeden açılması (kapak kapısı). */
  kapak: 0.8,
  /** Zarfsız kapağın belirmesi. */
  belirme: 0.5,
  /** Ayraç kurdelesinin sarkması ve gecikmesi. */
  ayrac: 0.4,
  ayracGecikme: 0.3,
  /** Hero altındaki sayfanın girişi. */
  bolum: 0.4
} as const;

/** Kapak belirir: opaklık + ölçek 0.98 → 1. `hazir` yanlışken bekler. */
export const kapakBelirir = (hazir = true) => ({
  initial: { opacity: 0, scale: 0.98 },
  animate: hazir ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 },
  transition: { duration: KITAP_SURE.belirme, ease: ease.out }
});

/** Ayraç sarkar: yukarıdan iner. */
export const ayracSarkar = {
  initial: { y: '-100%' },
  animate: { y: 0 },
  transition: { duration: KITAP_SURE.ayrac, ease: ease.out, delay: KITAP_SURE.ayracGecikme }
} as const;

/** Görünür olduğunda bir kez: opaklık + y 10 → 0. */
export const bolumGirisi = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: KITAP_SURE.bolum, ease: ease.out }
} as const;
