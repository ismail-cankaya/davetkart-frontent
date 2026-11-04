import { useEffect, useState, type RefObject } from 'react';

/**
 * Sahne ekranda ve sekme görünürken `true`. Ekrandan çıkan ya da arka plana
 * düşen sahne kare çizmeyi durdurur (pil ve GPU).
 */
export function useStageActive(ref: RefObject<HTMLElement | null>): boolean {
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    const onChange = () => setPageVisible(document.visibilityState === 'visible');
    onChange();
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return inView && pageVisible;
}
