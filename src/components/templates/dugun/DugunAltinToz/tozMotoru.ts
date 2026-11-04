/**
 * Altın toz parçacık motoru — Canvas 2D, ek paket yok.
 *
 * Her parçacık bir hedefe yay kuvvetiyle çekilir ve sönümlenir; hedefler bir
 * metnin piksellerinden örneklenir. Hedef yoksa parçacıklar yavaşça süzülen
 * toza döner. Konumlar `Float32Array`'lerde tutulur (kare başına nesne yok).
 */

export interface TextLayout {
  lines: string[];
  /** CSS px. */
  fontSize: number;
  lineHeight: number;
  /** Bloğun merkezi (CSS px, tuvale göre). */
  centerY: number;
  font: string;
}

const GOLDS = ['#FFE7A3', '#F4C76B', '#E2A93B', '#FFF3CF', '#C98E2B'];

/** Genişliğe sığan yazı boyu ile satır düzeni. */
export function fitText(ctx: CanvasRenderingContext2D, lines: string[], width: number, maxSize: number, family: string, centerY: number): TextLayout {
  let size = maxSize;
  const font = (s: number) => `italic 500 ${s}px ${family}`;
  for (; size > 18; size -= 2) {
    ctx.font = font(size);
    if (lines.every((l) => ctx.measureText(l).width <= width)) break;
  }
  return { lines, fontSize: size, lineHeight: size * 1.05, centerY, font: font(size) };
}

/** Yazının piksellerinden en çok `max` hedef nokta (CSS px). */
export function sampleText(layout: TextLayout, width: number, height: number, max: number): Float32Array {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Float32Array(0);
  ctx.fillStyle = '#fff';
  ctx.font = layout.font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const n = layout.lines.length;
  layout.lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, layout.centerY + (i - (n - 1) / 2) * layout.lineHeight);
  });
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let filled = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) filled++;
  const gap = Math.max(1, Math.floor(Math.sqrt(filled / max)));
  const pts: number[] = [];
  for (let y = 0; y < canvas.height; y += gap) {
    for (let x = 0; x < canvas.width; x += gap) {
      if (data[(y * canvas.width + x) * 4 + 3] > 128) pts.push(x + (Math.random() - 0.5) * gap, y + (Math.random() - 0.5) * gap);
    }
  }
  return new Float32Array(pts);
}

export class DustField {
  readonly count: number;
  private x: Float32Array;
  private y: Float32Array;
  private vx: Float32Array;
  private vy: Float32Array;
  private tx: Float32Array;
  private ty: Float32Array;
  private bound: Uint8Array;
  private phase: Float32Array;
  private size: Float32Array;
  private color: Uint8Array;
  private w = 1;
  private h = 1;
  /** 0..1: yazı oturduktan sonra parçacıkların sönme oranı (HTML yazı öne geçer). */
  settle = 0;

  constructor(count: number, w: number, h: number) {
    this.count = count;
    this.x = new Float32Array(count);
    this.y = new Float32Array(count);
    this.vx = new Float32Array(count);
    this.vy = new Float32Array(count);
    this.tx = new Float32Array(count);
    this.ty = new Float32Array(count);
    this.bound = new Uint8Array(count);
    this.phase = new Float32Array(count);
    this.size = new Float32Array(count);
    this.color = new Uint8Array(count);
    this.resize(w, h);
    for (let i = 0; i < count; i++) {
      this.phase[i] = Math.random() * Math.PI * 2;
      this.size[i] = 0.7 + Math.random() * 1.3;
      this.color[i] = Math.floor(Math.random() * GOLDS.length);
      this.x[i] = Math.random() * w;
      this.y[i] = Math.random() * h;
    }
  }

  resize(w: number, h: number) {
    this.w = w;
    this.h = h;
  }

  /** Açılış: bütün toz tek noktadan patlar. */
  burst(cx: number, cy: number) {
    for (let i = 0; i < this.count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 4 + Math.random() * 16;
      this.x[i] = cx;
      this.y[i] = cy;
      this.vx[i] = Math.cos(a) * s;
      this.vy[i] = Math.sin(a) * s;
    }
  }

  /** Hedef noktalar; `null` → dağınık toz. */
  setTargets(points: Float32Array | null) {
    const n = points ? points.length / 2 : 0;
    for (let i = 0; i < this.count; i++) {
      if (n > 0 && i < n * 1.15) {
        const k = i % n;
        this.tx[i] = points![k * 2] + (i >= n ? (Math.random() - 0.5) * 3 : 0);
        this.ty[i] = points![k * 2 + 1] + (i >= n ? (Math.random() - 0.5) * 3 : 0);
        this.bound[i] = 1;
      } else {
        this.tx[i] = Math.random() * this.w;
        this.ty[i] = Math.random() * this.h;
        this.bound[i] = 0;
      }
      // Yeni yazıya geçerken küçük bir savrulma.
      this.vx[i] += (Math.random() - 0.5) * 6;
      this.vy[i] += (Math.random() - 0.5) * 6;
    }
  }

  /** Hareket olmadan doğrudan hedefe oturur (hareketi azalt). */
  snap() {
    this.x.set(this.tx);
    this.y.set(this.ty);
    this.vx.fill(0);
    this.vy.fill(0);
  }

  step(dt: number, time: number) {
    const k = 0.045 * dt * 60;
    const damp = Math.pow(0.86, dt * 60);
    for (let i = 0; i < this.count; i++) {
      const pull = this.bound[i] ? k : k * 0.08;
      this.vx[i] = (this.vx[i] + (this.tx[i] - this.x[i]) * pull + Math.sin(time * 0.9 + this.phase[i]) * 0.04) * damp;
      this.vy[i] = (this.vy[i] + (this.ty[i] - this.y[i]) * pull + Math.cos(time * 0.7 + this.phase[i]) * 0.04) * damp;
      this.x[i] += this.vx[i] * dt * 60;
      this.y[i] += this.vy[i] * dt * 60;
      if (!this.bound[i] && Math.abs(this.tx[i] - this.x[i]) + Math.abs(this.ty[i] - this.y[i]) < 4) {
        this.tx[i] = Math.random() * this.w;
        this.ty[i] = Math.random() * this.h;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, dpr: number, time: number) {
    ctx.clearRect(0, 0, this.w * dpr, this.h * dpr);
    ctx.globalCompositeOperation = 'lighter';
    for (let c = 0; c < GOLDS.length; c++) {
      ctx.fillStyle = GOLDS[c];
      for (let i = 0; i < this.count; i++) {
        if (this.color[i] !== c) continue;
        const tw = 0.55 + 0.45 * Math.sin(time * 3 + this.phase[i] * 3);
        const fade = this.bound[i] ? 1 - this.settle * 0.65 : 0.45;
        ctx.globalAlpha = tw * fade;
        const s = this.size[i] * dpr;
        ctx.fillRect(this.x[i] * dpr - s / 2, this.y[i] * dpr - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
}
