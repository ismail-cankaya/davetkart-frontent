import { canvasLayer, createStage } from '../lib/stage';
import { clamp, glowSprite, rng } from '../lib/glsl';
import type { SceneDef } from '../lib/types';
import * as THREE from 'three';

/**
 * Havai Fişek — gece şehir silüeti üzerinde patlayan fişekler; körfez suyu
 * patlamaları dalgalı bir ayna gibi yansıtır. Canvas 2D ile çizilir, bloom ve
 * gren efekt zincirinden geçer. Patlama takvimi tohumlu: her çalıştırmada aynı.
 */
const D = 12;
const G = 0.16; // yerçekimi (yükseklik birimi / sn²)
const DRAG = 1.25;

type Kind = 'peony' | 'willow' | 'ring' | 'crackle';
interface Burst {
  t0: number;
  x: number;
  y: number;
  launchX: number;
  kind: Kind;
  colors: [number, number, number][];
  n: number;
  speed: number;
  life: number;
  seed: number;
}

const PALETTES: [number, number, number][][] = [
  [[255, 214, 140], [255, 170, 80]],
  [[255, 90, 150], [255, 200, 230]],
  [[120, 200, 255], [220, 240, 255]],
  [[190, 120, 255], [255, 160, 240]],
  [[120, 255, 190], [255, 245, 170]],
  [[255, 120, 90], [255, 220, 120]]
];

function schedule(portrait: boolean): Burst[] {
  const r = rng(2026);
  const out: Burst[] = [];
  const kinds: Kind[] = ['peony', 'willow', 'ring', 'peony', 'crackle', 'peony', 'willow', 'ring', 'peony', 'crackle', 'willow', 'peony', 'ring', 'peony', 'peony', 'willow', 'crackle', 'ring'];
  const count = kinds.length;
  for (let i = 0; i < count; i++) {
    const t0 = (i / count) * D + r() * 0.35;
    const x = portrait ? 0.15 + r() * 0.7 : 0.1 + r() * 0.8;
    const y = portrait ? 0.2 + r() * 0.3 : 0.16 + r() * 0.28;
    const kind = kinds[i];
    out.push({
      t0,
      x,
      y,
      launchX: x + (r() - 0.5) * 0.06,
      kind,
      colors: PALETTES[Math.floor(r() * PALETTES.length)],
      n: kind === 'ring' ? 64 : kind === 'willow' ? 80 : 96,
      speed: (kind === 'willow' ? 0.34 : 0.42) * (0.8 + r() * 0.45) * (portrait ? 0.68 : 1),
      life: kind === 'willow' ? 3.6 : 2.6,
      seed: Math.floor(r() * 1e6)
    });
  }
  return out;
}

const LAUNCH = 0.7;

