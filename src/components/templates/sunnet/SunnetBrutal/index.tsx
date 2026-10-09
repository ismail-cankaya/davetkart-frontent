import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { SEHZADE, SUNNET_BRUTAL } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetBrutal — "Brutal": kuşak kırmızısı, pirinç ve lacivert mürekkeple sert grafik kutlama. */
export function SunnetBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_BRUTAL}
      renderHero={(props) => (
        <BrutalHero
          {...props}
          ink={SEHZADE.lacivert}
          accent={SEHZADE.nar}
          accent2={SEHZADE.pirinc}
          onAccent="#ffffff"
          onAccent2={SEHZADE.lacivert}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base={SEHZADE.seker}
          scrim={false}
          vignette={false}
          parallax={0}
          grain={0.018}
          fadeTo={SEHZADE.seker}
        />
      )}
    />
  );
}
