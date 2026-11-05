import { useCallback, useEffect, useRef, type RefObject } from 'react';

/** Pastel tebeşir renkleri (beyaz + dört pastel). */
export const TEBESIRLER = [
  { id: 'beyaz', ad: 'Beyaz tebeşir', renk: '#F4F1E6' },
  { id: 'pembe', ad: 'Pembe tebeşir', renk: '#F5B9C9' },
  { id: 'mavi', ad: 'Mavi tebeşir', renk: '#A9D6EC' },
  { id: 'sari', ad: 'Sarı tebeşir', renk: '#F6E3A0' },
  { id: 'yesil', ad: 'Yeşil tebeşir', renk: '#BFE6C4' }
] as const;

export type TebesirId = (typeof TEBESIRLER)[number]['id'];

interface Tane {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
  c: string;
}

export interface CanvasSize {
  w: number;
  h: number;
}

/** Canvas'ı kutusuna oturtur; DPR en çok 2. İçerik yeniden boyutta silinir. */
export function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): CanvasSize {
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

const MAX_TANE = 420;

/**
 * Tebeşir tozu: düşen, sönen taneler. Sürekli döngü YOK — rAF yalnızca
 * havada tane varken çalışır, son tane sönünce kendini durdurur.
 * `enabled` kapalıyken (önizleme / azaltılmış hareket) `emit` hiçbir şey yapmaz.
 */
export function useTebesirTozu(ref: RefObject<HTMLCanvasElement | null>, enabled: boolean) {
  const taneler = useRef<Tane[]>([]);
  const raf = useRef(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const size = useRef<CanvasSize>({ w: 1, h: 1 });

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d') ?? null;
    if (!canvas || !ctx || !enabled) return;
    ctxRef.current = ctx;
    size.current = fitCanvas(canvas, ctx);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => (size.current = fitCanvas(canvas, ctx))) : null;
    ro?.observe(canvas);
    return () => {
      ro?.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      taneler.current = [];
      ctxRef.current = null;
    };
  }, [ref, enabled]);

  const tick = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) {
      raf.current = 0;
      return;
    }
    const { w, h } = size.current;
    ctx.clearRect(0, 0, w, h);
    const list = taneler.current;
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.life += 1 / 60;
      p.vy += 0.035;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      const a = 1 - p.life / p.max;
      if (a <= 0 || p.y > h + 4) {
        list.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = a * 0.75;
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.r, p.r);
    }
    ctx.globalAlpha = 1;
    raf.current = list.length ? requestAnimationFrame(tick) : 0;
  }, []);

  return useCallback(
    (x: number, y: number, n: number, c = '#F4F1E6', spread = 4) => {
      if (!enabled || !ctxRef.current) return;
      const list = taneler.current;
      for (let i = 0; i < n && list.length < MAX_TANE; i++) {
        list.push({
          x: x + (Math.random() - 0.5) * spread,
          y: y + (Math.random() - 0.5) * spread,
          vx: (Math.random() - 0.5) * 0.9,
          vy: Math.random() * 0.4 - 0.2,
          life: 0,
          max: 0.6 + Math.random() * 1.1,
          r: 0.6 + Math.random() * 1.6,
          c
        });
      }
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    },
    [enabled, tick]
  );
}

/** Tebeşir çizgisi: düz çizgi yerine pürüzlü, delikli kısa lekeler. */
export function tebesirCiz(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, renk: string) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  const steps = Math.max(1, Math.ceil(len / 1.4));
  ctx.fillStyle = renk;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const x = x0 + dx * t;
    const y = y0 + dy * t;
    for (let k = 0; k < 4; k++) {
      ctx.globalAlpha = 0.35 + Math.random() * 0.55;
      const r = 0.8 + Math.random() * 1.7;
      ctx.fillRect(x + (Math.random() - 0.5) * 4.2, y + (Math.random() - 0.5) * 4.2, r, r);
    }
  }
  ctx.globalAlpha = 1;
}
