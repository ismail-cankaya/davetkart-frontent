import * as THREE from 'three';
import { createStage, fullscreenShader } from '../lib/stage';
import { GLSL_NOISE } from '../lib/glsl';
import type { SceneContext } from '../lib/types';

/** Giriş (tek sefer) ve döngü süreleri; döngünün t=0 karesi girişin son karesidir. */
export const GIRIS = 4.5;
export const DONGU = 12;

/**
 * Lansman Sahnesi — karanlık konferans sahnesi: üstte truss ve hareketli
 * başlıklar, ortada dev LED duvar (piksel ızgaralı akan degrade), parlak
 * zeminde yansıma, önde seyirci siluetleri. Tamamı tek tam ekran shader;
 * kare yalnızca uniform'lara bağlıdır.
 *
 * `uWall`  : LED duvarın açılışı (0 kapalı → 1 tam). Merkezden dışa tarama.
 * `uBeams` : başlıkların yanması (her biri 0..1), sırayla.
 * `uTime`  : döngü saati; giriş boyunca negatiften 0'a gelir (periyodik).
 */
const FRAG = /* glsl */ `
${GLSL_NOISE}
uniform float uTime;
uniform vec2 uResolution;
uniform float uWall;
uniform float uBeams[6];
uniform float uMobile;
varying vec2 vUv;
const float D = ${DONGU.toFixed(1)};

vec3 palette(float k) {
  // Lacivert → elektrik mavisi → camgöbeği → mor; kurumsal ve soğuk.
  vec3 a = vec3(0.05, 0.10, 0.55);
  vec3 b = vec3(0.10, 0.45, 1.00);
  vec3 c = vec3(0.20, 0.95, 1.00);
  vec3 d = vec3(0.55, 0.25, 1.00);
  k = fract(k);
  if (k < 0.33) return mix(a, b, k / 0.33);
  if (k < 0.66) return mix(b, c, (k - 0.33) / 0.33);
  return mix(c, d, (k - 0.66) / 0.34) ;
}

vec2 wallC() { return uMobile > 0.5 ? vec2(0.0, 0.12) : vec2(0.0, 0.07); }
vec2 wallS() { return uMobile > 0.5 ? vec2(0.52, 0.32) : vec2(1.20, 0.46); }

vec3 wall(vec2 p, float ph, out float inside) {
  vec2 c = wallC(), s = wallS();
  vec2 uv = (p - c) / s + 0.5;
  inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  if (inside < 0.5) return vec3(0.0);
  // Koyu lacivert zemin + yavaşça kayan derin degrade.
  float n = loopNoise(uv * vec2(1.6, 1.2), ph);
  vec3 col = mix(vec3(0.01, 0.025, 0.09), vec3(0.06, 0.03, 0.16), uv.x + 0.4 * (n - 0.5));
  // Akan ışık şeritleri (keynote görseli): her şerit döngüde tam tur atar.
  for (int j = 0; j < 5; j++) {
    float fj = float(j);
    float y = 0.5 + (0.16 + 0.05 * fj) * sin(TAU * (uv.x * (0.55 + 0.12 * fj) + ph * (fj < 2.5 ? 1.0 : -1.0) + fj * 0.21))
                  + 0.04 * sin(TAU * (uv.x * 2.0 - ph * 2.0 + fj));
    float wdt = 26.0 + fj * 10.0;
    float line = exp(-pow((uv.y - y) * wdt, 2.0));
    float glow = exp(-abs(uv.y - y) * 9.0) * 0.25;
    col += palette(fj * 0.17 + uv.x * 0.3 + ph) * (line * 0.9 + glow);
  }
  // Yatay ışık süpürmesi: duvarın dışındayken sarar, kesik görünmez.
  float bx = -0.25 + 1.5 * fract(ph * 2.0);
  col += vec3(0.5, 0.75, 1.0) * exp(-pow((uv.x - bx - (uv.y - 0.5) * 0.25) * 9.0, 2.0)) * 0.25;
  // Okunurluk: ortada başlık metni için yumuşak koyu yastık.
  col *= 0.32 + 0.68 * smoothstep(0.08, 0.62, length((uv - 0.5) * vec2(1.0, 1.7)));
  // LED pikselleri.
  vec2 cells = uMobile > 0.5 ? vec2(96.0, 58.0) : vec2(170.0, 66.0);
  vec2 g = fract(uv * cells) - 0.5;
  float dotm = smoothstep(0.48, 0.28, length(g));
  col *= 0.25 + 0.95 * dotm;
  // Açılış: merkezden dışa tarama + titreşim.
  float r = length((uv - 0.5) * vec2(1.0, 0.6));
  float on = smoothstep(uWall * 0.75 + 0.02, uWall * 0.75 - 0.04, r);
  float edge = exp(-pow((r - uWall * 0.75) * 30.0, 2.0)) * step(uWall, 0.999);
  col = col * on + vec3(0.7, 0.9, 1.0) * edge * 0.8;
  // Çerçeve.
  vec2 e = min(uv, 1.0 - uv) * s;
  float frame = smoothstep(0.004, 0.0, min(e.x, e.y));
  col += vec3(0.25, 0.4, 0.7) * frame * 0.6;
  return col * 0.9;
}

float beam(vec2 p, vec2 o, float ang, float spread) {
  vec2 dir = vec2(sin(ang), -cos(ang));
  vec2 d = p - o;
  float along = dot(d, dir);
  if (along < 0.0) return 0.0;
  float perp = abs(d.x * dir.y - d.y * dir.x);
  float w = along * spread + 0.006;
  float core = smoothstep(w, w * 0.15, perp);
  return core * exp(-along * 1.25) * (0.35 + 0.65 * smoothstep(w, 0.0, perp));
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  float ph = uTime / D;
  vec3 col = vec3(0.012, 0.016, 0.03);
  // Arka duvar: soluk dikey panel çizgileri.
  col += vec3(0.02, 0.03, 0.06) * (0.5 + 0.5 * sin(p.x * 60.0)) * smoothstep(-0.3, 0.4, p.y);

  float inside;
  vec3 w = wall(p, ph, inside);
  col = mix(col, w, inside);
  // Duvarın çevreye taşan ışığı.
  vec2 wc = wallC(), ws = wallS();
  vec2 q = (p - wc) / ws;
  float halo = exp(-max(0.0, length(max(abs(q) - 0.5, 0.0)) ) * 9.0) * (1.0 - inside);
  col += palette(ph + 0.2) * halo * 0.12 * uWall;

  // Zemin: parlak sahne, duvarın bulanık yansıması.
  float floorY = uMobile > 0.5 ? -0.12 : -0.22;
  if (p.y < floorY) {
    vec2 m = vec2(p.x + 0.0015 * sin(p.y * 90.0), 2.0 * floorY - p.y - 0.01);
    float ins2;
    vec3 refl = wall(m, ph, ins2);
    float fade = exp((p.y - floorY) * 9.0);
    col = vec3(0.012, 0.016, 0.03) + refl * ins2 * 0.16 * fade;
    col += vec3(0.25, 0.5, 1.0) * exp(-abs(p.y - floorY) * 160.0) * 0.6 * uWall;
  }

  // Truss + hareketli başlıklar.
  float trussY = 0.455;
  col = mix(col, vec3(0.06, 0.07, 0.09), smoothstep(0.006, 0.003, abs(p.y - trussY)));
  float hz = 0.55 + 0.75 * loopNoise(p * vec2(2.2, 3.0) + vec2(0.0, 1.3), ph * 2.0);
  float span = uMobile > 0.5 ? aspect * 0.42 : min(aspect * 0.44, 0.95);
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float u = fi / 5.0;
    vec2 o = vec2(mix(-span, span, u), trussY - 0.012);
    float side = u < 0.5 ? 1.0 : -1.0;
    float ang = side * (0.18 + 0.12 * sin(TAU * (ph * (1.0 + mod(fi, 2.0)) + fi * 0.37)))
              + 0.22 * sin(TAU * (ph + fi * 0.21));
    vec3 tint = mod(fi, 2.0) < 0.5 ? vec3(0.75, 0.88, 1.0) : vec3(0.75, 0.45, 1.0);
    float b = beam(p, o, ang, 0.05) * uBeams[i];
    col += tint * b * hz * 0.42;
    // Başlık gövdesi ve lensi.
    col += tint * exp(-length(p - o) * 180.0) * 2.5 * uBeams[i];
    col = mix(col, vec3(0.08, 0.09, 0.11), smoothstep(0.014, 0.011, length((p - o - vec2(0.0, 0.008)) * vec2(1.0, 1.6))) * (1.0 - uBeams[i] * 0.4));
  }

  // Ön sıra seyirci siluetleri (sahne ışığıyla kenar parlaması).
  for (int row = 0; row < 2; row++) {
    float fr = float(row);
    float cw = 0.068 - fr * 0.012;
    float x = p.x / cw + fr * 0.5;
    float cell = floor(x);
    float h = hash11(cell * 3.17 + fr * 11.0);
    float cx = (cell + 0.5 + (h - 0.5) * 0.35 - fr * 0.5) * cw;
    float baseY = -0.5 + 0.035 + fr * 0.025;
    float headY = baseY + 0.055 + h * 0.012;
    float rH = cw * 0.3;
    float dHead = length((p - vec2(cx, headY)) * vec2(1.0, 0.88)) - rH;
    float dBody = length((p - vec2(cx, baseY)) * vec2(0.62, 1.0)) - cw * 0.42;
    float d = min(dHead, dBody);
    float body = smoothstep(0.002, -0.002, d);
    float rim = smoothstep(0.004, 0.0, abs(d + 0.002)) * smoothstep(0.0, rH * 0.9, p.y - headY);
    vec3 sil = vec3(0.004, 0.005, 0.01) + palette(ph + 0.1) * rim * 0.22 * uWall;
    col = mix(col, sil, body * (1.0 - fr * 0.25));
  }

  // Sis: sahneyi bütünüyle yumuşatan hafif ışık.
  col += vec3(0.04, 0.06, 0.12) * hz * 0.25 * smoothstep(-0.5, 0.3, p.y);
  gl_FragColor = vec4(col, 1.0);
}
`;

export interface LansmanFrame {
  time: number;
  wall: number;
  beams: number[];
}

export function buildLansman(ctx: SceneContext) {
  const stage = createStage(ctx, {
    exposure: 1.05,
    bloom: { strength: 0.75, threshold: 0.6, radius: 1 },
    vignette: 0.45,
    grain: 0.012
  });
  const { scene, camera, material } = fullscreenShader(FRAG, {
    uWall: { value: 1 },
    uBeams: { value: [1, 1, 1, 1, 1, 1] },
    uMobile: { value: ctx.variant === 'mobile' ? 1 : 0 }
  });
  (material.uniforms.uResolution.value as THREE.Vector2).set(ctx.width, ctx.height);
  return {
    render(f: LansmanFrame, t: number) {
      material.uniforms.uTime.value = f.time;
      material.uniforms.uWall.value = f.wall;
      material.uniforms.uBeams.value = f.beams;
      stage.render(scene, camera, t);
    }
  };
}
