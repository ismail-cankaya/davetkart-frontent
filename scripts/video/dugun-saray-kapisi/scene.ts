import { buildSaray } from './sahne';
import { DONGU } from './giris.scene';
import type { SceneDef } from '../lib/types';

/**
 * Döngü klibi: kapı açık, kamera dinlenir; huzmeler kıpırdar, toz süzülür.
 * t = 0 karesi giriş klibinin son karesiyle aynıdır (kesme görünmez).
 */
const scene: SceneDef = {
  duration: DONGU,
  fps: 30,
  loop: true,
  poster: 0,
  setup(ctx) {
    const saray = buildSaray(ctx);
    return {
      render(t) {
        saray.render({ camZ: 8.4 + 0.12 * Math.sin((t / DONGU) * Math.PI * 2), camY: 1.9, open: 1, rayPhase: (t / DONGU) * Math.PI * 2, dustT: t, dustPeriod: DONGU }, t);
      }
    };
  }
};

export default scene;
