import React from 'react';
import { TemplateFlavor } from '../shared/flavor';

// Uyuyan ay ve minik yıldız — baby shower mühür/hero süsü
function BabyShowerOrnament({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M13 3.5a8.5 8.5 0 1 0 7.5 12.6A7 7 0 1 1 13 3.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M17 4l.8 1.7L19.5 6.5l-1.7.8L17 9l-.8-1.7-1.7-.8 1.7-.8L17 4Z" fill="currentColor" fillOpacity="0.55" />
      <circle cx="20.5" cy="10.5" r="0.7" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}

// Bulutlar ve minik yıldızlardan oluşan gökyüzü deseni
function BabyShowerPattern({ className }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="babyShowerPattern" x="0" y="0" width="110" height="110" patternUnits="userSpaceOnUse">
          <path
            d="M20 34a7 7 0 0 1 13-3 6 6 0 0 1 9 5H22a5 5 0 0 1-2-2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeOpacity="0.1"
            strokeLinejoin="round"
          />
          <circle cx="76" cy="26" r="1" fill="currentColor" fillOpacity="0.1" />
          <path d="M62 74l1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1 1-2.2Z" fill="currentColor" fillOpacity="0.08" />
          <circle cx="30" cy="88" r="1.2" fill="currentColor" fillOpacity="0.08" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#babyShowerPattern)" />
    </svg>
  );
}

export const BABY_SHOWER_FLAVOR: TemplateFlavor = {
  categoryId: 'baby-shower',
  Ornament: BabyShowerOrnament,
  BackgroundPattern: BabyShowerPattern
};
