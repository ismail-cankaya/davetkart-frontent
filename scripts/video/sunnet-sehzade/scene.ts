import * as THREE from 'three';
import { canvasLayer, createStage } from '../lib/stage';
import { glowSprite, rng } from '../lib/glsl';
import type { SceneDef } from '../lib/types';

/**
 * Şehzade Çadırı — otağın içinden tepeye bakış: kubbeye toplanan al ve
 * lacivert kumaş dilimleri, altın saçaklı fistolar, zincirlerden sarkan
 * delikli pirinç fenerler yavaşça sallanır; havada sıcak toz asılı.
 */
const D = 12;
const TAU = Math.PI * 2;

/** Delikli fener: kubbe + gövde (ışık sızan yıldız delikleri) + alem. */
function lanternSprite(size: number, blur: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = Math.round(size * 1.9);
  const g = c.getContext('2d')!;
  if (blur > 0) g.filter = `blur(${blur}px)`;
  const w = size, h = c.height;
  const cx = w / 2;
  const metal = g.createLinearGradient(0, 0, w, 0);
  metal.addColorStop(0, '#24160a');
  metal.addColorStop(0.45, '#7a5a2c');
  metal.addColorStop(0.62, '#b8955a');
  metal.addColorStop(1, '#2c1a0c');
  // Halka ve kubbe
  g.strokeStyle = '#c9a15a';
  g.lineWidth = w * 0.03;
  g.beginPath();
  g.arc(cx, h * 0.04, w * 0.06, 0, TAU);
  g.stroke();
  g.fillStyle = metal;
  g.beginPath();
  g.moveTo(cx, h * 0.07);
  g.quadraticCurveTo(w * 0.86, h * 0.2, w * 0.82, h * 0.3);
  g.lineTo(w * 0.18, h * 0.3);
  g.quadraticCurveTo(w * 0.14, h * 0.2, cx, h * 0.07);
  g.fill();
  // Gövde: sıcak iç ışık + metal kafes
  const body = g.createRadialGradient(cx, h * 0.5, 0, cx, h * 0.5, w * 0.45);
  body.addColorStop(0, '#fff2c8');
  body.addColorStop(0.5, '#ffb44e');
  body.addColorStop(1, '#a5501a');
  g.fillStyle = body;
  g.beginPath();
  g.moveTo(w * 0.2, h * 0.3);
  g.lineTo(w * 0.8, h * 0.3);
  g.quadraticCurveTo(w * 0.92, h * 0.5, w * 0.74, h * 0.72);
  g.lineTo(w * 0.26, h * 0.72);
  g.quadraticCurveTo(w * 0.08, h * 0.5, w * 0.2, h * 0.3);
  g.fill();
  // Kafes: koyu metal üstünde ışık sızan delikler
  g.globalCompositeOperation = 'source-atop';
  g.fillStyle = 'rgba(40,22,8,0.78)';
  g.fillRect(0, h * 0.3, w, h * 0.42);
  g.globalCompositeOperation = 'destination-out';
  const r = rng(size);
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 6; col++) {
      const x = w * (0.25 + col * 0.1 + (row % 2) * 0.05);
      const y = h * (0.34 + row * 0.054);
      const s = w * (0.03 + r() * 0.012);
      g.beginPath();
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * TAU - Math.PI / 2;
        const rr = k % 2 ? s * 0.45 : s;
        g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      g.fill();
    }
  }
  g.globalCompositeOperation = 'destination-over';
  // Deliklerin arkasındaki ışık (kesilen yerler bunu gösterir) — gövde biçiminde.
  g.fillStyle = body;
  g.beginPath();
  g.moveTo(w * 0.2, h * 0.3);
  g.lineTo(w * 0.8, h * 0.3);
  g.quadraticCurveTo(w * 0.92, h * 0.5, w * 0.74, h * 0.72);
  g.lineTo(w * 0.26, h * 0.72);
  g.quadraticCurveTo(w * 0.08, h * 0.5, w * 0.2, h * 0.3);
  g.fill();
  g.globalCompositeOperation = 'source-over';
  // Alt kubbe ve alem
  g.fillStyle = metal;
  g.beginPath();
  g.moveTo(w * 0.26, h * 0.72);
  g.lineTo(w * 0.74, h * 0.72);
  g.quadraticCurveTo(w * 0.7, h * 0.82, cx, h * 0.86);
  g.quadraticCurveTo(w * 0.3, h * 0.82, w * 0.26, h * 0.72);
  g.fill();
  g.strokeStyle = '#d6b066';
  g.lineWidth = w * 0.025;
  g.beginPath();
  g.moveTo(cx, h * 0.86);
  g.lineTo(cx, h * 0.97);
  g.stroke();
  g.fillStyle = '#e8c57e';
  g.beginPath();
  g.arc(cx, h * 0.975, w * 0.03, 0, TAU);
  g.fill();
  return c;
}

