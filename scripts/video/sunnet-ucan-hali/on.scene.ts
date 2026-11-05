import { buildSehir, PARILTI } from './sehir';
import type { SceneDef } from '../lib/types';

/** Ön ışık katmanı: halının önünden geçen yıldız tozu (döngü). */
const scene: SceneDef = {
  duration: PARILTI,
  fps: 24,
  loop: true,
  poster: 2,
  crf: 30,
  setup(ctx) {
    const c = buildSehir(ctx, 'on');
    return { render: (t) => c.render(t, 0) };
  }
};
export default scene;
