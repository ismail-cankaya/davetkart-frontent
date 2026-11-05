import * as THREE from 'three';
import { createStage, fullscreenShader } from '../lib/stage';
import { GLSL_NOISE } from '../lib/glsl';
import type { SceneContext } from '../lib/types';

export const YOLCULUK = 8;
export const PARILTI = 10;

/**
 * Uçan Halı — alacakaranlıkta kubbeli, minareli bir şehrin üstünden yolculuk.
 * `uS` (0..1) kaydırma ilerlemesidir: kamera sağa süzülür, katmanlar farklı
 * hızda kayar (paralaks), gökyüzü alacakaranlıktan geceye döner, ay yükselir,
 * pencerelerde ışıklar yanar. Silüetler tamamen prosedüreldir; belirli bir
 * yapı ya da şehir kopyalanmaz.
 */
const FRAG = /* glsl */ `
${GLSL_NOISE}
uniform float uS;
uniform vec2 uResolution;
uniform float uMobile;
varying vec2 vUv;

// Tek hücrelik silüet: 0 = boş, 1 = içinde. 'lit' pencere ışığı döndürür.
float building(vec2 q, float cw, float seed, float night, out float lit) {
  lit = 0.0;
  float cell = floor(q.x / cw);
  float h = hash11(cell * 1.731 + seed);
  float h2 = hash11(cell * 4.13 + seed * 2.0);
  float lx = q.x - (cell + 0.5) * cw;
  float y = q.y;
  float inside = 0.0;
  if (h < 0.34) {
    // Camili hücre: gövde, kasnak, ana kubbe, yarım kubbeler, minareler.
    float baseH = cw * (0.22 + 0.08 * h2);
    float R = cw * (0.24 + 0.05 * h2);
    float drum = cw * 0.05;
    inside = max(inside, step(abs(lx), cw * 0.38) * step(y, baseH));
    inside = max(inside, step(abs(lx), R * 0.92) * step(y, baseH + drum));
    vec2 dc = vec2(lx, y - baseH - drum);
    inside = max(inside, step(length(dc), R) * step(0.0, dc.y));
    // Alem (tepe süsü)
    inside = max(inside, step(abs(lx), cw * 0.006) * step(y, baseH + drum + R + cw * 0.06));
    for (int k = -1; k <= 1; k += 2) {
      vec2 hc = vec2(lx - float(k) * cw * 0.26, y - baseH);
      inside = max(inside, step(length(hc), R * 0.5) * step(0.0, hc.y));
    }
    float nMin = h2 > 0.5 ? 4.0 : 2.0;
    for (int m = 0; m < 4; m++) {
      if (float(m) >= nMin) break;
      float side = mod(float(m), 2.0) < 0.5 ? -1.0 : 1.0;
      float off = (m < 2 ? 0.44 : 0.33) * cw;
      float mx = lx - side * off;
      float mh = cw * (m < 2 ? 0.95 : 0.72) * (0.9 + 0.2 * h);
      float mw = cw * 0.016;
      float shaft = step(abs(mx), mw) * step(y, mh);
      float balc = step(abs(mx), mw * 1.9) * step(abs(y - mh * 0.72), cw * 0.008);
      float capH = cw * 0.11;
      float cap = step(mh, y) * step(y, mh + capH) * step(abs(mx), mw * 1.15 * (1.0 - (y - mh) / capH));
      inside = max(inside, max(shaft, max(balc, cap)));
    }
    float win = step(abs(lx), R * 0.7) * step(baseH * 0.45, y) * step(y, baseH * 0.72);
    float wx = fract(lx / (cw * 0.07));
    lit = win * step(0.42, wx) * step(wx, 0.58) * night * 0.45;
  } else if (h < 0.42) {
    // Selvi ağaçları
    float tx = fract(q.x / (cw * 0.22)) - 0.5;
    float th = cw * (0.25 + 0.2 * hash11(floor(q.x / (cw * 0.22)) + seed));
    float r = cw * 0.042 * pow(clamp(1.0 - y / th, 0.0, 1.0), 0.75) * smoothstep(-0.02 * th, 0.18 * th, y);
    float trunk = step(abs(tx * cw * 0.22), cw * 0.004) * step(y, th * 0.1);
    inside = max(step(abs(tx * cw * 0.22), r) * step(y, th), trunk);
  } else {
    // Evler: farklı yükseklik, bazıları kırma çatı, ışıklı pencereler.
    float sub = floor(lx / (cw * 0.25) + 2.0);
    float hh = cw * (0.12 + 0.2 * hash11(cell * 9.1 + sub + seed));
    float sx = fract(lx / (cw * 0.25)) - 0.5;
    float roof = hash11(cell + sub * 3.3 + seed) > 0.5 ? cw * 0.05 * (1.0 - abs(sx) * 2.0) : 0.0;
    inside = step(y, hh + roof);
    vec2 wg = vec2(lx / (cw * 0.05), y / (cw * 0.06));
    vec2 wf = fract(wg);
    float wOn = step(0.62, hash21(floor(wg) + cell * 7.0 + seed));
    lit = step(y, hh - cw * 0.03) * step(0.3, wf.x) * step(wf.x, 0.7) * step(0.35, wf.y) * step(wf.y, 0.75) * wOn * night;
  }
  return inside;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  float s = uS;
  bool mob = uMobile > 0.5;
  float night = smoothstep(0.15, 0.85, s);

  // Gökyüzü: alacakaranlık → gece.
  float gy = p.y + 0.5;
  vec3 topDusk = vec3(0.16, 0.10, 0.34), horDusk = vec3(1.0, 0.52, 0.36);
  vec3 topNight = vec3(0.02, 0.03, 0.11), horNight = vec3(0.32, 0.14, 0.36);
  vec3 top = mix(topDusk, topNight, night), hor = mix(horDusk, horNight, night);
  vec3 col = mix(hor, top, smoothstep(0.05, 0.85, gy));
  col += vec3(1.0, 0.45, 0.3) * exp(-abs(p.y + 0.18) * 7.0) * 0.35 * (1.0 - night);
  // Bulut şeritleri
  float cl = fbm(vec2(p.x * 1.4 + s * 0.6, p.y * 5.0));
  col = mix(col, mix(vec3(0.95, 0.55, 0.5), vec3(0.2, 0.15, 0.35), night), smoothstep(0.55, 0.8, cl) * 0.35 * smoothstep(-0.1, 0.25, p.y));
  // Yıldızlar
  vec2 sg = p * 90.0 + vec2(s * 6.0, 0.0);
  vec2 sf = fract(sg) - 0.5;
  float sh = hash21(floor(sg));
  float star = step(0.985, sh) * smoothstep(0.12, 0.0, length(sf)) * smoothstep(-0.1, 0.4, p.y);
  col += vec3(1.0, 0.95, 0.85) * star * (0.4 + 1.2 * night);
  // Hilal
  vec2 mc = vec2(mob ? aspect * 0.22 : aspect * 0.3, 0.18 + 0.16 * s);
  float md = length(p - mc);
  float crescent = smoothstep(0.052, 0.048, md) * smoothstep(0.044, 0.048, length(p - mc - vec2(0.022, 0.01)));
  col += vec3(1.0, 0.92, 0.75) * crescent * 1.4;
  col += vec3(1.0, 0.85, 0.6) * exp(-md * 14.0) * 0.18 * (0.4 + night);

  // Su (körfez) ve silüet katmanları: uzak → yakın.
  float waterY = -0.36;
  float travel = s * (mob ? 1.8 : 2.4);
  vec3 haze = mix(horDusk * 0.7, horNight * 0.6, night);
  for (int L = 0; L < 3; L++) {
    float fl = float(L);
    float par = 0.25 + fl * 0.4;
    float cw = (0.22 + fl * 0.12) * (mob ? 0.8 : 1.0);
    float base = waterY + 0.02 + (2.0 - fl) * 0.035;
    vec2 q = vec2(p.x + travel * par + fl * 13.7, p.y - base);
    float lit;
    float ins = building(q, cw, fl * 31.0, night, lit);
    vec3 silCol = mix(haze, vec3(0.04, 0.03, 0.08), 0.35 + fl * 0.3);
    col = mix(col, silCol, ins);
    col += vec3(1.0, 0.75, 0.4) * lit * ins * (0.5 + fl * 0.4);
  }
  // Su yüzeyi: gökyüzünü ve ışıkları yansıtır.
  if (p.y < waterY) {
    float dy = waterY - p.y;
    float ripple = sin(p.y * 260.0 + fbm(vec2(p.x * 8.0 + travel, p.y * 30.0)) * 6.0);
    vec3 w = mix(top, hor, 0.3) * 0.28;
    w += vec3(1.0, 0.7, 0.4) * exp(-abs(p.x - mc.x) * 10.0) * smoothstep(0.0, 1.0, ripple) * 0.25 * (0.3 + night);
    w += vec3(1.0, 0.6, 0.45) * smoothstep(0.85, 1.0, ripple) * exp(-dy * 10.0) * 0.08 * (1.0 - night);
    col = w * (1.0 - dy * 0.8);
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Ön ışık katmanı: siyah üstünde süzülen yıldız tozu (ekran harmanı). */
const FRAG_ON = /* glsl */ `
${GLSL_NOISE}
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;
const float D = ${PARILTI.toFixed(1)};
void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  float ph = uTime / D;
  vec3 col = vec3(0.0);
  for (int i = 0; i < 40; i++) {
    float fi = float(i);
    float k = floor(1.0 + hash11(fi * 5.3) * 2.0);
    float x = (fract(hash11(fi * 1.7) + ph * k) - 0.5) * (aspect + 0.2);
    float y = (hash11(fi * 9.1) - 0.5) * 0.9 + 0.04 * sin(TAU * (ph * k + fi * 0.13));
    float tw = 0.5 + 0.5 * sin(TAU * (ph * 4.0 * k + fi * 0.37));
    float d = length(p - vec2(x, y));
    vec3 c = mix(vec3(1.0, 0.82, 0.5), vec3(0.7, 0.85, 1.0), hash11(fi * 2.9));
    col += c * (exp(-d * 520.0) * 1.6 + exp(-d * 90.0) * 0.08) * (0.3 + tw);
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

export function buildSehir(ctx: SceneContext, layer: 'main' | 'on') {
  const stage = createStage(ctx, layer === 'main'
    ? { exposure: 1.0, bloom: { strength: 0.5, threshold: 0.7, radius: 1 }, vignette: 0.35, grain: 0.006, dither: false }
    : { exposure: 1.0, bloom: { strength: 0.6, threshold: 0.4, radius: 1 }, vignette: 0, grain: 0, dither: false });
  const { scene, camera, material } = fullscreenShader(layer === 'main' ? FRAG : FRAG_ON, {
    uS: { value: 0 },
    uMobile: { value: ctx.variant === 'mobile' ? 1 : 0 }
  });
  (material.uniforms.uResolution.value as THREE.Vector2).set(ctx.width, ctx.height);
  return {
    render(t: number, s: number) {
      material.uniforms.uTime.value = t;
      material.uniforms.uS.value = s;
      stage.render(scene, camera, t);
    }
  };
}
