import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { MotionValue } from 'motion/react';
import { SceneCanvas } from '../../shared/three/SceneCanvas';
import type { StageState } from '../../shared/three';

export interface FenerSahnesiProps extends StageState {
  revealed: boolean;
  progress: MotionValue<number>;
}

/** Kameranın kaydırma boyunca yükseldiği yol (dünya birimi). */
const CLIMB = 16;
const SPAN = 26;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Fener gövdesi: alttan dar, üstten geniş kâğıt silindir; altı daha parlak. */
function lanternGeometry(): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(0.2, 0.15, 0.42, 10, 4, true);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) + 0.21) / 0.42;
    colors[i * 3] = 1;
    colors[i * 3 + 1] = 0.82 - t * 0.32;
    colors[i * 3 + 2] = 0.45 - t * 0.3;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return g;
}

/** Hale dokusu: tuvalde çizilen radyal gradyan (görsel dosyası yok). */
function glowTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,214,140,1)');
    g.addColorStop(0.25, 'rgba(255,170,80,0.55)');
    g.addColorStop(1, 'rgba(255,140,40,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Sky({ revealed, still, quality, tilt, progress }: FenerSahnesiProps) {
  const count = quality === 'high' ? 150 : 70;
  const lanterns = useRef<THREE.InstancedMesh>(null);
  const glows = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(lanternGeometry, []);
  const glowGeo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const tex = useMemo(glowTexture, []);
  const start = useRef<number | null>(null);

  const items = useMemo(() => {
    const r = seeded(31);
    return Array.from({ length: count }, (_, i) => ({
      x: (r() - 0.5) * 16,
      z: -14 + r() * 13,
      base: -6 + r() * SPAN,
      speed: 0.25 + r() * 0.35,
      sway: r() * Math.PI * 2,
      scale: 0.7 + r() * 0.7,
      delay: (i / count) * 2.2 + r() * 0.4,
      flicker: r() * 10
    }));
  }, [count]);

  const stars = useMemo(() => {
    const r = seeded(5);
    const arr = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) {
      arr[i * 3] = (r() - 0.5) * 60;
      arr[i * 3 + 1] = -4 + r() * 50;
      arr[i * 3 + 2] = -30 - r() * 10;
    }
    return arr;
  }, []);

  useLayoutEffect(() => {
    const m = glows.current;
    if (!m) return;
    for (let i = 0; i < count; i++) m.setColorAt(i, new THREE.Color(1, 0.85 + (i % 5) * 0.03, 0.7));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count]);

  const tmp = useMemo(() => ({ o: new THREE.Object3D() }), []);

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    if (revealed && start.current === null) start.current = now;
    const t = still ? 30 : start.current === null ? 0 : now - start.current;
    const climb = progress.get() * CLIMB;
    const cam = state.camera;
    cam.position.x += (tilt.current.x * 0.8 - cam.position.x) * 0.05;
    cam.position.y += (climb - tilt.current.y * 0.4 - cam.position.y) * 0.08;
    cam.lookAt(cam.position.x * 0.3, cam.position.y + 1.2, -8);

    const lm = lanterns.current;
    const gm = glows.current;
    if (!lm || !gm) return;
    items.forEach((it, i) => {
      const age = Math.max(0, t - it.delay);
      // Açılış: alçaktakiler ufkun altından dalga hâlinde salınır, yüksektekiler zaten gökte.
      const released = it.base < 3;
      const from = released ? -7.5 + (it.base + 6) * 0.08 : it.base;
      const y = still ? it.base : -8 + ((from + 8 + age * it.speed) % SPAN);
      const x = it.x + Math.sin(now * 0.4 + it.sway) * 0.25;
      const s = it.scale * (released && !still ? Math.min(1, age * 1.5) : Math.min(1, t * 0.8 + (still ? 1 : 0)));
      tmp.o.position.set(x, y, it.z);
      tmp.o.rotation.set(0, now * 0.2 + it.sway, Math.sin(now * 0.6 + it.sway) * 0.06);
      tmp.o.scale.setScalar(s);
      tmp.o.updateMatrix();
      lm.setMatrixAt(i, tmp.o.matrix);
      const flick = 1 + Math.sin(now * 9 + it.flicker) * 0.05;
      tmp.o.rotation.set(0, 0, 0);
      tmp.o.position.set(x, y - 0.05, it.z + 0.05);
      tmp.o.scale.setScalar(s * 1.6 * flick);
      tmp.o.updateMatrix();
      gm.setMatrixAt(i, tmp.o.matrix);
    });
    lm.instanceMatrix.needsUpdate = true;
    gm.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#FFF4DA" size={0.08} sizeAttenuation transparent opacity={0.8} />
      </points>
      <instancedMesh ref={lanterns} args={[geo, undefined, count]} frustumCulled={false}>
        <meshBasicMaterial vertexColors side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={glows} args={[glowGeo, undefined, count]} frustumCulled={false}>
        <meshBasicMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </instancedMesh>
    </>
  );
}

export default function FenerSahnesi(props: FenerSahnesiProps) {
  return (
    <SceneCanvas stage={props} camera={{ fov: 50, position: [0, 0, 6], near: 0.1, far: 80 }}>
      <fog attach="fog" args={['#0B1026', 10, 28]} />
      <Sky {...props} />
    </SceneCanvas>
  );
}
