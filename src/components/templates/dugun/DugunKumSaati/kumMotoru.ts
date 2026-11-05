import { useEffect, useRef, type RefObject } from 'react';
import type { MotionValue } from 'motion/react';

/** Canvas'ın CSS boyutu (çizim bu birimlerle yapılır; DPR dönüşümü ctx'te). */
export interface CanvasSize {
  w: number;
  h: number;
}

export type DrawFn = (ctx: CanvasRenderingContext2D, size: CanvasSize, time: number, dt: number) => void;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Canvas'ı kutusuna oturtur; devicePixelRatio en çok 2 (telefonlarda bellek/dolgu maliyeti). */
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
 * Tek canvas döngüsü. `animate` kapalıyken (önizleme / azaltılmış hareket)
 * rAF hiç kurulmaz: sahne bir kez çizilir, yalnızca boyut ya da `invalidate`
 * değiştiğinde yeniden çizilir. Unmount'ta rAF, gözlemci ve abonelik temizlenir.
 */
export function useCanvasLoop(
  ref: RefObject<HTMLCanvasElement | null>,
  draw: DrawFn,
  animate: boolean,
  invalidate?: MotionValue<number>
) {
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

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(onResize);
      ro.observe(canvas);
    } else {
      window.addEventListener('resize', onResize);
    }
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

/* ------------------------------------------------------------------ */
/* Kum saati                                                            */
/* ------------------------------------------------------------------ */

interface StreamGrain {
  y: number;
  x: number;
  v: number;
}

/** Deterministik sözde rastgele (statik karede titreme olmasın). */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Kum saati çizicisi. `pour` 0 → bütün kum üst haznede, 1 → tamamı altta.
 * Hazne kesiti sinüs eğrisiyle; kum bölgeleri cam yoluyla kırpılır, böylece
 * kumun kenarı hesaplanmadan camın içine oturur.
 */
