import React from 'react';
import { cn } from '../../../../utils/cn';

interface RegistrationGridProps {
  /** Artı rengi (CSS rengi). */
  color: string;
  /** Izgaranın eridiği maske; kenarlar boş kalsın diye merkezde yoğunlaşır. */
  mask?: string;
  /** Hücre ölçüsü (px). */
  size?: number;
  className?: string;
}

/**
 * Kayıt artısı ızgarası — hero sahnelerinin koordinat düzlemi.
 *
 * SVG <pattern> yerine veri URI'si: aynı sayfada birden çok önizleme
 * çizildiğinde `id` çakışması ve `currentColor`'ın ilk desenden okunması
 * sorunu yaşanmaz; renk her şablonda kendi değeriyle basılır.
 */
export function RegistrationGrid({
  color,
  mask = 'radial-gradient(ellipse 75% 65% at 50% 42%, black 20%, transparent 100%)',
  size = 88,
  className
}: RegistrationGridProps) {
  const half = size / 2;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>` +
    `<path d='M${half} ${half - 5}v10M${half - 5} ${half}h10' stroke='${color}' stroke-width='0.8' fill='none'/>` +
    `<circle cx='0' cy='0' r='0.9' fill='${color}'/></svg>`;

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundSize: `${size}px ${size}px`,
        maskImage: mask,
        WebkitMaskImage: mask
      }}
    />
  );
}
