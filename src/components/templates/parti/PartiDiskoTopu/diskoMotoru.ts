import { useEffect, useRef, type RefObject } from 'react';

/** Canvas'ın CSS boyutu (çizim bu birimlerle yapılır; DPR dönüşümü ctx'te). */
export interface CanvasSize {
  w: number;
  h: number;
}

export type DrawFn = (ctx: CanvasRenderingContext2D, size: CanvasSize, dt: number) => void;

/**
 * Topu ve duvardaki ışık beneklerini birlikte süren paylaşılan sahne durumu.
 * Hero (top) ve backdrop (benekler, huzmeler) aynı nesneyi okur; React state
 * değil, düz bir değişken nesnesi — kare başına yeniden render yok.
 */
export interface DiscoStage {
  /** Topun dikey eksen etrafındaki açısı (radyan). */
  rot: number;
  /** Açısal hız (rad/sn). Sürüklemeyle artar, sürtünmeyle `BASE_SPIN`'e döner. */
  vel: number;
  /** Açılıştan bu yana geçen süre (sn). */
  t: number;
  /** "Ritmi düşür" parlaması (1 → 0 söner). */
  flash: number;
  /** Son ritim düşüşünün `t` anı — art arda en fazla ~2/sn. */
  lastDrop: number;
  /** Patlama parçacıkları (backdrop'ta çizilir). */
  burst: BurstSpeck[];
  /** Hero'daki topun ekran konumu (backdrop canvas'ına göre değil, viewport). */
  ball: { x: number; y: number; r: number };
  /** Backdrop canvas'ı — patlama, topun konumuna bu canvas'a göre çizilir. */
  wall: HTMLCanvasElement | null;
}

interface BurstSpeck {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
}

export const BASE_SPIN = 0.32;
/** Ritim düşüşleri arası en kısa süre: saniyede 3'ten az parlama (nöbet riski). */
const DROP_COOLDOWN = 0.5;

export function createStage(): DiscoStage {
  return { rot: 0.6, vel: BASE_SPIN, t: 0, flash: 0, lastDrop: -9, burst: [], ball: { x: 0, y: 0, r: 0 }, wall: null };
}

/** Sahneyi ilerletir: dönüş, sürtünme, parlama sönümü. */
export function stepStage(s: DiscoStage, dt: number) {
  s.t += dt;
  s.rot += s.vel * dt;
  // Sürtünme: hız, üstel olarak taban dönüş hızına yaklaşır.
  s.vel = BASE_SPIN + (s.vel - BASE_SPIN) * Math.exp(-dt * 0.9);
  s.flash = Math.max(0, s.flash - dt * 1.8);
}

/** Sürükleme: parmak yüzeyi sürükler — yatay piksel hızı / yarıçap = açısal hız (sınırlı). */
export function spin(s: DiscoStage, dxPerSec: number, radiusPx: number) {
  const target = dxPerSec / Math.max(40, radiusPx);
  s.vel = Math.max(-12, Math.min(12, s.vel * 0.4 + target * 0.6));
}

/** Dokunma: parlama + benek patlaması. `flashOk` yanlışsa (azaltılmış hareket) parlama yok. */
export function dropBeat(s: DiscoStage, flashOk: boolean) {
  if (s.t - s.lastDrop < DROP_COOLDOWN) return;
  s.lastDrop = s.t;
  if (flashOk) s.flash = 1;
  s.vel = Math.sign(s.vel || 1) * Math.max(Math.abs(s.vel), 2.6);
  const { x, y } = s.ball;
  for (let i = 0; i < 46; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 160 + Math.random() * 420;
    s.burst.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, hue: Math.random() });
  }
  if (s.burst.length > 160) s.burst.splice(0, s.burst.length - 160);
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ------------------------------------------------------------------ */
/* Top                                                                 */
/* ------------------------------------------------------------------ */

