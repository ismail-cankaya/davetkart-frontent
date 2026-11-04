/** Sahnelerin ortak GLSL parçaları. Hepsi saf işlev: aynı girdi → aynı çıktı. */

export const TAU = Math.PI * 2;

export const GLSL_NOISE = /* glsl */ `
#define TAU 6.28318530718
float hash11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1, 0)), u.x), mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x), u.y);
}
/** x yönünde 'period' hücrede tekrarlayan gürültü (yatay kayan döngüler için). */
float vnoiseTile(vec2 p, float period) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float i0 = mod(i.x, period), i1 = mod(i.x + 1.0, period);
  return mix(mix(hash21(vec2(i0, i.y)), hash21(vec2(i1, i.y)), u.x), mix(hash21(vec2(i0, i.y + 1.0)), hash21(vec2(i1, i.y + 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
float fbm3(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 3; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s / 0.875; }
float fbmTile(vec2 p, float period) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 5; i++) { s += a * vnoiseTile(p, period); p = vec2(p.x * 2.0, p.y * 2.03 + 17.1); period *= 2.0; a *= 0.5; }
  return s;
}
/** Döngüsel zaman için: faz çemberinde dolaşan 3B gürültü yerine iki örneğin harmanı. */
float loopNoise(vec2 p, float phase) {
  vec2 o = vec2(cos(phase * TAU), sin(phase * TAU)) * 1.7;
  return fbm(p + o);
}
`;

/** Döngü dostu periyodik dalga: k tam sayıysa t=0 ve t=D aynıdır. */
export function wave(t: number, duration: number, k = 1, phase = 0): number {
  return Math.sin((t / duration) * TAU * k + phase);
}

/** Deterministik PRNG (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let r = Math.imul(a ^ (a >>> 15), 1 | a);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const smooth = (e0: number, e1: number, x: number) => {
  const k = clamp((x - e0) / (e1 - e0));
  return k * k * (3 - 2 * k);
};
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);

/** Yumuşak ışık lekesi: merkez opak, kenara gauss sönümü — eklemeli çizim için. */
export function glowSprite(size: number, rgb: [number, number, number], core = 0.15, falloff = 2.2): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  if (!g) throw new Error('2d yok');
  const img = g.createImageData(size, size);
  const r0 = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x + 0.5 - r0, y + 0.5 - r0) / r0;
      const a = d >= 1 ? 0 : Math.max(Math.exp(-Math.pow(d / 0.42, falloff)) * (1 - d), d < core ? 1 - d / core : 0);
      const i = (y * size + x) * 4;
      img.data[i] = rgb[0];
      img.data[i + 1] = rgb[1];
      img.data[i + 2] = rgb[2];
      img.data[i + 3] = Math.round(clamp(a) * 255);
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}
