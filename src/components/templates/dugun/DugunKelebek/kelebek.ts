/** Kelebek sahnesinin ortak tipleri ve renkleri (three.js içermez: ana chunk'tan da alınır). */

/** Harf üstündeki konma noktası: sahne kabına göre px, sol üst köken. */
export interface Perch {
  x: number;
  y: number;
}

export interface PointerState {
  /** Sahne kabına göre px. */
  x: number;
  y: number;
  /** İmleç/parmak sahnede mi. */
  active: boolean;
  /** Son dokunuşun damgası (sn, `performance.now`); 0 = yok. Sahne her yeni damgayı bir kez işler. */
  tapAt: number;
}

/** [gövdeye yakın renk, kanat ucu rengi] — doğrusal RGB. */
export const BUTTERFLY_PALETTES: [number, number, number][][] = [
  [[0.55, 0.78, 1.0], [0.12, 0.3, 0.85]],
  [[1.0, 0.78, 0.55], [0.95, 0.38, 0.28]],
  [[0.98, 0.82, 0.92], [0.78, 0.45, 0.72]],
  [[1.0, 0.92, 0.6], [0.95, 0.62, 0.2]],
  [[0.85, 0.95, 0.88], [0.35, 0.7, 0.6]]
];

/** CSS rengi (yedek SVG için). */
export const toCss = ([r, g, b]: number[]) => `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
