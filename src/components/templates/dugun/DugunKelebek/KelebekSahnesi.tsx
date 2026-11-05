import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { SceneCanvas } from '../../shared/three/SceneCanvas';
import type { StageState } from '../../shared/three';
import { BUTTERFLY_PALETTES, type Perch, type PointerState } from './kelebek';

export interface KelebekSahnesiProps extends StageState {
  /** Harflerin üstündeki konma noktaları (sahne kabına göre px, sol üst köken). */
  perches: React.MutableRefObject<Perch[]>;
  pointer: React.MutableRefObject<PointerState>;
}

const FOV = 32;

/**
 * Kanat: gövde ekseni y. Her köşe kendi kanadının menteşesinde (x = 0) döner;
 * çırpma açısı örnek başına `aFlap` (CPU'dan). Kanat biçimi ve deseni parça
 * gölgelendiricisinde uv'den çizilir: ön kanat büyük elips, arka kanat küçük,
 * kenarda koyu şerit, uçta beyaz benekler, damarlar. Doku yok.
 */
const VERT = /* glsl */ `
attribute float aFlap;
attribute vec3 aColorA;
attribute vec3 aColorB;
varying vec2 vUv;
varying vec3 vA;
varying vec3 vB;
varying float vShade;
void main() {
  vUv = uv;
  vA = aColorA;
  vB = aColorB;
  vec3 p = position;
  float side = sign(p.x);
  float ax = abs(p.x);
  // Menteşe etrafında yukarı katlanma (z'ye doğru).
  p.x = side * ax * cos(aFlap);
  p.z = ax * sin(aFlap);
  vShade = 0.65 + 0.35 * cos(aFlap);
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(p, 1.0);
}
`;

const FRAG = /* glsl */ `
varying vec2 vUv;
varying vec3 vA;
varying vec3 vB;
varying float vShade;
void main() {
  vec2 q = vec2(abs(vUv.x - 0.5) * 2.0, vUv.y * 2.0 - 1.0); // q.x: gövdeden uca 0..1, q.y: -1 (kuyruk) .. 1 (baş)
  // Ön kanat (üst) ve arka kanat (alt)
  // Ön kanat dışa-yukarı eğik uzun elips (uç sivri görünür), arka kanat aşağı eğik yuvarlak.
  vec2 f0 = q - vec2(0.46, 0.34);
  vec2 h0 = q - vec2(0.3, -0.4);
  float ca = cos(0.65), sa = sin(0.65), cb = cos(-0.55), sb = sin(-0.55);
  vec2 f = vec2(ca * f0.x + sa * f0.y, -sa * f0.x + ca * f0.y) / vec2(0.58, 0.33);
  vec2 h = vec2(cb * h0.x + sb * h0.y, -sb * h0.x + cb * h0.y) / vec2(0.36, 0.3);
  float fw = 1.0 - dot(f, f);
  float hw = 1.0 - dot(h, h);
  float wing = max(fw, hw);
  // Gövde
  float body = 1.0 - length((q - vec2(0.0, -0.05)) / vec2(0.07, 0.72));
  if (wing < 0.0 && body < 0.0) discard;
  vec3 col = mix(vA, vB, smoothstep(0.1, 0.95, length(q * vec2(1.0, 0.8))));
  // Koyu kenar şeridi ve uçta beyaz benekler
  float edge = smoothstep(0.18, 0.02, wing);
  col = mix(col, vec3(0.12, 0.09, 0.12), edge * 0.85);
  float spots = smoothstep(0.06, 0.02, length(q - vec2(0.84, 0.66))) + smoothstep(0.045, 0.015, length(q - vec2(0.7, 0.78)));
  col = mix(col, vec3(1.0), spots * 0.9);
  // Damarlar
  float vein = smoothstep(0.03, 0.0, abs(sin(atan(q.y + 0.1, q.x) * 7.0))) * step(0.15, q.x) * (1.0 - edge);
  col *= 1.0 - vein * 0.18;
  if (body > 0.0 && wing < 0.25) col = vec3(0.16, 0.12, 0.14);
  gl_FragColor = vec4(col * vShade, 1.0);
}
`;

type Mode = 'fly' | 'perch' | 'flee';

