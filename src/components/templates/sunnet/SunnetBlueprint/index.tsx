import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { BlueprintHero } from '../../shared/heroes';
import { SEHZADE, SUNNET_BLUEPRINT } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetBlueprint — "Teknik Çizim": şenliğin akışı pelerin mavisi ozalite, fener pirinciyle kotlanır. */
export function SunnetBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_BLUEPRINT}
      renderHero={(props) => (
        <BlueprintHero {...props} paper="#132a7a" line="#e6ecff" accent={SEHZADE.fener} sheetCode="SN-07" />
      )}
    />
  );
}
