import { buildSaray } from './sahne';
import { easeInOut, smooth } from '../lib/glsl';
import type { SceneDef } from '../lib/types';

/** Giriş klibi (tek sefer): kamera koridorda ilerler, kapı ışık sızdırarak açılır. */
export const GIRIS = 6;
export const DONGU = 10;

const scene: SceneDef = {
  duration: GIRIS,
  fps: 30,
  loop: false,
  poster: 0,
  setup(ctx) {
    const saray = buildSaray(ctx);
    const z0 = 18, z1 = 8.4;
    return {
      render(t) {
        const k = easeInOut(Math.min(1, t / GIRIS));
        saray.render(
          {
            camZ: z0 + (z1 - z0) * (1 - Math.pow(1 - Math.min(1, t / (GIRIS - 0.2)), 2.4)),
            camY: 1.9,
            open: smooth(2.4, GIRIS - 0.3, t) * 0.999 + 0.001 * k,
            rayPhase: (t / DONGU) * Math.PI * 2 - (GIRIS / DONGU) * Math.PI * 2,
            dustT: t - GIRIS,
            dustPeriod: DONGU
          },
          t
        );
      }
    };
  }
};

export default scene;
