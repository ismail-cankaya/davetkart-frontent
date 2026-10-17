import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * Davetiyenin kaydırma kabının yüksekliği (px).
 *
 * Kapaktan sonra hero'da başka bir sayfa daha olduğunda kapak tam bir ekran
 * boyu olmalıdır. Kap `min-height` ile büyüdüğü için `%` çözülmez; `vh` ise
 * editörün telefon çerçevesinde pencereyi ölçer. Kabın kendisi ölçülür ve
 * boyu değiştikçe (cihaz değişimi, telefon dönmesi) yeniden okunur.
 *
 * Ölçülmeden önce (sunucu çizimi, ilk çizim) `null` döner; çağıran o an için
 * `100svh` gibi bir yedek kullanır.
 */
export function useEkranBoyu(kap?: RefObject<HTMLDivElement | null>): number | null {
  const [boy, setBoy] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = kap?.current;
    if (!el) return;
    const oku = () => setBoy(el.clientHeight || null);
    oku();
    const gozlem = new ResizeObserver(oku);
    gozlem.observe(el);
    return () => gozlem.disconnect();
  }, [kap]);
  return boy;
}
