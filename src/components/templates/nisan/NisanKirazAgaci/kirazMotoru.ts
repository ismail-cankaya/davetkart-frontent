import { useEffect, useRef, type RefObject } from 'react';
import type { MotionValue } from 'motion/react';

/**
 * Kiraz ağacı motoru — canvas 2D.
 *
 * Ağaç tohumlu bir RNG ile özyinelemeli dallanarak bir kez üretilir (her
 * açılışta aynı ağaç). Çizim tek bir `season` değerine bağlıdır:
 *   0.00–0.36  dallar sırayla büyür (gövde → ince uçlar)
 *   0.36–0.50  tomurcuklar açar → 0.50 = tam çiçek
 *   0.52–0.82  çiçekler tek tek dökülür (yaprak taneciklerine dönüşür)
 *   0.80–1.00  dökülen çiçeklerin bir kısmı kiraza döner
 * Rüzgâr: hafif sürekli esinti + dokunuşla verilen, sönümlenen bir "esinti" vektörü.
 */

export interface CanvasSize {
  w: number;
  h: number;
}

/** Ağacın oturacağı kutu (canvas koordinatlarında). */
export interface TreeBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const SEASON_BLOOM = 0.5;
const GROW_END = 0.36;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Branch {
  x0: number;
  y0: number;
  cx: number;
  cy: number;
  x1: number;
  y1: number;
  width: number;
  depth: number;
  g0: number;
  g1: number;
}

interface Blossom {
  x: number;
  y: number;
  r: number;
  rot: number;
  tone: number;
  /** Açılma anı (season). */
  open: number;
  /** Dökülme anı (season). */
  drop: number;
  fruit: boolean;
  dropped: boolean;
  depth: number;
}

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  spin: number;
  size: number;
  tone: number;
  flutter: number;
  life: number;
}

const MAX_DEPTH = 7;
const PETAL_TONES = ['#F9D3DC', '#F4B4C4', '#FBE4E9', '#EE9FB4'];
const BLOSSOM_TONES = ['#FAD6DF', '#F6BFCC', '#FDE8EC', '#F2A9BC'];

/** Ağaç birim uzayda üretilir: kök (0,0), yukarı negatif y. */
function buildTree(seed: number) {
  const rnd = mulberry32(seed);
  const branches: Branch[] = [];
  const blossoms: Blossom[] = [];

  const grow = (x: number, y: number, angle: number, len: number, width: number, depth: number, t0: number) => {
    const x1 = x + Math.cos(angle) * len;
    const y1 = y + Math.sin(angle) * len;
    const bend = (rnd() - 0.5) * len * 0.35;
    const cx = (x + x1) / 2 + Math.cos(angle + Math.PI / 2) * bend;
    const cy = (y + y1) / 2 + Math.sin(angle + Math.PI / 2) * bend;
    const dur = (GROW_END * 0.92) / (MAX_DEPTH + 1);
    const g1 = Math.min(GROW_END, t0 + dur * (0.9 + rnd() * 0.3));
    branches.push({ x0: x, y0: y, cx, cy, x1, y1, width, depth, g0: t0, g1 });

    if (depth >= 3) {
      const n = depth >= MAX_DEPTH ? 3 : 1 + Math.floor(rnd() * 2);
      for (let i = 0; i < n; i++) {
        const along = depth >= MAX_DEPTH ? 0.7 + rnd() * 0.35 : 0.35 + rnd() * 0.6;
        const px = x + (x1 - x) * along + (rnd() - 0.5) * 0.05;
        const py = y + (y1 - y) * along + (rnd() - 0.5) * 0.05;
        blossoms.push({
          x: px,
          y: py,
          r: 0.022 + rnd() * 0.016,
          rot: rnd() * Math.PI * 2,
          tone: Math.floor(rnd() * BLOSSOM_TONES.length),
          open: GROW_END * 0.75 + rnd() * (SEASON_BLOOM - GROW_END * 0.75 - 0.02),
          drop: 0.53 + rnd() * 0.29,
          fruit: rnd() < 0.16,
          dropped: false,
          depth
        });
      }
    }
    if (depth >= MAX_DEPTH) return;

    const kids = depth < 2 ? 2 : rnd() < 0.3 ? 3 : 2;
    for (let i = 0; i < kids; i++) {
      const spread = 0.32 + rnd() * 0.28;
      const side = kids === 2 ? (i === 0 ? -1 : 1) : i - 1;
      // Hafif yukarı eğilim: dallar ışığa uzanır
      const a = angle + side * spread + (rnd() - 0.5) * 0.2 + (-Math.PI / 2 - angle) * 0.12;
      grow(x1, y1, a, len * (0.7 + rnd() * 0.12), width * 0.68, depth + 1, g1 - dur * 0.15);
    }
  };

  grow(0, 0, -Math.PI / 2 + 0.04, 0.32, 0.075, 0, 0);

  // Sınır kutusu: kutuya oturtmak için
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  for (const b of branches) {
    minX = Math.min(minX, b.x1, b.cx);
    maxX = Math.max(maxX, b.x1, b.cx);
    minY = Math.min(minY, b.y1, b.cy);
  }
  // Uçlardan aşağı doğru sırala: çiçekler kalın dalların önünde dursun
  blossoms.sort((a, b) => a.depth - b.depth);
  return { branches, blossoms, bounds: { minX: minX - 0.05, maxX: maxX + 0.05, minY: minY - 0.05 } };
}

