import { buildHamam, SURE } from './hamam';
import type { SceneDef } from '../lib/types';

/** Ön ışık katmanı (siyah zemin, ekran harmanı): aynanın önünden geçen buhar ve ışıltılar. */
const scene: SceneDef = {
  duration: SURE,
  fps: 24,
  loop: true,
  poster: 3,
  crf: 30,
  setup(ctx) {
    const h = buildHamam(ctx, 'on');
    return { render: (t) => h.render(t) };
  }
};
export default scene;
