import * as THREE from 'three';
import { createStage, fullscreenShader } from '../lib/stage';
import { GLSL_NOISE } from '../lib/glsl';
import type { SceneDef } from '../lib/types';

/**
 * Al Duvak — karanlıkta iki kanat hâlinde süzülen kırmızı tül. Kıvrımlar
 * ışığı yakalar, kenar şeridindeki altın pullar kumaş döndükçe parlar,
 * havada altın yaldız asılı kalır. Ortada metin için karanlık bir aralık.
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

// Kumaşın yükseklik alanı: dikey kıvrımlar + rüzgârla kayan yumuşak dalgalar.
float clothH(vec2 p, float t, float seed) {
  float sway = 0.18 * sin(p.y * 1.7 + W(1.0) * t + seed) + 0.06 * sin(p.y * 3.1 - W(2.0) * t + seed * 2.0);
  float x = p.x + sway;
  float h = 0.0;
  h += 0.050 * sin(x * 11.0 + W(1.0) * t + seed);
  h += 0.030 * sin(x * 19.0 - p.y * 2.0 - W(2.0) * t + seed * 1.7);
  h += 0.018 * sin(x * 31.0 + p.y * 3.0 + W(3.0) * t + seed * 0.3);
  vec2 o = vec2(cos(W(1.0) * t), sin(W(1.0) * t)) * 0.9;
  h += 0.045 * (fbm3(vec2(x * 2.2, p.y * 0.9) + o + seed) - 0.5);
  return h;
}

vec3 clothNormal(vec2 p, float t, float seed) {
  float e = 0.0025;
  float h = clothH(p, t, seed);
  float hx = clothH(p + vec2(e, 0.0), t, seed) - h;
  float hy = clothH(p + vec2(0.0, e), t, seed) - h;
  return normalize(vec3(-hx / e, -hy / e, 1.0) * vec3(0.55, 0.55, 1.0));
}

// Kanadın kenarı: üstte birbirine yakın, aşağı indikçe açılan perde aralığı.
float panelEdge(float y, float t, float side) {
  float open = uMobile > 0.5 ? 0.10 + 0.28 * pow(clamp(0.62 - y, 0.0, 1.4), 1.25)
                             : 0.12 + 0.42 * pow(clamp(0.58 - y, 0.0, 1.2), 1.3);
  float flutter = 0.035 * sin(y * 4.0 + W(1.0) * t + side) + 0.02 * sin(y * 9.0 - W(2.0) * t + side * 3.0);
  return open + flutter;
}

vec3 veilLayer(vec2 p, float t, vec3 bg, float seed, float depth, inout vec3 glints) {
  float side = p.x < 0.0 ? -1.0 : 1.0;
  float edge = panelEdge(p.y, t, side * 1.3 + seed);
  float dist = abs(p.x) - edge * depth;           // < 0: tülün içi değil → aralık
  float inside = smoothstep(-0.004, 0.012, -dist); // aralıkta 1
  float cover = 1.0 - inside;
  if (cover < 0.001) return bg;

  vec3 n = clothNormal(p * vec2(1.0, 1.0) + vec2(seed, 0.0), t, seed);
  vec3 L = normalize(vec3(-0.35, 0.65, 0.7));
  vec3 V = vec3(0.0, 0.0, 1.0);
  float ndl = max(dot(n, L), 0.0);
  float slope = 1.0 - n.z;                        // kıvrım yamacı: daha çok katman, daha opak
  float alpha = clamp(0.16 + 3.4 * slope, 0.0, 0.9) * cover;
  float sheen = pow(1.0 - max(dot(n, V), 0.0), 2.2);

  vec3 crimson = vec3(0.50, 0.012, 0.035);
  vec3 deep = vec3(0.06, 0.0, 0.01);
  float lit = pow(ndl, 1.6);
  vec3 col = mix(deep, crimson, lit) * (0.2 + 1.25 * lit);
  col += vec3(1.0, 0.32, 0.22) * sheen * 0.35;
  // Arkadan sızan sıcak ışık: tülün ince yerinden geçer.
  float back = exp(-dot(p - vec2(0.0, 0.55), p - vec2(0.0, 0.55)) * 1.4);
  col += vec3(0.9, 0.10, 0.06) * back * (1.0 - alpha) * 0.5;

  // Kenar şeridi: dantel bant + pul yoğunluğu.
  float band = smoothstep(0.075, 0.0, abs(dist + 0.035)) * cover;
  float scallop = 0.5 + 0.5 * sin(p.y * 120.0);
  col += vec3(0.9, 0.62, 0.25) * band * (0.10 + 0.12 * scallop) * ndl;
  float hem = smoothstep(0.006, 0.0, abs(dist + 0.012)) * cover;
  col += vec3(1.0, 0.72, 0.35) * hem * (0.35 + 0.9 * pow(ndl, 3.0));

  // Pullar: kumaşla birlikte salınan ızgara; normal kumaşınkine yakın ama eğik.
  vec2 q = (p + vec2(clothH(p, t, seed) * 0.6, 0.0)) * (uMobile > 0.5 ? 70.0 : 80.0);
  vec2 cell = floor(q);
  vec2 f = fract(q) - 0.5;
  vec2 rnd = hash22(cell + seed * 13.0);
  float density = mix(0.03, 0.85, band) * cover;
  if (rnd.x < density) {
    vec2 jitter = (hash22(cell * 1.7) - 0.5) * 0.5;
    float d = length(f - jitter * 0.6);
    vec3 tilt = normalize(n + vec3((rnd - 0.5) * 0.9, 0.0));
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(tilt, H), 0.0), 50.0);
    float disc = smoothstep(0.24, 0.06, d);
    glints += vec3(1.0, 0.78, 0.42) * min(spec * disc * 4.0, 2.2) * depth;
    col += vec3(0.55, 0.36, 0.12) * disc * 0.35 * ndl;
  }
  return mix(bg, col, alpha);
}

// Altın yaldız: döngüde tam bir tur yükselen, hücre başına tek zerre.
vec3 dust(vec2 p, float t, float scale, float size, float bright, float seed) {
  vec3 acc = vec3(0.0);
  vec2 q = p * scale;
  q.y -= t / D * scale * 1.0 * (seed > 1.5 ? 2.0 : 1.0) * (uMobile > 0.5 ? 1.0 : 0.5625) ;
  vec2 cell = floor(q);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 c = cell + vec2(i, j);
    vec2 h = hash22(c + seed);
    if (h.x > 0.45) continue;
    vec2 pos = c + 0.5 + 0.35 * vec2(sin(W(1.0) * t + h.y * TAU), cos(W(1.0) * t + h.x * 9.0));
    float d = length(q - pos) / size;
    float tw = 0.6 + 0.4 * sin(W(3.0) * t + h.y * 40.0);
    acc += vec3(1.0, 0.76, 0.40) * exp(-d * d * 3.0) * bright * tw;
  }
  return acc;
}

void main() {
  float t = uTime;
  vec2 res = uResolution;
  vec2 p = (vUv - 0.5) * vec2(res.x / res.y, 1.0);

  // Zemin: koyu vişne, üst ortada sıcak bir ışık havuzu.
  vec3 bg = mix(vec3(0.010, 0.002, 0.004), vec3(0.09, 0.008, 0.02), exp(-dot(p - vec2(0.0, 0.25), p - vec2(0.0, 0.25)) * 2.2));
  bg += vec3(0.25, 0.04, 0.03) * exp(-dot(p - vec2(0.0, 0.62), p - vec2(0.0, 0.62)) * 5.0) * (0.85 + 0.15 * sin(W(2.0) * t));

  vec3 glints = vec3(0.0);
  vec3 col = veilLayer(p * 1.15 + vec2(0.0, 0.03), t + 1.7, bg, 3.1, 0.82, glints) ;
  col = mix(bg, col, 0.55);                 // arka katman: soluk, uzak
  vec3 g2 = vec3(0.0);
  col = veilLayer(p, t, col, 0.0, 1.0, g2);
  col += glints * 0.25 + g2;

  col += dust(p, t, 9.0, 0.06, 0.55, 1.0);
  col += dust(p + 0.3, t, 4.0, 0.05, 0.9, 2.0) * 0.8;
  col += dust(p + 0.7, t, 2.2, 0.10, 0.35, 3.0);   // önde, iri ve bulanık

  gl_FragColor = vec4(min(col, vec3(2.5)), 1.0);
}
`;

const scene: SceneDef = {
  duration: DURATION,
  fps: 24,
  loop: true,
  poster: 2.2,
  setup(ctx) {
    const stage = createStage(ctx, {
      exposure: 0.95,
      bloom: { strength: 1.0, threshold: 0.6, radius: 1.0 },
      vignette: 0.45,
      grain: 0.02,
      aberration: 0.8
    });
    const { scene: s, camera, material } = fullscreenShader(FRAG, {
      uMobile: { value: ctx.variant === 'mobile' ? 1 : 0 }
    });
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
