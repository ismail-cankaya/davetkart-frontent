import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { createParticleField, FieldOptions, PresetName } from './particleEngine';

export interface ParticleFieldProps extends Omit<FieldOptions, 'preset'> {
  preset: PresetName;
  className?: string;
  /**
   * Karışım modu. 'screen' parlayan efektleri (toz, kıvılcım) videonun koyu
   * bölgelerinde eritir; fiziksel objelerde (yaprak, konfeti) 'normal' kalır.
   */
  blend?: 'normal' | 'screen' | 'plus-lighter' | 'overlay' | 'soft-light';
}

const BLEND_CLASS: Record<NonNullable<ParticleFieldProps['blend']>, string> = {
  normal: '',
  screen: 'mix-blend-screen',
  'plus-lighter': 'mix-blend-plus-lighter',
  overlay: 'mix-blend-overlay',
  'soft-light': 'mix-blend-soft-light'
};

/**
 * Parçacık alanını hero'nun üstüne serer.
 *
 * İki koruma her şablonda geçerlidir:
 *  - Ekranda değilse rAF döngüsü tamamen durur (IntersectionObserver).
 *  - "Hareketi azalt" açıksa tek durağan kare çizilir; döngü hiç başlamaz.
 *
 * Katman her zaman pointer-events:none'dır — işaretçi etkileşimi window
 * üzerinden okunur, davetiyenin tıklanabilir alanları asla bloke edilmez.
 */
export function ParticleField({
  preset,
  colors,
  density,
  speed,
  pointerStrength,
  opacity = 1,
  seed,
  className,
  blend = 'normal'
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  // Renk dizisi her render'da yeni referans olur; efekti içerikten tetikle ki
  // motor gereksiz yere yıkılıp yeniden kurulmasın.
  const colorKey = colors.join('|');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const field = createParticleField(
      canvas,
      {
        preset,
        colors: colorKey.split('|'),
        density,
        speed,
        pointerStrength: reducedMotion ? 0 : pointerStrength,
        seed
      },
      { staticFrame: Boolean(reducedMotion) }
    );

    if (reducedMotion) {
      return () => field.destroy();
    }

    const observer = new IntersectionObserver(
      ([entry]) => field.setRunning(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      field.destroy();
    };
  }, [preset, colorKey, density, speed, pointerStrength, seed, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        'absolute inset-0 w-full h-full pointer-events-none',
        BLEND_CLASS[blend],
        className
      )}
      style={{ opacity }}
    />
  );
}
