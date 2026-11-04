import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import type { MotionValue } from 'motion/react';
import { SceneCanvas } from '../../shared/three/SceneCanvas';
import type { StageState } from '../../shared/three';
import { createLeafGeometry, createPetalGeometry, roseLayout, seeded, vineCurve } from './gulGeometri';

export interface GulSahnesiProps extends StageState {
  revealed: boolean;
  heroExit: MotionValue<number>;
}

const FOV = 38;
const CAMERA_Z = 10;
/** Açılış: kamera güllerin arasından geri çekilir (s). */
const DOLLY = 2.6;

const easeOutCubic = (x: number) => 1 - (1 - Math.min(1, Math.max(0, x))) ** 3;
const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};
const easeOutBack = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  const c = 1.5;
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
};

/** Açılış saatini paylaşır: kapı açılınca (revealed) başlar; hareketi azaltınca hep "bitti". */
function useOpeningClock(revealed: boolean, still: boolean) {
  const start = useRef<number | null>(null);
  return (now: number) => {
    if (still) return 30;
    if (!revealed) return 0;
    if (start.current === null) start.current = now;
    return now - start.current;
  };
}

function Garden({ revealed, still, quality, tilt, heroExit }: GulSahnesiProps) {
  const { size, camera, invalidate } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const halfH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z;
  const halfW = halfH * aspect;
  const unit = Math.min(halfW, halfH);

  const roseCount = quality === 'high' ? 12 : 9;
  const petalsPerRose = quality === 'high' ? 22 : 15;
  const fallingCount = quality === 'high' ? 70 : 30;

  const roses = useMemo(() => roseLayout(aspect, roseCount), [aspect, roseCount]);
  const petalGeo = useMemo(createPetalGeometry, []);
  const leafGeo = useMemo(createLeafGeometry, []);
  const vines = useMemo(() => {
    const rand = seeded(11);
    return ([[-1, 1], [1, -1], [1, 1], [-1, -1]] as const).map(([sx, sy]) =>
      new THREE.TubeGeometry(vineCurve(halfW, halfH, sx, sy, rand), 90, 0.028, 5, false)
    );
  }, [halfW, halfH]);

  const petals = useRef<THREE.InstancedMesh>(null);
  const leaves = useRef<THREE.InstancedMesh>(null);
  const falling = useRef<THREE.InstancedMesh>(null);
  const vineRefs = useRef<(THREE.Mesh | null)[]>([]);
  const clock = useOpeningClock(revealed, still);

  // Düşen yaprakların kalıcı durumu: konum, hız, dönüş.
  const drift = useMemo(() => {
    const rand = seeded(23);
    return Array.from({ length: fallingCount }, () => ({
      x: (rand() - 0.5) * 2.2,
      y: rand() * 2 - 1,
      z: -2 + rand() * 3.5,
      speed: 0.18 + rand() * 0.22,
      sway: rand() * Math.PI * 2,
      rx: rand() * Math.PI,
      ry: rand() * Math.PI,
      spin: 0.4 + rand() * 0.9,
      scale: 0.16 + rand() * 0.12
    }));
  }, [fallingCount]);

  useLayoutEffect(() => {
    const mesh = petals.current;
    if (!mesh) return;
    for (let r = 0; r < roses.length; r++) {
      for (let p = 0; p < petalsPerRose; p++) {
        const shade = 0.85 + ((p * 37) % 11) / 55;
        mesh.setColorAt(r * petalsPerRose + p, roses[r].color.clone().multiplyScalar(shade));
      }
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    const leafMesh = leaves.current;
    if (leafMesh) {
      const green = new THREE.Color('#2F5A3A');
      for (let i = 0; i < roses.length * 3; i++) leafMesh.setColorAt(i, green.clone().multiplyScalar(0.8 + (i % 3) * 0.12));
      if (leafMesh.instanceColor) leafMesh.instanceColor.needsUpdate = true;
    }
    const fall = falling.current;
    if (fall) {
      for (let i = 0; i < fallingCount; i++) fall.setColorAt(i, new THREE.Color(i % 3 === 0 ? '#F2C7C2' : '#C23A55'));
      if (fall.instanceColor) fall.instanceColor.needsUpdate = true;
    }
    invalidate();
  }, [roses, petalsPerRose, fallingCount, invalidate]);

  const m = useMemo(
    () => ({
      rose: new THREE.Matrix4(),
      local: new THREE.Matrix4(),
      tmp: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      e: new THREE.Euler(),
      p: new THREE.Vector3(),
      s: new THREE.Vector3(),
      look: new THREE.Vector3()
    }),
    []
  );

  useFrame((state, delta) => {
    const t = clock(state.clock.elapsedTime);
    const time = still ? 0 : state.clock.elapsedTime;
    const exit = heroExit.get();

    // Kamera: güllerin içinden geri çekilir, kaydırınca yukarı süzülür, eğimle hafifçe döner.
    const dolly = easeOutCubic(t / DOLLY);
    const cam = camera as THREE.PerspectiveCamera;
    const tx = tilt.current.x * 0.45;
    const ty = -tilt.current.y * 0.3;
    cam.position.x += (tx - cam.position.x) * 0.06;
    cam.position.y += (ty - exit * 2.4 - cam.position.y) * 0.08;
    cam.position.z = 6.4 + (CAMERA_Z - 6.4) * dolly + exit * 1.5;
    m.look.set(0, -exit * 1.6, 0);
    cam.lookAt(m.look);
    cam.rotation.z = (1 - dolly) * 0.12;

    const petalMesh = petals.current;
    const leafMesh = leaves.current;
    if (petalMesh && leafMesh) {
      roses.forEach((rose, r) => {
        const grow = easeOutBack((t - rose.delay) / 0.9);
        const bloom = smooth((t - rose.delay - 0.2) / 1.7);
        const sway = Math.sin(time * 0.6 + r) * 0.04;
        const size = rose.size * unit * (aspect < 0.9 ? 0.36 : 0.26) * Math.max(0.001, grow);
        m.p.set(rose.fx * 2 * halfW, rose.fy * 2 * halfH, rose.z);
        m.e.set(Math.PI / 2 + rose.tiltX + sway, rose.tiltY, rose.spin + time * 0.03);
        m.q.setFromEuler(m.e);
        m.s.setScalar(size);
        m.rose.compose(m.p, m.q, m.s);

        for (let p = 0; p < petalsPerRose; p++) {
          const layer = p / (petalsPerRose - 1);
          const angle = p * 2.39996;
          const closed = 0.12 + 0.3 * layer;
          const open = 0.22 + 1.3 * layer;
          const tiltAngle = closed + (open - closed) * bloom;
          const s = 0.32 + 0.78 * layer;
          m.local.makeRotationY(angle);
          m.local.multiply(m.tmp.makeTranslation(0, (1 - layer) * 0.1, 0.03 + 0.1 * layer * (0.6 + 0.4 * bloom)));
          m.local.multiply(m.tmp.makeRotationX(tiltAngle));
          m.local.multiply(m.tmp.makeScale(s, s * 1.08, s));
          m.tmp.multiplyMatrices(m.rose, m.local);
          petalMesh.setMatrixAt(r * petalsPerRose + p, m.tmp);
        }
        for (let l = 0; l < 3; l++) {
          m.local.makeRotationY(rose.spin + l * 2.1);
          m.local.multiply(m.tmp.makeTranslation(0, -0.05, 0.25));
          m.local.multiply(m.tmp.makeRotationX(1.25 + 0.25 * bloom));
          m.local.multiply(m.tmp.makeScale(0.95, 1.25, 0.95));
          m.tmp.multiplyMatrices(m.rose, m.local);
          leafMesh.setMatrixAt(r * 3 + l, m.tmp);
        }
      });
      petalMesh.instanceMatrix.needsUpdate = true;
      leafMesh.instanceMatrix.needsUpdate = true;
    }

    // Sarmaşıklar: çizim aralığı büyüyerek "uzar".
    const grow = easeOutCubic(t / 2);
    vineRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const g = mesh.geometry;
      const total = g.index ? g.index.count : 0;
      const segments = Math.floor(90 * Math.min(1, grow * (1 - i * 0.06) + 0.02));
      g.setDrawRange(0, Math.min(total, segments * 5 * 6));
    });

    // Düşen taç yaprakları (açılıştan ~1 s sonra başlar).
    const fall = falling.current;
    if (fall) {
      const visible = smooth((t - 1) / 1.5);
      const dt = Math.min(delta, 0.05);
      drift.forEach((d, i) => {
        if (!still) {
          d.y -= d.speed * dt * 0.5;
          d.rx += d.spin * dt;
          d.ry += d.spin * 0.7 * dt;
          if (d.y < -1.15) d.y = 1.15;
        }
        m.p.set(
          d.x * halfW + Math.sin(time * 0.7 + d.sway) * 0.35,
          d.y * halfH - exit * 2.4,
          d.z
        );
        m.e.set(d.rx, d.ry, d.sway);
        m.q.setFromEuler(m.e);
        m.s.setScalar(d.scale * unit * 0.22 * visible);
        m.tmp.compose(m.p, m.q, m.s);
        fall.setMatrixAt(i, m.tmp);
      });
      fall.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={petals} args={[petalGeo, undefined, roses.length * petalsPerRose]} frustumCulled={false}>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.55} metalness={0} />
      </instancedMesh>
      <instancedMesh ref={leaves} args={[leafGeo, undefined, roses.length * 3]} frustumCulled={false}>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.7} />
      </instancedMesh>
      {vines.map((geo, i) => (
        <mesh
          key={i}
          geometry={geo}
          ref={(el) => {
            vineRefs.current[i] = el;
          }}
        >
          <meshStandardMaterial color="#25462E" roughness={0.8} />
        </mesh>
      ))}
      <instancedMesh ref={falling} args={[petalGeo, undefined, fallingCount]} frustumCulled={false}>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.6} transparent opacity={0.92} />
      </instancedMesh>
    </>
  );
}

/** Tembel chunk'ın tek girişi: Canvas + ışık + bahçe. */
export default function GulSahnesi(props: GulSahnesiProps) {
  return (
    <SceneCanvas stage={props} camera={{ fov: FOV, position: [0, 0, 6.4], near: 0.1, far: 40 }}>
      <fog attach="fog" args={['#1A0A10', 9, 17]} />
      <hemisphereLight args={['#FFE9DC', '#3A0E1A', 0.85]} />
      <directionalLight position={[-4, 6, 8]} intensity={2.1} color="#FFE2C8" />
      <pointLight position={[0, 0, 3]} intensity={6} distance={14} color="#FF9AA8" />
      <Garden {...props} />
    </SceneCanvas>
  );
}
