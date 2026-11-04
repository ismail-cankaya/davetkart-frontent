import React, { type ReactNode } from 'react';
import { Canvas, type CameraProps } from '@react-three/fiber';
import { dprFor } from './support';
import type { StageState } from './ThreeStage';

interface SceneCanvasProps {
  stage: StageState;
  camera?: CameraProps;
  children: ReactNode;
  /** Sahne kendi sis/arka plan rengini çiziyorsa `false` (opak, daha ucuz). */
  transparent?: boolean;
}

/**
 * R3F Canvas sarmalayıcısı — yalnızca sahne chunk'larından içe aktarılır.
 * DPR sınırı, görünmezken durma (`never`), hareketi azaltınca tek kare
 * (`demand`) ve bağlam kaybında statik görünüme dönüş burada.
 */
export function SceneCanvas({ stage, camera, children, transparent = true }: SceneCanvasProps) {
  const frameloop = !stage.active ? 'never' : stage.still ? 'demand' : 'always';
  return (
    <Canvas
      dpr={dprFor(stage.quality)}
      frameloop={frameloop}
      camera={camera}
      gl={{ antialias: stage.quality === 'high', alpha: transparent, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          stage.onFail();
        });
      }}
    >
      {children}
    </Canvas>
  );
}
