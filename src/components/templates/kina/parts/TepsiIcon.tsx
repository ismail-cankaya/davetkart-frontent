import React from 'react';
import { KinaMotionStyles } from './motion';

const FLAME = 'M0-4C1.2-2.6 1.4-1.2 0 0C-1.4-1.2-1.2-2.6 0-4Z';

/**
 * Kına tepsisi — kına yoğurulmuş tasın ortasında ve kenarında yanan mumlar.
 * Zarf mührü ve hero süsü (flavor.Ornament); alevler hafifçe titrer.
 */
export function TepsiIcon({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <>
      <KinaMotionStyles />
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="17.6" rx="9.2" ry="2.4" strokeWidth="1.1" />
          <path d="M3.2 17.9C4.1 20.7 8 22 12 22S19.9 20.7 20.8 17.9" strokeWidth="1.1" />
          <path d="M8.4 17.3C9.3 15.4 10.6 14.8 12 14.8S14.7 15.4 15.6 17.3" fill="currentColor" fillOpacity="0.35" strokeWidth="0.9" />
          <rect x="11.15" y="8.4" width="1.7" height="6.6" rx="0.35" strokeWidth="0.9" />
          <rect x="5.9" y="11.6" width="1.5" height="5.6" rx="0.3" strokeWidth="0.85" />
          <rect x="16.6" y="11.6" width="1.5" height="5.6" rx="0.3" strokeWidth="0.85" />
        </g>
        {/* Konum dış <g>'de: CSS animasyonu iç yolun transform'unu yazar. */}
        <g fill="currentColor">
          <g transform="translate(12 7.7)">
            <path d={FLAME} data-atmosphere="" className="kina-flicker" />
          </g>
          <g transform="translate(6.65 10.9) scale(0.85)">
            <path d={FLAME} data-atmosphere="" className="kina-flicker" style={{ animationDelay: '-0.9s' }} />
          </g>
          <g transform="translate(17.35 10.9) scale(0.85)">
            <path d={FLAME} data-atmosphere="" className="kina-flicker" style={{ animationDelay: '-1.7s' }} />
          </g>
        </g>
      </svg>
    </>
  );
}
