/**
 * Gece Havuzu sahnesinin TEK kaynağı. Aynı GLSL hem videoyu üretir
 * (scripts/video/parti-havuz/scene.ts, three.js ShaderMaterial) hem de canlı
 * WebGL katmanında çalışır (HavuzCanli.tsx) — video ile canlı sahne arasındaki
 * geçişte görüntü atlamaz. GLSL ES 1.0 sözdizimi: iki ortamda da derlenir.
 *
 * Zaman döngüseldir: `uTime` HAVUZ_SURESI'nde tam tur atar.
 */
export const HAVUZ_SURESI = 10;

/** Yüzen LED küreler: konum (p uzayı, yükseklik = 1), renk (doğrusal RGB). */
export const ORB_COLORS: [number, number, number][] = [
  [1.0, 0.18, 0.62],
  [0.25, 0.85, 1.0],
  [1.0, 0.62, 0.18],
  [0.62, 0.32, 1.0],
  [0.2, 1.0, 0.7]
];

/** `t` anında kürelerin konumu; döngüde başa döner. `aspect` = genişlik/yükseklik. */
export function orbPositions(t: number, aspect: number): number[] {
  const out: number[] = [];
  const w = Math.PI * 2 * (t / HAVUZ_SURESI);
  const halfW = aspect * 0.5;
  const portrait = aspect < 1;
  for (let i = 0; i < ORB_COLORS.length; i++) {
    const a = i * 1.618 * Math.PI;
    // Kenarlara yakın gezinirler; orta şerit tipografiye kalır.
    const side = i % 2 === 0 ? -1 : 1;
    const bx = portrait ? side * halfW * (0.55 + 0.12 * Math.sin(a)) : side * halfW * (0.62 + 0.18 * Math.sin(a * 1.3));
    const by = portrait ? 0.38 - (i / (ORB_COLORS.length - 1)) * 0.76 : 0.34 - (i / (ORB_COLORS.length - 1)) * 0.68;
    out.push(bx + 0.05 * Math.sin(w + a), by + 0.04 * Math.cos(w * (i % 2 ? 1 : -1) + a * 0.7));
  }
  return out;
}