const scene: SceneDef = {
  duration: D,
  fps: 24,
  loop: true,
  poster: 6.35,
  setup(ctx) {
    const { width: W, height: H } = ctx;
    const portrait = ctx.variant === 'mobile';
    const stage = createStage(ctx, {
      toneMapping: THREE.NoToneMapping,
      bloom: { strength: 1.1, threshold: 0.55, radius: 1 },
      vignette: 0.35,
      grain: 0
    });
    const layer = canvasLayer(W, H);
    const g = layer.g;
    const U = H; // birim: yükseklik
    const horizon = portrait ? 0.74 : 0.7;
    const bursts = schedule(portrait);

    // Sabit katmanlar bir kez çizilir: gök, silüet (+pencereler ayrı).
    const sky = document.createElement('canvas');
    sky.width = W;
    sky.height = H;
    const sg = sky.getContext('2d')!;
    const grad = sg.createLinearGradient(0, 0, 0, H * horizon);
    grad.addColorStop(0, '#04030f');
    grad.addColorStop(0.55, '#0d0a2a');
    grad.addColorStop(0.85, '#2a1640');
    grad.addColorStop(1, '#5a2a4a');
    sg.fillStyle = grad;
    sg.fillRect(0, 0, W, H);
    const sr = rng(7);
    for (let i = 0; i < 260; i++) {
      const x = sr() * W, y = sr() * H * horizon * 0.85, a = sr() * 0.6;
      sg.fillStyle = `rgba(255,250,235,${a})`;
      sg.fillRect(x, y, sr() < 0.1 ? 2 : 1, sr() < 0.1 ? 2 : 1);
    }

    const city = document.createElement('canvas');
    city.width = W;
    city.height = H;
    const cg = city.getContext('2d')!;
    const br = rng(11);
    interface Win { x: number; y: number; w: number; h: number; ph: number; on: number }
    const windows: Win[] = [];
    const drawRow = (base: number, minH: number, maxH: number, color: string, winAlpha: number) => {
      let x = -10;
      while (x < W + 10) {
        const bw = (0.02 + br() * 0.05) * U;
        const bh = (minH + br() * (maxH - minH)) * U;
        cg.fillStyle = color;
        cg.fillRect(x, base - bh, bw, bh + 2);
        if (br() < 0.25) {
          cg.fillRect(x + bw * 0.4, base - bh - 0.04 * U, bw * 0.12, 0.04 * U); // anten / kule
        }
        if (winAlpha > 0) {
          const cols = Math.max(1, Math.floor(bw / (0.009 * U)));
          const rows = Math.floor(bh / (0.014 * U));
          for (let c = 0; c < cols; c++)
            for (let rr = 1; rr < rows; rr++) {
              if (br() < 0.32) windows.push({ x: x + 3 + c * (bw - 6) / cols, y: base - bh + rr * 0.014 * U, w: Math.max(2, (bw - 6) / cols - 3), h: 0.006 * U, ph: br(), on: winAlpha });
            }
        }
        x += bw + br() * 0.004 * U;
      }
    };
    const base = H * horizon;
    drawRow(base, 0.06, 0.16, '#0c0a1a', 0);
    drawRow(base, 0.03, 0.11, '#07060f', 0.9);
    // Kıyı bandı
    cg.fillStyle = '#05040b';
    cg.fillRect(0, base - 2, W, 0.012 * U);

    const sprites = new Map<string, HTMLCanvasElement>();
    const sprite = (c: [number, number, number]) => {
      const k = c.join(',');
      if (!sprites.has(k)) sprites.set(k, glowSprite(64, c, 0.12, 2.0));
      return sprites.get(k)!;
    };
    const white = glowSprite(64, [255, 250, 235], 0.15, 2.0);
    const haze = glowSprite(128, [255, 200, 220], 0.0, 1.4);

    // Kapalı biçimli parçacık konumu (sürüklenme + yerçekimi).
    const pos = (v: number, a: number, tau: number, x0: number, y0: number): [number, number] => {
      const f = (1 - Math.exp(-DRAG * tau)) / DRAG;
      const vx = Math.cos(a) * v, vy = Math.sin(a) * v;
      const gy = (G / DRAG) * (tau - f);
      return [x0 + vx * f, y0 - vy * f + gy];
    };

    const drawBurst = (b: Burst, tau: number) => {
      // Fırlatma izi
      const lx = b.launchX * W / H; // yatay birim
      if (tau < LAUNCH) {
        const k = tau / LAUNCH;
        const e = 1 - Math.pow(1 - k, 2);
        const y = horizon + (b.y - horizon) * e;
        const x = lx + (b.x * W / H - lx) * e;
        for (let i = 0; i < 6; i++) {
          const yy = y + i * 0.012 * (1 - k * 0.5);
          g.globalAlpha = (1 - i / 6) * 0.8;
          g.drawImage(white, x * U - 6, yy * U - 6, 12, 12);
        }
        return;
      }
      const T = tau - LAUNCH;
      if (T > b.life) return;
      const r = rng(b.seed);
      const x0 = b.x * W / H, y0 = b.y;
      const fade = clamp(1 - T / b.life);
      // Patlama anı: büyük flaş + duman halesi.
      if (T < 0.18) {
        g.globalAlpha = (1 - T / 0.18) * 0.8;
        const s = 0.13 * U;
        g.drawImage(white, x0 * U - s / 2, y0 * U - s / 2, s, s);
      }
      g.globalAlpha = fade * 0.12;
      const hs = (0.25 + T * 0.08) * U;
      g.drawImage(haze, x0 * U - hs / 2, y0 * U - hs / 2, hs, hs);
      // Gökyüzünü boyayan renkli ışık.
      if (T < 1.4) {
        g.globalAlpha = 0.3 * Math.pow(1 - T / 1.4, 2);
        const ls = 1.3 * U;
        g.drawImage(sprite(b.colors[0]), x0 * U - ls / 2, y0 * U - ls / 2, ls, ls);
      }

      for (let i = 0; i < b.n; i++) {
        const a = b.kind === 'ring' ? (i / b.n) * Math.PI * 2 : r() * Math.PI * 2;
        const v = b.kind === 'ring' ? b.speed : b.speed * Math.sqrt(0.15 + r() * 0.85);
        const c = b.colors[i % b.colors.length];
        const tw = b.kind === 'crackle' ? 0.55 + 0.45 * Math.sin(T * 9 + i * 2.3) : 1;
        const life = b.kind === 'willow' ? fade : Math.pow(fade, 1.3);
        const spr = sprite(c);
        // Kuyruk: geçmiş konumlardan sönen noktalar.
        const steps = b.kind === 'willow' ? 7 : 4;
        for (let s = 0; s < steps; s++) {
          const tt = T - s * (b.kind === 'willow' ? 0.07 : 0.03);
          if (tt < 0) break;
          const [px, py] = pos(v, a, tt, x0, y0);
          const size = (b.kind === 'willow' ? 12 : 15) * (1 - s / steps * 0.8) * (U / 1080);
          g.globalAlpha = life * tw * (1 - s / steps);
          g.drawImage(s === 0 && T < 0.6 ? white : spr, px * U - size, py * U - size, size * 2, size * 2);
        }
      }
    };

    // Su: gökyüzü + patlamaları dalgalı şeritlerle aynalar.
    // Yansıma yarım çözünürlükten çizilir: doğal bulanıklık, kodlayıcıya daha az ayrıntı.
    const half = document.createElement('canvas');
    half.width = Math.round(W / 3);
    half.height = Math.round(H / 3);
    const hg = half.getContext('2d')!;
    const drawWater = (t: number) => {
      hg.drawImage(layer.source, 0, 0, half.width, half.height);
      const top = Math.floor(H * horizon) + Math.floor(0.012 * U);
      const hWater = H - top;
      g.globalCompositeOperation = 'source-over';
      g.globalAlpha = 1;
      g.fillStyle = '#04030b';
      g.fillRect(0, top, W, hWater);
      const strip = 6;
      g.globalCompositeOperation = 'lighter';
      for (let y = 0; y < hWater; y += strip) {
        const depth = y / hWater;
        const srcY = top - 0.012 * U - y * 1.35 - 2;
        if (srcY < 0) break;
        const off = Math.sin(y * 0.05 + (t / D) * Math.PI * 2 * 2) * (2 + depth * 10);
        g.globalAlpha = 0.5 * (1 - depth * 0.7);
        g.drawImage(half, 0, srcY / 3, half.width, strip / 3, off, top + y, W, strip);
      }
      g.globalCompositeOperation = 'source-over';
    };

    return {
      render(t) {
        g.globalCompositeOperation = 'source-over';
        g.globalAlpha = 1;
        g.drawImage(sky, 0, 0);
        g.globalCompositeOperation = 'lighter';
        for (const b of bursts) {
          for (const shift of [0, D, -D]) {
            const tau = t - b.t0 + shift;
            if (tau >= 0 && tau < LAUNCH + b.life) drawBurst(b, tau);
          }
        }
        g.globalCompositeOperation = 'source-over';
        g.globalAlpha = 1;
        g.drawImage(city, 0, 0);
        // Pencereler: yavaş yanıp sönen sıcak ışıklar.
        for (const w of windows) {
          const on = 0.55 + 0.45 * Math.sin((t / D) * Math.PI * 2 * (1 + Math.floor(w.ph * 3)) + w.ph * 20);
          g.globalAlpha = w.on * clamp(on) * (w.ph > 0.85 ? 0.4 : 1);
          g.fillStyle = w.ph > 0.6 ? '#ffd9a0' : '#ffe9c4';
          g.fillRect(w.x, w.y, w.w, w.h);
        }
        g.globalAlpha = 1;
        drawWater(t);
        layer.texture.needsUpdate = true;
        stage.render(layer.scene, layer.camera, t);
      }
    };
  }
};

export default scene;
