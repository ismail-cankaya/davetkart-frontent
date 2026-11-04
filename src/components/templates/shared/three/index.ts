/**
 * Ortak 3D altyapısı. Bu barrel three.js İÇERMEZ; `SceneCanvas` yalnızca
 * tembel sahne modüllerinden doğrudan yoldan (`shared/three/SceneCanvas`) alınır.
 */
export { ThreeStage, type StageState } from './ThreeStage';
export { useCanvasSlot } from './canvasSlot';
export { hasWebGL, isVeryLowEnd, preferredQuality, dprFor, type StageQuality } from './support';
export { useStageActive } from './useStageActive';
export { useTilt, type Tilt } from './useTilt';
export { GyroButton } from './GyroButton';
