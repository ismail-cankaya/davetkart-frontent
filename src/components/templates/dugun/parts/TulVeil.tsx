import React from 'react';
import { cn } from '../../../../utils/cn';
import { DUGUN_RGB } from './palette';

interface TulVeilProps {
  /** Açık zeminde mürekkep, koyu zeminde inci ipliği. */
  tone: 'light' | 'dark';
  /** Dokunun genel yoğunluğu (0..1). */
  strength?: number;
  /**
   * Merkezin açık kalma payı (%). Tül duvak gibi kenarlardan kadrajı sarar;
   * metnin oturduğu orta alan bu orana kadar temiz kalır.
   */
  clear?: number;
  className?: string;
}

/**
 * Puantiyeli tül (point d'esprit) dokusu: ince bir baklava ağ ve ağın
 * gözlerine serpilmiş inci noktalar.
 *
 * Tamamen durağandır — ne animasyon ne canvas; "hareketi azalt" için ayrıca
 * bir şey gerekmez. Desen SVG `pattern`'dir, her çözünürlükte keskin kalır.
 */
export function TulVeil({ tone, strength = 1, clear = 34, className }: TulVeilProps) {
  const id = `tul-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const ink = tone === 'light' ? DUGUN_RGB.murekkep : DUGUN_RGB.inci;
  const net = (tone === 'light' ? 0.07 : 0.08) * strength;
  const dot = (tone === 'light' ? 0.16 : 0.2) * strength;
  const mask = `radial-gradient(ellipse 78% 66% at 50% 46%, transparent ${clear}%, black 92%)`;

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
            <path
              d="M0 7 L7 0 L14 7 L7 14 Z M14 7 L21 0 L28 7 L21 14 Z M0 21 L7 14 L14 21 L7 28 Z M14 21 L21 14 L28 21 L21 28 Z"
              fill="none"
              stroke={`rgba(${ink},${net})`}
              strokeWidth="0.5"
            />
            <circle cx="7" cy="7" r="1.1" fill={`rgba(${ink},${dot})`} />
            <circle cx="21" cy="21" r="1.1" fill={`rgba(${ink},${dot})`} />
            <circle cx="21" cy="7" r="0.55" fill={`rgba(${ink},${dot * 0.7})`} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
