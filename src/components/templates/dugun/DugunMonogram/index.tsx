import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { MonogramHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunMonogram — "İnci Varak": pamuk kartta altın değil inci-gümüş varak
 * arma; kartın boyalı kenarı şakayık.
 */
export function DugunMonogram({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunMonogram}
      renderHero={(props) => (
        <MonogramHero {...props} paper="#fdfcfe" edge="#9b3a63" foil={['#7d7489', '#d6cde0', '#fbf8fd']} stock="light" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(120% 80% at 50% 30%, #faf8fb 0%, #e9e4ee 100%)"
          scrim={false}
          vignette={{ strength: 0.16, tint: '33,27,45' }}
          parallax={0}
          grain={0.025}
          fadeTo="#f4f2f6"
        />
      )}
    />
  );
}
