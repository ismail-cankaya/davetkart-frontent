import React, { Component, Suspense, useCallback, useEffect, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { useCanvasSlot } from './canvasSlot';
import { hasWebGL, isVeryLowEnd, preferredQuality, type StageQuality } from './support';
import { useStageActive } from './useStageActive';
import { useTilt, type Tilt } from './useTilt';

/** 3D sahneye geçirilen durum. Sahne modülü bunu `SceneCanvas`'a iletir. */
export interface StageState {
  /** Ekranda ve sekme görünür: kare döngüsü çalışır. */
  active: boolean;
  /** Hareketi azalt: sahne son hâlini tek kare çizer (`frameloop="demand"`). */
  still: boolean;
  quality: StageQuality;
  tilt: MutableRefObject<Tilt>;
  /** Bağlam kaybı ya da hata: statik görünüme dönülür. */
  onFail: () => void;
}

class SceneBoundary extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface ThreeStageProps {
  mode: 'preview' | 'live';
  /** Her zaman çizilen statik/2D görünüm: SSR, WebGL yok, zayıf cihaz, yükleniyor. */
  fallback: ReactNode;
  /** Tembel sahne bileşenini çizer (three.js yalnızca o chunk'ta). */
  children: (state: StageState) => ReactNode;
  className?: string;
}

/**
 * 3D sahne kapısı. three.js içe aktarmaz; sahne yalnızca istemcide, WebGL
 * varsa, cihaz çok zayıf değilse ve sayfadaki tek Canvas yuvası boşsa açılır.
 * Statik görünüm altta hep durur: sahne inene kadar ve sahne düşerse o görünür.
 */
export function ThreeStage({ mode, fallback, children, className }: ThreeStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => setMounted(true), []);

  const eligible = mounted && !failed && hasWebGL() && !isVeryLowEnd();
  const hasSlot = useCanvasSlot(eligible);
  const active = useStageActive(ref);
  const tilt = useTilt(hasSlot && !reduced && mode === 'live');
  const onFail = useCallback(() => setFailed(true), []);

  return (
    <div ref={ref} className={className ?? 'absolute inset-0 overflow-hidden'} aria-hidden="true">
      {fallback}
      {hasSlot && (
        <SceneBoundary onFail={onFail}>
          <Suspense fallback={null}>
            {children({ active, still: reduced, quality: preferredQuality(mode), tilt, onFail })}
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
