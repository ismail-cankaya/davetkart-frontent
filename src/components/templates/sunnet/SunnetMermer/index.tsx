import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { SUNNET_MERMER } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetMermer — "Mermer & Rölyef": sax damarlı beyaz taşa oyulmuş yazı. */
export function SunnetMermer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_MERMER}
      renderHero={(props) => (
        <MermerHero
          {...props}
          slab="linear-gradient(150deg, #fbfcff 0%, #eef1fa 45%, #e1e6f4 100%)"
          vein="#8d9bd0"
          polish="light"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfcfe 0%, #eceff7 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f3f5fa"
        />
      )}
    />
  );
}
