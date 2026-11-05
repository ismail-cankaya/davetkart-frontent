/**
 * Koi Havuzu — tam ekran parça gölgelendiricisi (LiveShader, GLSL ES 1.0).
 *
 * p uzayı: yükseklik = 1, merkez (0,0). Balıkların omurgası CPU'da
 * (`koiSim.ts`) hesaplanır ve her karede `uSpine` olarak gelir: iki balık ×
 * 10 nokta, baştan kuyruğa. Gövde, segmentlere uzaklıktan (kapsül SDF)
 * kurulur; yarıçap baştan kuyruğa incelir. Gölge, aynı gövdenin kaydırılmış
 * ve bulanık bir kopyasıdır (havuz dibine düşer).
 */
export const SPINE_POINTS = 10;
export const FISH = 2;

export const KOI_FRAG = /* glsl */ `
#define TAU 6.28318530718
uniform float uTime;
uniform float uClock;
uniform vec2 uResolution;
uniform vec2 uSpine[${FISH * SPINE_POINTS}];
uniform vec4 uRipples[4];
uniform vec4 uFood[4];
varying vec2 vUv;

float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), u.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }

// Çakıl dibi: hücresel taşlar.
float pebbles(vec2 p) {
  vec2 g = p * 14.0;
  vec2 i = floor(g), f = fract(g);
  float d = 1.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(float(x), float(y));
    vec2 c = o + 0.5 + 0.85 * (vec2(h21(i + o), h21(i + o + 7.1)) - 0.5);
    d = min(d, length(f - c));
  }
  return d;
}

float caustic(vec2 p, float t) {
  float c = 0.0;
  c += sin(p.x * 23.0 + t * 1.1 + sin(p.y * 17.0 - t * 0.8) * 1.6);
  c += sin(p.y * 21.0 - t * 0.9 + sin(p.x * 19.0 + t * 0.7) * 1.4);
  c += sin((p.x + p.y) * 15.0 + t * 0.6);
  return pow(max(0.0, c / 3.0), 3.0);
}

// Bir balığın gövde uzaklığı; s = baştan kuyruğa konum (0..1), side = yanal işaret.
// Omurga dizisi parametre olarak gelir: GLSL ES 1.0'da uniform dizisi yalnızca döngü
// sayacıyla indekslenebilir, fonksiyon parametresiyle değil.
float fishSd(vec2 p, vec2 sp[${SPINE_POINTS}], out float s, out float lat, out vec2 tailP, out vec2 tailDir) {
  float best = 1e3;
  s = 0.0; lat = 0.0;
  vec2 a = sp[0];
  for (int i = 1; i < ${SPINE_POINTS}; i++) {
    vec2 b = sp[i];
    vec2 ab = b - a;
    float l2 = max(dot(ab, ab), 1e-6);
    float h = clamp(dot(p - a, ab) / l2, 0.0, 1.0);
    vec2 q = a + ab * h;
    float t = (float(i - 1) + h) / ${(SPINE_POINTS - 1).toFixed(1)};
    // Profil: başta yuvarlak, gövdenin üçte birinde en kalın, kuyruğa incelir.
    float r = 0.027 * pow(sin(3.14159 * (0.1 + t * 0.88)), 0.75) * (1.0 - 0.6 * t) + 0.002;
    float d = length(p - q) - r;
    if (d < best) {
      best = d;
      s = t;
      vec2 n = normalize(vec2(-ab.y, ab.x));
      lat = dot(p - q, n) / max(r, 1e-3);
    }
    a = b;
  }
  tailP = sp[${SPINE_POINTS - 1}];
  tailDir = normalize(tailP - sp[${SPINE_POINTS - 2}]);
  return best;
}

// Kuyruk yüzgeci: kuyruk ucundan açılan, dalgalanan yelpaze.
float tailSd(vec2 p, vec2 tp, vec2 dir, float wob) {
  vec2 n = vec2(-dir.y, dir.x);
  vec2 q = p - tp;
  float along = dot(q, dir);
  float side = dot(q, n) - wob * along * 1.2;
  float len = 0.05;
  if (along < -0.004 || along > len) return 1.0;
  float w = 0.003 + along * 0.6;
  // Çatal kuyruk: ortası arkadan oyuk.
  float fork = smoothstep(len * 0.45, len, along) * w * 0.55;
  return max(abs(side) - w, fork - abs(side));
}

vec3 fishColor(int fi, float s, float lat, vec2 p) {
  float spots = vn(vec2(s * 7.0 + float(fi) * 9.0, lat * 1.4 + 3.0));
  float scales = 0.5 + 0.5 * sin((s * 70.0) + abs(lat) * 6.0);
  if (fi == 0) {
    // Kohaku: kar beyazı gövde, kırmızı-turuncu lekeler.
    vec3 white = vec3(0.97, 0.95, 0.92);
    vec3 red = vec3(0.92, 0.25, 0.12);
    vec3 c = mix(white, red, smoothstep(0.48, 0.56, spots) * step(s, 0.88));
    return c * (0.9 + 0.1 * scales);
  }
  // Yamabuki: altın, metalik pullar.
  vec3 gold = mix(vec3(1.0, 0.72, 0.22), vec3(1.0, 0.88, 0.5), scales);
  return gold * (0.85 + 0.25 * (1.0 - abs(lat)));
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  float t = uTime;

  // Dokunuş dalgaları: yüzeyi kırar (dibi kaydırır) ve ışıltı halkası çizer.
  vec2 warp = vec2(0.0);
  float ring = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 r = uRipples[i];
    if (r.w < 0.5) continue;
    float k = uClock - r.z;
    if (k < 0.0 || k > 3.0) continue;
    vec2 d = p - r.xy;
    float dist = length(d);
    float front = k * 0.22;
    float wave = sin((dist - front) * 90.0) * exp(-abs(dist - front) * 30.0) * exp(-k * 1.2);
    warp += normalize(d + 1e-5) * wave * 0.004;
    ring += max(0.0, wave) * 0.35;
  }
  vec2 q = p + warp + 0.003 * vec2(sin(p.y * 30.0 + t * 1.3), cos(p.x * 26.0 - t));

  // Havuz dibi
  float pb = pebbles(q);
  vec3 bottom = mix(vec3(0.05, 0.16, 0.16), vec3(0.09, 0.25, 0.22), fbm(q * 3.0));
  bottom *= 0.9 + 0.14 * smoothstep(0.08, 0.5, pb) - 0.06 * fbm(q * 9.0);
  bottom += vec3(0.5, 0.75, 0.6) * caustic(q, t) * 0.16;
  vec3 col = bottom;

  // Balıklar: önce gölgeler, sonra gövdeler.
  vec2 sp[${SPINE_POINTS}];
  for (int fi = 0; fi < ${FISH}; fi++) {
    for (int i = 0; i < ${SPINE_POINTS}; i++) sp[i] = uSpine[fi * ${SPINE_POINTS} + i];
    float s, lat; vec2 tp, td;
    float d = fishSd(q - vec2(0.016, -0.022), sp, s, lat, tp, td);
    col *= 1.0 - 0.45 * smoothstep(0.02, -0.01, d);
  }
  for (int fi = 0; fi < ${FISH}; fi++) {
    for (int i = 0; i < ${SPINE_POINTS}; i++) sp[i] = uSpine[fi * ${SPINE_POINTS} + i];
    float s, lat; vec2 tp, td;
    float d = fishSd(q, sp, s, lat, tp, td);
    float wob = sin(uClock * 6.0 + float(fi) * 2.0) * 0.6;
    float tl = tailSd(q, tp, td, wob);
    vec3 fc = fishColor(fi, s, lat, q);
    // Yüzgeç: yarı saydam, tülümsü.
    vec3 finC = fi == 0 ? vec3(1.0, 0.93, 0.9) : vec3(1.0, 0.84, 0.45);
    col = mix(col, finC, smoothstep(0.003, -0.002, tl) * 0.38);
    // Gövde: kenarlar suyun rengine kaçar (derinlik), sırt parlar.
    float body = smoothstep(0.002, -0.002, d);
    vec3 shaded = fc * (0.75 + 0.35 * (1.0 - abs(lat))) + vec3(1.0) * pow(max(0.0, 1.0 - abs(lat + 0.2)), 6.0) * 0.25;
    col = mix(col, mix(shaded, bottom, 0.12), body);
    // Gözler
    vec2 head = sp[0];
    vec2 dir = normalize(head - sp[1]);
    vec2 n = vec2(-dir.y, dir.x);
    for (int e = -1; e <= 1; e += 2) {
      vec2 eye = head - dir * 0.012 + n * float(e) * 0.016;
      col = mix(col, vec3(0.05), smoothstep(0.0045, 0.003, length(q - eye)));
    }
  }

  // Yem taneleri: suda süzülür, yavaşça kaybolur.
  for (int i = 0; i < 4; i++) {
    vec4 f = uFood[i];
    if (f.w < 0.5) continue;
    float k = uClock - f.z;
    if (k < 0.0 || k > 6.0) continue;
    for (int j = 0; j < 5; j++) {
      float fj = float(j);
      vec2 o = (vec2(h21(vec2(fj, f.z)), h21(vec2(f.z, fj))) - 0.5) * 0.05;
      vec2 fp = f.xy + o + 0.004 * vec2(sin(uClock * 1.7 + fj), cos(uClock * 1.3 + fj));
      col = mix(col, vec3(0.55, 0.36, 0.18), smoothstep(0.0055, 0.0035, length(q - fp)) * (1.0 - k / 6.0));
    }
  }

  // Nilüfer yaprakları (yüzeyde, balıkların üstünde) ve bir çiçek.
  vec3 pads[6];
  pads[0] = vec3(-0.62, 0.34, 0.085); pads[1] = vec3(0.58, 0.38, 0.07); pads[2] = vec3(0.7, -0.3, 0.09);
  pads[3] = vec3(-0.68, -0.36, 0.075); pads[4] = vec3(-0.3, 0.47, 0.05); pads[5] = vec3(0.32, -0.46, 0.06);
  for (int i = 0; i < 6; i++) {
    vec3 pd = pads[i];
    vec2 c = vec2(pd.x * min(aspect / 1.78, 1.0) * (aspect < 1.0 ? 1.55 : 1.0), pd.y);
    c += 0.004 * vec2(sin(t * 0.5 + float(i)), cos(t * 0.4 + float(i) * 1.7));
    vec2 d = p - c;
    float a = atan(d.y, d.x) + float(i) * 1.3;
    float dist = length(d);
    // Nilüfer yaprağının kama biçimli yarığı.
    float ang = abs(mod(a + 3.14159, TAU) - 3.14159);
    float notch = smoothstep(0.2, 0.16, ang);
    float pad = smoothstep(pd.z, pd.z - 0.004, dist) * (1.0 - notch);
    // Gölge
    col *= 1.0 - 0.35 * smoothstep(pd.z + 0.02, pd.z - 0.01, length(d - vec2(0.012, -0.016)));
    vec3 leaf = mix(vec3(0.16, 0.42, 0.2), vec3(0.32, 0.6, 0.28), fbm(d * 30.0 + float(i)));
    leaf *= 0.95 + 0.05 * sin(a * 14.0) + 0.04 * smoothstep(0.004, 0.0, abs(fract(a * 2.2) - 0.5) * dist);
    leaf += vec3(0.25) * pow(max(0.0, 1.0 - dist / pd.z), 3.0) * 0.3;
    col = mix(col, leaf, pad);
    if (i == 0 || i == 2) {
      // Pembe nilüfer çiçeği: iki kat yaprak.
      vec2 fc = c + vec2(0.012, 0.01);
      vec2 fd = p - fc;
      float fa = atan(fd.y, fd.x);
      float fr = length(fd);
      float petal = 0.026 * (0.6 + 0.4 * abs(cos(fa * 4.0)));
      float petal2 = 0.016 * (0.6 + 0.4 * abs(cos(fa * 4.0 + 0.8)));
      col = mix(col, vec3(0.98, 0.72, 0.8), smoothstep(petal, petal - 0.003, fr));
      col = mix(col, vec3(1.0, 0.86, 0.9), smoothstep(petal2, petal2 - 0.003, fr));
      col = mix(col, vec3(1.0, 0.85, 0.35), smoothstep(0.006, 0.004, fr));
    }
  }

  // Yüzey ışıltısı ve dokunuş halkaları
  col += vec3(0.8, 0.95, 1.0) * ring;
  col += vec3(0.6, 0.8, 0.85) * pow(max(0.0, sin(p.x * 3.0 + p.y * 5.0 + t * 0.3)), 18.0) * 0.06;
  // Kenarlara doğru koyulaşan derinlik (vinyet)
  vec2 v = p / vec2(aspect * 0.5, 0.5);
  col *= 0.6 + 0.4 * smoothstep(1.45, 0.3, length(v));
  gl_FragColor = vec4(col, 1.0);
}
`;
