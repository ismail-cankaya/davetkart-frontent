import React, { useId } from 'react';
import { TemplateFlavor } from '../shared/flavor';
import { SunnetMotionStyles } from './parts/motion';

/**
 * Sorguç — şehzade kalpağının tüylü mücevheri: nazar boncuğundan yükselen tüy.
 * Tüy kökünden hafifçe salınır (bkz. parts/motion); 18 px'te de okunur.
 */
function SunnetOrnament({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <>
      <SunnetMotionStyles />
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g data-atmosphere="" className="sunnet-sway">
          <path
            d="M12 13.9C9.4 11.4 9.5 6.9 13.4 2.6C15.9 6.2 15.4 10.9 12 13.9Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M12 13.9C12.5 10.2 12.9 6.6 13.4 2.6" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
          <path
            d="M12.3 10.6L10.7 9.4M12.7 7.8L11.4 6.8M12.5 10.9L14.1 9.8M12.8 8.1L14.1 7.2"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </g>
        <circle cx="12" cy="17.6" r="3.7" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="12" cy="17.6" r="1.75" stroke="currentColor" strokeWidth="1" />
        <circle cx="12" cy="17.6" r="0.55" fill="currentColor" />
        <circle cx="6.9" cy="19.5" r="0.75" fill="currentColor" fillOpacity="0.7" />
        <circle cx="17.1" cy="19.5" r="0.75" fill="currentColor" fillOpacity="0.7" />
      </svg>
    </>
  );
}

/** Nazar boncukları ve pullar — yarım kaydırmalı seyrek kafes. */
function SunnetPattern({ className }: { className?: string }) {
  // Birden çok davetiye aynı belgede çizilirse desen kimlikleri çakışmasın.
  const id = `sunnet-nazar-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="104" height="104" patternUnits="userSpaceOnUse">
          <g transform="translate(26 26)" stroke="currentColor" strokeOpacity="0.11" fill="none">
            <circle r="8" strokeWidth="0.7" />
            <circle r="4.6" strokeWidth="0.6" />
            <circle r="1.7" fill="currentColor" fillOpacity="0.11" stroke="none" />
          </g>
          <g transform="translate(78 78)" stroke="currentColor" strokeOpacity="0.1" fill="none">
            <circle r="6" strokeWidth="0.6" />
            <circle r="3.4" strokeWidth="0.5" />
            <circle r="1.3" fill="currentColor" fillOpacity="0.1" stroke="none" />
          </g>
          <path
            transform="translate(78 24)"
            d="M0-4.2 1.1-1.1 4.2 0 1.1 1.1 0 4.2-1.1 1.1-4.2 0-1.1-1.1Z"
            fill="currentColor"
            fillOpacity="0.09"
          />
          <path
            transform="translate(24 80) scale(0.7)"
            d="M0-4.2 1.1-1.1 4.2 0 1.1 1.1 0 4.2-1.1 1.1-4.2 0-1.1-1.1Z"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <circle cx="52" cy="52" r="1" fill="currentColor" fillOpacity="0.08" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export const SUNNET_FLAVOR: TemplateFlavor = {
  categoryId: 'sunnet',
  Ornament: SunnetOrnament,
  BackgroundPattern: SunnetPattern,
  envelopeLabel: 'Sünnet Davetiyesi',
  tagline: 'Şehzademizin Büyük Gününe Bekliyoruz',
  headings: {
    timeline: 'Şenlik Programı',
    details: 'Adres & Ulaşım',
    gallery: 'Şehzademizden Kareler',
    gift: 'Takı & Armağan',
    rsvp: 'Katılım Durumu'
  }
};
