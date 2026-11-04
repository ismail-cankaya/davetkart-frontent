import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

/**
 * Yuvarlak, kare izi bırakmayan bloom (Jimenez 2014 tipi): eşikli ön süzgeç,
 * 13 dokulu aşağı örnekleme zinciri ve 9 dokulu çadır süzgeçle yukarı toplama.
 * UnrealBloomPass'in küçük çekirdekli düşük mip'leri parlak noktaların
 * çevresinde kare hale bırakıyordu.
 */
const VERT = /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const PREFILTER = /* glsl */ `
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uThreshold, uKnee; varying vec2 vUv;
vec3 down(vec2 uv) {
  vec3 a = texture2D(tSrc, uv + uTexel * vec2(-2, -2)).rgb, b = texture2D(tSrc, uv + uTexel * vec2(0, -2)).rgb, c = texture2D(tSrc, uv + uTexel * vec2(2, -2)).rgb;
  vec3 d = texture2D(tSrc, uv + uTexel * vec2(-2, 0)).rgb, e = texture2D(tSrc, uv).rgb, f = texture2D(tSrc, uv + uTexel * vec2(2, 0)).rgb;
  vec3 g = texture2D(tSrc, uv + uTexel * vec2(-2, 2)).rgb, h = texture2D(tSrc, uv + uTexel * vec2(0, 2)).rgb, i = texture2D(tSrc, uv + uTexel * vec2(2, 2)).rgb;
  vec3 j = texture2D(tSrc, uv + uTexel * vec2(-1, -1)).rgb, k = texture2D(tSrc, uv + uTexel * vec2(1, -1)).rgb;
  vec3 l = texture2D(tSrc, uv + uTexel * vec2(-1, 1)).rgb, m = texture2D(tSrc, uv + uTexel * vec2(1, 1)).rgb;
  return e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
}
void main() {
  vec3 c = down(vUv);
  #ifdef PREFILTER_PASS
    float br = max(c.r, max(c.g, c.b));
    float soft = clamp(br - uThreshold + uKnee, 0.0, 2.0 * uKnee);
    soft = soft * soft / (4.0 * uKnee + 1e-4);
    c *= max(soft, br - uThreshold) / max(br, 1e-4);
    c = min(c, vec3(32.0));
  #endif
  gl_FragColor = vec4(c, 1.0);
}`;

const UPSAMPLE = /* glsl */ `
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uRadius; varying vec2 vUv;
void main() {
  vec2 o = uTexel * uRadius;
  vec3 s = texture2D(tSrc, vUv).rgb * 4.0;
  s += (texture2D(tSrc, vUv + vec2(-o.x, 0)).rgb + texture2D(tSrc, vUv + vec2(o.x, 0)).rgb + texture2D(tSrc, vUv + vec2(0, -o.y)).rgb + texture2D(tSrc, vUv + vec2(0, o.y)).rgb) * 2.0;
  s += texture2D(tSrc, vUv - o).rgb + texture2D(tSrc, vUv + o).rgb + texture2D(tSrc, vUv + vec2(-o.x, o.y)).rgb + texture2D(tSrc, vUv + vec2(o.x, -o.y)).rgb;
  gl_FragColor = vec4(s / 16.0, 1.0);
}`;

const COMPOSITE = /* glsl */ `
uniform sampler2D tBase, tBloom; uniform float uStrength; varying vec2 vUv;
void main() { gl_FragColor = vec4(texture2D(tBase, vUv).rgb + texture2D(tBloom, vUv).rgb * uStrength, 1.0); }`;

export class SoftBloomPass extends Pass {
  strength: number;
  private mips: THREE.WebGLRenderTarget[] = [];
  private prefilter: THREE.ShaderMaterial;
  private down: THREE.ShaderMaterial;
  private up: THREE.ShaderMaterial;
  private composite: THREE.ShaderMaterial;
  private quad = new FullScreenQuad();

  constructor(width: number, height: number, opts: { strength: number; threshold: number; knee?: number; radius?: number; levels?: number }) {
    super();
    this.strength = opts.strength;
    const levels = opts.levels ?? 6;
    let w = width, h = height;
    for (let i = 0; i < levels; i++) {
      w = Math.max(1, Math.floor(w / 2));
      h = Math.max(1, Math.floor(h / 2));
      this.mips.push(new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false }));
    }
    const base = { vertexShader: VERT, depthTest: false, depthWrite: false };
    this.prefilter = new THREE.ShaderMaterial({
      ...base,
      defines: { PREFILTER_PASS: 1 },
      fragmentShader: PREFILTER,
      uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() }, uThreshold: { value: opts.threshold }, uKnee: { value: opts.knee ?? 0.5 } }
    });
    this.down = new THREE.ShaderMaterial({
      ...base,
      fragmentShader: PREFILTER,
      uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() }, uThreshold: { value: 0 }, uKnee: { value: 0.5 } }
    });
    this.up = new THREE.ShaderMaterial({
      ...base,
      fragmentShader: UPSAMPLE,
      blending: THREE.AdditiveBlending,
      transparent: true,
      uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() }, uRadius: { value: opts.radius ?? 1 } }
    });
    this.composite = new THREE.ShaderMaterial({
      ...base,
      fragmentShader: COMPOSITE,
      uniforms: { tBase: { value: null }, tBloom: { value: null }, uStrength: { value: opts.strength } }
    });
  }

  render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget) {
    const draw = (mat: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null, clear = true) => {
      this.quad.material = mat;
      renderer.setRenderTarget(target);
      if (clear) renderer.clear();
      this.quad.render(renderer);
    };
    const autoClear = renderer.autoClear;
    renderer.autoClear = false;

    this.prefilter.uniforms.tSrc.value = readBuffer.texture;
    this.prefilter.uniforms.uTexel.value.set(1 / readBuffer.width, 1 / readBuffer.height);
    draw(this.prefilter, this.mips[0]);
    for (let i = 1; i < this.mips.length; i++) {
      this.down.uniforms.tSrc.value = this.mips[i - 1].texture;
      this.down.uniforms.uTexel.value.set(1 / this.mips[i - 1].width, 1 / this.mips[i - 1].height);
      draw(this.down, this.mips[i]);
    }
    for (let i = this.mips.length - 1; i > 0; i--) {
      this.up.uniforms.tSrc.value = this.mips[i].texture;
      this.up.uniforms.uTexel.value.set(1 / this.mips[i].width, 1 / this.mips[i].height);
      draw(this.up, this.mips[i - 1], false);
    }
    this.composite.uniforms.tBase.value = readBuffer.texture;
    this.composite.uniforms.tBloom.value = this.mips[0].texture;
    this.composite.uniforms.uStrength.value = this.strength / this.mips.length;
    draw(this.composite, this.renderToScreen ? null : writeBuffer);
    renderer.autoClear = autoClear;
  }
}
