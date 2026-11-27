import React from 'react';
import { TemplateFlavor } from '../shared/flavor';

// Balon buketi — doğum günü temalarının mühür/hero süsü
function DogumGunuOrnament({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="9" cy="7.5" rx="3.4" ry="4" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="15.5" cy="6" rx="2.8" ry="3.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 11.5c-.6 3 .8 5.5 3 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M15.5 9.4c.4 3.4-1.4 7-3.5 11.1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M8 12.2h2M14.6 10h1.8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// Havada süzülen konfeti deseni
function DogumGunuPattern({ className }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dogumGunuPattern" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="14" r="1.6" fill="currentColor" fillOpacity="0.1" />
          <rect x="44" y="22" width="4" height="4" rx="1" fill="currentColor" fillOpacity="0.08" transform="rotate(24 46 24)" />
          <path d="M26 50c2-2 4-2 6 0" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.1" strokeLinecap="round" />
          <circle cx="58" cy="56" r="1.2" fill="currentColor" fillOpacity="0.09" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#dogumGunuPattern)" />
    </svg>
  );
}

export const DOGUM_GUNU_FLAVOR: TemplateFlavor = {
  categoryId: 'dogum-gunu',
  Ornament: DogumGunuOrnament,
  BackgroundPattern: DogumGunuPattern
};
