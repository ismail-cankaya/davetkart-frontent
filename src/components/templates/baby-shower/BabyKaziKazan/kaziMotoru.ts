/**
 * Kazı kazan kaplaması (canvas 2B). Altın-sim bir katman çizer, işaretçinin
 * yolunu `destination-out` ile açar ve açılan oranı seyrek örnekleyerek ölçer.
 * Kazınan her parça için dışarıya bir "kırıntı" olayı bildirir (sayfadaki
 * düşen sim kırıntılarını ayrı bir tuval çizer).
 */

export interface ScratchCard {
  scratch(x0: number, y0: number, x1: number, y1: number): void;
  /** Açılan alan oranı (0..1), seyrek örnekle. */
  cleared(): number;
  destroy(): void;
}

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

export function paintCoating(canvas: HTMLCanvasElement, seed: number, label: string): number {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(r.width * dpr));
  canvas.height = Math.max(1, Math.round(r.height * dpr));
  const g = canvas.getContext('2d');
  if (!g) return dpr;
  const w = canvas.width;
  const h = canvas.height;
  const grd = g.createLinearGradient(0, 0, w, h);
  grd.addColorStop(0, '#E9C98A');
  grd.addColorStop(0.35, '#FFF1CF');
  grd.addColorStop(0.55, '#D9AE62');
  grd.addColorStop(0.8, '#F6DFA8');
  grd.addColorStop(1, '#C99A4E');
  g.fillStyle = grd;
  g.fillRect(0, 0, w, h);
  // Sim: küçük parlak ve koyu noktalar.
  const rnd = seeded(seed * 977 + 13);
  const n = Math.round((w * h) / (60 * dpr * dpr));
  for (let i = 0; i < n; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const s = (0.5 + rnd() * 1.4) * dpr;
    g.fillStyle = rnd() > 0.55 ? `rgba(255,255,240,${0.4 + rnd() * 0.5})` : `rgba(150,105,40,${0.15 + rnd() * 0.25})`;
    g.fillRect(x, y, s, s);
  }
  // Pastel yıldızlar ve "kazı" yazısı.
  g.font = `600 ${13 * dpr}px Fredoka, ui-rounded, system-ui, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = 'rgba(122,82,30,0.45)';
  g.fillText(label, w / 2, h / 2);
  for (let i = 0; i < 9; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    if (Math.abs(y - h / 2) < 14 * dpr && Math.abs(x - w / 2) < 60 * dpr) continue;
    g.fillStyle = `rgba(255,255,255,${0.35 + rnd() * 0.3})`;
    g.font = `${(9 + rnd() * 8) * dpr}px system-ui, sans-serif`;
    g.fillText('✦', x, y);
  }
  return dpr;
}

export function createScratchCard(
  canvas: HTMLCanvasElement,
  seed: number,
  label: string,
  onCrumb: (x: number, y: number) => void
): ScratchCard {
  let dpr = paintCoating(canvas, seed, label);
  const g = canvas.getContext('2d');
  const ro = new ResizeObserver(() => {
    // Boyut değişirse (döndürme) kaplama yeniden çizilir: kazınan iz kaybolur
    // ama açılmış kart açık kalır (bunu bileşen tutar).
    const r = canvas.getBoundingClientRect();
    if (Math.round(r.width * dpr) !== canvas.width) dpr = paintCoating(canvas, seed, label);
  });
  ro.observe(canvas);

  return {
    scratch(x0, y0, x1, y1) {
      if (!g) return;
      const radius = 20 * dpr;
      const ax = x0 * dpr, ay = y0 * dpr, bx = x1 * dpr, by = y1 * dpr;
      const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / (radius * 0.4)));
      g.globalCompositeOperation = 'destination-out';
      for (let i = 0; i <= steps; i++) {
        const x = ax + ((bx - ax) * i) / steps;
        const y = ay + ((by - ay) * i) / steps;
        g.beginPath();
        // Kenarı hafif tırtıklı fırça: gerçek kazıma gibi düzensiz.
        for (let k = 0; k < 10; k++) {
          const a = (k / 10) * Math.PI * 2;
          const rr = radius * (0.82 + 0.18 * Math.sin(a * 3 + x * 0.05));
          const px = x + Math.cos(a) * rr;
          const py = y + Math.sin(a) * rr;
          if (k === 0) g.moveTo(px, py);
          else g.lineTo(px, py);
        }
        g.closePath();
        g.fill();
      }
      g.globalCompositeOperation = 'source-over';
      onCrumb(x1, y1);
    },
    cleared() {
      if (!g || canvas.width < 2) return 0;
      const step = 8 * dpr;
      const data = g.getImageData(0, 0, canvas.width, canvas.height).data;
      let open = 0;
      let total = 0;
      for (let y = Math.floor(step / 2); y < canvas.height; y += step) {
        for (let x = Math.floor(step / 2); x < canvas.width; x += step) {
          total++;
          if (data[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3] < 40) open++;
        }
      }
      return total ? open / total : 0;
    },
    destroy() {
      ro.disconnect();
    }
  };
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  life: number;
  kind: 'crumb' | 'confetti';
}

const CRUMB = ['#E9C98A', '#FFF1CF', '#D9AE62', '#F6DFA8'];
const CONFETTI = ['#F7B9C9', '#B9D8F7', '#C8EFD9', '#FBE3A6', '#D8C6F5', '#FFFFFF'];

/** Sayfa üstü parçacık tuvali: sim kırıntıları ve konfeti. Boşken döngü durur. */
export function createParticles(canvas: HTMLCanvasElement) {
  const g = canvas.getContext('2d');
  const parts: Particle[] = [];
  let raf = 0;
  let last = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const frame = (now: number) => {
    raf = 0;
    if (!g) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    g.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vy += (p.kind === 'crumb' ? 900 : 380) * dt;
      p.vx *= p.kind === 'confetti' ? 0.985 : 1;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.life -= dt;
      g.save();
      g.translate(p.x * dpr, p.y * dpr);
      g.rotate(p.rot);
      g.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
      g.fillStyle = p.color;
      if (p.kind === 'crumb') g.fillRect(-p.size * dpr * 0.5, -p.size * dpr * 0.5, p.size * dpr, p.size * dpr * 0.7);
      else g.fillRect(-p.size * dpr * 0.5, -p.size * dpr * 0.25, p.size * dpr, p.size * dpr * 0.5 * (0.4 + 0.6 * Math.abs(Math.sin(p.rot))));
      g.restore();
      if (p.life <= 0 || p.y * dpr > canvas.height + 20) parts.splice(i, 1);
    }
    if (parts.length) raf = requestAnimationFrame(frame);
    else last = 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  return {
    crumbs(x: number, y: number) {
      if (parts.length > 260) return;
      for (let i = 0; i < 3; i++) {
        parts.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 120,
          vy: -40 - Math.random() * 80,
          rot: Math.random() * 6,
          vr: (Math.random() - 0.5) * 14,
          size: 2 + Math.random() * 3,
          color: CRUMB[i % CRUMB.length],
          life: 1.4,
          kind: 'crumb'
        });
      }
      kick();
    },
    confetti(x: number, y: number) {
      for (let i = 0; i < 120; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
        const v = 380 + Math.random() * 520;
        parts.push({
          x,
          y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          rot: Math.random() * 6,
          vr: (Math.random() - 0.5) * 16,
          size: 6 + Math.random() * 6,
          color: CONFETTI[i % CONFETTI.length],
          life: 2.6 + Math.random(),
          kind: 'confetti'
        });
      }
      kick();
    },
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    }
  };
}
