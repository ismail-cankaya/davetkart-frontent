import React from 'react';
import { HARITA_RENK } from './palet';

/**
 * Toplu iğne: yuvarlak baş, ince iğne, haritaya düşen küçük gölge. Haritaya
 * saplanmış gerçek bir iğnedir; harita sağlayıcılarının damla işaretçisi
 * taklit edilmez (HARITA-KONSEPTI §9).
 *
 * Ölçüler 32 × 48 ızgaradadır; `UC` iğnenin haritaya değdiği nokta, `BAS`
 * başın merkezi. Konumlandıran bileşen ikisini de bunlardan hesaplar.
 */
export const IGNE_OLCU = { genislik: 32, yukseklik: 48, uc: { x: 16, y: 46 }, bas: { x: 16, y: 15 } } as const;

export function Igne({ olcek = 1, className }: { olcek?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 48"
      width={IGNE_OLCU.genislik * olcek}
      height={IGNE_OLCU.yukseklik * olcek}
      className={className}
    >
      <ellipse cx="16" cy="46" rx="6" ry="1.8" fill={HARITA_RENK.murekkep} fillOpacity="0.22" />
      <path d="M16 25v20.5" stroke={HARITA_RENK.murekkep} strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="15" r="11" fill={HARITA_RENK.rotaAcik} stroke={HARITA_RENK.murekkep} strokeWidth="1.75" />
      <circle cx="12.2" cy="11.2" r="3" fill={HARITA_RENK.yol} fillOpacity="0.6" />
    </svg>
  );
}

/**
 * Hazine haritasının "X"i: mekânı iğne yerine işaretler (HARITA-KONSEPTI §4.3).
 * İki kalın rota çizgisi, altlarında arazinin üstünde okunsun diye beyaz bir
 * iz; gölge yok. Ölçü 40 × 40, `merkez` işaretin haritaya değdiği nokta.
 */
export const CARPI_OLCU = { boyut: 40, merkez: 20 } as const;

export function Carpi({ olcek = 1, className }: { olcek?: number; className?: string }) {
  const d = 'M9 9l22 22M31 9 9 31';
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" width={CARPI_OLCU.boyut * olcek} height={CARPI_OLCU.boyut * olcek} className={className}>
      <path d={d} stroke={HARITA_RENK.yol} strokeWidth="11" strokeLinecap="round" />
      <path d={d} stroke={HARITA_RENK.rota} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
