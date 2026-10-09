import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { TerrazzoHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/** DugunTerrazzo — "Terrazzo" yorumu: inci harca gömülü şakayık, mersin, lila ve mürekkep çakıllar. */
export function DugunTerrazzo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunTerrazzo}
      renderHero={(props) => (
        <TerrazzoHero
          {...props}
          chips={['#a3365f', '#3f6b55', '#b9a7e0', '#e4dee9', '#211b2d']}
          slab="#f5f3f6"
          seed={11}
        />
      )}
    />
  );
}
