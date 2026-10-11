import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { BlueprintHero } from '../../shared/heroes';
import { KINA_BLUEPRINT } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaBlueprint — "Teknik Çizim" kına yorumu: kına kahvesi paftaya krem çizgi, kına ışığı ölçü. */
export function KinaBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_BLUEPRINT}
      renderHero={(props) => <BlueprintHero {...props} paper="#3a170e" line="#fbe3cf" accent="#ffb27a" sheetCode="KN-02" />}
    />
  );
}
