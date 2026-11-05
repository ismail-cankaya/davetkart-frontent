import { FISH, SPINE_POINTS } from './koiShader';

/**
 * İki koinin hareketi (p uzayı, yükseklik = 1).
 *
 * Kafa bir hedefe doğru sınırlı dönüş hızıyla yüzer; gövde noktaları bir
 * zincir gibi kafayı izler (her nokta bir öncekine sabit uzaklıkta). Hedef,
 * yem yoksa ortak bir çember üzerinde birbirinin karşısındaki iki noktadır:
 * balıklar birbirinin kuyruğunu kovalar ve yin-yang biçiminde döner. Yem
 * atılınca en yakın balık ona yönelir ve yer.
 *
 * Yüzme kıvrımı çıktıya eklenir, duruma yazılmaz (zincir kaymaz).
 */

interface Fish {
  x: number;
  y: number;
  heading: number;
  spine: number[];
}

export interface Food {
  x: number;
  y: number;
  at: number;
  active: boolean;
}

const SEG = 0.0205;
const CENTER = { x: 0, y: -0.07 };

export function createKoiSim() {
  const fish: Fish[] = Array.from({ length: FISH }, (_, i) => {
    const a = i * Math.PI;
    const x = CENTER.x + Math.cos(a) * 0.17;
    const y = CENTER.y + Math.sin(a) * 0.17;
    const heading = a + Math.PI / 2;
    const spine: number[] = [];
    for (let k = 0; k < SPINE_POINTS; k++) spine.push(x - Math.cos(heading) * SEG * k, y - Math.sin(heading) * SEG * k);
    return { x, y, heading, spine };
  });
  const out = new Array<number>(FISH * SPINE_POINTS * 2).fill(0);

  return {
    /** Bir adım ilerlet; yenen yemleri `false` yapar. Omurga dizisini döndürür. */
    step(dt: number, clock: number, foods: Food[]): number[] {
      fish.forEach((f, i) => {
        let tx: number, ty: number;
        let speed = 0.085;
        const food = foods
          .filter((fd) => fd.active && clock - fd.at < 6)
          .sort((a, b) => Math.hypot(a.x - f.x, a.y - f.y) - Math.hypot(b.x - f.x, b.y - f.y))[0];
        if (food) {
          tx = food.x;
          ty = food.y;
          speed = 0.15;
          if (Math.hypot(food.x - f.x, food.y - f.y) < 0.025) food.active = false;
        } else {
          const R = 0.165 + 0.025 * Math.sin(clock * 0.21);
          const a = clock * 0.42 + i * Math.PI + 0.65;
          tx = CENTER.x + Math.cos(a) * R;
          ty = CENTER.y + Math.sin(a) * R;
        }
        const want = Math.atan2(ty - f.y, tx - f.x);
        let diff = want - f.heading;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const turn = (food ? 3.2 : 1.9) * dt;
        f.heading += Math.max(-turn, Math.min(turn, diff));
        f.x += Math.cos(f.heading) * speed * dt;
        f.y += Math.sin(f.heading) * speed * dt;
        f.spine[0] = f.x;
        f.spine[1] = f.y;
        for (let k = 1; k < SPINE_POINTS; k++) {
          const px = f.spine[(k - 1) * 2], py = f.spine[(k - 1) * 2 + 1];
          let dx = f.spine[k * 2] - px, dy = f.spine[k * 2 + 1] - py;
          const d = Math.hypot(dx, dy) || 1;
          dx /= d;
          dy /= d;
          f.spine[k * 2] = px + dx * SEG;
          f.spine[k * 2 + 1] = py + dy * SEG;
        }
        // Çıktı: yüzme kıvrımı (kuyruğa doğru büyüyen yanal dalga).
        const amp = food ? 0.009 : 0.006;
        const freq = food ? 10 : 7;
        for (let k = 0; k < SPINE_POINTS; k++) {
          const nx = -Math.sin(f.heading), ny = Math.cos(f.heading);
          const w = Math.sin(clock * freq - k * 0.75) * amp * (k / (SPINE_POINTS - 1)) ** 1.3;
          out[(i * SPINE_POINTS + k) * 2] = f.spine[k * 2] + nx * w;
          out[(i * SPINE_POINTS + k) * 2 + 1] = f.spine[k * 2 + 1] + ny * w;
        }
      });
      return out;
    }
  };
}
