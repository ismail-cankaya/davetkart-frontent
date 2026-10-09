import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { TerrazzoHero } from '../../shared/heroes';
import { SEHZADE, SUNNET_TERRAZZO } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetTerrazzo — "Terrazzo": şeker beyazı harca serpilmiş pelerin, kuşak ve sırma çakılları. */
export function SunnetTerrazzo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_TERRAZZO}
      renderHero={(props) => (
        <TerrazzoHero
          {...props}
          chips={[SEHZADE.sax, SEHZADE.nar, SEHZADE.pirinc, '#dfe6fb', SEHZADE.lacivert]}
          slab="#f4f6fc"
          seed={41}
        />
      )}
    />
  );
}
