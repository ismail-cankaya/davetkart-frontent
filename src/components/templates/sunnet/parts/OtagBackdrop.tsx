import React from 'react';
import { HeroBackgroundState } from '../../shared/InvitationComposition';
import { SEHZADE } from '../themes';
import { Fener, Sacak } from './Sacak';

/** Tavan dilimleri: kadrajın üstündeki tepe noktasından yelpaze gibi açılır. */
const WEDGES = Array.from({ length: 16 }, (_, i) => {
  const step = 240 / 16;
  const left = -70 + step * i;
  return `M50 -45 L${left} 112 L${left + step} 112 Z`;
}).filter((_, i) => i % 2 === 0);

/**
 * Otağ içi — Klasik şablonun sahnesi: gündüz şenliği.
 *
 * Şeker beyazı zemin; tepede çadır tavanının dilimleri metne inmeden söner.
 * Üstte sax–beyaz saçak, iki yanında farklı boyda asılı fener. Metin
 * bloğunun arkası beyaza açılır ki lacivert ad ve nar kuşak en yüksek
 * kontrastta okunsun.
 */
export function OtagBackdrop({ revealed }: HeroBackgroundState) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 85% 65% at 50% 50%, #ffffff 0%, #f5f7fd 58%, #e4e9f8 100%)' }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 40%, transparent 78%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 40%, transparent 78%)'
        }}
      >
        {WEDGES.map((d) => (
          <path key={d} d={d} fill={SEHZADE.sax} fillOpacity="0.07" />
        ))}
      </svg>

      <Sacak stripes={[SEHZADE.sax, '#ffffff']} trim={SEHZADE.nar} tassel={SEHZADE.pirinc} revealed={revealed}>
        <Fener
          metal={SEHZADE.pirinc}
          glass="rgba(195,38,60,0.82)"
          light="233,178,58"
          cord={34}
          className="left-[7%] @md:left-[14%]"
        />
        <Fener
          metal={SEHZADE.pirinc}
          glass="rgba(35,72,198,0.82)"
          light="233,178,58"
          cord={58}
          phase={1.7}
          className="right-[7%] @md:right-[14%]"
        />
      </Sacak>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-28"
        style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${SEHZADE.seker})` }}
      />
    </div>
  );
}
