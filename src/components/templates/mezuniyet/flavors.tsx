import React from 'react';
import { TemplateFlavor } from '../shared/flavor';

// Mezuniyet kepi — kategori mühür/hero süsü
function MezuniyetOrnament({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2.5 9.5L12 5l9.5 4.5L12 14 2.5 9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6.5 11.5v4.2c0 1.2 2.5 2.6 5.5 2.6s5.5-1.4 5.5-2.6v-4.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M21.5 9.5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="21.5" cy="16" r="0.9" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// Defne dalları ve akademik çizgilerden oluşan desen
function MezuniyetPattern({ className }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="mezuniyetPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path
            d="M25 20c4 6 4 14 0 20M25 20c-4 6-4 14 0 20"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeOpacity="0.09"
            strokeLinecap="round"
          />
          <path d="M65 62l14 14M79 62l-14 14" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.06" />
          <circle cx="72" cy="69" r="9" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.07" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#mezuniyetPattern)" />
    </svg>
  );
}

export const MEZUNIYET_FLAVOR: TemplateFlavor = {
  categoryId: 'mezuniyet',
  Ornament: MezuniyetOrnament,
  BackgroundPattern: MezuniyetPattern
};
