import React, { useId, useMemo } from 'react';
import { motion, MotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { cn } from '../../../../../utils/cn';
import { ease } from '../../../../../utils/motion';
import { BackdropState } from '../../InvitationComposition';
import { Grain, Vignette } from '../../effects';
import { rng } from '../../effects/scenery';
import { crescent, FLOAT, STRIP, TOP, UFUK_ART, UfukStrip } from './art';
import { nightPalette, skyCss, UfukPreset } from './presets';

/**
 * Ufuk — davetiyenin tamamının arkasında yaşayan sinematik manzara.
 *
 * Diğer şablonlarda görsel yalnızca hero'dadır; bölümler düz bir zeminin
 * üstünden akar. Burada sahne kaydırma kabının ARKASINDA sabit durur ve
 * misafir kaydırdıkça zamanda ilerler:
 *
 *   hero          gün batımı — güneş ufukta, ışıklar sönük
 *   ilk kaydırma  kamera ileri süzülür: ön plan kadrajdan taşar, güneş
 *                 batar, mavi saat başlar, pencereler ve fenerler yanar
 *   bölümler      gökyüzü geceye döner, yıldızlar ve ay belirir
 *   LCV           yıldızlı gece
 *
 * ——— Okunabilirlik ———
 *
 * Bölüm metinleri sahnenin önünden geçer. İçeriğe girildiği anda bir okuma
 * perdesi (scrim) iner ve siluetler gece tonuna koyulaşır; en kalabalık
 * çizimler (ön plan, sarkan süsler) zaten kadrajdan çıkmıştır. Kartlar ayrıca
 * kendi koyu cam zeminlerini taşır (bkz. şablon temaları).
 *
 * ——— Performans ———
 *
 * Kaydırmaya bağlı her şey yalnızca `transform` ve `opacity`'dir. Degradeler
 * canlandırılmaz, üst üste duran hâlleri arasında opaklık geçişi yapılır;
 * siluetlerin gece tonu da aynı şeklin ikinci bir kopyasıdır. Sürekli dönen
 * tek şey birkaç yıldızın parıltısıdır (CSS, compositor'da).
 *
 * "Hareketi azalt" açıkken derinlik kaymaları kapanır (kamera durur), zaman
 * geçişi opaklıkla sürer — hareket değil, ışık değişir.
 */

/** Kaydırma eğrisini yumuşatan yay: sahne parmağı birkaç kare geriden, ağırca izler. */
const FOLLOW = { stiffness: 110, damping: 26, mass: 0.45 };

type Frame = 'ground' | 'float' | 'top';

/**
 * Şeridin kutusu. Dikey kadrajda kutu ekran yüksekliğinin bir oranıdır ve
 * şerit yanlardan kırpılır (ana motif ortada kalır); geniş kadrajda `cqw`
 * terimi devreye girer, kutu şeridin kendi en-boy oranına ulaşır ve üstten
 * hiçbir şey kırpılmaz. 37.5 = 600/1600, 62.5 = 1000/1600, 25 = 400/1600.
 */
const FRAMES: Record<Frame, { box: string; view: { w: number; h: number }; align: string }> = {
  ground: { box: 'bottom-0 h-[max(50%,37.5cqw)]', view: STRIP, align: 'xMidYMax slice' },
  float: { box: 'bottom-0 h-[max(85%,62.5cqw)]', view: FLOAT, align: 'xMidYMax slice' },
  top: { box: 'top-0 h-[max(32%,25cqw)]', view: TOP, align: 'xMidYMin slice' }
};

function StripSvg({ frame, children }: { frame: Frame; children: React.ReactNode }) {
  const { box, view, align } = FRAMES[frame];
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${view.w} ${view.h}`}
      preserveAspectRatio={align}
      className={cn('absolute inset-x-0 w-full', box)}
    >
      {children}
    </svg>
  );
}

interface DepthLayerProps {
  frame: Frame;
  day: UfukStrip;
  night: UfukStrip;
  /** 0 = alacakaranlık mürekkebi, 1 = gece mürekkebi. */
  nightness: MotionValue<number>;
  lights: MotionValue<number>;
  y: MotionValue<string>;
  scale?: MotionValue<number>;
  opacity?: MotionValue<number>;
  origin?: string;
}

/**
 * Tek bir derinlik katmanı: arka ışık → siluet → gece siluet → ön ışık.
 * Dördü aynı kutuda üst üste durur ve kamera hareketini birlikte yapar.
 */
function DepthLayer({ frame, day, night, nightness, lights, y, scale, opacity, origin = '50% 100%' }: DepthLayerProps) {
  return (
    <motion.div className="absolute inset-0 will-change-transform" style={{ y, scale, opacity, transformOrigin: origin }}>
      {day.glow && (
        <motion.div className="absolute inset-0" style={{ opacity: lights }}>
          <StripSvg frame={frame}>{day.glow}</StripSvg>
        </motion.div>
      )}
      <StripSvg frame={frame}>{day.shape}</StripSvg>
      <motion.div className="absolute inset-0" style={{ opacity: nightness }}>
        <StripSvg frame={frame}>{night.shape}</StripSvg>
      </motion.div>
      {day.lights && (
        <motion.div className="absolute inset-0" style={{ opacity: lights }}>
          <StripSvg frame={frame}>{day.lights}</StripSvg>
        </motion.div>
      )}
    </motion.div>
  );
}

/** Ufka oturan güneş: geniş sıcak hale + disk. Kaydırınca tepelerin ardına batar. */
function Sun({ color }: { color: string }) {
  return (
    <div className="absolute left-[68%] top-[74%] w-[15cqw] max-w-[150px] aspect-square -translate-x-1/2 -translate-y-1/2">
      <div
        className="absolute left-1/2 top-1/2 w-[900%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, rgba(${color},0.42) 0%, rgba(${color},0.15) 30%, rgba(${color},0) 62%)` }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 45%, rgb(255,247,232) 0%, rgb(${color}) 58%, rgba(${color},0.85) 100%)`,
          boxShadow: `0 0 40px 8px rgba(${color},0.5)`
        }}
      />
    </div>
  );
}

function Moon({ color, phase }: UfukPreset['moon']) {
  return (
    <div className="absolute left-[80%] top-[9%] w-[10cqw] max-w-[84px] aspect-square -translate-x-1/2">
      <div
        className="absolute left-1/2 top-1/2 w-[640%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, rgba(${color},0.2) 0%, rgba(${color},0) 60%)` }}
      />
      {phase === 'full' ? (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 36% 34%, rgb(255,255,255) 0%, rgb(${color}) 52%, rgba(${color},0.82) 100%)`,
            boxShadow: `0 0 28px rgba(${color},0.5)`
          }}
        />
      ) : (
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{ filter: `drop-shadow(0 0 10px rgba(${color},0.6))` }}
        >
          <path d={crescent(58, 50, 40)} fill={`rgb(${color})`} />
        </svg>
      )}
    </div>
  );
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkle: boolean;
  delay: number;
  period: number;
}

/** Yıldız alanı — tohumlu, yani her açılışta aynı gökyüzü. */
function makeStars(): Star[] {
  const random = rng(7);
  return Array.from({ length: 70 }, (_, i) => {
    const magnitude = random();
    return {
      x: random() * 100,
      y: random() * 64,
      size: magnitude > 0.92 ? 2.4 : magnitude > 0.6 ? 1.6 : 1.1,
      alpha: 0.4 + random() * 0.6,
      // Döngü bütçesi: yalnızca her beşinci yıldız parıldar.
      twinkle: i % 5 === 0,
      delay: random() * 6,
      period: 3 + random() * 4
    };
  });
}

export interface UfukSceneProps extends BackdropState {
  preset: UfukPreset;
}

export function UfukScene({ preset, revealed, heroExit, progress }: UfukSceneProps) {
  // Gradyan/kırpma kimlikleri belgede tekil olmalı; useId'nin ayraçları
  // (`:r1:`, `«r1»`) SVG `url(#…)` içinde geçersiz olduğu için ayıklanır.
  const uid = `ufuk${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const day = useMemo(() => UFUK_ART[preset.kind](preset.palette, uid), [preset, uid]);
  const night = useMemo(() => UFUK_ART[preset.kind](nightPalette(preset), `${uid}n`), [preset, uid]);
  const stars = useMemo(makeStars, []);

  const still = useReducedMotion();
  const k = still ? 0 : 1;

  const exit = useSpring(heroExit, FOLLOW);
  const prog = useSpring(progress, FOLLOW);

  // ——— Zaman: gün batımı → mavi saat → gece ———
  const duskOpacity = useTransform(exit, [0, 0.9], [1, 0]);
  const twilightOpacity = useTransform(prog, [0.35, 0.92], [1, 0]);
  const starsOpacity = useTransform(prog, [0.02, 0.55], [0.18, 1]);
  const sunOpacity = useTransform(exit, [0, 0.75], [1, 0]);
  const sunY = useTransform(exit, [0, 1], ['0%', `${16 * k}%`]);
  const moonOpacity = useTransform(prog, [0.12, 0.5], [0, 1]);
  const moonY = useTransform(prog, [0, 1], [`${14 * k}%`, '0%']);
  const hazeOpacity = useTransform(exit, [0, 1], [1, 0.3]);
  const lights = useTransform(exit, [0.05, 0.8], [0.32, 1]);
  // Sarkan süsler kadrajdan çıkmadan görülsün diye baştan yanar.
  const topLights = useTransform(exit, [0, 0.6], [0.85, 1]);
  const nightness = useTransform([exit, prog], ([e, p]: number[]) =>
    Math.min(1, e * 0.55 + Math.max(0, (p - 0.3) / 0.6) * 0.45)
  );
  const scrimOpacity = useTransform(exit, [0.1, 1], [0, 1]);

  // ——— Kamera: ileri süzülür. Yakın olan daha çok kayar (parallax). ———
  const farY = useTransform(exit, [0, 1], ['0%', `${5 * k}%`]);
  const midY = useTransform(exit, [0, 1], ['0%', `${12 * k}%`]);
  const nearY = useTransform(exit, [0, 1], ['0%', `${26 * k}%`]);
  const nearScale = useTransform(exit, [0, 1], [1, 1 + 0.08 * k]);
  const topY = useTransform(exit, [0, 1], ['0%', `${-34 * k}%`]);
  const topScale = useTransform(exit, [0, 1], [1, 1 + 0.06 * k]);
  // Balon ve kepler bütün davetiye boyunca gökyüzüne yükselir.
  const floatY = useTransform(prog, [0, 1], ['0%', `${-38 * k}%`]);
  const floatOpacity = useTransform(prog, [0.25, 0.85], [1, 0.25]);

  const { sky, haze, scrim, moon } = preset;

  return (
    // Açılış: sahne hafif yakın plandan geri çekilerek oturur — bir filmin
    // "kuruluş planı". Zarf varsa zarf kalkarken başlar.
    <motion.div
      className="absolute inset-0"
      style={{ transformOrigin: '50% 100%' }}
      initial={{ opacity: 0, scale: 1.08 }}
      animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
      transition={{ opacity: { duration: 1.2, ease: ease.out }, scale: { duration: 2.8, ease: ease.out } }}
    >
      {/* Gökyüzü: üç hâl üst üste, yalnızca opaklık değişir. */}
      <div className="absolute inset-0" style={{ background: skyCss(sky.night) }} />
      <motion.div className="absolute inset-0" style={{ background: skyCss(sky.twilight), opacity: twilightOpacity }} />
      <motion.div className="absolute inset-0" style={{ background: skyCss(sky.dusk), opacity: duskOpacity }} />

      <motion.div className="absolute inset-0" style={{ opacity: starsOpacity }}>
        {stars.map((star, i) => (
          <span
            key={i}
            data-atmosphere={star.twinkle ? '' : undefined}
            className={cn('absolute rounded-full', star.twinkle && 'animate-ufuk-twinkle')}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.alpha,
              background: `rgb(${moon.color})`,
              boxShadow: star.size > 2 ? `0 0 6px rgba(${moon.color},0.8)` : undefined,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.period}s`
            }}
          />
        ))}
        {/* Kayan yıldız: on bir saniyede bir, bir saniyelik bir çizgi. */}
        <div className="absolute left-[60%] top-[13%] w-[22cqw] h-px -rotate-[24deg] origin-left">
          <span
            data-atmosphere=""
            className="absolute inset-0 animate-ufuk-shoot"
            style={{ opacity: 0, background: 'linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0))' }}
          />
        </div>
      </motion.div>

      <motion.div className="absolute inset-0" style={{ opacity: moonOpacity, y: moonY }}>
        <Moon {...moon} />
      </motion.div>

      <motion.div className="absolute inset-0" style={{ opacity: sunOpacity, y: sunY }}>
        <Sun color={preset.sun} />
      </motion.div>

      <DepthLayer frame="ground" day={day.far} night={night.far} nightness={nightness} lights={lights} y={farY} />

      {/* Ufuk sisi: uzak tepeleri havaya gömer, ana motifi öne çıkarır. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          opacity: hazeOpacity,
          background: `linear-gradient(to top, rgba(${haze},0) 8%, rgba(${haze},0.34) 34%, rgba(${haze},0.12) 58%, rgba(${haze},0) 80%)`
        }}
      />

      {day.float && night.float && (
        <DepthLayer
          frame="float"
          day={day.float}
          night={night.float}
          nightness={nightness}
          lights={lights}
          y={floatY}
          opacity={floatOpacity}
        />
      )}

      <DepthLayer frame="ground" day={day.mid} night={night.mid} nightness={nightness} lights={lights} y={midY} />
      <DepthLayer
        frame="ground"
        day={day.near}
        night={night.near}
        nightness={nightness}
        lights={lights}
        y={nearY}
        scale={nearScale}
      />

      {day.top && night.top && (
        <DepthLayer
          frame="top"
          day={day.top}
          night={night.top}
          nightness={nightness}
          lights={topLights}
          y={topY}
          scale={topScale}
          origin="50% 0%"
        />
      )}

      {/* Okuma perdesi: bölümler akarken sahneyi kısar. */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: scrimOpacity,
          background: `linear-gradient(180deg, rgba(${scrim},0.6) 0%, rgba(${scrim},0.38) 38%, rgba(${scrim},0.46) 72%, rgba(${scrim},0.72) 100%)`
        }}
      />
      <Vignette strength={0.32} tint={scrim} />
      <Grain opacity={0.03} />
    </motion.div>
  );
}
