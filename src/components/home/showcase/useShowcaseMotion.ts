import { useTransform, type MotionValue } from 'motion/react';
import type { ShowcaseMode } from './showcaseLayout';
import { showcasePose, type ShowcasePose } from './showcasePose';
import type { ShowcaseRole } from './showcaseSlides';

export interface PhoneMotion {
  transform: MotionValue<string>;
  opacity: MotionValue<number>;
  screen: MotionValue<string>;
}

export interface ShowcaseMotion {
  phones: Record<ShowcaseRole, PhoneMotion>;
  head: { transform: MotionValue<string>; opacity: MotionValue<number> };
  cta: { transform: MotionValue<string>; opacity: MotionValue<number>; visibility: MotionValue<'visible' | 'hidden'> };
}

/**
 * Kaydırma ilerlemesini sahnenin MotionValue'larına çevirir; React her karede yeniden çizmez.
 * 🔴 `mode`/`rtl` değişince çağıran bileşen yeniden bağlanır (`key`), dönüştürücüler eski değeri tutmasın.
 */
export function useShowcaseMotion(progress: MotionValue<number>, mode: ShowcaseMode, rtl: boolean): ShowcaseMotion {
  const pick = <K extends keyof ShowcasePose>(key: K) => (p: number) => showcasePose(p, mode, rtl)[key];
  const one = useTransform(progress, () => 1);
  const sideOpacity = useTransform(progress, pick('sideOpacity'));
  const ctaOpacity = useTransform(progress, pick('ctaOpacity'));

  return {
    phones: {
      center: { transform: useTransform(progress, pick('center')), opacity: one, screen: useTransform(progress, pick('screenCenter')) },
      start: { transform: useTransform(progress, pick('start')), opacity: sideOpacity, screen: useTransform(progress, pick('screenStart')) },
      end: { transform: useTransform(progress, pick('end')), opacity: sideOpacity, screen: useTransform(progress, pick('screenEnd')) }
    },
    head: { transform: useTransform(progress, pick('head')), opacity: useTransform(progress, pick('headOpacity')) },
    // Görünmeyen bağlantı odak almasın: neredeyse saydamken `visibility: hidden`.
    cta: {
      transform: useTransform(progress, pick('cta')),
      opacity: ctaOpacity,
      visibility: useTransform(ctaOpacity, (v): 'visible' | 'hidden' => (v < 0.05 ? 'hidden' : 'visible'))
    }
  };
}
