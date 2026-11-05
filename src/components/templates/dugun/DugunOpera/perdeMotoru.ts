/**
 * Perde motoru — kadife sahne perdesinin canvas 2D fiziği.
 *
 * Perdenin iç kenarı R satıra bölünür; her satır bir sönümlü yaydır ve bir
 * üstündeki satırı izler (en üstteki satır perde çubuğunu). Çubuk çekilince
 * hareket yukarıdan aşağı bir gecikmeyle yayılır, az sönümlü yaylar kenarda
 * dalgalanma bırakır. Kıvrımlar (pli) panel genişliğine bölünmüş şeritlerdir:
 * panel daraldıkça aynı sayıda kıvrım sıkışır — gerçek perdedeki gibi.
 */

const ROWS = 26;
const STRIPS = 84;
/** Çubuk yayı (az sönümlü: hafif aşar ve geri döner). */
const ROD_K = 16;
const ROD_C = 5.2;
/** Satır zinciri yayı. */
const ROW_K = 300;
const ROW_C = 15;

export interface Curtain {
  /** 0 = kapalı, 1 = açık. */
  setTarget: (v: number) => void;
  getTarget: () => number;
  /** Hareketsiz son kareye atlar (önizleme / azaltılmış hareket). */
  snap: (v: number) => void;
  /** Dokunuşla kadifede dalga: y 0..1, güç işaretli. */
  poke: (y: number, amount: number) => void;
  step: (dt: number) => void;
  /** Sistem duruldu mu (rAF'yi durdurmak için). */
  settled: () => boolean;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
  /** Verilen noktada perde kumaşı var mı (tıklama isabeti). */
  hit: (x: number, y: number, w: number, h: number) => boolean;
}

/** Açık perdenin toplanmış genişliği (ekran oranı): altta biraz daha geniş, bağlı perde gibi. */
function gathered(yn: number, w: number) {
  const min = w < 640 ? 0.075 : 0.06;
  return min + 0.07 * Math.pow(yn, 1.6);
}

function edgeAt(open: number, yn: number, w: number) {
  const closed = w / 2 + 2;
  return closed + (gathered(yn, w) * w - closed) * open;
}

