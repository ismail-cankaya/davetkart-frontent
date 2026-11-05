/**
 * Yörünge geometrisi — 3D sahne ve SVG yedeği aynı hesabı kullanır.
 * Düzlem koordinatları (x, z); `m` 0 → iki ayrı yörünge, 1 → tek ortak yörünge.
 */

/** Açılışta gezegenlerin kendi kendine yaklaştığı oran; kalanı kaydırma tamamlar. */
export const INTRO_MERGE = 0.35;

export interface OrbitFrame {
  /** Yörünge merkezleri (A solda, B sağda). */
  ca: number;
  cb: number;
  r: number;
  ax: number;
  az: number;
  bx: number;
  bz: number;
  /** Ortak yörüngenin görünürlüğü (0..1). */
  shared: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function orbitFrame(merge: number, t: number, spin: number): OrbitFrame {
  const m = ease(Math.min(1, Math.max(0, merge)));
  const d = lerp(2.05, 0, m);
  const r = lerp(1.45, 2.05, m);
  const phaseA = t * 0.32 + spin;
  // Ayrıyken B biraz daha hızlı döner; birleştikçe aynı hıza ve yan yana bir açıya iner.
  const phaseB = phaseA + lerp(Math.PI + t * 0.1, 0.5, m);
  return {
    ca: -d,
    cb: d,
    r,
    ax: -d + Math.cos(phaseA) * r,
    az: Math.sin(phaseA) * r,
    bx: d + Math.cos(phaseB) * r,
    bz: Math.sin(phaseB) * r,
    shared: Math.max(0, (m - 0.6) / 0.4)
  };
}
