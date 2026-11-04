import * as THREE from 'three';
import { canvasLayer, createStage } from '../lib/stage';
import { glowSprite, rng } from '../lib/glsl';
import type { SceneDef } from '../lib/types';

/**
 * Gece Yasemini — ay ışığında bir bahçe duvarı: kadrajın kenarlarından
 * sarkan sarmaşıklarda beyaz yaseminler nefes alır gibi açılıp kapanır,
 * kopan taç yapraklar süzülür, ateş böcekleri yavaşça dolaşır. Orta açık.
 */
const D = 12;
const TAU = Math.PI * 2;

interface Flower { x: number; y: number; s: number; rot: number; ph: number; depth: number }
interface Leaf { x: number; y: number; s: number; rot: number; shade: number }

function drawFlower(g: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, open: number, alpha: number) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.globalAlpha = alpha;
  for (let i = 0; i < 5; i++) {
    g.save();
    g.rotate((i / 5) * TAU + (1 - open) * 0.5);
    const len = size * (0.55 + 0.45 * open);
    const wid = size * 0.32 * (0.6 + 0.4 * open);
    const grad = g.createLinearGradient(0, 0, 0, -len);
    grad.addColorStop(0, '#f3efe0');
    grad.addColorStop(0.6, '#fffdf6');
    grad.addColorStop(1, '#e7e6f2');
    g.fillStyle = grad;
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(wid, -len * 0.35, wid * 0.9, -len * 0.9, wid * 0.15, -len);
    g.quadraticCurveTo(0, -len * 1.05, -wid * 0.15, -len);
    g.bezierCurveTo(-wid * 0.9, -len * 0.9, -wid, -len * 0.35, 0, 0);
    g.fill();
    g.restore();
  }
  g.fillStyle = '#f2d98a';
  g.beginPath();
  g.arc(0, 0, size * 0.09, 0, TAU);
  g.fill();
  g.restore();
}

