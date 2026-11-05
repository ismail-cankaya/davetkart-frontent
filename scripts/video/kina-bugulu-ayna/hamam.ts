import * as THREE from 'three';
import { createStage, fullscreenShader } from '../lib/stage';
import { GLSL_NOISE } from '../lib/glsl';
import type { SceneContext } from '../lib/types';

export const SURE = 12;

/**
 * Yükselen buhar: iki gürültü katmanı aynı hızla yukarı kayar ve üçgen
 * ağırlıkla çapraz harmanlanır. Her katman yarım periyotta bir sıfır ağırlıkta
 * "başa sarar", böylece klip kesintisiz döner ama buhar hep yükselir.
 */
const STEAM = /* glsl */ `
float steamLayer(vec2 p, float off, float ph) {
  vec2 q = p * vec2(2.2, 1.4) + vec2(0.0, -off * 1.6);
  float n = loopNoise(q + vec2(0.35 * sin(q.y * 1.3 + ph * TAU), 0.0), ph);
  return smoothstep(0.42, 0.95, n);
}
float steam(vec2 p, float ph) {
  float a = fract(ph * 2.0);
  float b = fract(ph * 2.0 + 0.5);
  float wa = 1.0 - abs(a * 2.0 - 1.0);
  float wb = 1.0 - abs(b * 2.0 - 1.0);
  return (steamLayer(p, a, ph) * wa + steamLayer(p + 7.3, b, ph) * wb) / max(wa + wb, 0.001);
}
`;