export const HAVUZ_FRAG = /* glsl */ `
#define TAU 6.28318530718
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uOrbs[5];
uniform vec3 uOrbColors[5];
/** Dokunuş dalgaları: xy konum (p uzayı), z başlangıç anı (sn, gerçek zaman), w = 1 etkin. */
uniform vec4 uRipples[4];
uniform float uClock;
varying vec2 vUv;

const float D = ${HAVUZ_SURESI.toFixed(1)};

float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

// Yüzey: döngüsel dalgalar (her bileşen D içinde tam sayı tur atar).
float surface(vec2 p, float ph) {
  float h = 0.0;
  h += 0.012 * sin(dot(p, vec2(9.0, 4.0)) + ph * 2.0 + 1.3);
  h += 0.009 * sin(dot(p, vec2(-6.0, 11.0)) - ph * 3.0 + 4.1);
  h += 0.006 * sin(dot(p, vec2(15.0, -7.0)) + ph * 4.0 + 2.2);
  h += 0.004 * sin(dot(p, vec2(-21.0, -17.0)) - ph * 5.0 + 5.7);
  for (int i = 0; i < 4; i++) {
    vec4 r = uRipples[i];
    if (r.w < 0.5) continue;
    float age = uClock - r.z;
    if (age < 0.0 || age > 3.0) continue;
    float d = length(p - r.xy);
    float front = age * 0.45;
    h += 0.02 * exp(-pow((d - front) * 18.0, 2.0)) * sin((d - front) * 70.0) * (1.0 - age / 3.0);
  }
  return h;
}

// Kostik: tekrar eden kıvrımlı ızgara (Hoskins) — zaman çarpanları tam sayı, döngü kusursuz.
float caustic(vec2 uv, float ph) {
  vec2 p = uv * TAU - 250.0;
  vec2 i = p;
  float c = 1.0;
  float inten = 0.005;
  for (int n = 0; n < 4; n++) {
    float k = n == 0 ? -2.0 : n == 1 ? -1.0 : n == 2 ? 1.0 : 2.0;
    float t = ph * k;
    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 2.0);
}

vec3 tiles(vec2 q, float depth) {
  vec2 cell = floor(q);
  vec2 f = fract(q);
  float grout = smoothstep(0.0, 0.07, min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y)));
  float var = h21(cell);
  vec3 a = vec3(0.006, 0.055, 0.095);
  vec3 b = vec3(0.012, 0.10, 0.16);
  vec3 col = mix(a, b, var) * (0.75 + 0.25 * var);
  col = mix(vec3(0.03, 0.06, 0.075), col, grout);
  return col * mix(1.0, 0.55, depth);
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  float ph = TAU * mod(uTime, D) / D;

  // Kırılma: yüzey eğimi zemindeki karoları kaydırır.
  float e = 0.004;
  float h = surface(p, ph);
  vec2 grad = vec2(surface(p + vec2(e, 0.0), ph) - h, surface(p + vec2(0.0, e), ph) - h) / e;
  vec2 refr = p + grad * 0.014;

  // Derinlik: uzun kenar boyunca sığdan derine.
  float along = aspect >= 1.0 ? refr.x / aspect + 0.5 : 0.5 - refr.y;
  float depth = smoothstep(0.0, 1.0, along);
  float tileScale = 34.0;
  vec3 col = tiles(refr * tileScale, depth);

  // Kulvar çizgisi: koyu karo şeridi, uçta T.
  vec2 lane = refr * tileScale;
  float laneMask = aspect >= 1.0
    ? step(abs(lane.y + 9.0), 0.5) * step(abs(lane.x), aspect * 17.0 - 2.0) + step(abs(lane.x - (aspect * 17.0 - 2.5)), 0.5) * step(abs(lane.y + 9.0), 2.5)
    : step(abs(lane.x - 6.0), 0.5) * step(abs(lane.y), 14.0) + step(abs(lane.y - 14.5), 0.5) * step(abs(lane.x - 6.0), 2.5);
  col = mix(col, vec3(0.01, 0.04, 0.09) * mix(1.0, 0.6, depth), laneMask * 0.85);

  // Kostik ışık + yüzen kürelerin renkli ışığı zemine düşer.
  float c1 = caustic(refr * 1.9 + vec2(3.13, 1.7), ph);
  float c2 = caustic(refr * 2.7 - vec2(2.4, 5.1), -ph);
  float caust = c1 * 0.6 + c2 * 0.4;
  // Duvar lambaları: sığ uçtan suya yayılan sıcak-turkuaz ışık.
  vec2 lampDir = aspect >= 1.0 ? vec2(-aspect * 0.5, 0.0) : vec2(0.0, 0.5);
  float lamp = 0.0;
  for (int k = -1; k <= 1; k++) {
    vec2 lp = aspect >= 1.0 ? vec2(-aspect * 0.5 - 0.02, float(k) * 0.3) : vec2(float(k) * 0.3, 0.52);
    lamp += 0.05 / (0.02 + dot(refr - lp, refr - lp) * 4.0);
  }
  lamp = min(lamp, 3.0);
  vec3 light = vec3(0.30, 0.90, 1.0) * caust * (0.10 + 0.22 * lamp) + vec3(0.06, 0.35, 0.45) * lamp * 0.18;

  vec3 orbLight = vec3(0.0);
  vec3 orbGlow = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    vec2 o = uOrbs[i];
    vec3 oc = uOrbColors[i];
    float d = length(refr - o);
    orbLight += oc * (0.16 / (1.0 + d * d * 45.0)) * (0.35 + caust * 0.9);
    // Gölge: küre ışığı keser (biraz kaymış).
    float sh = smoothstep(0.02, 0.06, length(p - o - vec2(0.025, -0.03)));
    col *= mix(0.55, 1.0, sh);
    // Küre gövdesi ve yüzeydeki parıltısı.
    float r = length(p - o);
    float body = smoothstep(0.038, 0.033, r);
    float core = smoothstep(0.036, 0.0, length(p - o - vec2(-0.01, 0.012)));
    vec3 sphere = oc * (0.55 + 0.9 * core) + vec3(0.25) * pow(core, 3.0);
    orbGlow += oc * 0.012 / (r * r * 40.0 + 0.012);
    col = mix(col, sphere, body);
  }
  col += light + orbLight;
  col += orbGlow;

  // Yüzeyde gökyüzü yansıması: eğimin yakaladığı ince parıltılar.
  float spec = pow(max(0.0, 1.0 - length(grad * 1.6 - vec2(0.3, 0.4))), 18.0);
  col += vec3(0.75, 0.85, 1.0) * spec * 0.35;

  // Gece: kenarlar koyulaşır (havuz ışıkları ortayı aydınlatır).
  float vig = smoothstep(1.35, 0.2, length(p * vec2(aspect >= 1.0 ? 0.75 : 1.2, aspect >= 1.0 ? 1.2 : 0.75)));
  col *= 0.45 + 0.55 * vig;

  gl_FragColor = vec4(col, 1.0);
}
`;
