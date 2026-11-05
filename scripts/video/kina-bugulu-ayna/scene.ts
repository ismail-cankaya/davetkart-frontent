import { buildHamam, SURE } from './hamam';
import type { SceneDef } from '../lib/types';

/** Gelin hamamı: kubbe filgözlerinden süzülen huzmeler, yükselen buhar, kemerli niş. */
const scene: SceneDef = {
  duration: SURE,
  fps: 24,
  loop: true,
  poster: 3,
  setup(ctx) {
    const h = buildHamam(ctx, 'main');
    return { render: (t) => h.render(t) };
  }
};
export default scene;
