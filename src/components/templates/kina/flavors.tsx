import React, { useId } from 'react';
import { TemplateFlavor } from '../shared/flavor';
import { TepsiIcon } from './parts/TepsiIcon';

/** Seyrek bindallı dalları — lale filizleri ve sırma pullar, yarım kaydırmalı. */
function KinaPattern({ className }: { className?: string }) {
  // Birden çok davetiye aynı belgede çizilirse desen kimlikleri çakışmasın.
  const id = `kina-dal-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
          <g
            transform="translate(34 40)"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.13"
            strokeWidth="0.8"
            strokeLinecap="round"
          >
            <path d="M0 14C0 6 4 1 9-3M0 14C0 7-4 2-9-1" />
            <path d="M0-6C3-3 4 1 0 5C-4 1-3-3 0-6Z" fill="currentColor" fillOpacity="0.07" />
            <path d="M9-3C12-6 15-6 16-4C14-2 11-2 9-3Z" fill="currentColor" fillOpacity="0.08" />
            <path d="M-9-1C-12-4-15-4-16-2C-14 0-11 0-9-1Z" fill="currentColor" fillOpacity="0.08" />
          </g>
          <g transform="translate(104 108)" fill="currentColor" fillOpacity="0.12">
            <circle r="1.4" />
            <circle cx="-6" cy="3" r="0.9" />
            <circle cx="6" cy="3" r="0.9" />
            <circle cy="-6" r="0.9" />
          </g>
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export const KINA_FLAVOR: TemplateFlavor = {
  categoryId: 'kina',
  Ornament: TepsiIcon,
  BackgroundPattern: KinaPattern,
  envelopeLabel: 'Kına Davetiyesi',
  tagline: 'Kınamıza Bekliyoruz',
  headings: {
    timeline: 'Gecenin Akışı',
    details: 'Adres & Ulaşım',
    gallery: 'Anılarımız',
    gift: 'Takı & Armağan',
    rsvp: 'Katılım Durumu'
  },
  eyebrows: {
    timeline: 'Kına Gecesi Programı',
    details: 'Kınanın Yakılacağı Yer',
    gallery: 'Kınadan Önce',
    gift: 'Takı Merasimi',
    rsvp: 'Kına Davetine Yanıt'
  },
  giftNote:
    'Kınamızda yanımızda olmanız en güzel armağan; yine de takı ya da hediye göndermek isterseniz hesap bilgilerimiz aşağıda.'
};
