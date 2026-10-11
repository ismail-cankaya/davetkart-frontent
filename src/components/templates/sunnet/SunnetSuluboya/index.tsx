import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { SUNNET_SULUBOYA } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetSuluboya — "Suluboya": pelerin, kuşak ve sırma tonlarının sulandırılmış lekeleri. */
export function SunnetSuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_SULUBOYA}
      renderHero={(props) => (
        <SuluboyaHero {...props} washes={['#8ea2ea', '#ee8f9c', '#f2cf74']} seed={31} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfeff 0%, #eff2fb 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f6f8fd"
        />
      )}
    />
  );
}
