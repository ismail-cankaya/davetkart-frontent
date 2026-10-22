/**
 * Arazi çizimlerinin yardımcıları. Hepsi tohumludur: her açılışta aynı
 * harita çizilir. Sonuç modül yüklenirken bir kez hesaplanan durağan SVG
 * yol dizgileridir; çalışma anında filtre ya da canlandırma yoktur.
 */

/** mulberry32 — küçük, tohumlu, tekrarlanabilir rastgele sayı. */
export function tohumlu(tohum: number): () => number {
  let a = tohum >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const y1 = (v: number) => Math.round(v);

/** Kapalı Catmull-Rom eğrisi: her noktadan geçen yumuşak, kapalı bir yol. */
export function kapaliEgri(noktalar: [number, number][]): string {
  const n = noktalar.length;
  const p = (i: number) => noktalar[(i + n) % n];
  let d = `M${y1(p(0)[0])} ${y1(p(0)[1])}`;
  for (let i = 0; i < n; i++) {
    const [x0, yy0] = p(i - 1);
    const [x1, yy1] = p(i);
    const [x2, yy2] = p(i + 1);
    const [x3, yy3] = p(i + 2);
    d += `C${y1(x1 + (x2 - x0) / 6)} ${y1(yy1 + (yy2 - yy0) / 6)} ${y1(x2 - (x3 - x1) / 6)} ${y1(yy2 - (yy3 - yy1) / 6)} ${y1(x2)} ${y1(yy2)}`;
  }
  return d + 'Z';
}

export interface Leke {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** Derece. */
  aci?: number;
  tohum: number;
  /** Kenar düzensizliği (0–0.3). */
  puruz?: number;
}

/** Düzensiz bir elips (eş yükselti halkası, orman lekesi). `olcek` iç halkalar için. */
export function lekeYolu({ cx, cy, rx, ry, aci = 0, tohum, puruz = 0.12 }: Leke, olcek = 1, kayma: [number, number] = [0, 0]): string {
  const r = tohumlu(tohum);
  const f = [r() * 6.28, r() * 6.28, r() * 6.28];
  const a = [puruz, puruz * 0.6, puruz * 0.35];
  const rad = (aci * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const noktalar: [number, number][] = [];
  const adet = 28;
  for (let i = 0; i < adet; i++) {
    const t = (i / adet) * Math.PI * 2;
    const k = 1 + a[0] * Math.sin(2 * t + f[0]) + a[1] * Math.sin(3 * t + f[1]) + a[2] * Math.sin(5 * t + f[2]);
    const x = Math.cos(t) * rx * olcek * k;
    const y = Math.sin(t) * ry * olcek * k;
    noktalar.push([cx + kayma[0] + x * cos - y * sin, cy + kayma[1] + x * sin + y * cos]);
  }
  return kapaliEgri(noktalar);
}

/** Bir lekenin içine (elipsin `doluluk` oranında) tohumlu, aralıklı noktalar: ağaç simgeleri. */
export function lekeIciNoktalar({ cx, cy, rx, ry, aci = 0, tohum }: Leke, aralik: number, doluluk = 0.72): [number, number][] {
  const r = tohumlu(tohum + 101);
  const rad = (aci * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const sonuc: [number, number][] = [];
  for (let y = -ry; y <= ry; y += aralik) {
    for (let x = -rx; x <= rx; x += aralik) {
      const jx = x + (r() - 0.5) * aralik * 0.7;
      const jy = y + (r() - 0.5) * aralik * 0.7;
      if ((jx / rx) ** 2 + (jy / ry) ** 2 > doluluk * doluluk) continue;
      sonuc.push([y1(cx + jx * cos - jy * sin), y1(cy + jx * sin + jy * cos)]);
    }
  }
  return sonuc;
}

export type Nokta2 = [number, number];

/** Açık Catmull-Rom: her noktadan geçen yumuşak, açık bir yol; uçlarda teğet komşuya bakar. */
export function acikEgri(noktalar: Nokta2[]): string {
  const n = noktalar.length;
  if (!n) return '';
  const p = (i: number) => noktalar[Math.max(0, Math.min(n - 1, i))];
  let d = `M${y1(p(0)[0])} ${y1(p(0)[1])}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, yy0] = p(i - 1);
    const [x1, yy1] = p(i);
    const [x2, yy2] = p(i + 1);
    const [x3, yy3] = p(i + 2);
    d += `C${y1(x1 + (x2 - x0) / 6)} ${y1(yy1 + (yy2 - yy0) / 6)} ${y1(x2 - (x3 - x1) / 6)} ${y1(yy2 - (yy3 - yy1) / 6)} ${y1(x2)} ${y1(yy2)}`;
  }
  return d;
}

/**
 * Elle çizilmiş görünen çizgi (mahalle krokisi): kırık çizgi `adim` px'te bir
 * örneklenir, her nokta dik yönde `kayma` + iki dalganın toplamı + küçük tohumlu
 * sarsıntı kadar kaydırılır. `kayma` ile bir sokağın iki kenarı çizilir (±genişlik/2);
 * iki kenar ayrı tohumla titrer, birbirine paralel durmaz.
 */
export function titrek(noktalar: Nokta2[], tohum: number, genlik = 1.8, adim = 22, kayma = 0): Nokta2[] {
  const r = tohumlu(tohum);
  const f1 = r() * 6.28;
  const f2 = r() * 6.28;
  const sonuc: Nokta2[] = [];
  let s = 0;
  const kaydir = (x: number, y: number, nx: number, ny: number, yol: number): Nokta2 => {
    const sapma = kayma + genlik * (0.65 * Math.sin(yol / 41 + f1) + 0.35 * Math.sin(yol / 13 + f2)) + (r() - 0.5) * genlik * 0.4;
    return [x + nx * sapma, y + ny * sapma];
  };
  let nx = 0;
  let ny = 0;
  for (let i = 0; i < noktalar.length - 1; i++) {
    const [ax, ay] = noktalar[i];
    const [bx, by] = noktalar[i + 1];
    const uzunluk = Math.hypot(bx - ax, by - ay) || 1;
    nx = -(by - ay) / uzunluk;
    ny = (bx - ax) / uzunluk;
    const adet = Math.max(1, Math.round(uzunluk / adim));
    for (let j = 0; j < adet; j++) {
      const t = j / adet;
      sonuc.push(kaydir(ax + (bx - ax) * t, ay + (by - ay) * t, nx, ny, s + uzunluk * t));
    }
    s += uzunluk;
  }
  const [lx, ly] = noktalar[noktalar.length - 1];
  sonuc.push(kaydir(lx, ly, nx, ny, s));
  return sonuc;
}

/** Bir noktanın kırık çizgiye en kısa uzaklığı (yerleşim çakışma denetimi için). */
export function cizgiyeUzaklik([px, py]: Nokta2, cizgi: Nokta2[]): number {
  let en = Infinity;
  for (let i = 0; i < cizgi.length - 1; i++) {
    const [ax, ay] = cizgi[i];
    const [bx, by] = cizgi[i + 1];
    const dx = bx - ax;
    const dy = by - ay;
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
    en = Math.min(en, Math.hypot(px - (ax + dx * t), py - (ay + dy * t)));
  }
  return en;
}
