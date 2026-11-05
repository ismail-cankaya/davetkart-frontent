/**
 * Kapsül makinesi fiziği (canvas 2B). Cam fanusun içinde daire kapsüller:
 * yerçekimi (telefon eğilince yön değiştirir), birbirine ve fanus çeperine
 * çarpma, sürtünme. Kol çevrilince fanus sarsılır ve en alttaki kapsül
 * ağızdan çıkar (motor `onDispense` ile bildirir; düşüşü bileşen anlatır).
 *
 * Sabit 1/120 sn adım: kare hızı ne olursa olsun aynı davranış.
 */

export const CAPSULE_COLORS = [
  ['#FF6B8B', '#FFD1DC'],
  ['#5BC0FF', '#D4F0FF'],
  ['#FFC83D', '#FFF0C2'],
  ['#7BE0A6', '#DDF8E8'],
  ['#B48CFF', '#EBDFFF'],
  ['#FF9F5A', '#FFE2CC']
] as const;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: number;
  rot: number;
}

export interface Machine {
  /** Kolu çevir: sarsıntı + en alttaki kapsülü bırak. Kapsül kalmadıysa `false`. */
  crank(): boolean;
  /** Ekran düzleminde yerçekimi yönü (-1..1). */
  setGravity(gx: number, gy: number): void;
  /** Kalan kapsül sayısı. */
  count(): number;
  destroy(): void;
}

