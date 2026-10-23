import React from 'react';

/**
 * Özgün soyut eserler (§4.4): tek eser rengi + mürekkep + duvar beyazı;
 * dokusuz, filtresiz SVG. Kapak eseri fotoğrafa bağlı değildir — galeri
 * kapalıyken de tam çalışır. Telif notu: docs/rehber/.../soyutEserler.md.
 *
 * Her eser 400×500 tuvale çizilir ve çerçevesini `slice` ile doldurur;
 * önemli biçimler kenarlardan en az %12 içeride durur ki kırpılmasın.
 */

interface EserProps {
  className?: string;
}

/**
 * "Eşik": biri dolu ışık, biri çizgi iki kemer aynı eşiğin üstünde. Gelinin
 * eşikten geçişi ve iki kişinin aynı kapıdan girişi; ikinci kemer ilkinin
 * üstünden geçer, ikisi tek bir eşikte buluşur.
 */
export function EserEsik({ className }: EserProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className={className}>
      <rect width="400" height="500" fill="var(--sg-eser)" />
      <path d="M76 440 V200 A80 80 0 0 1 236 200 V440 Z" fill="var(--sg-duvar)" />
      <path d="M174 440 V262 A64 64 0 0 1 302 262 V440" fill="none" stroke="var(--sg-murekkep)" strokeWidth="4" />
      <rect x="48" y="440" width="286" height="9" fill="var(--sg-murekkep)" />
    </svg>
  );
}

/**
 * "İki Yarım": iki panoluk diptik (her pano 300×450). Bir daire panoların
 * arasındaki boşlukta ikiye bölünür; her yarı öbür panonun renklerini
 * taşır, alttaki mürekkep çizgi iki panodan da geçer. İki kişi, tek eser.
 *
 * Daire iç kenara yaslıdır (kenar kuralının bilinçli istisnası): kırpılmasın
 * diye sol pano sağ kenarına, sağ pano sol kenarına sabitlenir.
 */
export function EserIkiYarim({ className, pano = 'sol' }: EserProps & { pano?: 'sol' | 'sag' }) {
  const sol = pano === 'sol';
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 450"
      preserveAspectRatio={sol ? 'xMaxYMid slice' : 'xMinYMid slice'}
      className={className}
    >
      <rect width="300" height="450" fill={sol ? 'var(--sg-eser)' : 'var(--sg-duvar)'} />
      <circle cx={sol ? 300 : 0} cy="190" r="112" fill={sol ? 'var(--sg-duvar)' : 'var(--sg-eser)'} />
      <rect x={sol ? 44 : 0} y="352" width={sol ? 256 : 214} height="6" fill="var(--sg-murekkep)" />
    </svg>
  );
}

/*
 * Retrospektif (doğum günü, salon asması): dört küçük eser, her biri bir dönem.
 * Tuvalleri çerçeve oranıyla aynıdır; yıl yazılmaz (veride yok). Hepsi aynı
 * eser rengini paylaşır: tek renk kuralı salonda da geçerlidir.
 */

/** "İlk işler": duvar zeminde tek dolu daire ve bir yer çizgisi — ilk resim. 1 / 1. */
export function EserIlkIsler({ className }: EserProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" className={className}>
      <rect width="300" height="300" fill="var(--sg-duvar)" />
      <circle cx="150" cy="128" r="62" fill="var(--sg-eser)" />
      <rect x="58" y="226" width="184" height="7" fill="var(--sg-murekkep)" />
    </svg>
  );
}

/** "Oyun dönemi": üst üste üç blok, en üstteki hafif eğik. 3 / 4. */
export function EserOyunDonemi({ className }: EserProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className={className}>
      <rect width="300" height="400" fill="var(--sg-duvar)" />
      <rect x="62" y="270" width="176" height="62" fill="var(--sg-murekkep)" />
      <rect x="92" y="196" width="116" height="74" fill="var(--sg-eser)" />
      <rect x="122" y="140" width="52" height="52" fill="var(--sg-murekkep)" transform="rotate(9 148 166)" />
    </svg>
  );
}

/** "Keşif dönemi": eser renginde alan, köşeden köşeye bir yörünge ve ucunda duvar beyazı nokta. 4 / 3. */
export function EserKesifDonemi({ className }: EserProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className}>
      <rect width="400" height="300" fill="var(--sg-eser)" />
      <path d="M64 236 C 150 236, 220 120, 318 92" fill="none" stroke="var(--sg-murekkep)" strokeWidth="6" />
      <circle cx="318" cy="92" r="16" fill="var(--sg-duvar)" />
    </svg>
  );
}

/** "Bugün": tek mum — mürekkep gövde, eser renginde alev, altta yer çizgisi. 2 / 3. */
export function EserBugun({ className }: EserProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" className={className}>
      <rect width="200" height="300" fill="var(--sg-duvar)" />
      <path d="M100 74 C 120 104, 122 124, 100 136 C 78 124, 80 104, 100 74 Z" fill="var(--sg-eser)" />
      <rect x="90" y="146" width="20" height="98" fill="var(--sg-murekkep)" />
      <rect x="44" y="244" width="112" height="6" fill="var(--sg-murekkep)" />
    </svg>
  );
}

/**
 * "Yeni Yaş" (doğum günü, tek eser): yarım kalmış bir tuval. Kalın eser
 * renginde bir yay tuvalin ortasında kesilir; devamı ve bir daire yalnızca
 * kesik kurşun kalem çizgisiyle eskizdir — yeni yaş henüz çiziliyor. 5 / 4.
 */
export function EserYeniYas({ className }: EserProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid slice" className={className}>
      <rect width="500" height="400" fill="var(--sg-duvar)" />
      <path d="M262 186 C 300 240, 350 300, 420 262" fill="none" stroke="var(--sg-murekkep)" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="7 9" />
      <circle cx="372" cy="118" r="44" fill="none" stroke="var(--sg-murekkep)" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="7 9" />
      <path d="M80 318 C 128 170, 210 128, 262 186" fill="none" stroke="var(--sg-eser)" strokeWidth="34" strokeLinecap="round" />
    </svg>
  );
}

export interface SoyutEserTanimi {
  Bilesen: React.ComponentType<EserProps>;
  /** Etiketteki eser adı. */
  ad: string;
  /** Etiketteki teknik satırı. */
  teknik: string;
}

export const SOYUT_ESERLER = {
  esik: { Bilesen: EserEsik, ad: 'Eşik', teknik: 'Tuval üzerine akrilik' },
  ikiYarim: { Bilesen: EserIkiYarim, ad: 'İki Yarım', teknik: 'Diptik, tuval üzerine akrilik' },
  ilkIsler: { Bilesen: EserIlkIsler, ad: 'İlk işler', teknik: 'Kâğıt üzerine guaj' },
  oyunDonemi: { Bilesen: EserOyunDonemi, ad: 'Oyun dönemi', teknik: 'Ahşap üzerine boya' },
  kesifDonemi: { Bilesen: EserKesifDonemi, ad: 'Keşif dönemi', teknik: 'Tuval üzerine akrilik' },
  bugun: { Bilesen: EserBugun, ad: 'Bugün', teknik: 'Tuval üzerine akrilik' },
  yeniYas: { Bilesen: EserYeniYas, ad: 'Yeni Yaş', teknik: 'Tuval üzerine akrilik ve kurşun kalem' }
} as const satisfies Record<string, SoyutEserTanimi>;

export type SoyutEserAdi = keyof typeof SOYUT_ESERLER;