export function createHourglass(animated: boolean) {
  const grains: StreamGrain[] = [];
  const rnd = seeded(7);
  const speckles = Array.from({ length: 70 }, () => ({ x: rnd(), y: rnd(), a: 0.25 + rnd() * 0.5 }));

  return (ctx: CanvasRenderingContext2D, { w, h }: CanvasSize, pour: number, time: number, dt: number) => {
    const p = clamp01(pour);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const capH = Math.max(6, h * 0.055);
    const top = capH + 2;
    const bottom = h - capH - 2;
    const mid = h / 2;
    const L = mid - top;
    const W = w * 0.34;
    const n = Math.max(1.6, w * 0.022);
    const halfW = (y: number) => {
      const d = clamp01(Math.abs(y - mid) / L);
      const body = n + (W - n) * Math.pow(Math.sin(Math.min(1, d * 1.2) * (Math.PI / 2)), 0.75);
      const shoulder = d > 0.86 ? 1 - 0.14 * Math.pow((d - 0.86) / 0.14, 2) : 1;
      return body * shoulder;
    };

    // Boyundaki ılık hale
    const glow = ctx.createRadialGradient(cx, mid, 0, cx, mid, W * 1.6);
    glow.addColorStop(0, 'rgba(242,190,100,0.22)');
    glow.addColorStop(1, 'rgba(242,190,100,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Cam yolu
    const glass = new Path2D();
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const y = top + ((bottom - top) * i) / steps;
      const x = cx + halfW(y);
      if (i === 0) glass.moveTo(x, y);
      else glass.lineTo(x, y);
    }
    for (let i = steps; i >= 0; i--) {
      const y = top + ((bottom - top) * i) / steps;
      glass.lineTo(cx - halfW(y), y);
    }
    glass.closePath();

    ctx.fillStyle = 'rgba(255,240,214,0.05)';
    ctx.fill(glass);

    // Kum
    const sand = ctx.createLinearGradient(0, top, 0, bottom);
    sand.addColorStop(0, '#F6D58A');
    sand.addColorStop(0.5, '#E2AE55');
    sand.addColorStop(1, '#B77A2E');

    const topFill = (1 - p) * 0.82 * L;
    const level = mid - topFill;
    const pile = p * 0.8 * L;
    const peak = bottom - pile;

    ctx.save();
    ctx.clip(glass);
    ctx.fillStyle = sand;
    if (topFill > 0.5) {
      ctx.beginPath();
      ctx.moveTo(0, level);
      ctx.quadraticCurveTo(cx, level + Math.min(10, topFill * 0.35), w, level);
      ctx.lineTo(w, mid);
      ctx.lineTo(0, mid);
      ctx.closePath();
      ctx.fill();
    }
    if (pile > 0.5) {
      ctx.beginPath();
      ctx.moveTo(0, bottom);
      ctx.lineTo(0, peak + W * 0.6);
      ctx.lineTo(cx, peak);
      ctx.lineTo(w, peak + W * 0.6);
      ctx.lineTo(w, bottom);
      ctx.closePath();
      ctx.fill();
    }
    // Kum dokusu: sabit parıltı noktaları, yalnız kumun üstünde görünür
    for (const s of speckles) {
      const y = top + s.y * (bottom - top);
      const inTop = y > level + 3 && y < mid;
      const inBottom = y > peak + W * 0.35 && y < bottom;
      if (!inTop && !inBottom) continue;
      const x = cx + (s.x * 2 - 1) * halfW(y) * 0.9;
      ctx.fillStyle = `rgba(255,244,214,${s.a})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Akan ince kum hattı
    const flowing = topFill > 0.5 && p < 0.999;
    if (flowing) {
      ctx.fillStyle = 'rgba(246,213,138,0.55)';
      ctx.fillRect(cx - 0.6, mid, 1.2, peak - mid);
      if (animated) {
        if (grains.length < 26 && dt > 0) grains.push({ y: mid, x: (Math.random() - 0.5) * 1.6, v: 30 + Math.random() * 40 });
        ctx.fillStyle = '#FFE6AA';
        for (let i = grains.length - 1; i >= 0; i--) {
          const g = grains[i];
          g.v += 420 * dt;
          g.y += g.v * dt;
          if (g.y >= peak) {
            grains.splice(i, 1);
            continue;
          }
          ctx.fillRect(cx + g.x - 0.7, g.y, 1.4, 1.4);
        }
        // Tepede sıçrayan birkaç tane
        const bounce = Math.sin(time * 9) * 2;
        ctx.fillRect(cx - 3 + bounce, peak - 1.5, 1.2, 1.2);
      }
    } else {
      grains.length = 0;
    }
    ctx.restore();

    // Cam kenarı + parlama
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(255,236,200,0.45)';
    ctx.stroke(glass);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,250,235,0.18)';
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) {
      const y = top + 8 + ((L - 18) * i) / 12;
      const x = cx - halfW(y) * 0.72;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Ahşap/pirinç çerçeve
    const capW = W * 2 + 18;
    const brass = ctx.createLinearGradient(0, 0, 0, capH);
    brass.addColorStop(0, '#F3D08A');
    brass.addColorStop(1, '#9A6A2C');
    ctx.fillStyle = brass;
    ctx.fillRect(cx - capW / 2, 0, capW, capH);
    ctx.save();
    ctx.translate(0, h);
    ctx.scale(1, -1);
    ctx.fillRect(cx - capW / 2, 0, capW, capH);
    ctx.restore();
    ctx.fillStyle = '#6E4A22';
    for (const side of [-1, 1]) ctx.fillRect(cx + side * (W + 5) - 1.5, capH, 3, h - capH * 2);
  };
}

/* ------------------------------------------------------------------ */
/* Arka plan: süzülen altın kum taneleri                               */
/* ------------------------------------------------------------------ */

interface Dust {
  x: number;
  y: number;
  vy: number;
  r: number;
  a: number;
  ph: number;
}

/** Arka planda yavaşça süzülen altın tanecikler; kaydırma hızlandırır. */
export function createDustField() {
  let dust: Dust[] = [];
  let area = 0;

  const seed = (w: number, h: number) => {
    const count = Math.round(Math.min(110, Math.max(30, (w * h) / 9000)));
    dust = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vy: 6 + Math.random() * 16,
      r: 0.6 + Math.random() * 1.4,
      a: 0.25 + Math.random() * 0.55,
      ph: Math.random() * Math.PI * 2
    }));
    area = w * h;
  };

  return (ctx: CanvasRenderingContext2D, { w, h }: CanvasSize, time: number, dt: number, speed: number) => {
    if (Math.abs(w * h - area) > area * 0.25 || dust.length === 0) seed(w, h);
    ctx.clearRect(0, 0, w, h);
    for (const d of dust) {
      d.y += d.vy * dt * speed;
      d.x += Math.sin(time * 0.6 + d.ph) * 6 * dt;
      if (d.y > h + 4) {
        d.y = -4;
        d.x = Math.random() * w;
      }
      if (d.x < -4) d.x = w + 4;
      else if (d.x > w + 4) d.x = -4;
      const tw = 0.65 + 0.35 * Math.sin(time * 2 + d.ph);
      ctx.fillStyle = `rgba(242,197,102,${d.a * tw})`;
      ctx.fillRect(d.x, d.y, d.r, d.r);
    }
  };
}