export function createMachine(
  canvas: HTMLCanvasElement,
  opts: { animate: boolean; total: number; onDispense: (color: number) => void }
): Machine {
  const g = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 1, H = 1, R = 1, cx = 0, cy = 0;
  const balls: Ball[] = [];
  let gx = 0, gy = 1;
  let raf = 0;
  let last = 0;
  let acc = 0;
  let calm = 0;
  let destroyed = false;

  const layout = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    W = r.width;
    H = r.height;
    R = Math.min(W, H) * 0.47;
    cx = W / 2;
    cy = H / 2;
  };

  const seed = (n: number) => {
    let s = 11;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    balls.length = 0;
    const br = R * 0.17;
    for (let i = 0; i < n; i++) {
      // Fanusun alt yarısına düzenli yığ (önizlemede de doğal dursun).
      const row = Math.floor(i / 5);
      const col = i % 5;
      const x = cx + (col - 2) * br * 2.02 + (row % 2) * br + (rnd() - 0.5) * 2;
      const y = cy + R - br - row * br * 1.75 - 4;
      balls.push({ x, y, vx: 0, vy: 0, r: br * (0.94 + rnd() * 0.1), color: i % CAPSULE_COLORS.length, rot: rnd() * Math.PI * 2 });
    }
    // Yığını oturt: birkaç yüz adım sessizce benzet.
    for (let k = 0; k < 400; k++) step(1 / 120);
  };

  const step = (dt: number) => {
    const G = 1400;
    for (const b of balls) {
      b.vx += gx * G * dt;
      b.vy += gy * G * dt;
      b.vx *= 0.995;
      b.vy *= 0.995;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.rot += (b.vx / Math.max(b.r, 1)) * dt;
      // Fanus çeperi
      const dx = b.x - cx, dy = b.y - cy;
      const d = Math.hypot(dx, dy);
      const lim = R - b.r - 3;
      if (d > lim) {
        const nx = dx / d, ny = dy / d;
        b.x = cx + nx * lim;
        b.y = cy + ny * lim;
        const vn = b.vx * nx + b.vy * ny;
        if (vn > 0) {
          b.vx -= 1.45 * vn * nx;
          b.vy -= 1.45 * vn * ny;
          b.vx *= 0.96;
          b.vy *= 0.96;
        }
      }
    }
    // Kapsül-kapsül
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i], c = balls[j];
        const dx = c.x - a.x, dy = c.y - a.y;
        const min = a.r + c.r;
        const d2 = dx * dx + dy * dy;
        if (d2 >= min * min || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const nx = dx / d, ny = dy / d;
        const push = (min - d) * 0.5;
        a.x -= nx * push;
        a.y -= ny * push;
        c.x += nx * push;
        c.y += ny * push;
        const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (rv < 0) {
          const imp = -rv * 0.7;
          a.vx -= imp * nx;
          a.vy -= imp * ny;
          c.vx += imp * nx;
          c.vy += imp * ny;
        }
      }
    }
  };

  const drawBall = (b: Ball) => {
    if (!g) return;
    const [main, light] = CAPSULE_COLORS[b.color];
    g.save();
    g.translate(b.x * dpr, b.y * dpr);
    g.rotate(b.rot);
    const r = b.r * dpr;
    // Alt yarı beyaz, üst yarı renkli kapsül.
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.fillStyle = '#FFFFFF';
    g.fill();
    g.beginPath();
    g.arc(0, 0, r, Math.PI, Math.PI * 2);
    g.closePath();
    const grd = g.createLinearGradient(0, -r, 0, 0);
    grd.addColorStop(0, light);
    grd.addColorStop(1, main);
    g.fillStyle = grd;
    g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.12)';
    g.lineWidth = 1.2 * dpr;
    g.beginPath();
    g.moveTo(-r, 0);
    g.lineTo(r, 0);
    g.stroke();
    g.restore();
    // Sabit yönlü parlama (dönmez).
    g.beginPath();
    g.arc((b.x - b.r * 0.35) * dpr, (b.y - b.r * 0.4) * dpr, b.r * 0.28 * dpr, 0, Math.PI * 2);
    g.fillStyle = 'rgba(255,255,255,0.6)';
    g.fill();
    g.beginPath();
    g.arc(b.x * dpr, b.y * dpr, b.r * dpr, 0, Math.PI * 2);
    g.strokeStyle = 'rgba(40,20,60,0.18)';
    g.lineWidth = 1 * dpr;
    g.stroke();
  };

  const draw = () => {
    if (!g) return;
    g.clearRect(0, 0, canvas.width, canvas.height);
    for (const b of balls) drawBall(b);
  };

  const frame = (now: number) => {
    raf = 0;
    if (destroyed) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    acc += dt;
    while (acc >= 1 / 120) {
      step(1 / 120);
      acc -= 1 / 120;
    }
    draw();
    // Herkes durunca döngü uyur; yerçekimi değişince ya da kol çevrilince uyanır.
    const energy = balls.reduce((s, b) => s + Math.abs(b.vx) + Math.abs(b.vy), 0) / Math.max(1, balls.length);
    calm = energy < 6 ? calm + dt : 0;
    if (calm < 0.6) raf = requestAnimationFrame(frame);
    else last = 0;
  };
  const kick = () => {
    calm = 0;
    if (opts.animate && !raf && !destroyed) raf = requestAnimationFrame(frame);
  };

  layout();
  seed(opts.total);
  draw();
  const ro = new ResizeObserver(() => {
    const prev = { W, H, R, cx, cy };
    layout();
    // Tuvalin boyutunu yazmak içeriğini siler: her durumda yeniden çiz.
    if (prev.W === W && prev.H === H) return draw();
    const k = R / Math.max(prev.R, 1);
    for (const b of balls) {
      b.x = cx + (b.x - prev.cx) * k;
      b.y = cy + (b.y - prev.cy) * k;
      b.r *= k;
    }
    draw();
    kick();
  });
  ro.observe(canvas);

  return {
    crank() {
      if (!balls.length) return false;
      // En alttaki (yerçekimi yönünde en uzaktaki) kapsül ağızdan çıkar.
      let best = 0;
      let bestY = -Infinity;
      balls.forEach((b, i) => {
        if (b.y > bestY) {
          bestY = b.y;
          best = i;
        }
      });
      const [out] = balls.splice(best, 1);
      for (const b of balls) {
        b.vx += (Math.random() - 0.5) * 520;
        b.vy -= 260 + Math.random() * 340;
      }
      opts.onDispense(out.color);
      if (!opts.animate) draw();
      kick();
      return true;
    },
    setGravity(x, y) {
      const len = Math.hypot(x, y) || 1;
      const nx = x / len, ny = y / len;
      if (Math.abs(nx - gx) + Math.abs(ny - gy) > 0.05) {
        gx = nx;
        gy = ny;
        kick();
      }
    },
    count: () => balls.length,
    destroy() {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    }
  };
}