const FRAG = /* glsl */ `
${GLSL_NOISE}
${STEAM}
uniform float uTime;
uniform vec2 uResolution;
uniform float uMobile;
varying vec2 vUv;
const float D = ${SURE.toFixed(1)};

// Sivri (Osmanlı) kemer: iki daire yayının kesişimi + dikdörtgen gövde.
float archSd(vec2 p, float w, float spring, float k) {
  if (p.y < spring) return max(abs(p.x) - w, -1.0);
  float r = w * k;
  float dl = length(p - vec2(w - r, spring)) - r;
  float dr = length(p - vec2(-w + r, spring)) - r;
  return max(dl, dr);
}

float star8(vec2 p, float r) {
  float a = atan(p.y, p.x);
  float s = 0.72 + 0.28 * cos(8.0 * a);
  return length(p) - r * s;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  float ph = uTime / D;
  bool mob = uMobile > 0.5;

  // Mermer duvar: sıcak krem, damarlı.
  float vein = abs(sin(fbm(p * vec2(3.0, 5.0) + 2.0) * 9.0 + p.x * 2.0));
  vec3 marble = mix(vec3(0.42, 0.33, 0.26), vec3(0.58, 0.48, 0.38), fbm(p * 4.0));
  marble *= 0.82 + 0.18 * smoothstep(0.0, 0.08, vein);
  // Duvar taşı derzleri.
  vec2 blk = p * vec2(5.0, 8.0);
  blk.x += step(1.0, mod(floor(blk.y), 2.0)) * 0.5;
  vec2 bf = abs(fract(blk) - 0.5);
  marble *= 0.95 + 0.05 * smoothstep(0.47, 0.44, max(bf.x, bf.y));
  vec3 col = marble * 0.16;
  // Yanlar karanlıkta: ışık ortada ve huzmelerde toplanır.
  col *= 0.4 + 0.6 * smoothstep(1.0, 0.15, abs(p.x) / (aspect * 0.5));

  // Kubbe: üstte koyu kemer ve yıldız biçimli filgözleri.
  float domeY = mob ? 0.28 : 0.3;
  float dome = smoothstep(domeY - 0.02, domeY + 0.05, p.y + 0.15 * p.x * p.x);
  col = mix(col, vec3(0.1, 0.075, 0.06), dome * 0.85);
  vec3 skyl = vec3(1.0, 0.86, 0.62);
  vec2 holes[5];
  holes[0] = vec2(-0.55, 0.43); holes[1] = vec2(-0.25, 0.46); holes[2] = vec2(0.05, 0.47);
  holes[3] = vec2(0.35, 0.45); holes[4] = vec2(0.62, 0.42);
  float shafts = 0.0;
  float pools = 0.0;
  for (int i = 0; i < 5; i++) {
    vec2 h = holes[i] * vec2(mob ? 0.52 : 1.0, 1.0);
    float s = star8(p - h, 0.018);
    col += skyl * smoothstep(0.004, -0.004, s) * 1.6;
    col += skyl * exp(-max(s, 0.0) * 60.0) * 0.18;
    // Eğik ışık huzmesi (sol üstten sağ alta).
    vec2 dir = normalize(vec2(0.32, -1.0));
    vec2 d = p - h;
    float along = dot(d, dir);
    float perp = abs(d.x * dir.y - d.y * dir.x);
    float w = 0.016 + along * 0.07;
    float flick = 0.85 + 0.15 * sin(TAU * (ph * 2.0 + float(i) * 0.31));
    shafts += step(0.0, along) * smoothstep(w, w * 0.2, perp) * exp(-along * 1.1) * flick;
    // Huzmenin zemine düştüğü sıcak ışık havuzu.
    float hitX = h.x + 0.32 * (h.y + 0.42);
    pools += exp(-length((p - vec2(hitX, -0.44)) * vec2(1.0, 4.5)) * 9.0) * flick;
  }

  // Ortadaki kemerli niş: aynanın yeri (koyu, sıcak, çini bordürlü).
  vec2 ac = p - vec2(0.0, mob ? -0.02 : -0.04);
  float aw = mob ? aspect * 0.42 : 0.33;
  float spring = mob ? 0.18 : 0.14;
  float sd = archSd(ac, aw, spring, 1.1);
  float niche = smoothstep(0.004, -0.004, sd) * step(-0.46, ac.y);
  vec3 nicheCol = mix(vec3(0.025, 0.01, 0.01), vec3(0.12, 0.045, 0.03), smoothstep(0.4, -0.45, ac.y)) * (0.85 + 0.3 * fbm(p * 6.0));
  col = mix(col, nicheCol, niche);
  // Bordür: altın sedef şerit + kına kırmızısı geometrik desen.
  float band = smoothstep(0.02, 0.016, abs(sd + 0.004)) * step(-0.46, ac.y);
  vec2 bp = p * 110.0;
  float pat = step(0.5, fract((bp.x + bp.y) * 0.25)) * step(0.5, fract((bp.x - bp.y) * 0.25));
  vec3 bandCol = mix(vec3(0.2, 0.035, 0.03), vec3(0.28, 0.05, 0.04), pat);
  col = mix(col, bandCol * 0.55, band);
  col += vec3(1.0, 0.78, 0.45) * (smoothstep(0.0025, 0.0, abs(sd + 0.022)) + smoothstep(0.0025, 0.0, abs(sd - 0.014))) * 0.32 * step(-0.46, ac.y);

  // Göbek taşı / zemin.
  float floorY = -0.42;
  float fl = smoothstep(floorY + 0.01, floorY - 0.01, p.y);
  vec3 floorCol = mix(vec3(0.22, 0.18, 0.15), vec3(0.32, 0.26, 0.21), fbm(p * vec2(6.0, 18.0)));
  col = mix(col, floorCol * 0.35, fl);
  col += vec3(0.9, 0.7, 0.45) * exp(-abs(p.y - floorY) * 120.0) * 0.08;
  col += vec3(1.0, 0.72, 0.4) * pools * 0.22;

  // Buhar ve huzmeler: huzme buharla görünür olur.
  float st = steam(p, ph);
  float lowSteam = smoothstep(0.1, -0.5, p.y);
  col += vec3(1.0, 0.78, 0.48) * shafts * (0.15 + 0.6 * st) * 0.42;
  col = mix(col, vec3(0.42, 0.33, 0.26), st * (0.05 + 0.12 * lowSteam));

  // Bakır tas parıltıları (zeminde, iki yanda).
  for (int i = 0; i < 2; i++) {
    float sx = (i == 0 ? -1.0 : 1.0) * (mob ? aspect * 0.33 : 0.62);
    vec2 c = p - vec2(sx, floorY + 0.03);
    float bowl = smoothstep(0.004, 0.0, length(c * vec2(1.0, 2.4)) - 0.06) * step(c.y, 0.0);
    col = mix(col, vec3(0.3, 0.14, 0.06), bowl);
    float glint = exp(-length(c - vec2(-0.02, -0.006)) * 140.0) * (0.6 + 0.4 * sin(TAU * (ph * 3.0 + float(i) * 0.5)));
    col += vec3(1.0, 0.75, 0.45) * glint * 1.2;
  }

  // Sıcak ışık sızıntısı: üstten.
  col += vec3(0.25, 0.14, 0.06) * smoothstep(-0.2, 0.5, p.y) * 0.12;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Ön katman: siyah üstünde yükselen buhar telleri ve damla ışıltıları (ekran harmanı için). */
const FRAG_ON = /* glsl */ `
${GLSL_NOISE}
${STEAM}
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;
const float D = ${SURE.toFixed(1)};
void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  float ph = uTime / D;
  float st = steam(p * 0.7 + vec2(3.1, 0.0), ph);
  // Ortayı (aynayı) hafif boş bırak: buhar daha çok kenarlarda ve altta.
  float mask = 0.35 + 0.65 * smoothstep(0.12, 0.55, length(p * vec2(0.9, 1.2)));
  mask *= smoothstep(0.55, -0.3, p.y) * 0.8 + 0.2;
  vec3 col = vec3(0.62, 0.55, 0.48) * st * mask * 0.55;
  // Süzülen ışıltılar.
  for (int i = 0; i < 18; i++) {
    float fi = float(i);
    float sx = (hash11(fi * 3.1) - 0.5) * aspect;
    float speed = 0.6 + hash11(fi * 7.7) * 0.8;
    float y = -0.55 + fract(ph * floor(1.0 + speed * 2.0) + hash11(fi)) * 1.1;
    float x = sx + 0.03 * sin(TAU * (ph * 2.0 + fi * 0.37));
    float tw = 0.5 + 0.5 * sin(TAU * (ph * 6.0 + fi * 0.61));
    col += vec3(1.0, 0.85, 0.6) * exp(-length(p - vec2(x, y)) * 420.0) * (0.6 + tw) * 1.4;
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

export function buildHamam(ctx: SceneContext, layer: 'main' | 'on') {
  const stage = createStage(ctx, layer === 'main'
    ? { exposure: 1.0, bloom: { strength: 0.6, threshold: 0.7, radius: 1 }, vignette: 0.55, grain: 0.012 }
    : { exposure: 1.0, bloom: { strength: 0.4, threshold: 0.5, radius: 1 }, vignette: 0, grain: 0, dither: false });
  const { scene, camera, material } = fullscreenShader(layer === 'main' ? FRAG : FRAG_ON, {
    uMobile: { value: ctx.variant === 'mobile' ? 1 : 0 }
  });
  (material.uniforms.uResolution.value as THREE.Vector2).set(ctx.width, ctx.height);
  return {
    render(t: number) {
      material.uniforms.uTime.value = t;
      stage.render(scene, camera, t);
    }
  };
}
