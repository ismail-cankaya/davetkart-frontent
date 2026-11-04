/**
 * 2D sayfa kıvırma geometrisi (CSS clip-path + matrix, WebGL yok).
 *
 * Sayfanın dış köşesi C, işaretçinin taşıdığı noktaya P gider. Katlama çizgisi
 * C–P doğru parçasının dik ortayıdır. Çizginin C tarafı katlanır: ön yüz o
 * bölgeden kırpılır, sayfanın arka yüzü çizgiye göre yansıtılarak üstüne
 * konur. Arka yüz kendi düzeninde (aynalanmamış) çizilir; "x'te aynala +
 * çizgiye göre yansıt" iki yansımanın bileşkesidir, yani tek bir dönme +
 * öteleme: CSS `matrix()` ile verilir.
 */

export interface Vec {
  x: number;
  y: number;
}

/** Çizgi üstünde bir nokta ve bandın uzandığı yön (birim normal). */
export interface Line {
  q: Vec;
  n: Vec;
}

export interface CurlGeometry {
  /** Ön yüzün kalan kısmı (sayfa koordinatı). */
  frontClip: string;
  /** Arka yüzün görünen kısmı (arka yüz koordinatı). */
  backClip: string;
  /** Arka yüzü katlanmış konumuna taşıyan dönüşüm (transform-origin 0 0). */
  backMatrix: string;
  /** Ön yüzde katlama gölgesi: çizgiden kalan sayfaya doğru. */
  frontFold: Line;
  /** Arka yüzde katlama parlaması: çizgiden kanadın içine doğru. */
  backFold: Line;
  /** Alttaki sayfaya düşen gölge: çizgiden açılan bölgeye doğru. */
  underFold: Line;
  /** 0 (düz) → 1 (tam çevrildi). */
  progress: number;
}

const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;

/** Sutherland–Hodgman: çokgeni `f(p) >= 0` yarı düzlemine kırpar. */
function clipPolygon(poly: Vec[], f: (p: Vec) => number): Vec[] {
  const out: Vec[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const fa = f(a);
    const fb = f(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) {
      const t = fa / (fa - fb);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return out;
}

const toPolygon = (pts: Vec[]) =>
  pts.length < 3 ? 'polygon(0 0, 0 0, 0 0)' : `polygon(${pts.map((p) => `${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`).join(', ')})`;

/**
 * P'yi kâğıdın fiziksel sınırına çeker: sayfa sırttan kopamaz. Köşe, aynı
 * kenardaki sırt noktasından en çok W, karşı sırt köşesinden en çok köşegen
 * kadar uzaklaşabilir.
 */
export function constrain(W: number, H: number, cornerY: number, p: Vec): Vec {
  let { x, y } = p;
  const limit = (sx: number, sy: number, r: number) => {
    const dx = x - sx;
    const dy = y - sy;
    const d = Math.hypot(dx, dy);
    if (d > r) {
      x = sx + (dx / d) * r;
      y = sy + (dy / d) * r;
    }
  };
  limit(0, cornerY, W);
  limit(0, H - cornerY, Math.hypot(W, H));
  return { x, y };
}

/** Kıvrım geometrisi; P köşeye çok yakınsa `null` (sayfa düz). */
export function curl(W: number, H: number, cornerY: number, pRaw: Vec): CurlGeometry | null {
  const P = constrain(W, H, cornerY, pRaw);
  const C = { x: W, y: cornerY };
  const d = { x: P.x - C.x, y: P.y - C.y };
  const len = Math.hypot(d.x, d.y);
  if (len < 0.5) return null;
  const n = { x: d.x / len, y: d.y / len };
  const M = { x: (C.x + P.x) / 2, y: (C.y + P.y) / 2 };

  const rect: Vec[] = [
    { x: 0, y: 0 },
    { x: W, y: 0 },
    { x: W, y: H },
    { x: 0, y: H }
  ];
  const keep = clipPolygon(rect, (p) => dot({ x: p.x - M.x, y: p.y - M.y }, n));
  // Arka yüz noktası b, ön yüzde (W - b.x, b.y) noktasının arkasıdır.
  const flap = clipPolygon(rect, (b) => -dot({ x: W - b.x - M.x, y: b.y - M.y }, n));

  // Lin = (I - 2nnᵀ)·diag(-1, 1); t = (I - 2nnᵀ)(W, 0) + 2(M·n)n
  const a = -(1 - 2 * n.x * n.x);
  const b = 2 * n.x * n.y;
  const c = -2 * n.x * n.y;
  const dd = 1 - 2 * n.y * n.y;
  const mn = 2 * dot(M, n);
  const e = W * (1 - 2 * n.x * n.x) + mn * n.x;
  const f = -2 * n.x * n.y * W + mn * n.y;

  return {
    frontClip: toPolygon(keep),
    backClip: toPolygon(flap),
    backMatrix: `matrix(${a}, ${b}, ${c}, ${dd}, ${e}, ${f})`,
    frontFold: { q: M, n },
    backFold: { q: { x: W - M.x, y: M.y }, n: { x: n.x, y: -n.y } },
    underFold: { q: M, n: { x: -n.x, y: -n.y } },
    progress: Math.min(1, Math.max(0, (W - P.x) / (2 * W)))
  };
}

/**
 * Bir çizgiye yaslanan gradyan bandı: üst kenarı çizgide, `n` yönünde `width`
 * kadar uzanır. `left/top: 0`, `transform-origin: 0 0` olan bir öğeye verilir.
 */
export function bandTransform(line: Line, length: number): string {
  const u = { x: -line.n.y, y: line.n.x };
  const half = length / 2;
  return `matrix(${u.x}, ${u.y}, ${line.n.x}, ${line.n.y}, ${line.q.x - u.x * half}, ${line.q.y - u.y * half})`;
}
