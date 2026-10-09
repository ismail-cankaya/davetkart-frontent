import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { PostaHero } from '../../shared/heroes';
import { SEHZADE, SUNNET_POSTA } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetPosta — "Posta Damgası": uçak postası şeridi pelerin mavisi ve kuşak kırmızısı, pul pirinç. */
export function SunnetPosta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_POSTA}
      renderHero={(props) => (
        <PostaHero
          {...props}
          stripe={[SEHZADE.sax, SEHZADE.nar]}
          stamp={SEHZADE.pirinc}
          postmark={SEHZADE.lacivert}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fcfdff 0%, #edf0fa 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo={SEHZADE.seker}
        />
      )}
    />
  );
}
