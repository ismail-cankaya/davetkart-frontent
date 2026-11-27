import React from 'react';
import { TemplateFlavor } from '../shared/flavor';

// Havai fişek patlaması — parti temalarının mühür/hero süsü
function PartiOrnament({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="19.5" cy="4.5" r="0.8" fill="currentColor" fillOpacity="0.6" />
      <circle cx="4.5" cy="19" r="0.6" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

// Ritmik ışık huzmeleri ve parıltı deseni
function PartiPattern({ className }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="partiPattern" x="0" y="0" width="95" height="95" patternUnits="userSpaceOnUse">
          <path d="M18 18l4 4M22 18l-4 4" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.1" strokeLinecap="round" />
          <circle cx="66" cy="34" r="1.4" fill="currentColor" fillOpacity="0.1" />
          <path d="M40 70l1.2 2.6 2.6 1.2-2.6 1.2-1.2 2.6-1.2-2.6-2.6-1.2 2.6-1.2 1.2-2.6Z" fill="currentColor" fillOpacity="0.08" />
          <circle cx="80" cy="80" r="0.9" fill="currentColor" fillOpacity="0.09" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#partiPattern)" />
    </svg>
  );
}

export const PARTI_FLAVOR: TemplateFlavor = {
  categoryId: 'parti',
  Ornament: PartiOrnament,
  BackgroundPattern: PartiPattern
};
