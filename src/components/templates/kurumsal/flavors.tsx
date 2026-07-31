import React from 'react';
import { TemplateFlavor } from '../shared/flavor';

/**
 * Kurumsal etkinlik kimliği. Diğer kategorilerin süslemeleri organik
 * (yaprak, alyans, kalp); burada dil geometrik ve kesin — kurumsal davet
 * duygusal değil, güven verici olmalı.
 */

/** Birbirine bağlanan düğümlerden oluşan altıgen — ağ ve iş birliği. */
function KurumsalOrnament({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.1" stroke="currentColor" strokeWidth="0.9" />
      <path d="M12 2.5v7.4M20 7l-6 4M20 17l-6-4M12 21.5v-7.4M4 17l6-4M4 7l6 4" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.65" />
    </svg>
  );
}

/** Seyrek düğüm ızgarası — teknoloji zemini, okunabilirliği bozmayacak yoğunlukta. */
function KurumsalPattern({ className }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="kurumsalPattern" x="0" y="0" width="96" height="96" patternUnits="userSpaceOnUse">
          <circle cx="48" cy="48" r="1.4" fill="currentColor" fillOpacity="0.12" />
          <path d="M48 48H96M48 48V96" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.06" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#kurumsalPattern)" />
    </svg>
  );
}

export const KURUMSAL_FLAVOR: TemplateFlavor = {
  categoryId: 'kurumsal',
  Ornament: KurumsalOrnament,
  BackgroundPattern: KurumsalPattern,
  envelopeLabel: 'Etkinlik Daveti',
  tagline: 'Birlikte Daha İleriye',
  headings: {
    timeline: 'Program Akışı',
    details: 'Konum ve Ulaşım',
    gallery: 'Galeri',
    gift: 'Sponsorluk',
    rsvp: 'Kayıt Formu'
  }
};
