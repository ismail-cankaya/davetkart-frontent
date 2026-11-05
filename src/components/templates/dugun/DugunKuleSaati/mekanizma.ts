/**
 * Kule saatinin dişli takımı — saf geometri, React yok.
 *
 * Her dişli diş sayısıyla tanımlanır; hatve yarıçapı diş sayısıyla orantılıdır
 * (`r = n · MODUL`), böylece kavrayan iki dişlinin merkez uzaklığı her zaman
 * `rA + rB` olur ve dişler birbirine oturur. Kavrayan dişli ters yönde ve
 * `nA / nB` oranında döner; aynı mile takılı dişliler (coaxial) aynı açıyla.
 */

export const MODUL = 1.4;

export interface Gear {
  id: string;
  teeth: number;
  r: number;
  cx: number;
  cy: number;
  /** Dişlinin açısı (derece, SVG yönü: saat yönü +) — sürücü açıdan türetilir. */
  angle: (driver: number) => number;
  tone: 'brass' | 'iron';
}

/** Kavrama: B, A'nın α yönünde durur; A'da dişin karşısına B'de boşluk gelir. */
function meshed(a: Gear, teeth: number, alphaDeg: number, id: string, tone: Gear['tone']): Gear {
  const r = teeth * MODUL;
  const d = a.r + r;
  const al = (alphaDeg * Math.PI) / 180;
  return {
    id,
    teeth,
    r,
    cx: a.cx + d * Math.cos(al),
    cy: a.cy + d * Math.sin(al),
    tone,
    angle: (drv) => -(a.teeth / teeth) * (a.angle(drv) - alphaDeg) + alphaDeg + 180 + 180 / teeth
  };
}

/**
 * Sürücü = dakika mili açısı (dakika × 6°). Takım:
 *   A (36) dakika milinin büyük dişlisi
 *   B (18) A'ya kavrar → 2× hızla ters döner
 *   C (28) B'ye kavrar → A ile aynı yönde, 36/28 hızında
 *   D (14) C'ye kavrar → eşapman tarafı, en hızlı
 */
export function buildTrain(): Gear[] {
  const A: Gear = { id: 'A', teeth: 36, r: 36 * MODUL, cx: 92, cy: 322, tone: 'brass', angle: (drv) => drv };
  const B = meshed(A, 18, -38, 'B', 'iron');
  const C = meshed(B, 28, 22, 'C', 'brass');
  const D = meshed(C, 14, -70, 'D', 'iron');
  return [A, B, C, D];
}

/** Yamuk dişli bir dişli çarkın SVG yolu (merkez 0,0). */
export function gearPath(teeth: number, r: number): string {
  const h = 3.2;
  const p = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  const pt = (rad: number, a: number) => `${(rad * Math.cos(a)).toFixed(2)},${(rad * Math.sin(a)).toFixed(2)}`;
  for (let i = 0; i < teeth; i++) {
    const c = i * p;
    pts.push(pt(r - h, c - p * 0.5), pt(r - h, c - p * 0.27), pt(r + h, c - p * 0.14), pt(r + h, c + p * 0.14), pt(r - h, c + p * 0.27));
  }
  return `M${pts.join('L')}Z`;
}

/** Saat:dakika → gün içi dakika. Saat girilmemişse 19:00. */
export function weddingMinutes(hour: string, minute: string): number {
  const h = Number(hour);
  const m = Number(minute);
  if (!hour || Number.isNaN(h)) return 19 * 60;
  return h * 60 + (Number.isNaN(m) ? 0 : m);
}
