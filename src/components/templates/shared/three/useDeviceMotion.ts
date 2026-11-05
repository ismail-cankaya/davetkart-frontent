import { useEffect, useRef, type MutableRefObject } from 'react';

/**
 * Telefonun yerçekimi yönü ve sallanma enerjisi. Değerler ref'e yazılır,
 * yeniden çizim tetiklenmez; sahne kendi kare döngüsünde okur.
 *
 * - `gx`, `gy`: ekran düzleminde yerçekimi (-1..1). Telefon dik tutulunca
 *   `gy ≈ 1` (aşağı), sağa yatırınca `gx > 0`. Sensör yoksa `gx = 0, gy = 1`.
 * - `shake`: son sallamaların sönümlü enerjisi (0..~3). Sahne okur ve kendi
 *   ölçeğinde kullanır; değer kendiliğinden ~0,6 sn'de söner.
 * - `live`: en az bir sensör olayı geldi (masaüstünde hep `false`).
 *
 * İzin: iOS 13+ `DeviceMotionEvent.requestPermission` ister; ortak
 * `GyroButton` tek dokunuşta hem yön hem hareket iznini alır. İzinsiz
 * cihazlarda olay hiç gelmez, değerler varsayılanda kalır.
 */
export interface DeviceMotionState {
  gx: number;
  gy: number;
  shake: number;
  live: boolean;
}

export function useDeviceMotion(
  enabled: boolean,
  onShake?: () => void
): MutableRefObject<DeviceMotionState> {
  const state = useRef<DeviceMotionState>({ gx: 0, gy: 1, shake: 0, live: false });
  const shakeRef = useRef(onShake);
  shakeRef.current = onShake;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    let last = 0;
    let lastShake = 0;
    // iOS Safari `accelerationIncludingGravity` eksenlerini Android'in tersi işaretle verir.
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const sign = ios ? -1 : 1;
    const onMotion = (e: DeviceMotionEvent) => {
      const g = e.accelerationIncludingGravity;
      const now = performance.now();
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      const s = state.current;
      if (g && g.x !== null && g.y !== null) {
        // Tarayıcı ekseni: x sağa, y yukarı. Ekran düzleminde aşağı yönü istiyoruz.
        const len = Math.hypot(g.x, g.y, g.z ?? 0) || 9.81;
        s.gx = Math.max(-1, Math.min(1, (-sign * g.x) / len));
        s.gy = Math.max(-1, Math.min(1, (sign * g.y) / len));
        s.live = true;
      }
      const a = e.acceleration;
      const mag = a && a.x !== null ? Math.hypot(a.x ?? 0, a.y ?? 0, a.z ?? 0) : 0;
      s.shake = Math.max(0, s.shake * Math.exp(-dt / 0.6) + Math.max(0, mag - 6) * 0.08);
      if (mag > 14 && now - lastShake > 700) {
        lastShake = now;
        shakeRef.current?.();
      }
    };
    window.addEventListener('devicemotion', onMotion, { passive: true });
    return () => {
      window.removeEventListener('devicemotion', onMotion);
      state.current = { gx: 0, gy: 1, shake: 0, live: false };
    };
  }, [enabled]);

  return state;
}
