/**
 * Buğulu cam motoru (canvas 2B). Tek bir tuvalde üç iş:
 *
 *  1. **Buğu:** yarı saydam, lekeli, ince damlacıklı bir yoğuşma katmanı.
 *     Bir kez ekran dışı bir tuvale çizilir (`fogTile`), sonra kopyalanır.
 *  2. **Silme:** işaretçinin geçtiği yol `destination-out` ile yumuşak fırçayla
 *     açılır. Hızlı sürüklemede boşluk kalmasın diye iki nokta arası doldurulur.
 *  3. **Geri gelme + damlalar:** buğu her karede çok düşük opaklıkla yeniden
 *     boyanır (silinen yer ~14 sn'de bulanır); silinen yerden ara sıra bir damla
 *     kopar, aşağı akarken arkasında ince temiz bir iz bırakır.
 *
 * Kare döngüsü yalnızca bir şey değişirken döner: buğu tam dolunca ve damla
 * kalmayınca durur, yeni bir silmeyle uyanır.
 */

interface Drop {
  x: number;
  y: number;
  vy: number;
  r: number;
  life: number;
}

export interface FogEngine {
  /** Bir noktadan diğerine sil (CSS pikseli, tuvalin sol üstüne göre). */
  wipe(x0: number, y0: number, x1: number, y1: number): void;
  /** Tüm camı aç ve buğunun geri gelmesini durdur. */
  clearAll(): void;
  resize(): void;
  destroy(): void;
}

function makeFogTile(w: number, h: number, dpr: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (!g) return c;
  g.fillStyle = 'rgba(214, 200, 188, 0.86)';
  g.fillRect(0, 0, w, h);
  // Bulutsu lekeler: buğu hiçbir zaman düz değildir.
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 70; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const r = (30 + rnd() * 90) * dpr;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    const light = rnd() > 0.5;
    grd.addColorStop(0, light ? 'rgba(240,232,224,0.22)' : 'rgba(150,130,118,0.16)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // Mikro damlacıklar: küçük parlak noktalar ve gölgeleri.
  const n = Math.round((w * h) / (220 * dpr * dpr));
  for (let i = 0; i < n; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const r = (0.4 + rnd() * 1.3) * dpr;
    g.fillStyle = 'rgba(120,100,90,0.25)';
    g.beginPath();
    g.arc(x + r * 0.4, y + r * 0.5, r, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = 'rgba(255,250,244,0.55)';
    g.beginPath();
    g.arc(x, y, r * 0.75, 0, Math.PI * 2);
    g.fill();
  }
  return c;
}

export function createFogEngine(canvas: HTMLCanvasElement, opts: { regrowSeconds?: number } = {}): FogEngine {
  const g = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let tile: HTMLCanvasElement | null = null;
  let raf = 0;
  let last = 0;
  let regrow = true;
  /** Silinmiş alan var mı (buğu tam değil). */
  let dirty = false;
  let sinceWipe = 0;
  const drops: Drop[] = [];
  const regrowSeconds = opts.regrowSeconds ?? 14;

  const paintFull = () => {
    if (!g || !tile) return;
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = 1;
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.drawImage(tile, 0, 0);
  };

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (w === canvas.width && h === canvas.height && tile) return;
    canvas.width = w;
    canvas.height = h;
    tile = makeFogTile(w, h, dpr);
    paintFull();
    dirty = false;
  };

  const brush = (x: number, y: number, radius: number) => {
    if (!g) return;
    const grd = g.createRadialGradient(x, y, 0, x, y, radius);
    grd.addColorStop(0, 'rgba(0,0,0,1)');
    grd.addColorStop(0.6, 'rgba(0,0,0,0.85)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  };

  const frame = (now: number) => {
    raf = 0;
    if (!g || !tile) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    sinceWipe += dt;

    // Damlalar: aşağı akar, ince temiz iz bırakır.
    g.globalCompositeOperation = 'destination-out';
    g.globalAlpha = 1;
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.vy = Math.min(d.vy + 40 * dpr * dt, 70 * dpr);
      d.y += d.vy * dt * (0.6 + 0.4 * Math.sin(now / 90 + d.x));
      d.life -= dt;
      brush(d.x, d.y, d.r);
      if (d.life <= 0 || d.y > canvas.height + 10) drops.splice(i, 1);
    }

    // Buğunun geri gelmesi: silmeden 1,2 sn sonra başlar.
    if (regrow && dirty && sinceWipe > 1.2) {
      g.globalCompositeOperation = 'source-over';
      g.globalAlpha = Math.min(1, (dt / regrowSeconds) * 3);
      g.drawImage(tile, 0, 0);
      g.globalAlpha = 1;
      if (sinceWipe > regrowSeconds * 2.2) {
        paintFull();
        dirty = false;
      }
    }
    if (drops.length || (regrow && dirty)) raf = requestAnimationFrame(frame);
    else last = 0;
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  resize();
  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);

  return {
    wipe(x0, y0, x1, y1) {
      if (!g) return;
      const ax = x0 * dpr, ay = y0 * dpr, bx = x1 * dpr, by = y1 * dpr;
      const radius = 24 * dpr;
      const dist = Math.hypot(bx - ax, by - ay);
      const steps = Math.max(1, Math.ceil(dist / (radius * 0.35)));
      g.globalCompositeOperation = 'destination-out';
      g.globalAlpha = 1;
      for (let i = 0; i <= steps; i++) brush(ax + ((bx - ax) * i) / steps, ay + ((by - ay) * i) / steps, radius);
      // Silinen yerin altında biriken su: ara sıra bir damla kopar.
      if (Math.random() < Math.min(0.5, dist / (radius * 6)) && drops.length < 14) {
        drops.push({ x: bx + (Math.random() - 0.5) * radius, y: by + radius * 0.6, vy: 0, r: (2 + Math.random() * 2.2) * dpr, life: 1.2 + Math.random() * 2.4 });
      }
      dirty = true;
      sinceWipe = 0;
      kick();
    },
    clearAll() {
      regrow = false;
      drops.length = 0;
      g?.clearRect(0, 0, canvas.width, canvas.height);
    },
    resize,
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    }
  };
}