const scene: SceneDef = {
  duration: D,
  fps: 24,
  loop: true,
  poster: 3,
  setup(ctx) {
    const { width: W, height: H } = ctx;
    const portrait = ctx.variant === 'mobile';
    const stage = createStage(ctx, {
      toneMapping: THREE.NoToneMapping,
      bloom: { strength: 0.85, threshold: 0.55, radius: 1 },
      vignette: 0.55,
      grain: 0.005
    });
    const layer = canvasLayer(W, H);
    const g = layer.g;
    const U = Math.min(W, H);

    // Çadır tavanı: tepe noktasına toplanan dilimler (durağan, bir kez).
    const tent = document.createElement('canvas');
    tent.width = W;
    tent.height = H;
    const tg = tent.getContext('2d')!;
    const apex = { x: W / 2, y: -H * (portrait ? 0.08 : 0.22) };
    const slices = 22;
    const R = Math.hypot(W, H) * 1.4;
    for (let i = 0; i < slices; i++) {
      const a0 = Math.PI * (0.05 + (i / slices) * 0.9);
      const a1 = Math.PI * (0.05 + ((i + 1) / slices) * 0.9);
      const grad = tg.createLinearGradient(apex.x, apex.y, apex.x, H);
      const crimson = i % 2 === 0;
      grad.addColorStop(0, crimson ? '#2a050c' : '#080d22');
      grad.addColorStop(0.35, crimson ? '#5c0f1c' : '#132050');
      grad.addColorStop(1, crimson ? '#1e0409' : '#060a1a');
      tg.fillStyle = grad;
      tg.beginPath();
      tg.moveTo(apex.x, apex.y);
      tg.lineTo(apex.x + Math.cos(a0) * R, apex.y + Math.sin(a0) * R);
      tg.lineTo(apex.x + Math.cos(a1) * R, apex.y + Math.sin(a1) * R);
      tg.closePath();
      tg.fill();
      // Dilim ortasında kumaş kıvrımı: hafif açık çizgi
      const am = (a0 + a1) / 2;
      const fold = tg.createLinearGradient(apex.x + Math.cos(a0) * 300, apex.y + Math.sin(a0) * 300, apex.x + Math.cos(a1) * 300, apex.y + Math.sin(a1) * 300);
      fold.addColorStop(0, 'rgba(0,0,0,0.25)');
      fold.addColorStop(0.5, 'rgba(255,220,180,0.06)');
      fold.addColorStop(1, 'rgba(0,0,0,0.25)');
      tg.fillStyle = fold;
      tg.fill();
      // Dikiş: altın şerit
      tg.strokeStyle = 'rgba(214,170,90,0.28)';
      tg.lineWidth = U * 0.0018;
      tg.beginPath();
      tg.moveTo(apex.x, apex.y);
      tg.lineTo(apex.x + Math.cos(a0) * R, apex.y + Math.sin(a0) * R);
      tg.stroke();
      void am;
    }
    // Fisto saçak: dilimler arasında sarkan altın kenarlı yaylar.
    const valY = H * (portrait ? 0.66 : 0.74);
    const swags = portrait ? 4 : 7;
    for (let i = 0; i < swags; i++) {
      const x0 = (i / swags) * W, x1 = ((i + 1) / swags) * W;
      tg.fillStyle = i % 2 ? '#14204a' : '#6a0f1e';
      tg.beginPath();
      tg.moveTo(x0, valY - U * 0.05);
      tg.lineTo(x1, valY - U * 0.05);
      tg.quadraticCurveTo((x0 + x1) / 2, valY + U * 0.09, x0, valY - U * 0.05);
      tg.fill();
      tg.strokeStyle = '#d9b46a';
      tg.lineWidth = U * 0.006;
      tg.beginPath();
      tg.moveTo(x1, valY - U * 0.05);
      tg.quadraticCurveTo((x0 + x1) / 2, valY + U * 0.09, x0, valY - U * 0.05);
      tg.stroke();
      // Püskül
      tg.fillStyle = '#d9b46a';
      tg.fillRect(x0 - U * 0.004, valY - U * 0.05, U * 0.008, U * 0.05);
    }
    const floor = tg.createLinearGradient(0, valY, 0, H);
    floor.addColorStop(0, 'rgba(8,4,10,0.75)');
    floor.addColorStop(0.3, 'rgba(6,3,8,0.97)');
    floor.addColorStop(1, '#040205');
    tg.fillStyle = floor;
    tg.fillRect(0, valY + U * 0.02, W, H);
    // Ortam karanlığı: kumaş yalnızca fenerlerin ışığında görünür.
    tg.fillStyle = 'rgba(4,2,6,0.55)';
    tg.fillRect(0, 0, W, H);
    // Kenar perdeleri: bağlanmış kapı kanatları
    for (const side of [-1, 1]) {
      const x = side < 0 ? 0 : W;
      const grad = tg.createLinearGradient(x, 0, x - side * W * (portrait ? 0.3 : 0.22), 0);
      grad.addColorStop(0, '#24050b');
      grad.addColorStop(0.7, 'rgba(70,10,22,0.85)');
      grad.addColorStop(1, 'rgba(70,10,22,0)');
      tg.fillStyle = grad;
      tg.beginPath();
      tg.moveTo(x, 0);
      tg.lineTo(x - side * W * (portrait ? 0.3 : 0.22), 0);
      tg.quadraticCurveTo(x - side * W * 0.04, H * 0.55, x - side * W * (portrait ? 0.14 : 0.1), H);
      tg.lineTo(x, H);
      tg.fill();
    }

    const warm = glowSprite(128, [255, 170, 80], 0.0, 1.5);
    const mote = glowSprite(32, [255, 220, 160], 0.2, 2.0);
    // Fenerler: derinlik katmanları (uzak küçük/keskin, yakın büyük/bulanık).
    const lr = rng(77);
    const specs = portrait
      ? [[0.22, 0.18, 0.55, 0], [0.78, 0.22, 0.6, 0], [0.5, 0.12, 0.35, 0], [0.12, 0.36, 1.05, 4], [0.9, 0.42, 1.2, 5], [0.38, 0.3, 0.42, 0], [0.64, 0.33, 0.45, 0]]
      : [[0.2, 0.2, 0.5, 0], [0.8, 0.22, 0.55, 0], [0.5, 0.1, 0.32, 0], [0.35, 0.32, 0.38, 0], [0.66, 0.34, 0.4, 0], [0.07, 0.38, 1.0, 4], [0.94, 0.44, 1.15, 5]];
    const lanterns = specs.map(([x, y, s, blur]) => ({
      x, y, s,
      img: lanternSprite(Math.round(U * 0.12 * s * 2) || 40, blur as number),
      ph: lr() * TAU,
      k: 1 + Math.floor(lr() * 2),
      flick: lr() * TAU
    })).sort((a, b) => a.s - b.s);
    const dr = rng(3);
    const dust = Array.from({ length: 120 }, () => ({ x: dr(), y: dr(), ph: dr() * TAU, s: 0.6 + dr() * 1.6 }));

    return {
      render(t) {
        const w = (t / D) * TAU;
        g.globalCompositeOperation = 'source-over';
        g.globalAlpha = 1;
        g.drawImage(tent, 0, 0);
        for (const L of lanterns) {
          const sw = 0.05 * Math.sin(w * L.k + L.ph) / Math.max(0.6, L.s);
          const chain = L.y * H + H * 0.05;
          const px = L.x * W, py = -H * 0.05;
          const lx = px + Math.sin(sw) * chain, ly = py + Math.cos(sw) * chain;
          // Zincir
          g.strokeStyle = `rgba(200,160,90,${0.35 + 0.3 * Math.min(1, L.s)})`;
          g.lineWidth = Math.max(1, U * 0.0016 * L.s);
          g.beginPath();
          g.moveTo(px, py);
          g.lineTo(lx, ly);
          g.stroke();
          // Işık halesi: titrek alev
          const fl = 0.85 + 0.1 * Math.sin(w * 5 + L.flick) + 0.05 * Math.sin(w * 11 + L.flick * 2);
          g.globalCompositeOperation = 'lighter';
          const gs = U * 0.9 * L.s;
          g.globalAlpha = 0.42 * fl;
          g.drawImage(warm, lx - gs / 2, ly + L.img.height * 0.5 - gs / 2, gs, gs);
          g.globalCompositeOperation = 'source-over';
          g.globalAlpha = 1;
          g.save();
          g.translate(lx, ly);
          g.rotate(-sw);
          g.drawImage(L.img, -L.img.width / 2, 0);
          // Gövdeden taşan iç ışık (bloom'u besler)
          g.globalCompositeOperation = 'lighter';
          g.globalAlpha = 0.55 * fl;
          const cs = L.img.width * 0.9;
          g.drawImage(warm, -cs / 2, L.img.height * 0.5 - cs / 2, cs, cs);
          g.globalAlpha = 1;
          g.globalCompositeOperation = 'source-over';
          g.restore();
        }
        g.globalCompositeOperation = 'lighter';
        for (const p of dust) {
          const y = ((p.y - (t / D) * 0.12) % 1 + 1) % 1;
          const x = p.x + 0.012 * Math.sin(w + p.ph);
          g.globalAlpha = 0.25 + 0.25 * Math.sin(w * 2 + p.ph);
          const s = p.s * U / 540;
          g.drawImage(mote, x * W - s * 2, y * H - s * 2, s * 4, s * 4);
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
