import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SoftBloomPass } from './bloom';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { SceneContext } from './types';

export interface StageOptions {
  exposure?: number;
  bloom?: { strength: number; threshold: number; radius?: number; knee?: number } | false;
  /** Kenar karartması 0..1. */
  vignette?: number;
  /** Kareden kareye değişen film greni (0..~0.06). */
  grain?: number;
  /** Merkezden kenara renk sapması (piksel, 1080p ölçeğinde). */
  aberration?: number;
  toneMapping?: THREE.ToneMapping;
  clearColor?: THREE.ColorRepresentation;
  /** MSAA örnek sayısı: geometrili (three) sahnelerde 4, tam ekran shader'da 0. */
  samples?: number;
}

/** Son geçiş: vinyet + renk sapması + gren + 8 bit bantlanmayı kıran titreşim. */
const FinishShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uVignette: { value: 0.35 },
    uGrain: { value: 0.03 },
    uAberration: { value: 0.0 },
    uFrame: { value: 0 },
    uResolution: { value: new THREE.Vector2(1920, 1080) }
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uVignette, uGrain, uAberration, uFrame;
    uniform vec2 uResolution;
    varying vec2 vUv;
    float hash(vec3 p) {
      p = fract(p * vec3(443.897, 441.423, 437.195));
      p += dot(p, p.yzx + 19.19);
      return fract((p.x + p.y) * p.z);
    }
    void main() {
      vec2 c = vUv - 0.5;
      vec2 dir = c * uAberration / uResolution.y * 2.0;
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + dir).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv - dir).b;
      float aspect = uResolution.x / uResolution.y;
      vec2 v = c * vec2(min(aspect, 1.0), min(1.0 / aspect, 1.0)) * 2.0;
      float vig = smoothstep(1.45, 0.35, length(v));
      col *= mix(1.0, vig, uVignette);
      float n = hash(vec3(gl_FragCoord.xy, uFrame)) - 0.5;
      col += n * uGrain * (0.35 + 0.65 * (1.0 - dot(col, vec3(0.33))));
      // Statik üçgen titreşim: koyu degradelerde 8 bit basamaklarını kırar.
      float d = hash(vec3(gl_FragCoord.xy, 7.0)) + hash(vec3(gl_FragCoord.yx, 13.0)) - 1.0;
      col += d / 255.0;
      gl_FragColor = vec4(col, 1.0);
    }
  `
};

export interface Stage {
  renderer: THREE.WebGLRenderer;
  width: number;
  height: number;
  /** Sahneyi tüm efekt zinciriyle çizer. */
  render(scene: THREE.Scene, camera: THREE.Camera, t: number): void;
  bloom: SoftBloomPass | null;
  finish: ShaderPass;
}

export function createStage(ctx: SceneContext, opts: StageOptions = {}): Stage {
  const { canvas, width, height } = ctx;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: false });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.toneMapping = opts.toneMapping ?? THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(new THREE.Color(opts.clearColor ?? 0x000000), 1);

  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(width, height, {
    type: THREE.HalfFloatType,
    samples: opts.samples ?? 0
  }));
  composer.setPixelRatio(1);
  composer.setSize(width, height);
  const renderPass = new RenderPass(new THREE.Scene(), new THREE.Camera());
  composer.addPass(renderPass);

  let bloom: SoftBloomPass | null = null;
  if (opts.bloom !== false) {
    bloom = new SoftBloomPass(width, height, opts.bloom ?? { strength: 0.6, threshold: 0.8 });
    composer.addPass(bloom);
  }
  composer.addPass(new OutputPass());
  const finish = new ShaderPass(FinishShader);
  finish.uniforms.uVignette.value = opts.vignette ?? 0.35;
  finish.uniforms.uGrain.value = opts.grain ?? 0.025;
  finish.uniforms.uAberration.value = opts.aberration ?? 0;
  finish.uniforms.uResolution.value.set(width, height);
  composer.addPass(finish);

  return {
    renderer,
    width,
    height,
    bloom,
    finish,
    render(scene, camera, t) {
      renderPass.scene = scene;
      renderPass.camera = camera;
      finish.uniforms.uFrame.value = Math.round(t * 1000) % 100000;
      composer.render();
    }
  };
}

/** Tam ekran shader sahnesi: `uTime`, `uResolution`, `uAspect` hazır gelir. */
export function fullscreenShader(
  fragmentShader: string,
  uniforms: Record<string, THREE.IUniform> = {}
): { scene: THREE.Scene; camera: THREE.OrthographicCamera; material: THREE.ShaderMaterial } {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      ...uniforms
    },
    vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader,
    depthTest: false,
    depthWrite: false
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
  return { scene, camera, material };
}

/** Canvas 2D ile çizilen sahneyi efekt zincirinden geçirmek için doku katmanı. */
export function canvasLayer(width: number, height: number) {
  const source = document.createElement('canvas');
  source.width = width;
  source.height = height;
  const g = source.getContext('2d');
  if (!g) throw new Error('2d bağlamı yok');
  const texture = new THREE.CanvasTexture(source);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  const { scene, camera, material } = fullscreenShader(
    /* glsl */ `
    uniform sampler2D uTex; uniform float uGain; varying vec2 vUv;
    void main() { vec4 c = texture2D(uTex, vUv); gl_FragColor = vec4(c.rgb * uGain, 1.0); }
  `,
    { uTex: { value: texture }, uGain: { value: 1 } }
  );
  return { source, g, texture, scene, camera, material };
}
