import { useEffect, RefObject } from 'react';
import { useMotionValue, useSpring, useReducedMotion, MotionValue } from 'motion/react';

export interface ParallaxHandle {
  /** -1..1 normalize edilmiş, yaylanmış işaretçi konumu. */
  px: MotionValue<number>;
  py: MotionValue<number>;
}

/**
 * Konteyner üzerindeki işaretçi konumunu -1..1 aralığına indirger ve yayla
 * yumuşatır. Katmanlar bu değeri kendi derinlik çarpanlarıyla kullanır:
 *
 *   const { px, py } = usePointerParallax(ref);
 *   const x = useTransform(px, (v) => v * 18);   // ön katman
 *   const x = useTransform(px, (v) => v * 6);    // arka katman
 *
 * Ham `pointermove` değeri doğrudan bağlanırsa hareket sinirli ve dijital
 * görünür; yay (spring) onu ağır bir kamera hissine çevirir.
 *
 * Dokunmatik cihazda `pointermove` yalnızca parmak ekrandayken gelir; bu
 * yüzden kaldırıldığında merkeze dönülür — katmanlar eğik takılı kalmasın.
 */
export function usePointerParallax(
  ref: RefObject<HTMLElement | null>,
  { stiffness = 60, damping = 20 }: { stiffness?: number; damping?: number } = {}
): ParallaxHandle {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const reducedMotion = useReducedMotion();

  const px = useSpring(rawX, { stiffness, damping, mass: 0.6 });
  const py = useSpring(rawY, { stiffness, damping, mass: 0.6 });

  useEffect(() => {
    if (reducedMotion) return;

    const element = ref.current;
    if (!element) return;

    // Kutu her `pointermove`'da ölçülmez: aynı karede yazılan transform'larla
    // birlikte her ölçüm zorunlu bir senkron layout demekti. Ölçüm önbelleğe
    // alınır; boyut değişince hemen, herhangi bir kaydırmadan sonra (davetiye
    // kendi kutusunda kayar, olay capture ile yakalanır) ilk harekette yenilenir.
    let rect = element.getBoundingClientRect();
    let stale = false;
    const markStale = () => {
      stale = true;
    };
    const resizeObserver = new ResizeObserver(() => {
      rect = element.getBoundingClientRect();
      stale = false;
    });
    resizeObserver.observe(element);
    window.addEventListener('scroll', markStale, { passive: true, capture: true });

    const onMove = (event: PointerEvent) => {
      if (stale) {
        rect = element.getBoundingClientRect();
        stale = false;
      }
      if (rect.width === 0 || rect.height === 0) return;

      rawX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
      rawY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const recenter = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', recenter, { passive: true });
    window.addEventListener('pointercancel', recenter, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', markStale, { capture: true });
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', recenter);
      window.removeEventListener('pointercancel', recenter);
    };
  }, [ref, rawX, rawY, reducedMotion]);

  return { px, py };
}
