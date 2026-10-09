import React, { useId } from 'react';
import { TemplateFlavor } from '../shared/flavor';

/**
 * Kurumsal etkinlik kimliği — "Grafit & Sinyal". Diğer kategorilerin
 * süslemeleri organik (yaprak, alyans, hilal); burada dil baskı provasından:
 * kesim işareti, kayıt artısı, cetvel. Davet duygusal değil, ölçülüp
 * biçilmiş ve güven verici görünmeli.
 */

/** Odak işareti: köşe kesim işaretleri arasında, artıyla ortalanmış bir daire. */
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
        d="M3 7.5V3h4.5M16.5 3H21v4.5M21 16.5V21h-4.5M7.5 21H3v-4.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="square"
      />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.1" />
      <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.7" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

/**
 * Kayıt artıları: kesim matının ızgarası — seyrek, metnin altında kaybolur.
 * Desen kimliği örneğe özgü: galeride yan yana çizilen önizlemeler birbirinin
 * desenini (ve `currentColor`'ını) ödünç almaz.
 */
function KurumsalPattern({ className }: { className?: string }) {
  const patternId = `kurumsal-desen-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={patternId} x="0" y="0" width="88" height="88" patternUnits="userSpaceOnUse">
          <path d="M44 39v10M39 44h10" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
          <circle cx="0" cy="0" r="0.9" fill="currentColor" fillOpacity="0.14" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
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
    timeline: 'Gündem',
    details: 'Konum ve Ulaşım',
    gallery: 'Görsel Arşiv',
    gift: 'Bağış ve Katkı',
    rsvp: 'Kayıt Formu'
  }
};
