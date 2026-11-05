/**
 * Kokteyl — tam ekran parça gölgelendiricisi (LiveShader, GLSL ES 1.0).
 *
 * p uzayı: yükseklik = 1, merkez hero'nun ortası. Bardak sabit bir yerdedir
 * (`GLASS` ile bileşendeki kazıma yazısı aynı sayıları kullanır). Sıvı
 * yüzeyi CPU'daki yaylı çalkalanmadan gelir (`uTilt`, `uWave`); buz küpleri
 * yüzeyde yüzer (`uIce`), dolum başında yukarıdan bir akış iner (`uPour`).
 * Cam arkasındaki bar ışıkları bardaktan geçerken kırılır (büyüteç gibi).
 */
export const GLASS = {
  cx: 0,
  /** Ağız ve dip (p uzayında y). */
  top: 0.075,
  bottom: -0.285,
  /** Yarı genişlikler: dipte dar, ağızda geniş. */
  halfBottom: 0.08,
  halfTop: 0.102
};

export const KOKTEYL_FRAG = /* glsl */ `
#define TAU 6.28318530718
uniform float uTime;
uniform float uClock;
uniform vec2 uResolution;
uniform float uLevel;
uniform float uTilt;
uniform float uWave;
uniform float uPour;
uniform vec3 uIce[3];
uniform float uClink;
varying vec2 vUv;

const float TOP = ${GLASS.top.toFixed(3)};
const float BOT = ${GLASS.bottom.toFixed(3)};
const float HB = ${GLASS.halfBottom.toFixed(3)};
const float HT = ${GLASS.halfTop.toFixed(3)};

float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

// Bar arka planı: sıcak ve pembe bokeh, koyu mor zemin.
vec3 bar(vec2 p) {
  vec3 col = mix(vec3(0.05, 0.02, 0.07), vec3(0.12, 0.04, 0.12), smoothstep(-0.5, 0.5, p.y));
  for (int i = 0; i < 14; i++) {
    float fi = float(i);
    vec2 c = vec2((h21(vec2(fi, 3.0)) - 0.5) * 1.9, (h21(vec2(fi, 8.0)) - 0.35) * 0.9);
    c.x += 0.02 * sin(uTime * 0.2 + fi);
    float r = 0.04 + 0.07 * h21(vec2(fi, 5.0));
    vec3 tint = mix(vec3(1.0, 0.55, 0.3), vec3(1.0, 0.3, 0.65), h21(vec2(fi, 1.0)));
    tint = mix(tint, vec3(0.45, 0.6, 1.0), step(0.8, h21(vec2(fi, 2.0))));
    float d = length(p - c);
    col += tint * smoothstep(r, r * 0.8, d) * 0.22 + tint * exp(-d * 9.0) * 0.05;
  }
  // Tezgâh: bardağın altında parlak bir yüzey.
  float counter = smoothstep(BOT + 0.004, BOT - 0.004, p.y);
  col = mix(col, vec3(0.08, 0.04, 0.06) + vec3(0.3, 0.15, 0.2) * exp((p.y - BOT) * 10.0) * 0.3, counter);
  return col;
}

float halfW(float y) { return mix(HB, HT, clamp((y - BOT) / (TOP - BOT), 0.0, 1.0)); }

float surfaceY(float x) {
  return BOT + 0.035 + uLevel * (TOP - BOT - 0.07) + tan(uTilt) * x + uWave * sin(x * 48.0 - uClock * 7.0) + uWave * 0.6 * sin(x * 31.0 + uClock * 5.0);
}

float iceSd(vec2 p, vec3 ice) {
  vec2 q = p - ice.xy;
  float c = cos(ice.z), s = sin(ice.z);
  q = mat2(c, -s, s, c) * q;
  vec2 d = abs(q) - vec2(0.024);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - 0.008;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  vec3 col = bar(p);

  float hw = halfW(p.y);
  float inGlass = step(abs(p.x - ${GLASS.cx.toFixed(3)}), hw) * step(BOT, p.y) * step(p.y, TOP);
  float wall = 0.007;
  float inner = step(abs(p.x), hw - wall) * step(BOT + 0.028, p.y) * step(p.y, TOP);

  // Akış (dolum): yukarıdan sıvı yüzeyine inen dalgalı ince sütun.
  float sy = surfaceY(p.x);
  if (uPour > 0.01 && p.y > sy && p.y < 0.6) {
    float wob = 0.004 * sin(p.y * 60.0 - uClock * 25.0);
    float sw = 0.006 + 0.004 * uPour;
    float stream = smoothstep(sw, sw * 0.4, abs(p.x - 0.02 - wob)) * uPour;
    col = mix(col, vec3(1.0, 0.55, 0.35), stream * 0.9);
  }

  if (inGlass > 0.5) {
    // Cam içinden kırılan arka plan.
    vec2 rp = vec2(p.x * 0.78, p.y + 0.01);
    vec3 through = bar(rp) * 0.85 + vec3(0.04, 0.03, 0.05);
    col = mix(col, through, 0.9);

    // Sıvı
    if (inner > 0.5 && p.y < sy) {
      float depth = clamp((sy - p.y) / 0.3, 0.0, 1.0);
      vec3 liq = mix(vec3(1.0, 0.56, 0.3), vec3(0.85, 0.1, 0.35), smoothstep(0.0, 1.0, depth));
      vec3 refr = bar(vec2(p.x * 0.6, p.y * 0.9 + 0.05));
      col = liq * (0.55 + 0.6 * refr * 2.0) + vec3(0.2, 0.05, 0.08) * depth;
      // Kabarcıklar: sütunlar halinde yükselen noktalar.
      for (int i = 0; i < 18; i++) {
        float fi = float(i);
        float bx = (h21(vec2(fi, 11.0)) - 0.5) * 2.0 * (HB - 0.02);
        float sp = 0.05 + 0.06 * h21(vec2(fi, 4.0));
        float range = sy - BOT - 0.03;
        float by = BOT + 0.03 + mod(uClock * sp + h21(vec2(fi, 7.0)) * range, max(range, 0.001));
        float r = 0.0025 + 0.002 * h21(vec2(fi, 9.0));
        vec2 bp = vec2(bx + 0.004 * sin(uClock * 3.0 + fi), by);
        float d = length(p - bp);
        col += vec3(1.0, 0.92, 0.85) * (smoothstep(r, r * 0.4, d) * 0.6 + smoothstep(r * 1.4, r, d) * 0.25);
      }
      // Yüzeye yakın parlak menisküs çizgisi
      col += vec3(1.0, 0.85, 0.7) * exp(-(sy - p.y) * 140.0) * 0.5;
    }

    // Buz küpleri: yüzeyde yüzer, yarı saydam, kenarları parlak.
    for (int i = 0; i < 3; i++) {
      float d = iceSd(p, uIce[i]);
      float m = smoothstep(0.0015, -0.0015, d);
      if (m > 0.0) {
        vec3 ice = mix(col, vec3(0.85, 0.92, 1.0), 0.35);
        ice += vec3(1.0) * smoothstep(-0.006, 0.0, d) * 0.45;
        ice += vec3(1.0) * pow(max(0.0, 1.0 - length(p - uIce[i].xy - vec2(-0.01, 0.01)) / 0.017), 3.0) * 0.4;
        col = mix(col, ice, m);
      }
    }

    // Cam duvarları ve dip: kalın, parlak kenarlar.
    float edge = smoothstep(wall, 0.0, hw - abs(p.x));
    col += vec3(0.75, 0.8, 0.95) * edge * 0.55;
    float base = smoothstep(BOT + 0.03, BOT, p.y);
    col = mix(col, bar(vec2(p.x * 0.5, BOT + 0.1)) * 1.4 + vec3(0.12), base * 0.6);
    // Dikey parlama şeritleri
    float hl = exp(-pow((p.x + hw * 0.62) * 80.0, 2.0)) * 0.35 + exp(-pow((p.x - hw * 0.78) * 140.0, 2.0)) * 0.25;
    col += vec3(1.0) * hl * smoothstep(BOT, BOT + 0.06, p.y);
  }

  // Ağız kenarı: elips parlaması.
  vec2 rim = (p - vec2(0.0, TOP)) / vec2(HT, 0.012);
  col += vec3(0.85, 0.9, 1.0) * smoothstep(0.12, 0.0, abs(length(rim) - 1.0)) * 0.6;

  // Narenciye dilimi (ağızda, sağda).
  vec2 lc = p - vec2(HT - 0.008, TOP + 0.008);
  float lr = length(lc / vec2(1.0, 0.92));
  if (lr < 0.046) {
    float la = atan(lc.y, lc.x);
    vec3 lime = mix(vec3(1.0, 0.75, 0.2), vec3(1.0, 0.92, 0.5), smoothstep(0.037, 0.0, lr));
    lime *= 0.85 + 0.15 * smoothstep(0.08, 0.0, abs(sin(la * 4.0)));
    lime = mix(lime, vec3(1.0, 0.55, 0.1), smoothstep(0.038, 0.042, lr));
    col = mix(col, lime, smoothstep(0.046, 0.043, lr));
  }

  // Pipet: hafif eğik, şeritli.
  vec2 sd = p - vec2(-0.04, 0.0);
  float sa = 0.22;
  vec2 sq = vec2(cos(sa) * sd.x + sin(sa) * sd.y, -sin(sa) * sd.x + cos(sa) * sd.y);
  if (abs(sq.x) < 0.006 && sq.y > -0.12 && sq.y < 0.15) {
    float stripe = step(0.5, fract(sq.y * 22.0 + sq.x * 4.0));
    vec3 straw = mix(vec3(1.0, 0.95, 0.9), vec3(1.0, 0.3, 0.5), stripe);
    float under = step(sq.y, -0.0) * step(p.y, sy) * inGlass;
    col = mix(col, straw * (0.85 + 0.15 * (1.0 - abs(sq.x) / 0.006)), under > 0.5 ? 0.55 : 1.0);
  }

  // Tokuşma ışıltısı: ağızda kısa yıldız parlaması.
  float k = uClock - uClink;
  if (k > 0.0 && k < 0.7) {
    vec2 c = p - vec2(-HT + 0.02, TOP + 0.005);
    float star = exp(-length(c) * 60.0) + exp(-abs(c.x) * 260.0) * exp(-abs(c.y) * 40.0) + exp(-abs(c.y) * 260.0) * exp(-abs(c.x) * 40.0);
    col += vec3(1.0, 0.95, 0.85) * star * (1.0 - k / 0.7) * 1.4;
  }

  gl_FragColor = vec4(col, 1.0);
}
`;
