import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { KINA_MERMER } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaMermer — "Mermer & Rölyef" kına yorumu: gül-kayısı mermer, kına damarı. */
export function KinaMermer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_MERMER}
      renderHero={(props) => (
        <MermerHero
          {...props}
          slab="linear-gradient(150deg, #fcf4ec 0%, #f4e1d2 48%, #ebcfbc 100%)"
          vein="#b9734e"
          polish="light"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbf3ec 0%, #f2ded0 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f7ebe1"
        />
      )}
    />
  );
}
