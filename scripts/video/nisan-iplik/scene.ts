import * as THREE from 'three';
import { canvasLayer, createStage } from '../lib/stage';
import { glowSprite, rng, smooth } from '../lib/glsl';
import type { SceneDef } from '../lib/types';

/**
 * Kader İpliği — mor kadife karanlıkta altın ve gül rengi iki iplik,
 * kadrajın iki ucundan gelip ortada gevşek bir düğüm atar. İpliklerin
 * üzerinde ışık akar, düğüm nefes alır; arkada bulanık ışık lekeleri.
 */
const D = 12;
const TAU = Math.PI * 2;

const scene: SceneDef = {
  duration: D,
  fps: 24,
  loop: true,
  poster: 4,
  setup(ctx) {
    const { width: W, height: H } = ctx;
    const portrait = ctx.variant === 'mobile';
    const stage = createStage(ctx, {
      toneMapping: THREE.NoToneMapping,
      bloom: { strength: 0.9, threshold: 0.5, radius: 1 },
      vignette: 0.5,
      grain: 0.005
    });
    const layer = canvasLayer(W, H);
    const g = layer.g;
    const U = Math.min(W, H);

    // Kadife zemin: radyal degrade + durağan ince doku (bir kez).
    const bg = document.createElement('canvas');
    bg.width = W;
    bg.height = H;
    const bgc = bg.getContext('2d')!;
    const rg = bgc.createRadialGradient(W / 2, H * 0.48, 0, W / 2, H * 0.48, Math.max(W, H) * 0.75);
    rg.addColorStop(0, '#3a1230');
    rg.addColorStop(0.45, '#1c0818');
    rg.addColorStop(1, '#08030a');
    bgc.fillStyle = rg;
    bgc.fillRect(0, 0, W, H);
    const img = bgc.getImageData(0, 0, W, H);
    const nr = rng(5);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (nr() - 0.5) * 6;
      img.data[i] += n;
      img.data[i + 1] += n * 0.6;
      img.data[i + 2] += n;
    }
    bgc.putImageData(img, 0, 0);

    const bokehR = rng(9);
    const bokeh = Array.from({ length: 22 }, () => ({
      x: bokehR(), y: bokehR(), r: 0.02 + bokehR() * 0.07, ph: bokehR() * TAU, gold: bokehR() < 0.5
    }));
    const goldGlow = glowSprite(128, [255, 200, 120], 0.0, 1.6);
    const roseGlow = glowSprite(128, [255, 110, 150], 0.0, 1.6);
    const spark = glowSprite(32, [255, 240, 210], 0.2, 2.0);

    /** İplik eğrisi: s ∈ [0,1], `side` ±1 iki ipliği karşı fazda tutar. */
    const N = 420;
    const curve = (s: number, t: number, side: number): [number, number] => {
      const w = (t / D) * TAU;
      const cy = portrait ? 0.3 : 0.27;
      // Ana yol: bir uçtan diğerine, ortada birbirine dolanan iki dalga.
      const along = -0.15 + s * 1.3;
      const amp = (0.13 + 0.05 * Math.sin(w + side)) * (1 - 0.6 * smooth(0.3, 0.5, s) * smooth(0.7, 0.5, s));
      let wave = side * amp * Math.sin(s * TAU * 1.5 + w + side * 0.6) + 0.025 * Math.sin(s * TAU * 4 - w * 2);
      // Düğüm: ortada her iplik bir tur atar (yönleri ters).
      const k = smooth(0.38, 0.62, s);
      const loopR = (portrait ? 0.075 : 0.13) * (1 + 0.08 * Math.sin(w * 2 + side)) * Math.sin(Math.PI * k);
      const th = k * TAU * side + (side > 0 ? 0 : Math.PI);
      const lx = loopR * Math.sin(th);
      const ly = loopR * (1 - Math.cos(th)) * 0.9 * -side;
      wave += ly;
      // Dikeyde de yatay akar: düğüm üst üçte birde, adlar altta kalır.
      return [(along + lx * (portrait ? 1.0 : 0.6)) * W, (cy + wave * (portrait ? 0.62 : 0.85)) * H];
    };

    const strokeThread = (t: number, side: number, rgb: [number, number, number]) => {
      const pts: [number, number][] = [];
      for (let i = 0; i <= N; i++) pts.push(curve(i / N, t, side));
      const path = (offset: number) => {
        g.beginPath();
        for (let i = 0; i <= N; i++) {
          const [x, y] = pts[i];
          // Bükülmüş lif: normal boyunca ince salınım.
          const [x2, y2] = pts[Math.min(N, i + 1)];
          const dx = x2 - x, dy = y2 - y;
          const l = Math.hypot(dx, dy) || 1;
          const o = offset * Math.sin(i * 0.9 + offset * 3);
          const px = x - (dy / l) * o, py = y + (dx / l) * o;
          if (i === 0) g.moveTo(px, py);
          else g.lineTo(px, py);
        }
      };
      const [r, gg, b] = rgb;
      g.lineCap = 'round';
      g.lineJoin = 'round';
      const scale = U / 1080;
      for (const [w, a] of [[30, 0.05], [14, 0.12], [6.5, 0.35]] as const) {
        g.strokeStyle = `rgba(${r},${gg},${b},${a})`;
        g.lineWidth = w * scale;
        path(0);
        g.stroke();
      }
      for (const off of [-1.4, 0, 1.4]) {
        g.strokeStyle = `rgba(${Math.min(255, r + 40)},${Math.min(255, gg + 50)},${Math.min(255, b + 50)},0.75)`;
        g.lineWidth = 1.8 * scale;
        path(off * scale);
        g.stroke();
      }
      // İplik boyunca akan ışık: döngüde bir tam geçiş (iki ipliğe karşı yönde).
      const glow = side > 0 ? goldGlow : roseGlow;
      for (let j = 0; j < 3; j++) {
        let s = ((t / D) + j / 3) % 1;
        if (side < 0) s = 1 - s;
        const [x, y] = curve(s, t, side);
        const size = 90 * scale;
        g.globalAlpha = 0.85;
        g.drawImage(glow, x - size / 2, y - size / 2, size, size);
        g.globalAlpha = 1;
        g.drawImage(spark, x - 10 * scale, y - 10 * scale, 20 * scale, 20 * scale);
      }
    };

    const dustR = rng(21);
    const dust = Array.from({ length: 140 }, () => ({ x: dustR(), y: dustR(), s: 0.5 + dustR() * 1.8, ph: dustR() * TAU, k: 1 + Math.floor(dustR() * 2) }));

    return {
      render(t) {
        const w = (t / D) * TAU;
        g.globalCompositeOperation = 'source-over';
        g.globalAlpha = 1;
        g.drawImage(bg, 0, 0);
        g.globalCompositeOperation = 'lighter';
        // Arka plan ışık lekeleri: alan derinliği hissi.
        for (const o of bokeh) {
          const x = (o.x + 0.02 * Math.sin(w + o.ph)) * W;
          const y = (o.y + 0.015 * Math.cos(w + o.ph)) * H;
          const r = o.r * U * 2;
          g.globalAlpha = 0.07 + 0.04 * Math.sin(w * 2 + o.ph);
          g.drawImage(o.gold ? goldGlow : roseGlow, x - r, y - r, r * 2, r * 2);
        }
        g.globalAlpha = 1;
        strokeThread(t, -1, [255, 105, 145]);
        strokeThread(t, 1, [242, 190, 105]);
        // Toz: yavaşça yükselir, döngüde bir tur.
        for (const p of dust) {
          const y = ((p.y - (t / D) * 0.25 * p.k) % 1 + 1) % 1;
          const x = p.x + 0.01 * Math.sin(w + p.ph);
          g.globalAlpha = 0.35 + 0.35 * Math.sin(w * 3 + p.ph);
          const s = p.s * (U / 1080) * 3;
          g.drawImage(spark, x * W - s, y * H - s, s * 2, s * 2);
        }
        g.globalAlpha = 1;
        g.globalCompositeOperation = 'source-over';
        layer.texture.needsUpdate = true;
        stage.render(layer.scene, layer.camera, t);
      }
    };
  }
};

export default scene;
