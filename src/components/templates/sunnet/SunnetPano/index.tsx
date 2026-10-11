import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { SUNNET_PANO } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetPano — "Mekanik Pano": gece mavisi kanatlar, nazar turkuazı vurgu. */
export function SunnetPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_PANO}
      renderHero={(props) => <PanoHero {...props} flap="#141c52" ink="#f5f7fd" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #17215e 0%, #0d1442 55%, #070b26 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="111,214,226" size={56} x={50} y={42} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.028}
          fadeTo="#0b1238"
        />
      )}
    />
  );
}