interface Fly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number;
  size: number;
  mode: Mode;
  timer: number;
  perch: number;
  flap: number;
  phase: number;
  speed: number;
}

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function Swarm({ still, quality, perches, pointer }: KelebekSahnesiProps) {
  const { size, camera } = useThree();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = quality === 'high' ? 34 : 22;
  const rnd = useMemo(() => seeded(42), []);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(2, 1.6, 2, 1);
    const pal = Array.from({ length: count }, (_, i) => BUTTERFLY_PALETTES[i % BUTTERFLY_PALETTES.length]);
    g.setAttribute('aFlap', new THREE.InstancedBufferAttribute(new Float32Array(count), 1));
    g.setAttribute('aColorA', new THREE.InstancedBufferAttribute(new Float32Array(pal.flatMap((p) => p[0])), 3));
    g.setAttribute('aColorB', new THREE.InstancedBufferAttribute(new Float32Array(pal.flatMap((p) => p[1])), 3));
    return g;
  }, [count]);
  const material = useMemo(() => new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, side: THREE.DoubleSide, transparent: false }), []);

  const flies = useRef<Fly[]>([]);
  /** Son işlenen dokunuşun damgası: her dokunuş tam bir kez kaçırır. */
  const handledTap = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Kamerayı piksel ölçeğine kur: z = 0 düzleminde 1 birim = 1 CSS pikseli.
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = FOV;
    cam.position.set(0, 0, size.height / 2 / Math.tan((FOV * Math.PI) / 360));
    cam.near = 1;
    cam.far = cam.position.z * 3;
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  // İlk durum: yarısı harflerde dinlenir (adlar baştan süslü), kalanı kenarlardan uçar.
  useEffect(() => {
    flies.current = Array.from({ length: count }, (_, i) => {
      const p = perches.current;
      const perched = p.length > 0 && i % 2 === 0;
      const pp = perched ? p[(i / 2) % p.length | 0] : null;
      const side = rnd() > 0.5 ? 1 : -1;
      return {
        x: pp ? pp.x - size.width / 2 : side * (size.width / 2 + 40 + rnd() * 120),
        y: pp ? size.height / 2 - pp.y : (rnd() - 0.5) * size.height * 0.8,
        vx: 0,
        vy: 0,
        heading: pp ? 0 : side > 0 ? Math.PI : 0,
        size: 12 + rnd() * 6,
        mode: perched ? 'perch' : 'fly',
        timer: 2 + rnd() * 6,
        perch: perched ? (i / 2) % Math.max(1, p.length) | 0 : -1,
        flap: 0.4,
        phase: rnd() * 10,
        speed: 70 + rnd() * 40
      };
    });
  }, [count, perches, rnd, size.width, size.height]);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = still ? 0 : Math.min(0.05, delta);
    const t = state.clock.elapsedTime;
    const W = size.width / 2;
    const H = size.height / 2;
    const ptr = pointer.current;
    const px = ptr.x - W;
    const py = H - ptr.y;
    const p = perches.current;
    const freshTap = ptr.tapAt > 0 && ptr.tapAt !== handledTap.current;
    if (freshTap) handledTap.current = ptr.tapAt;

    flies.current.forEach((f, i) => {
      f.timer -= dt;
      // Dokunuş: yakındaki kelebekler kaçar.
      if (freshTap && Math.hypot(f.x - px, f.y - py) < 140) {
        const a = Math.atan2(f.y - py, f.x - px);
        f.vx = Math.cos(a) * 260;
        f.vy = Math.sin(a) * 260;
        f.mode = 'flee';
        f.timer = 1.6;
      }
      if (f.mode === 'perch') {
        // Dinlenme: kanatlar yavaşça açılıp kapanır.
        f.flap = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.4 + f.phase));
        const target = p[f.perch];
        if (target) {
          f.x += (target.x - W - f.x) * Math.min(1, dt * 8);
          f.y += (H - target.y - f.y) * Math.min(1, dt * 8);
        }
        f.heading += (0 - f.heading) * Math.min(1, dt * 4);
        if (f.timer <= 0 || !target) {
          f.mode = 'fly';
          f.timer = 4 + rnd() * 6;
          f.vy = 80;
        }
      } else {
        let tx: number, ty: number;
        const nearPointer = ptr.active && Math.hypot(f.x - px, f.y - py) < 280;
        if (f.mode === 'flee') {
          tx = f.x + f.vx;
          ty = f.y + f.vy;
          if (f.timer <= 0) f.mode = 'fly';
        } else if (nearPointer && i % 3 !== 0) {
          // Parmağın çevresinde dönerek izle.
          tx = px + Math.cos(t * 1.7 + f.phase) * 46;
          ty = py + Math.sin(t * 2.1 + f.phase) * 34;
        } else if (f.timer <= 0 && p.length) {
          // Bir harfe konmaya git.
          if (f.perch < 0) f.perch = (rnd() * p.length) | 0;
          const target = p[f.perch];
          tx = target.x - W;
          ty = H - target.y;
          if (Math.hypot(tx - f.x, ty - f.y) < 6) {
            f.mode = 'perch';
            f.timer = 3 + rnd() * 6;
          }
        } else {
          // Serbest gezinme: yavaş değişen hedef.
          tx = Math.sin(t * 0.21 + f.phase) * W * 0.85;
          ty = Math.cos(t * 0.17 + f.phase * 1.3) * H * 0.75;
          f.perch = -1;
        }
        const ax = (tx - f.x) * 1.6 - f.vx * 1.4;
        const ay = (ty - f.y) * 1.6 - f.vy * 1.4 + Math.sin(t * 6 + f.phase) * 120;
        f.vx += ax * dt;
        f.vy += ay * dt;
        const sp = Math.hypot(f.vx, f.vy);
        const max = f.mode === 'flee' ? 320 : f.speed;
        if (sp > max) {
          f.vx = (f.vx / sp) * max;
          f.vy = (f.vy / sp) * max;
        }
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        const want = Math.atan2(f.vy, f.vx) - Math.PI / 2;
        let d = want - f.heading;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        f.heading += d * Math.min(1, dt * 5);
        f.flap = 0.15 + 1.15 * (0.5 + 0.5 * Math.sin(t * (f.mode === 'flee' ? 26 : 17) + f.phase));
      }
      if (still) f.flap = 0.5;
      dummy.position.set(f.x, f.y, 0);
      dummy.rotation.set(0.5, 0, f.heading);
      dummy.scale.setScalar(f.size);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      (geometry.getAttribute('aFlap') as THREE.InstancedBufferAttribute).setX(i, f.flap);
    });
    m.instanceMatrix.needsUpdate = true;
    geometry.getAttribute('aFlap').needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} />;
}

export default function KelebekSahnesi(props: KelebekSahnesiProps) {
  return (
    <SceneCanvas stage={props} camera={{ fov: FOV, position: [0, 0, 1000], near: 1, far: 4000 }}>
      <Swarm {...props} />
    </SceneCanvas>
  );
}
