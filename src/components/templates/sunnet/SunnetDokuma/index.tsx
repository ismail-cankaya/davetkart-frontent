import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { SEHZADE, SUNNET_DOKUMA } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetDokuma — "Dokuma": kilim şeridi pelerin, kuşak ve sırma iplikleriyle dokunur. */
export function SunnetDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_DOKUMA}
      renderHero={(props) => (
        <DokumaHero
          {...props}
          threads={[SEHZADE.sax, SEHZADE.nar, SEHZADE.pirinc]}
          weave="#a7b0d4"
          stitch={SEHZADE.nar}
          seed={37}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fafbfe 0%, #eceef7 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.028}
          fadeTo="#f3f4fa"
        />
      )}
    />
  );
}
