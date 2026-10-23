import React from 'react';
import { cn } from '../../../../utils/cn';
import { SAYFA } from './palet';

/**
 * Dizgi süsleri (özgün SVG). Rengi `currentColor`'dan alır; süstür,
 * `aria-hidden`. Bölüm sonunda en çok bir tane kullanılır (KITAP-KONSEPTI §5).
 *
 * - `yaprak`: sarmaşık yaprağı (hedera) — yatık kalp biçimli yaprak, ortasında
 *   sayfa renginde damar, çentikten kıvrılan sap.
 * - `cizgi`: yatay matbaa süsü — ortada eşkenar dörtgen, iki yanda badem
 *   yaprak, uçlarda nokta. Başlık altı ya da künye üstü ayraç.
 */
interface FleuronProps {
  tur?: 'yaprak' | 'cizgi';
  /** Genişlik (px); yükseklik orantılı. */
  boyut?: number;
  /** Yaprağın damarı zeminin rengindedir; şamua dışında bir zeminde verilir. */
  zemin?: string;
  className?: string;
}

export function Fleuron({ tur = 'yaprak', boyut, zemin = SAYFA.samua, className }: FleuronProps) {
  if (tur === 'cizgi') {
    const w = boyut ?? 84;
    return (
      <svg aria-hidden="true" viewBox="0 0 84 14" width={w} height={(w * 14) / 84} className={cn('block', className)} fill="currentColor">
        <path d="M42 1.5 L47.5 7 L42 12.5 L36.5 7 Z" />
        <path d="M32.5 7 C 27 2.6, 19.5 2.6, 13 7 C 19.5 11.4, 27 11.4, 32.5 7 Z" />
        <path d="M51.5 7 C 57 2.6, 64.5 2.6, 71 7 C 64.5 11.4, 57 11.4, 51.5 7 Z" />
        <circle cx="6.5" cy="7" r="1.7" />
        <circle cx="77.5" cy="7" r="1.7" />
      </svg>
    );
  }
  const w = boyut ?? 34;
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" width={w} height={w} className={cn('block', className)}>
      {/* Yaprak yatık durur, ucu sağa bakar; sap çentikten sola çıkıp aşağı kıvrılır. */}
      <path
        fill="currentColor"
        d="M43 24 C 36 31.5, 29.5 39.5, 20.5 39.5 C 15 39.5, 11.4 35.8, 11.4 31.2 C 11.4 27.9, 13.4 25.2, 16.3 24 C 13.4 22.8, 11.4 20.1, 11.4 16.8 C 11.4 12.2, 15 8.5, 20.5 8.5 C 29.5 8.5, 36 16.5, 43 24 Z"
      />
      <path d="M18.5 24 C 25 23.3, 31 23.4, 37.5 24" fill="none" stroke={zemin} strokeWidth="1" strokeLinecap="round" />
      <path
        d="M16.3 24 C 11 24, 6.2 25.6, 4.6 29.6 C 3.5 32.6, 5.6 35.1, 8.1 34.1 C 9.7 33.4, 9.7 31.5, 8.5 30.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