const LAT_BANDS = 16;
const TILT = 0.32; // izleyiciye doğru eğim (radyan)
const LIGHT = (() => {
  const v = [-0.45, 0.55, 0.7];
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
})();
// Blinn-Phong yarım vektörü (göz = +z).
const HALF = (() => {
  const v = [LIGHT[0], LIGHT[1], LIGHT[2] + 1];
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
})();

/** Enlem/boylam → eğik görünüm uzayı (x sağ, y yukarı, z izleyiciye). */
function project(lat: number, lon: number, out: number[]) {
  const cl = Math.cos(lat);
  const x = cl * Math.sin(lon);
  const y0 = Math.sin(lat);
  const z0 = cl * Math.cos(lon);
  const ct = Math.cos(TILT);
  const st = Math.sin(TILT);
  out[0] = x;
  out[1] = y0 * ct - z0 * st;
  out[2] = y0 * st + z0 * ct;
}

/**
 * Aynalı topu çizer: küre enlem bantlarına, her bant cos(enlem)'e orantılı
 * sayıda yüzeye bölünür (gerçek disko topu gibi). Her yüzey normali ışıkla
 * karşılaştırılarak (difüz + parlak yansıma) gölgelenir; arka yüzler atlanır
 * (dışbükey olduğundan sıralama gerekmez).
 */
