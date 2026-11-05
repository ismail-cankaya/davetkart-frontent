import * as THREE from 'three';
import { createStage, fullscreenShader } from '../lib/stage';
import type { SceneDef } from '../lib/types';
import { HAVUZ_FRAG, HAVUZ_SURESI, ORB_COLORS, orbPositions } from '../../../src/components/templates/parti/PartiHavuz/havuzShader';

/**
 * Gece Havuzu — üstten bakış: karo zemin, döngüsel kostik ağı, yüzen LED
 * küreler. Shader şablonun canlı WebGL katmanıyla AYNI dosyadan gelir.
 */
const scene: SceneDef = {
  duration: HAVUZ_SURESI,
  fps: 24,
  loop: true,
  poster: 1.5,
  setup(ctx) {
    const stage = createStage(ctx, {
      exposure: 1.0,
      bloom: { strength: 0.55, threshold: 0.75, radius: 1 },
      vignette: 0.25,
      grain: 0.004
    });
    const orbs = Array.from({ length: 5 }, () => new THREE.Vector2());
    const { scene: s, camera, material } = fullscreenShader(HAVUZ_FRAG, {
      uOrbs: { value: orbs },
      uOrbColors: { value: ORB_COLORS.map(([r, g, b]) => new THREE.Vector3(r, g, b)) },
      uRipples: { value: Array.from({ length: 4 }, () => new THREE.Vector4(0, 0, 0, 0)) },
      uClock: { value: 0 }
    });
    (material.uniforms.uResolution.value as THREE.Vector2).set(ctx.width, ctx.height);
    const aspect = ctx.width / ctx.height;
    return {
      render(t) {
        const pos = orbPositions(t, aspect);
        orbs.forEach((v, i) => v.set(pos[i * 2], pos[i * 2 + 1]));
        material.uniforms.uTime.value = t;
        stage.render(s, camera, t);
      }
    };
  }
};

export default scene;
