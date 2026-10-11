import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { TerrazzoHero } from '../../shared/heroes';
import { KINA_TERRAZZO } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaTerrazzo — "Terrazzo" kına yorumu: avuç zemine al, kına, sırma ve yaprak çakılları. */
export function KinaTerrazzo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_TERRAZZO}
      renderHero={(props) => (
        <TerrazzoHero {...props} chips={['#b0241c', '#c4581d', '#d8a24a', '#666a2c', '#33140c']} slab="#f8ebdf" seed={23} />
      )}
    />
  );
}