function quadPoint(b: Branch, t: number) {
  const u = 1 - t;
  return {
    x: u * u * b.x0 + 2 * u * t * b.cx + t * t * b.x1,
    y: u * u * b.y0 + 2 * u * t * b.cy + t * t * b.y1
  };
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number, fill: string, open: number) {
  if (r < 0.4) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = fill;
  const pr = r * (0.45 + 0.55 * open);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * pr * 0.55, Math.sin(a) * pr * 0.55, pr * 0.58, pr * 0.42 * (0.5 + open * 0.5), a, 0, Math.PI * 2);
    ctx.fill();
  }
  if (open > 0.4) {
    ctx.fillStyle = '#D9677F';
    ctx.globalAlpha *= (open - 0.4) / 0.6;
    ctx.beginPath();
    ctx.arc(0, 0, pr * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.flutter)));
  ctx.fillStyle = PETAL_TONES[p.tone];
  ctx.beginPath();
  ctx.moveTo(0, -p.size);
  ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.6, p.size * 0.7, p.size * 0.8, 0, p.size);
  ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.8, -p.size * 0.9, -p.size * 0.6, 0, -p.size);
  ctx.fill();
  ctx.restore();
}

export interface TreeEngine {
  draw: (ctx: CanvasRenderingContext2D, size: CanvasSize, box: TreeBox, season: number, time: number, dt: number) => void;
  /** Dokunuş/sürükleme: (x,y) noktasında (vx,vy) yönünde esinti. */
  gust: (x: number, y: number, vx: number, vy: number) => void;
}

