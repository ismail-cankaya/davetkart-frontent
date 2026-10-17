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
