import * as THREE from 'three';
import { createStage, fullscreenShader } from '../lib/stage';
import { GLSL_NOISE } from '../lib/glsl';
import type { SceneDef } from '../lib/types';

/**
 * Ay Beşiği — pastel alacakaranlıkta, iki kurdeleye asılı hilal bir beşik
 * gibi sallanır; uçlarından ipe dizili yıldızlar salınır, altta bulut
 * yatağı yavaşça nefes alır, yıldız tozu süzülür. Çok sakin.
 */
const DURATION = 12;

const FRAG = /* glsl */ `
${GLSL_NOISE}
uniform float uTime;
uniform vec2 uResolution;
uniform float uMobile;
varying vec2 vUv;
const float D = ${DURATION.toFixed(1)};
float W(float k) { return TAU * k / D; }

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

float sdStar(vec2 p, float r, float rf) {
  const vec2 k1 = vec2(0.809016994375, -0.587785252292);
  const vec2 k2 = vec2(-k1.x, k1.y);
  p.x = abs(p.x);
  p -= 2.0 * max(dot(k1, p), 0.0) * k1;
  p -= 2.0 * max(dot(k2, p), 0.0) * k2;
  p.x = abs(p.x);
  p.y -= r;
  vec2 ba = rf * vec2(-k1.y, k1.x) - vec2(0, 1);
  float h = clamp(dot(p, ba) / dot(ba, ba), 0.0, r);
  return length(p - ba * h) * sign(p.y * ba.x - p.x * ba.y);
}

float sdSeg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }

float clouds(vec2 p, float t, float seed) {
  vec2 o = vec2(cos(W(1.0) * t + seed), sin(W(1.0) * t + seed)) * 0.35;
  vec2 q = p * vec2(1.4, 2.6) + o;
  q += 0.35 * vec2(fbm3(q + seed), fbm3(q.yx - seed));
  return fbm(q);
}

void main() {
  float t = uTime;
  vec2 res = uResolution;
  float aspect = res.x / res.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);

  // Gök: lavanta → toz pembe → şeftali.
  float y = vUv.y;
  vec3 sky = mix(vec3(0.98, 0.84, 0.80), vec3(0.93, 0.78, 0.88), smoothstep(0.15, 0.55, y));
  sky = mix(sky, vec3(0.62, 0.60, 0.86), smoothstep(0.5, 1.0, y));
  // Ayın arkasında sıcak hale.
  vec2 pivot = uMobile > 0.5 ? vec2(0.0, 0.62) : vec2(0.0, 0.64);
  float ang = 0.085 * sin(W(2.0) * t);
  vec2 moonC = pivot + rot(ang) * vec2(0.0, uMobile > 0.5 ? -0.36 : -0.42);
  float halo = exp(-length(p - moonC) * 3.2);
  sky += vec3(1.0, 0.93, 0.80) * halo * 0.18;

  // Uzak yıldızlar: sabit, nazikçe göz kırpar.
  vec2 sg = p * 34.0;
  vec2 sc = floor(sg);
  vec2 sh = hash22(sc);
  float tw = 0.5 + 0.5 * sin(W(floor(sh.y * 3.0) + 1.0) * t + sh.x * TAU);
  float star = smoothstep(0.06, 0.0, length(fract(sg) - 0.5 - (sh - 0.5) * 0.6)) * step(0.86, sh.x) * smoothstep(0.35, 0.9, y);
  sky += vec3(1.0, 0.98, 0.92) * star * (0.4 + 0.6 * tw);

  vec3 col = sky;

  // Kurdeleler: tepedeki noktadan hilalin iki ucuna.
  vec2 lp = rot(-ang) * (p - pivot);
  float mr = uMobile > 0.5 ? 0.15 : 0.16;
  float drop = uMobile > 0.5 ? -0.36 : -0.42;
  vec2 tipL = vec2(-mr * 0.92, drop + mr * 0.25);
  vec2 tipR = vec2(mr * 0.92, drop + mr * 0.25);
  float rib = min(sdSeg(lp, vec2(0.0, 0.5), tipL), sdSeg(lp, vec2(0.0, 0.5), tipR));
  col = mix(col, vec3(0.98, 0.86, 0.70), smoothstep(0.0022, 0.0, rib) * 0.75);

  // Hilal: iki dairenin farkı, beşik gibi uçları yukarıda.
  vec2 mp = lp - vec2(0.0, drop);
  float outer = length(mp) - mr;
  float inner = length(mp - vec2(0.0, mr * 0.52)) - mr * 0.92;
  float moon = max(outer, -inner);
  float moonMask = smoothstep(0.003, -0.003, moon);
  vec3 moonCol = mix(vec3(1.0, 0.86, 0.58), vec3(1.0, 0.97, 0.88), smoothstep(-mr, mr * 0.2, mp.y));
  moonCol *= 0.92 + 0.08 * fbm3(mp * 30.0);
  col += vec3(1.0, 0.88, 0.62) * exp(-max(moon, 0.0) * 40.0) * 0.22;
  col = mix(col, moonCol * 1.08, moonMask);

  // Uçlardan sarkan yıldız dizileri: her biri kendi fazında salınır.
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float side = fi < 2.5 ? -1.0 : 1.0;
    vec2 anchor = vec2((fi - 2.0) * mr * 0.42, drop - mr * 0.85);
    if (i == 2) anchor.y -= 0.0;
    float len = 0.07 + 0.05 * hash11(fi * 7.3);
    float sw = 0.25 * sin(W(fi < 2.5 ? 2.0 : 3.0) * t + fi * 1.7) + side * 0.02;
    vec2 endp = anchor + vec2(sin(sw), -cos(sw)) * len;
    float th = sdSeg(lp, anchor, endp);
    col = mix(col, vec3(0.96, 0.86, 0.75), smoothstep(0.0016, 0.0, th) * 0.7);
    vec2 sp = rot(sw * 1.5) * (lp - endp - vec2(sin(sw), -cos(sw)) * 0.02);
    float s = sdStar(sp, 0.024, 0.48);
    col += vec3(1.0, 0.9, 0.6) * exp(-max(s, 0.0) * 90.0) * 0.12;
    col = mix(col, vec3(1.0, 0.92, 0.70), smoothstep(0.002, -0.002, s));
  }

  // Bulut yatağı: iki katman, nefes alır.
  float horizon = uMobile > 0.5 ? -0.20 : -0.18;
  float c1 = clouds(p * 1.0 + vec2(0.0, 0.0), t, 0.0);
  float band1 = smoothstep(0.08, -0.12, p.y - horizon - 0.12 * (c1 - 0.5) * 2.0);
  float lit1 = clouds(p * 1.0 + vec2(0.0, -0.02), t, 0.0) - c1;
  vec3 cloudCol = mix(vec3(0.86, 0.76, 0.88), vec3(1.0, 0.97, 0.95), smoothstep(-0.03, 0.05, -lit1) * 0.6 + smoothstep(0.4, 0.7, c1) * 0.4);
  col = mix(col, cloudCol, band1 * smoothstep(0.38, 0.55, c1 + band1 * 0.25) * 0.95);
  float c2 = clouds(p * 1.3 + vec2(3.1, 0.0), t, 2.4);
  float band2 = smoothstep(0.06, -0.14, p.y - horizon + 0.14 - 0.1 * (c2 - 0.5) * 2.0);
  float lit2 = clouds(p * 1.3 + vec2(3.1, -0.02), t, 2.4) - c2;
  vec3 cloudCol2 = mix(vec3(0.90, 0.80, 0.90), vec3(1.0, 1.0, 0.98), smoothstep(-0.03, 0.05, -lit2) * 0.6 + smoothstep(0.35, 0.7, c2) * 0.4);
  col = mix(col, cloudCol2, band2 * smoothstep(0.36, 0.52, c2 + band2 * 0.3));
  // Bulut kenarlarında ay ışığı.
  col += vec3(1.0, 0.92, 0.78) * band1 * (1.0 - band2) * 0.06;

  // Yıldız tozu: yavaşça süzülen ışık zerreleri (döngüde bir tam iniş).
  for (int L = 0; L < 2; L++) {
    float fl = float(L);
    float sc2 = 7.0 + fl * 5.0;
    vec2 q = p * sc2;
    q.y += t / D * sc2 * (fl + 1.0) * 0.25 * (uMobile > 0.5 ? 1.0 : 1.0);
    q.y = mod(q.y + 0.0, sc2 * 1.0 * 4.0);
    vec2 cell = floor(q);
    vec2 h = hash22(cell + fl * 31.0);
    vec2 pos = cell + 0.5 + 0.3 * vec2(sin(W(1.0) * t + h.x * TAU), cos(W(1.0) * t + h.y * TAU));
    float d = length(q - pos);
    float a = step(0.78, h.x) * exp(-d * d * 380.0) * (0.5 + 0.5 * sin(W(3.0) * t + h.y * 30.0));
    col += vec3(1.0, 0.95, 0.85) * a * 0.5;
  }

  // Renkler sRGB olarak seçildi; çıkış geçişi doğrusal bekler.
  gl_FragColor = vec4(pow(max(col, 0.0), vec3(2.2)), 1.0);
}
`;

const scene: SceneDef = {
  duration: DURATION,
  fps: 24,
  loop: true,
  poster: 3,
  setup(ctx) {
    const stage = createStage(ctx, {
      toneMapping: THREE.NoToneMapping,
      bloom: { strength: 0.35, threshold: 0.92, radius: 1 },
      vignette: 0.12,
      grain: 0.008
    });
    const { scene: s, camera, material } = fullscreenShader(FRAG, { uMobile: { value: ctx.variant === 'mobile' ? 1 : 0 } });
    (material.uniforms.uResolution.value as THREE.Vector2).set(ctx.width, ctx.height);
    return {
      render(t) {
        material.uniforms.uTime.value = t;
        stage.render(s, camera, t);
      }
    };
  }
};

export default scene;
