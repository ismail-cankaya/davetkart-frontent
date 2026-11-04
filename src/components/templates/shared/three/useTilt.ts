import { useEffect, useRef, type MutableRefObject } from 'react';

/** -1..1 aralığında eğim; React durumu değil, kare döngüsünde okunan bir ref. */
export interface Tilt {
  x: number;
  y: number;
}

/**
 * İşaretçi ve (izin verilmiş/izin gerektirmeyen cihazlarda) jiroskop eğimi.
 * Değer her olayda ref'e yazılır, yeniden çizim tetiklenmez; sahneler ve CSS
 * katmanları onu kendi döngülerinde yumuşatarak okur. `enabled` kapalıysa
 * (hareketi azalt, önizleme) değer 0'da kalır.
 */
export function useTilt(enabled: boolean): MutableRefObject<Tilt> {
  const tilt = useRef<Tilt>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      tilt.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      tilt.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      // Telefon elde ~40° eğik tutulur; o duruş merkez sayılır.
      tilt.current.x = Math.max(-1, Math.min(1, e.gamma / 30));
      tilt.current.y = Math.max(-1, Math.min(1, (e.beta - 40) / 30));
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('deviceorientation', onOrientation);
      tilt.current.x = 0;
      tilt.current.y = 0;
    };
  }, [enabled]);

  return tilt;
}
