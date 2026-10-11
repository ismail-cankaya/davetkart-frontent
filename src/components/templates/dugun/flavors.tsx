import React from 'react';
import { TemplateFlavor } from '../shared/flavor';
import { KurdeleMark } from './parts/Kurdele';

/** Kurdele düğümü — zarf mührü ve ortak hero'ların kategori süsü. */
function DugunOrnament({ size = 48, className }: { size?: number; className?: string }) {
  return <KurdeleMark size={size} className={className} />;
}

/**
 * Puantiyeli tül: bölümlerin arkasında sabit duran baklava ağ ve seyrek
 * inci noktalar. Renk, kompozisyonun verdiği `theme.accent`'ten gelir.
 */
function DugunPattern({ className }: { className?: string }) {
  const id = `dugun-tul-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
          <path
            d="M0 9 L9 0 L18 9 L9 18 Z M18 9 L27 0 L36 9 L27 18 Z M0 27 L9 18 L18 27 L9 36 Z M18 27 L27 18 L36 27 L27 36 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity="0.09"
          />
          <circle cx="9" cy="9" r="1.2" fill="currentColor" fillOpacity="0.16" />
          <circle cx="27" cy="27" r="1.2" fill="currentColor" fillOpacity="0.16" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export const DUGUN_FLAVOR: TemplateFlavor = {
  categoryId: 'dugun',
  Ornament: DugunOrnament,
  BackgroundPattern: DugunPattern,
  envelopeLabel: 'Düğün Davetiyesi',
  tagline: 'Evleniyoruz',
  headings: {
    timeline: 'Nikâhtan Düğüne',
    details: 'Düğün Adresi',
    gallery: 'Hikâyemizden Kareler',
    gift: 'Takı & Hediye',
    rsvp: 'Lütfen Cevap Veriniz'
  }
};
