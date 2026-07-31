import React, { useRef } from 'react';
import { motion, useTransform, MotionValue } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { VideoBackdrop } from '../VideoBackdrop';
import { VideoSet } from '../videoAssets';
import { ParticleField, ParticleFieldProps } from './ParticleField';
import { BottomFade, Grain, Scrim, ScrimProps, Vignette } from './atmosphere';
import { usePointerParallax } from './usePointerParallax';

/** Parçacık katmanı + sahnedeki parallax derinliği. */
export interface ParticleLayerSpec extends ParticleFieldProps {
  /**
   * 0 = arka planla birlikte sabit, 1 = işaretçiye tam duyarlı. Ön plandaki
   * partiküllere yüksek, uzaktakilere düşük değer verilir; aradaki fark
   * derinlik hissini üretir.
   */
  depth?: number;
}

export interface HeroStageProps {
  /**
   * videoSet() çıktısı — yatay ve dikey takım birlikte.
   *
   * Opsiyoneldir: tamamen kod tabanlı (videosuz) şablonlar bu katmanı
   * atlayıp `base` + atmosfer + parçacık üçlüsüyle çalışır ve aynı parallax
   * kamerasından yararlanır.
   */
  video?: VideoSet;
  /**
   * Videonun ARKASINDA duran sabit CSS zemini (gradient ya da düz renk).
   *
   * İki işi var: video/poster inerken hero renksiz bir boşluk olarak
   * görünmez, ve videosu henüz yüklenmemiş bir slug'da kompozisyon yine de
   * eksiksiz durur — parçacıklar ve atmosfer bu zeminin üstünde çalışır.
   */
  base?: string;
  /** Okunabilirlik katmanı. `false` ise hiç basılmaz. */
  scrim?: ScrimProps | ScrimProps[] | false;
  /** Kenar karartması. */
  vignette?: { strength?: number; tint?: string } | false;
  /** Canvas parçacık katmanları — dizideki sıra z-sırasıdır. */
  particles?: ParticleLayerSpec[];
  /**
   * CSS atmosfer katmanları (GodRays, SilkVeil, FogDrift…). Parçacıkların
   * ALTINA basılır: ışık/duman arka planın parçasıdır, toz önde uçar.
   */
  atmosphere?: React.ReactNode;
  /** Parçacıkların da üstünde kalan süslemeler (çerçeve, monogram halkası). */
  overlay?: React.ReactNode;
  /** Gövde zeminine karışma rengi. */
  fadeTo?: string;
  /** Genel parallax şiddeti (px). 0 kapatır. */
  parallax?: number;
  /** Film greni yoğunluğu; false kapatır. */
  grain?: number | false;
  className?: string;
}

/**
 * Tek bir işaretçi eksenine bağlı parallax katmanı.
 *
 * Ayrı bileşen olmasının sebebi teknik: useTransform bir hook'tur, map()
 * içinde çağrılamaz. Her katman kendi hook'unu kendi bileşeninde çağırır.
 */
function ParallaxLayer({
  px,
  py,
  depth,
  amount,
  className,
  children
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  depth: number;
  amount: number;
  className?: string;
  children: React.ReactNode;
}) {
  // Ters işaret: fare sağa gidince katman sola kayar — kamera içeri bakıyor.
  const x = useTransform(px, (v) => -v * amount * depth);
  const y = useTransform(py, (v) => -v * amount * depth * 0.6);

  return (
    <motion.div style={{ x, y }} className={cn('absolute inset-0', className)}>
      {children}
    </motion.div>
  );
}

/**
 * Videolu hero'nun tam sahnesi: video → atmosfer → okunabilirlik → parçacık
 * → süsleme, hepsi tek bir parallax kamerasına bağlı.
 *
 * Katman sırası bilinçlidir. Scrim atmosferin ÜSTÜNDE, parçacıkların ALTINDA
 * durur: ışık huzmesi yumuşasın ama altın toz sönükleşmesin. Parçacığı scrim
 * altına koymak 24 konseptin tamamında tozu griye çevirirdi.
 *
 * Parallax katmanları %6 büyütülür — kayma sırasında kenarlarda boşluk
 * açılmasın diye taşma payı.
 */
export function HeroStage({
  video,
  base,
  scrim = { from: 'both', strength: 0.45 },
  vignette = { strength: 0.45 },
  particles = [],
  atmosphere,
  overlay,
  fadeTo,
  parallax = 14,
  grain = 0.035,
  className
}: HeroStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const { px, py } = usePointerParallax(stageRef);

  const scrims = scrim === false ? [] : Array.isArray(scrim) ? scrim : [scrim];
  const overscan = parallax > 0 ? '-inset-[6%]' : 'inset-0';

  return (
    <div ref={stageRef} className={cn('absolute inset-0 overflow-hidden', className)}>
      {/* 0 — Taban: video inene kadar (ya da hiç yoksa) rengi taşıyan zemin. */}
      {base && <div aria-hidden="true" className="absolute inset-0" style={{ background: base }} />}

      {/* 1 — Video: en yavaş katman, parallax'ın yarısı kadar tepki verir. */}
      {video && (
        <ParallaxLayer px={px} py={py} depth={0.35} amount={parallax} className={overscan}>
          <VideoBackdrop {...video.landscape} portrait={video.portrait} />
        </ParallaxLayer>
      )}

      {/* 2 — Atmosfer: ışık, sis, tül. Videonun uzantısı gibi davranır. */}
      {atmosphere && (
        <ParallaxLayer px={px} py={py} depth={0.6} amount={parallax} className={overscan}>
          {atmosphere}
        </ParallaxLayer>
      )}

      {/* 3 — Okunabilirlik: parallax uygulanmaz, metinle birebir hizalı kalır. */}
      {scrims.map((props, i) => (
        // Fragment sarmalayıcı: projede @types/react kurulu olmadığından
        // özel bileşenler JSX'te `key` kabul etmiyor.
        <React.Fragment key={i}>
          <Scrim {...props} />
        </React.Fragment>
      ))}
      {vignette !== false && <Vignette {...vignette} />}

      {/* 4 — Parçacıklar: en öndeki katman, işaretçiye en çok tepki veren. */}
      {particles.map(({ depth = 1, ...field }, i) => (
        <React.Fragment key={`${field.preset}-${i}`}>
          <ParallaxLayer px={px} py={py} depth={depth} amount={parallax} className={overscan}>
            <ParticleField {...field} />
          </ParallaxLayer>
        </React.Fragment>
      ))}

      {overlay}

      {grain !== false && <Grain opacity={grain} />}
      {fadeTo && <BottomFade to={fadeTo} />}
    </div>
  );
}
