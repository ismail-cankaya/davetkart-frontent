/**
 * Lazer Gösterisi sahnesinin TEK kaynağı. Aynı GLSL hem videoyu üretir
 * (scripts/video/parti-lazer/scene.ts) hem de canlı WebGL katmanında çalışır
 * (LiveShader): video ile canlı sahne arasındaki geçişte görüntü atlamaz.
 * GLSL ES 1.0 sözdizimi: iki ortamda da derlenir.
 *
 * Zaman döngüseldir: `uTime` LAZER_SURESI'nde tam tur atar. Lazer yelpazeleri
 * `uAim` noktasına yönelir; videoda bu nokta `aimAt(t)` ile gezinir, canlıda
 * misafirin parmağına doğru yumuşakça kayar.
 */
export const LAZER_SURESI = 8;

/** Videodaki (ve dokunulmadan önceki canlı sahnedeki) nişan noktası; p uzayı, yükseklik = 1. */
export function aimAt(t: number, aspect: number): [number, number] {
  const w = (Math.PI * 2 * t) / LAZER_SURESI;
  const spanX = Math.min(aspect, 1.6) * 0.28;
  return [spanX * Math.sin(w), 0.16 + 0.08 * Math.sin(w * 2 + 0.6)];
}

export const LAZER_FRAG = /* glsl */ `
#define TAU 6.28318530718
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uAim;
/** Dokunuş flaşı: x başlangıç anı (gerçek saat), y = 1 etkin. */
uniform vec2 uFlash;
uniform float uClock;
varying vec2 vUv;

const float D = ${LAZER_SURESI.toFixed(1)};

float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), u.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
// Döngüsel sis: gürültü uzayında bir çember üzerinde dolaşır.
float fog(vec2 p, float ph) {
  vec2 o = vec2(cos(ph * TAU), sin(ph * TAU)) * 1.3;
  float n = fbm(p * vec2(1.6, 2.6) + o);
  float n2 = fbm(p * 2.6 - o * 1.7 + 5.0);
  return 0.25 + 0.95 * n * n + 0.1 * n2;
}

vec3 fan(vec2 p, vec2 e, vec2 aim, vec3 c, float ph, float seed, float fg) {
  vec2 toA = aim - e;
  float th0 = atan(toA.x, toA.y);
  float open = 0.22 + 0.12 * sin(TAU * (ph * 2.0 + seed));
  vec3 acc = vec3(0.0);
  for (int j = 0; j < 7; j++) {
    float fj = float(j) - 3.0;
    float th = th0 + fj * open / 3.0 + 0.04 * sin(TAU * (ph * 4.0 + fj * 0.3 + seed));
    vec2 dir = vec2(sin(th), cos(th));
    vec2 d = p - e;
    float along = dot(d, dir);
    if (along < 0.0) continue;
    float perp = abs(d.x * dir.y - d.y * dir.x);
    float core = exp(-perp * 1100.0);
    float glow = exp(-perp * 90.0) * 0.12 + exp(-perp * 28.0) * 0.05 * fg;
    // Işın sisin içinde görünür: yoğun sis şeritlerinde parlar, boşlukta söner.
    acc += c * (core * (0.3 + 0.9 * fg * fg) + glow * fg) * exp(-along * 0.55);
  }
  // Kaynak noktası
  acc += c * exp(-length(p - e) * 90.0) * 1.5;
  return acc;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  float ph = uTime / D;
  float fg = fog(p, ph);

  vec3 col = vec3(0.008, 0.006, 0.02);
  // Arka duvar: uzaktaki şehir ışıkları gibi soluk bokeh.
  for (int i = 0; i < 10; i++) {
    float fi = float(i);
    vec2 b = vec2((h21(vec2(fi, 1.0)) - 0.5) * aspect * 1.1, 0.05 + h21(vec2(fi, 2.0)) * 0.35);
    float tw = 0.6 + 0.4 * sin(TAU * (ph * 2.0 + fi * 0.27));
    col += mix(vec3(0.8, 0.2, 0.9), vec3(0.2, 0.7, 1.0), h21(vec2(fi, 3.0))) * exp(-length(p - b) * 38.0) * 0.08 * tw;
  }
  col += vec3(0.06, 0.025, 0.11) * fg * fg * 0.9;

  float mob = aspect < 1.0 ? 1.0 : 0.0;
  float ex = min(aspect * 0.5, 0.9);
  vec2 e0 = vec2(-ex * 0.92, -0.42);
  vec2 e1 = vec2(ex * 0.92, -0.42);
  vec2 e2 = vec2(0.0, 0.52);
  vec2 aim = uAim;
  col += fan(p, e0, aim + vec2(0.05, 0.0), vec3(0.15, 1.0, 0.45), ph, 0.0, fg);
  col += fan(p, e1, aim - vec2(0.05, 0.0), vec3(1.0, 0.12, 0.7), ph, 0.33, fg);
  col += fan(p, e2, vec2(aim.x * 0.6, -0.5), vec3(0.25, 0.75, 1.0), ph, 0.66, fg) * 0.8;

  // Zemin: ızgara ve ışın yansıması.
  float floorY = -0.34;
  if (p.y < floorY) {
    float dz = floorY - p.y;
    float persp = 1.0 / (dz + 0.04);
    vec2 g = vec2(p.x * persp * 0.6, persp * 0.9 - ph * 2.0 * 0.0);
    vec2 gf = abs(fract(g) - 0.5);
    float grid = smoothstep(0.48, 0.5, max(gf.x, gf.y)) * exp(-dz * 4.0);
    col = col * 0.35 + vec3(0.6, 0.2, 1.0) * grid * 0.25;
    col += vec3(0.3, 0.15, 0.5) * exp(-dz * 30.0) * 0.2;
  }

  // Dokunuş flaşı: kısa beyaz-mor parlama + sis aydınlanması.
  if (uFlash.y > 0.5) {
    float k = uClock - uFlash.x;
    if (k > 0.0 && k < 0.6) col += vec3(0.7, 0.55, 1.0) * fg * 0.35 * exp(-k * 7.0);
  }
  gl_FragColor = vec4(col, 1.0);
}
`;
