import * as THREE from 'three';
import { createStage, fullscreenShader } from '../lib/stage';
import type { SceneDef } from '../lib/types';
import { LAZER_FRAG, LAZER_SURESI, aimAt } from '../../../src/components/templates/parti/PartiLazer/lazerShader';

/**
 * Lazer Gösterisi — sisli çatı katında üç kaynaktan yelpaze lazerler. Shader
 * şablonun canlı WebGL katmanıyla AYNI dosyadan gelir.
 */
const scene: SceneDef = {
  duration: LAZER_SURESI,
  fps: 24,
  loop: true,
  poster: 1.2,
  crf: 24,
  setup(ctx) {
    const stage = createStage(ctx, {
      exposure: 1.0,
      bloom: { strength: 0.8, threshold: 0.45, radius: 1 },
      vignette: 0.4,
      grain: 0.006,
      dither: false
    });
    const aim = new THREE.Vector2();
    const { scene: s, camera, material } = fullscreenShader(LAZER_FRAG, {
      uAim: { value: aim },
      uFlash: { value: new THREE.Vector2(0, 0) },
      uClock: { value: 0 }
    });
    (material.uniforms.uResolution.value as THREE.Vector2).set(ctx.width, ctx.height);
    const aspect = ctx.width / ctx.height;
    return {
      render(t) {
        const [x, y] = aimAt(t, aspect);
        aim.set(x, y);
        material.uniforms.uTime.value = t;
        stage.render(s, camera, t);
      }
    };
  }
};

export default scene;
