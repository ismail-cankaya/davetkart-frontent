import { buildSehir, YOLCULUK } from './sehir';
import type { SceneDef } from '../lib/types';

/** Kaydırmaya bağlı yolculuk: kare = ilerleme. Kısa GOP ile kodlanır. */
const scene: SceneDef = {
  duration: YOLCULUK,
  fps: 30,
  loop: false,
  scrub: true,
  poster: 0.6,
  setup(ctx) {
    const c = buildSehir(ctx, 'main');
    return { render: (t) => c.render(t, Math.min(1, t / YOLCULUK)) };
  }
};
export default scene;