const scene: SceneDef = {
  duration: D,
  fps: 24,
  loop: true,
  poster: 5,
  setup(ctx) {
    const { width: W, height: H } = ctx;
    const portrait = ctx.variant === 'mobile';
    const stage = createStage(ctx, {
      toneMapping: THREE.NoToneMapping,
      bloom: { strength: 0.7, threshold: 0.62, radius: 1 },
      vignette: 0.5,
      grain: 0.005
    });
    const layer = canvasLayer(W, H);
    const g = layer.g;
    const U = Math.min(W, H);
    const r = rng(1406);

    // Kümelerin merkezleri: yatayda sol/sağ ve üst köşeler; dikeyde üst ve alt.
    const clusters: [number, number, number][] = portrait
      ? [[0.0, 0.05, 0.55], [1.0, 0.1, 0.5], [0.0, 0.95, 0.5], [1.0, 0.9, 0.55], [0.5, -0.03, 0.4]]
      : [[0.0, 0.1, 0.42], [1.0, 0.12, 0.4], [0.02, 0.9, 0.36], [0.98, 0.88, 0.38], [0.25, -0.04, 0.3], [0.75, -0.03, 0.3]];

    // Zemin + ay + sarmaşık/yaprak katmanı (durağan, bir kez).
    const bg = document.createElement('canvas');
    bg.width = W;
    bg.height = H;
    const b = bg.getContext('2d')!;
    const sky = b.createRadialGradient(W * 0.68, H * 0.22, 0, W * 0.6, H * 0.4, Math.max(W, H) * 0.9);
    sky.addColorStop(0, '#1d3b40');
    sky.addColorStop(0.35, '#0c2226');
    sky.addColorStop(1, '#030a0c');
    b.fillStyle = sky;
    b.fillRect(0, 0, W, H);
    const moon = b.createRadialGradient(W * 0.68, H * 0.2, 0, W * 0.68, H * 0.2, U * 0.5);
    moon.addColorStop(0, 'rgba(220,235,230,0.22)');
    moon.addColorStop(1, 'rgba(220,235,230,0)');
    b.fillStyle = moon;
    b.fillRect(0, 0, W, H);

    const leaves: Leaf[] = [];
    const flowers: Flower[] = [];
    for (const [cx, cy, rad] of clusters) {
      // Kıvrık sarmaşıklar
      for (let v = 0; v < 6; v++) {
        b.strokeStyle = 'rgba(20,40,30,0.9)';
        b.lineWidth = U * 0.004;
        b.beginPath();
        let x = cx * W, y = cy * H;
        b.moveTo(x, y);
        const ang = Math.atan2(0.5 * H - y, 0.5 * W - x) + (r() - 0.5) * 1.6;
        for (let k = 0; k < 8; k++) {
          const step = rad * U * 0.14;
          const a = ang + Math.sin(k * 0.9 + v) * 0.7;
          const nx = x + Math.cos(a) * step, ny = y + Math.sin(a) * step;
          b.quadraticCurveTo(x + Math.cos(a + 0.6) * step, y + Math.sin(a + 0.6) * step, nx, ny);
          x = nx;
          y = ny;
          if (r() < 0.9) leaves.push({ x, y, s: U * (0.02 + r() * 0.025), rot: r() * TAU, shade: r() });
          if (r() < 0.55) flowers.push({ x: x / W + (r() - 0.5) * 0.03, y: y / H + (r() - 0.5) * 0.03, s: U * (0.016 + r() * 0.018), rot: r() * TAU, ph: r() * TAU, depth: 1 });
        }
        b.stroke();
      }
      // Yoğun yaprak kümesi
      for (let i = 0; i < 70; i++) {
        const a = r() * TAU, d = Math.sqrt(r()) * rad;
        leaves.push({ x: cx * W + Math.cos(a) * d * U * 0.9, y: cy * H + Math.sin(a) * d * U * 0.9, s: U * (0.025 + r() * 0.03), rot: r() * TAU, shade: r() });
        if (r() < 0.45) flowers.push({ x: cx + (Math.cos(a) * d * U * 0.85) / W, y: cy + (Math.sin(a) * d * U * 0.85) / H, s: U * (0.018 + r() * 0.02), rot: r() * TAU, ph: r() * TAU, depth: 1 });
      }
    }
    for (const L of leaves) {
      b.save();
      b.translate(L.x, L.y);
      b.rotate(L.rot);
      const lg = b.createLinearGradient(-L.s, 0, L.s, 0);
      const base = 18 + L.shade * 22;
      lg.addColorStop(0, `rgb(${base * 0.5},${base * 1.4},${base * 1.1})`);
      lg.addColorStop(1, `rgb(${base * 0.8},${base * 2.4},${base * 1.9})`);
      b.fillStyle = lg;
      b.beginPath();
      b.moveTo(-L.s, 0);
      b.quadraticCurveTo(0, -L.s * 0.55, L.s, 0);
      b.quadraticCurveTo(0, L.s * 0.55, -L.s, 0);
      b.fill();
      // Ay ışığı kenar parlaması
      b.strokeStyle = 'rgba(170,220,200,0.18)';
      b.lineWidth = 1;
      b.stroke();
      b.restore();
    }

    // Ön plan: büyük, odak dışı çiçekler (bulanık sprite).
    const bokehFlower = document.createElement('canvas');
    bokehFlower.width = bokehFlower.height = 256;
    const bf = bokehFlower.getContext('2d')!;
    bf.filter = 'blur(10px)';
    drawFlower(bf, 128, 128, 90, 0.3, 1, 0.85);
    const near = portrait
      ? [[0.05, 0.22, 1.1], [0.95, 0.78, 1.25], [0.9, 0.06, 0.8]]
      : [[0.04, 0.3, 1.1], [0.96, 0.7, 1.3], [0.12, 0.95, 0.9]];

    const glowSoft = glowSprite(128, [220, 255, 190], 0.0, 1.6);
    const fireflyCore = glowSprite(32, [245, 255, 200], 0.25, 2.0);
    const moonGlow = glowSprite(128, [235, 245, 240], 0.0, 1.4);
    const fr = rng(55);
    const fireflies = Array.from({ length: portrait ? 18 : 24 }, () => ({
      x: fr(), y: 0.15 + fr() * 0.75, ax: 0.03 + fr() * 0.06, ay: 0.02 + fr() * 0.05, kx: 1 + Math.floor(fr() * 2), ky: 1 + Math.floor(fr() * 3), ph: fr() * TAU, blink: fr() * TAU
    }));
    const pr = rng(808);
    const petals = Array.from({ length: 10 }, () => ({ x: pr(), ph: pr(), sway: pr() * TAU, s: U * (0.008 + pr() * 0.008) }));

    return {
      render(t) {
        const w = (t / D) * TAU;
        g.globalCompositeOperation = 'source-over';
        g.globalAlpha = 1;
        g.drawImage(bg, 0, 0);
        // Çiçekler: nefes alan açılış + hafif rüzgâr salınımı.
        for (const f of flowers) {
          const open = 0.82 + 0.18 * Math.sin(w + f.ph);
          const sx = Math.sin(w + f.ph * 0.5) * U * 0.004;
          g.globalCompositeOperation = 'lighter';
          g.globalAlpha = 0.12;
          const gs = f.s * 5;
          g.drawImage(moonGlow, f.x * W - gs / 2 + sx, f.y * H - gs / 2, gs, gs);
          g.globalCompositeOperation = 'source-over';
          drawFlower(g, f.x * W + sx, f.y * H, f.s, f.rot + 0.08 * Math.sin(w + f.ph), open, 0.95);
        }
        // Süzülen taç yapraklar (döngüde bir tam iniş).
        for (const p of petals) {
          const k = ((p.ph + t / D) % 1);
          const y = -0.05 + k * 1.1;
          const x = p.x + 0.04 * Math.sin(w * 2 + p.sway);
          g.save();
          g.translate(x * W, y * H);
          g.rotate(w * 2 + p.sway);
          g.scale(1, 0.5 + 0.5 * Math.abs(Math.sin(w * 3 + p.sway)));
          g.globalAlpha = 0.85;
          g.fillStyle = '#f7f4ea';
          g.beginPath();
          g.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, TAU);
          g.fill();
          g.restore();
        }
        g.globalAlpha = 1;
        // Ateş böcekleri
        g.globalCompositeOperation = 'lighter';
        for (const f of fireflies) {
          const x = (f.x + f.ax * Math.sin(w * f.kx + f.ph)) * W;
          const y = (f.y + f.ay * Math.sin(w * f.ky + f.ph * 1.3)) * H;
          const on = Math.max(0, Math.sin(w * 3 + f.blink));
          const a = 0.2 + 0.8 * on * on;
          g.globalAlpha = 0.6 * a;
          const gs = U * 0.09;
          g.drawImage(glowSoft, x - gs / 2, y - gs / 2, gs, gs);
          g.globalAlpha = a;
          const cs = U * 0.016;
          g.drawImage(fireflyCore, x - cs / 2, y - cs / 2, cs, cs);
        }
        g.globalCompositeOperation = 'source-over';
        // Ön plandaki bulanık yaseminler: kameraya yakın, yavaş salınım.
        for (const [nx, ny, ns] of near) {
          const s = U * 0.42 * ns;
          g.globalAlpha = 0.75;
          g.drawImage(bokehFlower, nx * W - s / 2 + Math.sin(w + nx * 5) * U * 0.01, ny * H - s / 2, s, s);
        }
        g.globalAlpha = 1;
        layer.texture.needsUpdate = true;
        stage.render(layer.scene, layer.camera, t);
      }
    };
  }
};

export default scene;
