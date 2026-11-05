import { buildLansman, DONGU } from './sahne';
import type { SceneDef } from '../lib/types';

/** Döngü: duvar açık, başlıklar sahneyi tarar. t = 0 girişin son karesidir. */
const scene: SceneDef = {
  duration: DONGU,
  fps: 24,
  loop: true,
  poster: 2.2,
  setup(ctx) {
    const l = buildLansman(ctx);
    const on = [1, 1, 1, 1, 1, 1];
    return { render: (t) => l.render({ time: t, wall: 1, beams: on }, t) };
  }
};

export default scene;
