import React from 'react';
import { cn } from '../../../../utils/cn';
import { SEHZADE } from '../themes';
import { SunnetMotionStyles } from './motion';

interface NazarRingsProps {
  className?: string;
  /** Dönen yörüngeyi ters yöne çevirir — iki boncuk aynı yöne dönmesin. */
  reverse?: boolean;
}

/**
 * Nazar boncuğunun soyut, iri hâli — Modern şablonun grafik imzası.
 *
 * Halkalar boncuğun gerçek sırasıyla dizilir (açık mavi, beyaz, turkuaz,
 * lacivert göz bebeği); çevresinde kesikli bir yörünge çok yavaş döner.
 * Kadrajın köşesine taşırılarak yerleştirilir; metnin arkasına girmez.
 */
export function NazarRings({ className, reverse = false }: NazarRingsProps) {
  return (
    <>
      <SunnetMotionStyles />
      <svg aria-hidden="true" viewBox="-50 -50 100 100" className={cn('absolute pointer-events-none', className)}>
        <g data-atmosphere="" className={reverse ? 'sunnet-spin-rev' : 'sunnet-spin'} style={{ transformOrigin: '0 0' }}>
          <circle r="48.5" fill="none" stroke={SEHZADE.turkuazMetin} strokeOpacity="0.35" strokeWidth="0.45" strokeDasharray="0.6 2.4" />
          <circle r="44.5" fill="none" stroke={SEHZADE.sax} strokeOpacity="0.18" strokeWidth="0.3" strokeDasharray="10 4 2 4" />
        </g>
        <circle r="40" fill="#dfe6fb" />
        <circle r="31" fill="#ffffff" />
        <circle r="23" fill={SEHZADE.turkuaz} fillOpacity="0.55" />
        <circle r="12.5" fill={SEHZADE.lacivert} />
        <circle cx="-4" cy="-4.5" r="3" fill="#ffffff" fillOpacity="0.85" />
      </svg>
    </>
  );
}