export function drawBall(ctx: CanvasRenderingContext2D, size: CanvasSize, rot: number, flash: number) {
  const { w, h } = size;
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.42;

  // Hale
  const halo = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.25);
  halo.addColorStop(0, `rgba(255,80,220,${0.22 + flash * 0.25})`);
  halo.addColorStop(1, 'rgba(255,80,220,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);

  // Derz (yüzeyler arası koyu dolgu)
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = '#120A1E';
  ctx.fill();

  const a = [0, 0, 0];
  const b = [0, 0, 0];
  const c = [0, 0, 0];
  const d = [0, 0, 0];
  const n = [0, 0, 0];
  const inset = 0.1;

  for (let i = 0; i < LAT_BANDS; i++) {
    const lat0 = -Math.PI / 2 + (i / LAT_BANDS) * Math.PI;
    const lat1 = -Math.PI / 2 + ((i + 1) / LAT_BANDS) * Math.PI;
    const latM = (lat0 + lat1) / 2;
    const count = Math.max(4, Math.round(LAT_BANDS * 2 * Math.cos(latM)));
    const step = (Math.PI * 2) / count;
    const dl = (lat1 - lat0) * inset;
    for (let j = 0; j < count; j++) {
      const lonA = j * step + rot + (i % 2) * step * 0.5;
      const lonM = lonA + step / 2;
      project(latM, lonM, n);
      if (n[2] <= 0.02) continue;
      const ds = step * inset;
      project(lat0 + dl, lonA + ds, a);
      project(lat0 + dl, lonA + step - ds, b);
      project(lat1 - dl, lonA + step - ds, c);
      project(lat1 - dl, lonA + ds, d);

      const seed = hash(i * 97 + j);
      const diff = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
      const nh = Math.max(0, n[0] * HALF[0] + n[1] * HALF[1] + n[2] * HALF[2]);
      const spec = Math.pow(nh, 60);
      // Ayna: çevreyi yansıtır — normalin yönüne göre macenta/camgöbeği tonu.
      const tint = n[0] * 0.5 + 0.5;
      const base = 38 + diff * 120 + seed * 55;
      let r = base * (0.55 + tint * 0.6);
      let g = base * 0.55;
      let bl = base * (1.15 - tint * 0.35);
      // Ara sıra bir yüzey ışığı tam yakalar.
      const glint = spec * 255 + (seed > 0.93 ? 90 * diff : 0) + flash * 70;
      r = Math.min(255, r + glint);
      g = Math.min(255, g + glint * 0.95);
      bl = Math.min(255, bl + glint);
      // Kenara doğru kararma (Fresnel tersine; kürenin hacmi okunur).
      const edge = 0.35 + 0.65 * Math.sqrt(n[2]);

      ctx.beginPath();
      ctx.moveTo(cx + a[0] * R, cy - a[1] * R);
      ctx.lineTo(cx + b[0] * R, cy - b[1] * R);
      ctx.lineTo(cx + c[0] * R, cy - c[1] * R);
      ctx.lineTo(cx + d[0] * R, cy - d[1] * R);
      ctx.closePath();
      ctx.fillStyle = `rgb(${(r * edge) | 0},${(g * edge) | 0},${(bl * edge) | 0})`;
      ctx.fill();
    }
  }

  // Cam parlaması
  const sheen = ctx.createRadialGradient(cx - R * 0.4, cy - R * 0.45, 0, cx - R * 0.4, cy - R * 0.45, R * 0.7);
  sheen.addColorStop(0, 'rgba(255,255,255,0.28)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();

  // Yıldız parıltısı (dönüşle yer değiştirir)
  const sx = cx - R * 0.38 + Math.sin(rot * 2.3) * R * 0.08;
  const sy = cy - R * 0.4;
  const sl = R * (0.32 + 0.12 * Math.sin(rot * 3.1));
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(sx - sl, sy);
  ctx.lineTo(sx + sl, sy);
  ctx.moveTo(sx, sy - sl);
  ctx.lineTo(sx, sy + sl);
  ctx.stroke();
}

/* ------------------------------------------------------------------ */
/* Duvar: ışık benekleri + huzmeler                                    */
/* ------------------------------------------------------------------ */

const SPECK_COLORS = ['255,70,210', '70,230,255', '255,255,255', '190,120,255'];

/** Yumuşak ışık lekesi; bir kez çizilir, sonra `drawImage` ile damgalanır. */
function makeSprite(rgb: string): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  if (g) {
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, `rgba(255,255,255,1)`);
    grad.addColorStop(0.25, `rgba(${rgb},0.9)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
  }
  return c;
}

interface WallSpeck {
  lon: number;
  y: number;
  size: number;
  color: number;
  phase: number;
}

/**
 * Duvara düşen yansımalar: her benek topun bir yüzeyine bağlı bir boylam taşır;
 * top döndükçe yatayda kayar (silindirik duvar). Hız arttıkça benekler yatayda
 * uzar (hareket bulanıklığı). Üstte üç huzme ritimle salınır.
 */
export function createWall(count: number) {
  const specks: WallSpeck[] = Array.from({ length: count }, (_, i) => ({
    lon: hash(i * 3.1) * Math.PI * 2,
    y: 0.04 + hash(i * 7.7) * 0.92,
    size: 5 + hash(i * 1.9) * 11,
    color: Math.floor(hash(i * 5.3) * SPECK_COLORS.length),
    phase: hash(i * 2.2) * Math.PI * 2
  }));
  let sprites: HTMLCanvasElement[] | null = null;

  return (ctx: CanvasRenderingContext2D, size: CanvasSize, s: DiscoStage, dt: number, fade: number) => {
    const { w, h } = size;
    if (!sprites) sprites = SPECK_COLORS.map(makeSprite);
    ctx.clearRect(0, 0, w, h);
    const t = s.t;
    const beamIn = clamp01((t - 0.9) / 0.9);
    const speckIn = clamp01((t - 1.3) / 1.2);
    // 120 BPM nabız — yumuşak sinüs, flaş değil.
    const pulse = 0.8 + 0.2 * Math.sin(t * Math.PI * 4);

    ctx.globalCompositeOperation = 'lighter';

    // Huzmeler: üstten sallanan üç koni.
    if (beamIn > 0) {
      const beams = [
        { x: 0.12, hue: '255,60,200', ph: 0 },
        { x: 0.5, hue: '80,220,255', ph: 2.1 },
        { x: 0.88, hue: '170,90,255', ph: 4.2 }
      ];
      for (const bm of beams) {
        const ang = Math.sin(t * 0.55 + bm.ph) * 0.55;
        const len = h * 1.15;
        const spread = 0.13;
        const ox = bm.x * w;
        const oy = -10;
        const grad = ctx.createLinearGradient(ox, oy, ox + Math.sin(ang) * len, oy + Math.cos(ang) * len);
        const al = 0.16 * beamIn * pulse * fade;
        grad.addColorStop(0, `rgba(${bm.hue},${al})`);
        grad.addColorStop(1, `rgba(${bm.hue},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + Math.sin(ang - spread) * len, oy + Math.cos(ang - spread) * len);
        ctx.lineTo(ox + Math.sin(ang + spread) * len, oy + Math.cos(ang + spread) * len);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Benekler
    if (speckIn > 0) {
      const stretch = 1 + Math.min(5, Math.abs(s.vel) * 0.9);
      const span = w * 1.6;
      for (let i = 0; i < specks.length; i++) {
        const sp = specks[i];
        // Sırayla belirme: açılışta duvara saçılır.
        const own = clamp01(speckIn * 1.6 - (i / specks.length) * 0.6);
        if (own <= 0) continue;
        const ang = (((sp.lon + s.rot) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const x = (ang / (Math.PI * 2)) * span - w * 0.3;
        if (x < -40 || x > w + 40) continue;
        // Duvar kenarına yaklaşınca küçülür (perspektif).
        const edge = 1 - Math.abs(x / w - 0.5) * 0.8;
        const tw = 0.65 + 0.35 * Math.sin(t * 2.2 + sp.phase);
        const a = Math.min(1, own * tw * fade * (0.7 + s.flash * 0.3));
        const sz = sp.size * edge * (1 + s.flash * 0.6);
        ctx.globalAlpha = a;
        ctx.drawImage(sprites[sp.color], x - (sz * stretch) / 2, sp.y * h - sz / 2, sz * stretch, sz);
      }
      ctx.globalAlpha = 1;
    }

    // Patlama parçacıkları
    if (s.burst.length) {
      for (const p of s.burst) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 1 - dt * 1.4;
        p.vy *= 1 - dt * 1.4;
        p.life -= dt * 0.7;
        if (p.life <= 0) continue;
        const sz = 6 + p.life * 10;
        ctx.globalAlpha = clamp01(p.life);
        ctx.drawImage(sprites[Math.floor(p.hue * SPECK_COLORS.length)], p.x - sz / 2, p.y - sz / 2, sz, sz);
      }
      ctx.globalAlpha = 1;
      s.burst = s.burst.filter((p) => p.life > 0);
    }

    // Ritim parlaması — tek, yumuşak, sönümlü (strobe değil).
    if (s.flash > 0) {
      ctx.fillStyle = `rgba(255,120,230,${s.flash * 0.22})`;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.globalCompositeOperation = 'source-over';
  };
}

/* ------------------------------------------------------------------ */
/* Döngü                                                               */
/* ------------------------------------------------------------------ */

/** Canvas'ı kutusuna oturtur; devicePixelRatio en çok 2. */
function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): CanvasSize {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));
  const pw = Math.round(w * dpr);
  const ph = Math.round(h * dpr);
  if (canvas.width !== pw) canvas.width = pw;
  if (canvas.height !== ph) canvas.height = ph;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h };
}

/**
 * Tek canvas döngüsü. `animate` kapalıyken (önizleme / azaltılmış hareket) rAF
 * kurulmaz: sahne bir kez (dt = 0) çizilir, yalnızca boyut değişince yeniden.
 * Unmount'ta rAF ve gözlemci temizlenir.
 */
export function useCanvasLoop(ref: RefObject<HTMLCanvasElement | null>, draw: DrawFn, animate: boolean) {
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let size = fitCanvas(canvas, ctx);
    let raf = 0;
    let last = performance.now();

    const still = () => drawRef.current(ctx, size, 0);
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      drawRef.current(ctx, size, dt);
      raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      size = fitCanvas(canvas, ctx);
      if (!animate) still();
    };

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(onResize);
      ro.observe(canvas);
    } else {
      window.addEventListener('resize', onResize);
    }

    if (animate) raf = requestAnimationFrame(frame);
    else still();

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [ref, animate]);
}
