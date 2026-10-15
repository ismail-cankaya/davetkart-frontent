import { ease } from '../../../../utils/motion';

/**
 * Kâğıt ailesinin hareket dili: kâğıt kayar, damga basılır, mühür kırılır.
 * Her hareket bir kez oynar; sonsuz döngü yoktur.
 *
 * Kural (KAGIT-KONSEPTI §5): hero'da son öğenin `gecikme + süre` toplamı
 * 1.0 s'yi geçmez. Yalnızca `transform` ve `opacity` canlandırılır.
 *
 * "Hareketi azalt": App'teki `MotionConfig reducedMotion="user"` transform'ları
 * atlar, opaklık kalır — öğeler yerinde belirir. Zarf kendi kısa yolunu
 * kullanır (KagitZarf).
 */
export const KAGIT_SURE = {
  /** Kâğıdın masaya kayması. */
  kayma: 0.6,
  /** Mürekkebin ya da yazının belirmesi. */
  belirme: 0.45,
  /** Damganın basılması: kısa, sert. */
  basma: 0.24,
  /** Hero girişinin üst sınırı (gecikme + süre). */
  ust: 1.0
} as const;

export const kaymaGirisi = (gecikme = 0) => ({
  initial: { opacity: 0, y: 22, rotate: -1.2 },
  animate: { opacity: 1, y: 0, rotate: 0 },
  transition: { duration: KAGIT_SURE.kayma, ease: ease.out, delay: gecikme }
});

export const belirmeGirisi = (gecikme = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: KAGIT_SURE.belirme, ease: ease.out, delay: gecikme }
});

/** Damga: biraz büyük ve eğik gelir, kâğıda oturur. `aci` son eğimdir. */
export const basmaGirisi = (gecikme = 0, aci = 0) => ({
  initial: { opacity: 0, scale: 1.16, rotate: aci - 5 },
  animate: { opacity: 1, scale: 1, rotate: aci },
  transition: { duration: KAGIT_SURE.basma, ease: ease.out, delay: gecikme }
});
