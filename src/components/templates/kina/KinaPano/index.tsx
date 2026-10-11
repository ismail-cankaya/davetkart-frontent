import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { KINA_PANO } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaPano — "Mekanik Pano" kına yorumu: kahve kanatlar, krem harfler, kına ışığı. */
export function KinaPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_PANO}
      renderHero={(props) => <PanoHero {...props} flap="#2e140c" ink="#fbe6d2" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #2e140a 0%, #180b06 55%, #0b0503 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="242,160,102" size={56} x={50} y={42} opacity={0.14} duration={12} />}
          parallax={5}
          grain={0.028}
          fadeTo="#160a05"
        />
      )}
    />
  );
}
