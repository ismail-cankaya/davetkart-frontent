/**
 * Rotanın geometrisi: ara noktalardan yumuşak bir eğri, eğri boyunca eşit
 * aralıklı noktalar. Saf hesap; DOM'a dokunmaz, ölçüyü çağıran verir.
 */

export interface Nokta {
  x: number;
  y: number;
}

export type BezierParcasi = [Nokta, Nokta, Nokta, Nokta];

/**
 * Catmull-Rom → kübik Bézier. Eğri her ara noktadan geçer; uçlarda teğet
 * komşu noktaya bakar.
 */
export function egriKur(noktalar: Nokta[]): BezierParcasi[] {
  const p = noktalar;
  const parcalar: BezierParcasi[] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    parcalar.push([
      p1,
      { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
      p2
    ]);
  }
  return parcalar;
}

function bezier([a, b, c, d]: BezierParcasi, t: number): Nokta {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y
  };
}

const yuvarla = (v: number) => Math.round(v * 10) / 10;

/** `<path d>` dizgisi (cadde bandı için). */
export function yolDizgisi(parcalar: BezierParcasi[]): string {
  if (!parcalar.length) return '';
  const [ilk] = parcalar[0];
  return (
    `M${yuvarla(ilk.x)} ${yuvarla(ilk.y)}` +
    parcalar.map(([, b, c, d]) => `C${yuvarla(b.x)} ${yuvarla(b.y)} ${yuvarla(c.x)} ${yuvarla(c.y)} ${yuvarla(d.x)} ${yuvarla(d.y)}`).join('')
  );
}

export interface Ornek {
  /** Eşit aralıklı rota noktaları, baştan sona. */
  noktalar: Nokta[];
  uzunluk: number;
  /** Yay uzunluğunun `oran`ındaki (0–1) nokta. */
  konum: (oran: number) => Nokta;
}

/** Eğriyi sık bir kırık çizgiye açar, sonra her `aralik` pikselde bir nokta bırakır. */
export function ornekle(parcalar: BezierParcasi[], aralik: number): Ornek {
  const cizgi: Nokta[] = [];
  for (const parca of parcalar) {
    for (let i = cizgi.length ? 1 : 0; i <= 48; i++) cizgi.push(bezier(parca, i / 48));
  }
  const birikim = [0];
  for (let i = 1; i < cizgi.length; i++) {
    birikim.push(birikim[i - 1] + Math.hypot(cizgi[i].x - cizgi[i - 1].x, cizgi[i].y - cizgi[i - 1].y));
  }
  const uzunluk = birikim[birikim.length - 1] ?? 0;

  const konumUzunlukta = (s: number): Nokta => {
    if (cizgi.length < 2) return cizgi[0] ?? { x: 0, y: 0 };
    let i = 1;
    while (i < birikim.length - 1 && birikim[i] < s) i++;
    const once = birikim[i - 1];
    const parca = birikim[i] - once || 1;
    const t = Math.min(1, Math.max(0, (s - once) / parca));
    return { x: cizgi[i - 1].x + (cizgi[i].x - cizgi[i - 1].x) * t, y: cizgi[i - 1].y + (cizgi[i].y - cizgi[i - 1].y) * t };
  };

  const noktalar: Nokta[] = [];
  for (let s = aralik / 2; s <= uzunluk; s += aralik) noktalar.push(konumUzunlukta(s));

  return { noktalar, uzunluk, konum: (oran) => konumUzunlukta(Math.min(1, Math.max(0, oran)) * uzunluk) };
}
