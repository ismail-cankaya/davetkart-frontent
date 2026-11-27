import React from 'react';
import { TemplateFlavor } from '../shared/flavor';

// A minimal geometric or leafy olive branch
function NisanOrnament({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Minimalist pastel geometric shapes / connected rings
function NisanPattern({ className }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="nisanPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect x="20" y="20" width="80" height="80" rx="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.08" />
          <line x1="60" y1="0" x2="60" y2="20" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.05" />
          <line x1="60" y1="100" x2="60" y2="120" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.05" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#nisanPattern)" />
    </svg>
  );
}

export const NISAN_FLAVOR: TemplateFlavor = {
  categoryId: 'nisan',
  Ornament: NisanOrnament,
  BackgroundPattern: NisanPattern
};
