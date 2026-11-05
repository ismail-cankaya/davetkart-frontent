import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { MotionValue } from 'motion/react';
import { SceneCanvas } from '../../shared/three/SceneCanvas';
import type { StageState } from '../../shared/three';
import { orbitFrame } from './yorunge';

export interface YorungeSahnesiProps extends StageState {
  revealed: boolean;
  /** 0..1 birleşme (açılış + kaydırma). */
  merge: MotionValue<number>;
  /** Sürükleyerek çevrilen düzlem açısı (radyan). */
  spin: MotionValue<number>;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function glowTexture(inner: string, outer: string): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, inner);
    g.addColorStop(0.3, outer);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Birim çember (x-z düzlemi); konum ve ölçek kare döngüsünde verilir. */
function ringGeometry(): THREE.BufferGeometry {
  const pts: number[] = [];
  for (let i = 0; i < 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    pts.push(Math.cos(a), 0, Math.sin(a));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

const CAM_DIR = new THREE.Vector3(0, 0.46, 0.89).normalize();

function System({ revealed, still, quality, tilt, merge, spin }: YorungeSahnesiProps) {
  const group = useRef<THREE.Group>(null);
  const planetA = useRef<THREE.Group>(null);
  const planetB = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.LineLoop>(null);
  const ringB = useRef<THREE.LineLoop>(null);
  const ringShared = useRef<THREE.LineLoop>(null);
  const core = useRef<THREE.Sprite>(null);
  const start = useRef<number | null>(null);
  const yaw = useRef(0);

  const ring = useMemo(ringGeometry, []);
  const texA = useMemo(() => glowTexture('rgba(160,220,255,0.9)', 'rgba(90,150,255,0.35)'), []);
  const texB = useMemo(() => glowTexture('rgba(255,190,220,0.9)', 'rgba(220,110,190,0.35)'), []);
  const texCore = useMemo(() => glowTexture('rgba(255,236,200,1)', 'rgba(255,190,120,0.4)'), []);
  const matA = useMemo(() => new THREE.LineBasicMaterial({ color: '#7FB8FF', transparent: true, opacity: 0 }), []);
  const matB = useMemo(() => new THREE.LineBasicMaterial({ color: '#F2A2D2', transparent: true, opacity: 0 }), []);
  const matS = useMemo(() => new THREE.LineBasicMaterial({ color: '#F3D9A4', transparent: true, opacity: 0 }), []);

  const stars = useMemo(() => {
    const r = seeded(11);
    const n = quality === 'high' ? 1400 : 700;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const th = r() * Math.PI * 2;
      const ph = Math.acos(2 * r() - 1);
      const rad = 30 + r() * 20;
      arr[i * 3] = rad * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = rad * Math.cos(ph);
      arr[i * 3 + 2] = rad * Math.sin(ph) * Math.sin(th);
    }
    return arr;
  }, [quality]);

  useEffect(
    () => () => {
      ring.dispose();
      texA.dispose();
      texB.dispose();
      texCore.dispose();
      matA.dispose();
      matB.dispose();
      matS.dispose();
    },
    [ring, texA, texB, texCore, matA, matB, matS]
  );

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    if (revealed && start.current === null) start.current = now;
    const age = still ? 10 : start.current === null ? 0 : now - start.current;
    const t = still ? 2.2 : now;

    // Kamera: dar ekranda sistem sığsın diye uzaklaşır.
    const cam = state.camera as THREE.PerspectiveCamera;
    const half = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const dist = Math.max(13, 4.4 / (half * Math.max(0.3, cam.aspect)));
    const tx = tilt.current.x * 0.6;
    cam.position.set(CAM_DIR.x * dist + tx, CAM_DIR.y * dist - tilt.current.y * 0.8, CAM_DIR.z * dist);
    cam.lookAt(0, 0, 0);

    // Koreografi: halkalar çizilir (0–1.6 s), gezegenler belirir (0.8–2.4 s).
    const ringIn = Math.min(1, age / 1.6);
    const planetIn = Math.min(1, Math.max(0, (age - 0.8) / 1.6));

    const target = spin.get();
    yaw.current += (target - yaw.current) * (still ? 1 : 0.12);
    if (group.current) group.current.rotation.y = yaw.current;

    const f = orbitFrame(merge.get(), t, 0);
    if (ringA.current) {
      ringA.current.position.set(f.ca, 0, 0);
      ringA.current.scale.setScalar(f.r * (0.6 + 0.4 * ringIn));
    }
    if (ringB.current) {
      ringB.current.position.set(f.cb, 0, 0);
      ringB.current.scale.setScalar(f.r * (0.6 + 0.4 * ringIn));
    }
    if (ringShared.current) ringShared.current.scale.setScalar(f.r * 1.02);
    matA.opacity = 0.75 * ringIn * (1 - f.shared * 0.8);
    matB.opacity = 0.75 * ringIn * (1 - f.shared * 0.8);
    matS.opacity = 0.85 * f.shared * ringIn;

    const bob = still ? 0 : Math.sin(now * 1.3) * 0.04;
    if (planetA.current) {
      planetA.current.position.set(f.ax, bob, f.az);
      planetA.current.scale.setScalar(planetIn);
      planetA.current.rotation.y = now * 0.4;
    }
    if (planetB.current) {
      planetB.current.position.set(f.bx, -bob, f.bz);
      planetB.current.scale.setScalar(planetIn);
      planetB.current.rotation.y = -now * 0.35;
    }
    if (core.current) {
      const s = (1.1 + f.shared * 2.2) * ringIn * (1 + (still ? 0 : Math.sin(now * 2) * 0.04));
      core.current.scale.setScalar(s);
    }
  });

  const seg = quality === 'high' ? 40 : 24;

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 1.5, 0]} intensity={30} color="#FFE2B8" distance={14} />
      <directionalLight position={[4, 6, 6]} intensity={0.9} color="#BFD4FF" />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#E9ECFF" size={0.12} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
      </points>
      <group ref={group}>
        <lineLoop ref={ringA} geometry={ring} material={matA} />
        <lineLoop ref={ringB} geometry={ring} material={matB} />
        <lineLoop ref={ringShared} geometry={ring} material={matS} />
        <sprite ref={core}>
          <spriteMaterial map={texCore} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <group ref={planetA}>
          <mesh>
            <sphereGeometry args={[0.44, seg, seg]} />
            <meshStandardMaterial color="#5E9BFF" emissive="#123A7A" emissiveIntensity={0.6} roughness={0.55} metalness={0.1} />
          </mesh>
          <sprite scale={[2.0, 2.0, 1]}>
            <spriteMaterial map={texA} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
        <group ref={planetB}>
          <mesh rotation={[0.4, 0, 0.3]}>
            <sphereGeometry args={[0.37, seg, seg]} />
            <meshStandardMaterial color="#E58BC0" emissive="#5A1648" emissiveIntensity={0.6} roughness={0.6} metalness={0.1} />
          </mesh>
          <mesh rotation={[Math.PI / 2 - 0.35, 0, 0]}>
            <torusGeometry args={[0.62, 0.022, 6, 64]} />
            <meshBasicMaterial color="#F6CFE6" transparent opacity={0.55} />
          </mesh>
          <sprite scale={[1.75, 1.75, 1]}>
            <spriteMaterial map={texB} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
      </group>
    </>
  );
}

export default function YorungeSahnesi(props: YorungeSahnesiProps) {
  return (
    <SceneCanvas stage={props} camera={{ fov: 42, position: [0, 4, 9], near: 0.1, far: 120 }}>
      <System {...props} />
    </SceneCanvas>
  );
}
