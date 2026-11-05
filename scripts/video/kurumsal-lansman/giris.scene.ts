import { buildLansman, GIRIS } from './sahne';
import { easeOut, smooth } from '../lib/glsl';
import type { SceneDef } from '../lib/types';

/**
 * Giriş (tek sefer): karanlık salon → başlıklar dışarıdan içeriye sırayla
 * yanar → LED duvar merkezden dışa doğru açılır. Son kare döngünün ilk karesi.
 */
const ORDER = [0, 5, 1, 4, 2, 3];

const scene: SceneDef = {
  duration: GIRIS,
  fps: 24,
  loop: false,
  poster: 0.2,
  setup(ctx) {
    const l = buildLansman(ctx);
    return {
      render(t) {
        const beams = new Array(6).fill(0);
        ORDER.forEach((idx, k) => {
          const t0 = 0.35 + k * 0.28;
          // Yanarken kısa bir titreme: lamba ısınıyor.
          const on = smooth(t0, t0 + 0.25, t);
          const flick = t > t0 && t < t0 + 0.25 ? 0.6 + 0.4 * Math.sin(t * 90 + idx) : 1;
          beams[idx] = on * flick;
        });
        const wall = easeOut(smooth(2.0, GIRIS - 0.15, t));
        l.render({ time: t - GIRIS, wall: Math.min(1, wall * 1.0001), beams }, t);
      }
    };
  }
};

export default scene;
