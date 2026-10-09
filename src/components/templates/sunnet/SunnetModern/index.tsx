import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SEHZADE, SUNNET_MODERN } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { NazarRings } from '../parts/NazarRings';
import { SehzadeHero } from '../parts/SehzadeHero';
import { TemplateProps } from '../../types';

/**
 * Sünnet — Modern / "Ferah Turkuaz": iki köşeye taşan iri, soyut nazar
 * boncukları; bol boşluk, turkuaz kuşak.
 */
export function SunnetModern({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_MODERN}
      renderHeroBackground={() => (
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#eaf4f8] via-[#f3f8fb] to-[#f3f8fb]">
          <NazarRings className="w-[64%] @md:w-[46%] -top-[18%] -right-[24%] @md:-top-[22%] @md:-right-[12%]" />
          <NazarRings reverse className="w-[44%] @md:w-[30%] -bottom-[8%] -left-[20%] @md:-left-[8%] opacity-80" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-28"
            style={{ backgroundImage: `linear-gradient(to bottom, transparent, #f3f8fb)` }}
          />
        </div>
      )}
      renderHero={(props) => (
        <SehzadeHero
          {...props}
          ornament={SEHZADE.turkuazMetin}
          sash={{ fill: SEHZADE.turkuazMetin, ink: '#ffffff', stitch: 'rgba(255,255,255,0.55)' }}
        />
      )}
    />
  );
}
