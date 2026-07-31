/**
 * Hero efekt katmanının tek giriş noktası. Şablonlar yalnızca buradan
 * içe aktarır; motorun iç dosyalarına doğrudan bağlanmaz.
 */

export { HeroStage } from './HeroStage';
export type { HeroStageProps, ParticleLayerSpec } from './HeroStage';

export { ParticleField } from './ParticleField';
export type { ParticleFieldProps } from './ParticleField';

export { GlassPanel } from './GlassPanel';
export { usePointerParallax } from './usePointerParallax';

export {
  Scrim,
  Vignette,
  GodRays,
  LightLeak,
  Halo,
  FogDrift,
  SilkVeil,
  AuroraMesh,
  Iridescent,
  GoldSheen,
  Grain,
  BottomFade
} from './atmosphere';

export { PRESETS } from './particleEngine';
export type { PresetName, FieldOptions } from './particleEngine';
