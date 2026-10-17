import { ease } from '../../../../utils/motion';

/**
 * Sergi'nin hareket dili: ışık yanar, eser asılır, etiket belirir. Sessiz,
 * kısa, tek sefer; sonsuz döngü yok (SERGI-KONSEPTI §6).
 *
 * Hero'da son öğenin `gecikme + süre` toplamı 1.0 s'yi geçmez. Yalnızca
 * `transform` ve `opacity` canlandırılır; "hareketi azalt"ta App'in
 * `MotionConfig reducedMotion="user"`'ı transform'ları atlar, opaklık kalır.
 */
export const SERGI_SURE = {
  spot: 0.5,
  asilma: 0.6,
  etiket: 0.3,
  /** Etiketin varsayılan gecikmesi: eser asıldıktan hemen sonra. */
  etiketGecikme: 0.5,
  yazi: 0.4,
  /** Hero girişinin üst sınırı (gecikme + süre). */
  ust: 1.0
} as const;

/** Spot: yalnızca opaklık. */
export const spotYanar = (gecikme = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: SERGI_SURE.spot, ease: ease.out, delay: gecikme }
});

/** Eser duvara asılır: hafif yukarıdan ve eğik gelir, oturur. */
export const eserAsilir = (gecikme = 0) => ({
  initial: { opacity: 0, y: -10, rotate: -0.6 },
  animate: { opacity: 1, y: 0, rotate: 0 },
  transition: { duration: SERGI_SURE.asilma, ease: ease.out, delay: gecikme }
});

/** Etiket: yalnızca opaklık. */
export const etiketBelirir = (gecikme: number = SERGI_SURE.etiketGecikme) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: SERGI_SURE.etiket, ease: ease.out, delay: gecikme }
});

/** Duvar yazısı ve gövde: opaklık + 12 px yükselme. */
export const yaziBelirir = (gecikme = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: SERGI_SURE.yazi, ease: ease.out, delay: gecikme }
});
