import * as THREE from 'three';

/**
 * Prosedürel gül parçaları. Model ya da doku indirilmez: taç yaprağı ve yaprak,
 * bükülmüş bir düzlemden üretilir; gül, bu yaprağın altın açıyla (137.5°)
 * sarmal dizilmiş örnekleridir (InstancedMesh, tek çizim çağrısı).
 */

/** Taç yaprağı: tabanı y=0'da, iç yüzü +z. Kenarlar içe kıvrık, uç dışa döner. */
export function createPetalGeometry(): THREE.BufferGeometry {
  const g = new THREE.PlaneGeometry(1, 1, 8, 12);
  g.translate(0, 0.5, 0);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) + 0.5;
    const v = pos.getY(i);
    let width = 0.32 + 0.68 * Math.sin(Math.PI * v * 0.82 + 0.25);
    if (v > 0.72) width *= Math.sqrt(Math.max(0, 1 - ((v - 0.72) / 0.29) ** 2));
    const e = (u - 0.5) * 2;
    const x = (u - 0.5) * width;
    // İçe kıvrık kenar (çanak) ve dışa dönen uç.
    let z = -e * e * 0.2 * (0.35 + v);
    z += Math.max(0, (v - 0.55) / 0.45) ** 2 * 0.24;
    z += Math.abs(e) * v ** 3 * 0.12;
    pos.setXYZ(i, x, v, z);
    // Taban koyu, kenar ve uç açık: tek renkle derinlik.
    const shade = 0.42 + 0.5 * v + 0.12 * Math.abs(e) * v;
    colors[i * 3] = shade;
    colors[i * 3 + 1] = shade;
    colors[i * 3 + 2] = shade;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

/** Yaprak: sivri uçlu, orta damar boyunca hafif katlı. */
export function createLeafGeometry(): THREE.BufferGeometry {
  const g = new THREE.PlaneGeometry(1, 1, 4, 8);
  g.translate(0, 0.5, 0);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) + 0.5;
    const v = pos.getY(i);
    const width = Math.sin(Math.PI * Math.min(1, v * 1.02)) ** 0.9 * 0.42;
    const e = (u - 0.5) * 2;
    pos.setXYZ(i, e * width, v, -Math.abs(e) * 0.08 + Math.sin(v * Math.PI) * 0.06);
    const shade = 0.6 + 0.4 * (1 - Math.abs(e));
    colors[i * 3] = shade;
    colors[i * 3 + 1] = shade;
    colors[i * 3 + 2] = shade;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

/** Sahnedeki bir gül: ekran oranına göre konum (-0.5..0.5), boy ve renk. */
export interface RoseSpec {
  fx: number;
  fy: number;
  z: number;
  size: number;
  color: THREE.Color;
  /** Açılma gecikmesi (s). */
  delay: number;
  /** Kameraya bakış sapması. */
  tiltX: number;
  tiltY: number;
  spin: number;
}

const ROSE_COLORS = ['#9E1B32', '#B8314A', '#E8A0A8', '#F2C7C2', '#7E1028', '#D9667A'];

/** Deterministik sözde rastgele (aynı davetiye her açılışta aynı buketi görür). */
export function seeded(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Kartı çevreleyen çelenk: köşelerde kümeler, kenarlarda tek güller.
 * Dar (telefon) ekranda güller üst ve alt banda, geniş ekranda yanlara toplanır.
 */
export function roseLayout(aspect: number, count: number): RoseSpec[] {
  const rand = seeded(7);
  const narrow = aspect < 0.9;
  const anchors: [number, number, number][] = narrow
    ? [
        [-0.42, 0.44, 1.15], [-0.18, 0.5, 0.85], [0.08, 0.47, 0.7], [0.36, 0.42, 1.05],
        [0.44, -0.4, 1.2], [0.15, -0.49, 0.85], [-0.12, -0.46, 0.75], [-0.4, -0.38, 1.0],
        [-0.5, 0.15, 0.7], [0.5, -0.1, 0.7], [0.27, 0.5, 0.6], [-0.3, -0.5, 0.6]
      ]
    : [
        [-0.44, 0.38, 1.25], [-0.36, 0.1, 0.85], [-0.46, -0.2, 0.95], [-0.3, -0.42, 0.8],
        [0.44, -0.36, 1.25], [0.36, -0.08, 0.85], [0.46, 0.22, 0.95], [0.3, 0.44, 0.8],
        [-0.18, 0.48, 0.6], [0.18, -0.48, 0.6], [-0.48, 0.45, 0.6], [0.48, -0.46, 0.65]
      ];
  return anchors.slice(0, count).map(([fx, fy, size], i) => ({
    fx,
    fy,
    z: -0.6 + rand() * 1.4,
    size,
    color: new THREE.Color(ROSE_COLORS[i % ROSE_COLORS.length]),
    delay: 0.15 + i * 0.13 + rand() * 0.2,
    tiltX: (rand() - 0.5) * 0.7,
    tiltY: -fx * 0.9 + (rand() - 0.5) * 0.3,
    spin: rand() * Math.PI * 2
  }));
}

/** Sarmaşık eğrisi: ekran köşesinden kartın kenarına kıvrılarak gelir. */
export function vineCurve(halfW: number, halfH: number, sx: number, sy: number, rand: () => number): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = sx * halfW * (1.1 - t * 0.55) + Math.sin(t * 5 + rand() * 2) * 0.25;
    const y = sy * halfH * (1.05 - t * 0.35) + Math.cos(t * 4 + rand()) * 0.3;
    pts.push(new THREE.Vector3(x, y, -0.8 + t * 0.6));
  }
  return new THREE.CatmullRomCurve3(pts);
}