export function createCurtain(initial: number): Curtain {
  let target = initial;
  let rod = initial;
  let rodV = 0;
  const pos = new Float32Array(ROWS).fill(initial);
  const vel = new Float32Array(ROWS);
  const xs = new Float32Array(ROWS);

  const step = (dt: number) => {
    const n = Math.max(1, Math.ceil(dt / (1 / 240)));
    const h = dt / n;
    for (let s = 0; s < n; s++) {
      rodV += (ROD_K * (target - rod) - ROD_C * rodV) * h;
      rod += rodV * h;
      for (let i = 0; i < ROWS; i++) {
        const lead = i === 0 ? rod : pos[i - 1] * 0.85 + rod * 0.15;
        vel[i] += (ROW_K * (lead - pos[i]) - ROW_C * vel[i]) * h;
        pos[i] += vel[i] * h;
      }
    }
  };

  const settled = () => {
    if (Math.abs(rod - target) > 0.0005 || Math.abs(rodV) > 0.0005) return false;
    for (let i = 0; i < ROWS; i++) if (Math.abs(vel[i]) > 0.0008 || Math.abs(pos[i] - target) > 0.001) return false;
    return true;
  };

  const drawPanel = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, mirror: boolean) => {
    for (let i = 0; i < ROWS; i++) xs[i] = edgeAt(pos[i], i / (ROWS - 1), w);
    const folds = w < 640 ? 7 : 11;
    const X = (x: number) => (mirror ? w - x : x);
    const sway = 0.18 * Math.sin(t * 0.9);
    for (let s = 0; s < STRIPS; s++) {
      const u0 = s / STRIPS;
      const u1 = (s + 1) / STRIPS;
      const phase = ((u0 + u1) / 2) * folds * Math.PI * 2 + sway;
      const c = Math.cos(phase);
      // Kadife: koyu dip, parlak sırt; sırtın ucunda hafif ışık (pile).
      const lit = 0.5 + 0.5 * c;
      const r = Math.round(46 + 150 * Math.pow(lit, 1.4));
      const g = Math.round(4 + 22 * Math.pow(lit, 2.2));
      const b = Math.round(12 + 26 * Math.pow(lit, 1.8));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      for (let i = 0; i < ROWS; i++) {
        const y = (i / (ROWS - 1)) * h;
        const x = u0 * xs[i];
        if (i === 0) ctx.moveTo(X(x), y - 1);
        else ctx.lineTo(X(x), y);
      }
      for (let i = ROWS - 1; i >= 0; i--) {
        const y = (i / (ROWS - 1)) * h;
        ctx.lineTo(X(u1 * xs[i] + 0.6), i === ROWS - 1 ? y + 1 : y);
      }
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawTrim = (ctx: CanvasRenderingContext2D, w: number, h: number, mirror: boolean) => {
    const X = (x: number) => (mirror ? w - x : x);
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#F7DD93');
    grad.addColorStop(0.5, '#C8902F');
    grad.addColorStop(1, '#8C5E1C');
    ctx.strokeStyle = grad;
    ctx.lineWidth = w < 640 ? 2.5 : 3.5;
    ctx.beginPath();
    for (let i = 0; i < ROWS; i++) {
      const y = (i / (ROWS - 1)) * h;
      if (i === 0) ctx.moveTo(X(xs[i] - 1.5), y);
      else ctx.lineTo(X(xs[i] - 1.5), y);
    }
    ctx.stroke();
    // Etek: altın saçak.
    ctx.fillStyle = 'rgba(214,160,64,0.85)';
    const last = xs[ROWS - 1];
    for (let x = 2; x < last - 2; x += 5) ctx.fillRect(X(x) - (mirror ? 1.5 : 0), h - 7, 1.5, 7);
  };

  const drawValance = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const vh = Math.min(h * 0.12, 96);
    const top = vh * 0.5;
    // Üst bant: dikey kıvrımlı kadife.
    const n = Math.round(w / 10);
    for (let s = 0; s < n; s++) {
      const c = 0.5 + 0.5 * Math.cos((s / n) * Math.PI * 2 * Math.round(w / 34));
      ctx.fillStyle = `rgb(${Math.round(60 + 110 * c)},${Math.round(6 + 14 * c)},${Math.round(14 + 18 * c)})`;
      ctx.fillRect((s / n) * w, 0, w / n + 1, top + 2);
    }
    // Festonlar.
    const swags = Math.max(3, Math.round(w / 170));
    const sw = w / swags;
    for (let k = 0; k < swags; k++) {
      const x0 = k * sw;
      const g = ctx.createLinearGradient(0, top, 0, vh);
      g.addColorStop(0, '#8E1422');
      g.addColorStop(0.7, '#5E0A16');
      g.addColorStop(1, '#3A0410');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x0, top);
      ctx.quadraticCurveTo(x0 + sw / 2, vh * 1.32, x0 + sw, top);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#D9A548';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, top);
      ctx.quadraticCurveTo(x0 + sw / 2, vh * 1.32, x0 + sw, top);
      ctx.stroke();
      // Püskül.
      if (k > 0) {
        ctx.fillStyle = '#E4B65A';
        ctx.beginPath();
        ctx.arc(x0, top + 4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x0 - 3, top + 7, 6, vh * 0.32);
      }
    }
    ctx.fillStyle = '#E2AE55';
    ctx.fillRect(0, top - 2, w, 2.5);
  };

  return {
    setTarget: (v) => {
      target = v;
    },
    getTarget: () => target,
    snap: (v) => {
      target = rod = v;
      rodV = 0;
      pos.fill(v);
      vel.fill(0);
    },
    poke: (y, amount) => {
      for (let i = 0; i < ROWS; i++) {
        const d = (i / (ROWS - 1) - y) / 0.14;
        vel[i] += amount * Math.exp(-d * d);
      }
    },
    step,
    settled,
    draw: (ctx, w, h, t) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      drawPanel(ctx, w, h, t, false);
      drawPanel(ctx, w, h, t, true);
      // Dikey ışık: tavan ve taban gölgede, orta sahne ışığında.
      ctx.globalCompositeOperation = 'source-atop';
      const shade = ctx.createLinearGradient(0, 0, 0, h);
      shade.addColorStop(0, 'rgba(0,0,0,0.55)');
      shade.addColorStop(0.35, 'rgba(0,0,0,0)');
      shade.addColorStop(0.75, 'rgba(0,0,0,0.05)');
      shade.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      drawTrim(ctx, w, h, false);
      for (let i = 0; i < ROWS; i++) xs[i] = edgeAt(pos[i], i / (ROWS - 1), w);
      drawTrim(ctx, w, h, true);
      drawValance(ctx, w, h);
    },
    hit: (x, y, w, h) => {
      const i = Math.min(ROWS - 1, Math.max(0, Math.round((y / h) * (ROWS - 1))));
      const e = edgeAt(pos[i], i / (ROWS - 1), w);
      return x <= e + 12 || x >= w - e - 12 || y <= Math.min(h * 0.12, 96);
    }
  };
}

/** Canvas'ı kapsayıcısına oturtur; DPR en çok 2. */
export function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, rect.width);
  const h = Math.max(1, rect.height);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h };
}