export function createTree(animated: boolean, seed = 20261105): TreeEngine {
  const tree = buildTree(seed);
  const petals: Petal[] = [];
  const rnd = mulberry32(seed ^ 0x9e3779b9);
  let gx = 0;
  let gy = 0;
  let gustX = -1;
  let gustY = -1;
  let gustPow = 0;
  let lastSeason = 0;
  let spawnAcc = 0;
  let lastSeasonDraw = 0;
  let lastBox: { ox: number; oy: number; scale: number } | null = null;

  const spawn = (x: number, y: number, unit: number, burst: boolean) => {
    if (petals.length > 220) return;
    petals.push({
      x,
      y,
      vx: (rnd() - 0.5) * (burst ? 140 : 20),
      vy: burst ? -40 - rnd() * 60 : 10 + rnd() * 20,
      rot: rnd() * Math.PI * 2,
      spin: (rnd() - 0.5) * 4,
      size: unit * (0.011 + rnd() * 0.008),
      tone: Math.floor(rnd() * PETAL_TONES.length),
      flutter: rnd() * Math.PI * 2,
      life: 0
    });
  };

  const draw: TreeEngine['draw'] = (ctx, size, box, season, time, dt) => {
    const { w, h } = size;
    ctx.clearRect(0, 0, w, h);
    const bw = tree.bounds.maxX - tree.bounds.minX;
    const bh = -tree.bounds.minY;
    const scale = Math.min(box.w / bw, box.h / bh);
    const ox = box.x + box.w / 2 - ((tree.bounds.minX + tree.bounds.maxX) / 2) * scale;
    const oy = box.y + box.h;
    const unit = scale;
    lastBox = { ox, oy, scale };
    lastSeasonDraw = season;

    // Rüzgâr: sürekli esinti + sönümlenen dokunuş esintisi
    const breeze = animated ? Math.sin(time * 0.7) * 0.6 + Math.sin(time * 1.9 + 1) * 0.25 : 0;
    gx *= Math.pow(0.12, dt);
    gy *= Math.pow(0.12, dt);
    gustPow *= Math.pow(0.05, dt);
    const sway = (breeze * 0.012 + gx * 0.00012) * unit;
    const swayAt = (yUnit: number) => {
      const k = Math.max(0, -yUnit) / bh;
      return sway * k * k;
    };
    const P = (x: number, y: number) => ({ x: ox + x * scale + swayAt(y), y: oy + y * scale });

    // Zemin gölgesi
    ctx.save();
    ctx.fillStyle = 'rgba(120,70,80,0.10)';
    ctx.beginPath();
    ctx.ellipse(ox, oy + 2, bw * scale * 0.38, unit * 0.025, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Dallar
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#5E3B3E';
    for (const b of tree.branches) {
      const g = clamp01((season - b.g0) / (b.g1 - b.g0));
      if (g <= 0) continue;
      const steps = 6;
      ctx.lineWidth = Math.max(0.8, b.width * scale * (1 - 0.15 * g));
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const q = quadPoint(b, (i / steps) * g);
        const p = P(q.x, q.y);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Çiçekler / kiraz
    const fallen = season > lastSeason;
    for (const f of tree.blossoms) {
      const p = P(f.x, f.y);
      const open = smooth((season - f.open) / 0.08);
      if (open <= 0) continue;
      const r = f.r * scale;
      if (season < f.drop) {
        f.dropped = false;
        ctx.globalAlpha = 0.92;
        drawFlower(ctx, p.x, p.y, r * (0.35 + 0.65 * open), f.rot + Math.sin(time + f.x * 9) * 0.1, BLOSSOM_TONES[f.tone], open);
        ctx.globalAlpha = 1;
      } else {
        if (!f.dropped && fallen && animated) for (let i = 0; i < 3; i++) spawn(p.x, p.y, unit, false);
        f.dropped = true;
        // Dökülürken kısa bir solma
        const fade = 1 - clamp01((season - f.drop) / 0.04);
        if (fade > 0) {
          ctx.globalAlpha = fade * 0.9;
          drawFlower(ctx, p.x, p.y, r, f.rot, BLOSSOM_TONES[f.tone], 1);
          ctx.globalAlpha = 1;
        }
        const fr = smooth((season - Math.max(0.82, f.drop)) / 0.1);
        if (f.fruit && fr > 0) {
          const cr = r * 0.42 * fr;
          ctx.strokeStyle = '#6E7F4A';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.quadraticCurveTo(p.x + cr, p.y + cr * 1.5, p.x + cr * 0.7, p.y + cr * 3);
          ctx.moveTo(p.x, p.y);
          ctx.quadraticCurveTo(p.x - cr, p.y + cr * 1.2, p.x - cr * 1.2, p.y + cr * 2.6);
          ctx.stroke();
          ctx.fillStyle = '#C2324F';
          for (const [dx, dy] of [
            [0.7, 3],
            [-1.2, 2.6]
          ]) {
            ctx.beginPath();
            ctx.arc(p.x + cr * dx, p.y + cr * dy + cr, cr, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.strokeStyle = '#5E3B3E';
        }
      }
    }
    lastSeason = season;

    if (!animated) {
      // Statik kare: birkaç süzülen yaprak (deterministik)
      const r2 = mulberry32(seed + 7);
      for (let i = 0; i < 18; i++) {
        drawPetal(ctx, {
          x: r2() * w,
          y: box.y + r2() * (box.h * 1.05),
          vx: 0,
          vy: 0,
          rot: r2() * 6,
          spin: 0,
          size: unit * (0.011 + r2() * 0.008),
          tone: Math.floor(r2() * PETAL_TONES.length),
          flutter: 1 + r2(),
          life: 0
        });
      }
      return;
    }

    // Ortam yaprakları: tam çiçekte az, dökülme mevsiminde çok
    const bloomFactor = season >= GROW_END ? (season < 0.52 ? 0.6 : season < 0.85 ? 2.4 : 0.8) : 0;
    spawnAcc += dt * 3 * bloomFactor;
    while (spawnAcc > 1) {
      spawnAcc -= 1;
      const live = tree.blossoms.filter((b) => season >= b.open && season < b.drop);
      const src = live.length ? live[Math.floor(rnd() * live.length)] : null;
      if (src) {
        const p = P(src.x, src.y);
        spawn(p.x, p.y, unit, false);
      } else {
        spawn(rnd() * w, -10, unit, false);
      }
    }

    const ground = oy + unit * 0.02;
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.life += dt;
      // Dokunuş esintisi: yakındaki yaprakları savurur
      if (gustPow > 1) {
        const dx = p.x - gustX;
        const dy = p.y - gustY;
        const d2 = dx * dx + dy * dy;
        const R = Math.max(90, w * 0.35);
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const k = (1 - d / R) * gustPow * dt * 0.05;
          p.vx += (dx / d) * k * 40 + gx * k * 0.2;
          p.vy += (dy / d) * k * 40 + gy * k * 0.2;
          p.spin += (rnd() - 0.5) * k * 0.4;
        }
      }
      const wind = breeze * 22 + gx * 0.15;
      p.vx += (wind - p.vx) * dt * 0.8;
      p.vy += (28 - p.vy) * dt * 0.9 + gy * 0.02 * dt;
      p.flutter += dt * (2.5 + p.size * 0.1);
      p.x += (p.vx + Math.sin(p.flutter) * 14) * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      if (p.y > ground && p.y < ground + 30 && p.x > box.x && p.x < box.x + box.w && Math.abs(p.vx) < 60) {
        p.vy = 0;
        p.vx *= 0.9;
        p.y = ground + rnd() * 6;
        p.spin *= 0.5;
      }
      if (p.y > h + 20 || p.x < -40 || p.x > w + 40 || p.life > 22) {
        petals.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = Math.min(1, p.life * 3) * (p.life > 18 ? (22 - p.life) / 4 : 1);
      drawPetal(ctx, p);
    }
    ctx.globalAlpha = 1;
  };

  const gust: TreeEngine['gust'] = (x, y, vx, vy) => {
    gustX = x;
    gustY = y;
    gx = Math.max(-900, Math.min(900, gx + vx));
    gy = Math.max(-900, Math.min(900, gy + vy));
    gustPow = Math.min(2400, gustPow + 600 + Math.hypot(vx, vy) * 1.5);
    // Esinti çiçeklerden de bir avuç yaprak koparır; dokunuş noktasına en yakın açık çiçekler
    const sx = vx === 0 ? (rnd() - 0.5) * 2 : Math.sign(vx);
    if (lastBox) {
      const lb = lastBox;
      const near = tree.blossoms
        .filter((b) => lastSeasonDraw >= b.open && lastSeasonDraw < b.drop)
        .map((b) => ({ px: lb.ox + b.x * lb.scale, py: lb.oy + b.y * lb.scale }))
        .sort((a, b) => Math.hypot(a.px - x, a.py - y) - Math.hypot(b.px - x, b.py - y))
        .slice(0, 24);
      for (const n of near) {
        petals.push({
          x: n.px,
          y: n.py,
          vx: sx * (60 + rnd() * 200),
          vy: -30 - rnd() * 90,
          rot: rnd() * 6,
          spin: (rnd() - 0.5) * 8,
          size: lb.scale * (0.012 + rnd() * 0.008),
          tone: Math.floor(rnd() * PETAL_TONES.length),
          flutter: rnd() * 6,
          life: 0
        });
      }
    }
    for (let i = 0; i < 8; i++) {
      petals.push({
        x: x + (rnd() - 0.5) * 60,
        y: y + (rnd() - 0.5) * 60,
        vx: sx * (80 + rnd() * 160),
        vy: -60 - rnd() * 120,
        rot: rnd() * 6,
        spin: (rnd() - 0.5) * 8,
        size: 4 + rnd() * 3,
        tone: Math.floor(rnd() * PETAL_TONES.length),
        flutter: rnd() * 6,
        life: 0
      });
    }
    if (petals.length > 260) petals.splice(0, petals.length - 260);
  };

  return { draw, gust };
}

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

export type DrawFn = (ctx: CanvasRenderingContext2D, size: CanvasSize, time: number, dt: number) => void;

/**
 * Tek canvas döngüsü. `animate` kapalıyken rAF kurulmaz: sahne bir kez,
 * sonra yalnızca boyut veya `invalidate` değişince çizilir. Unmount'ta
 * rAF, gözlemci ve abonelik temizlenir.
 */
export function useCanvasLoop(ref: RefObject<HTMLCanvasElement | null>, draw: DrawFn, animate: boolean, invalidate?: MotionValue<number>) {
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let size = fitCanvas(canvas, ctx);
    let raf = 0;
    let last = performance.now();
    const still = () => drawRef.current(ctx, size, 0, 0);
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      drawRef.current(ctx, size, now / 1000, dt);
      raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      size = fitCanvas(canvas, ctx);
      if (!animate) still();
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(canvas);
    else window.addEventListener('resize', onResize);
    const unsubscribe = !animate && invalidate ? invalidate.on('change', still) : undefined;
    if (animate) raf = requestAnimationFrame(frame);
    else still();
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener('resize', onResize);
      unsubscribe?.();
    };
  }, [ref, animate, invalidate]);
}
