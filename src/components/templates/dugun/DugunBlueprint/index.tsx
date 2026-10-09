import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { BlueprintHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunBlueprint — "Teknik Çizim" yorumu: günü kotlanmış bir proje gibi
 * çizen ozalit; düğünde lacivert değil mürekkep moru, revizyon şakayık.
 */
export function DugunBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunBlueprint}
      renderHero={(props) => (
        <BlueprintHero {...props} paper="#1e1832" line="#e3d9f2" accent="#f4b3cd" sheetCode="DK-01" />
      )}
    />
  );
}
