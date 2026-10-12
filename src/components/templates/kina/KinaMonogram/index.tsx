import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { MonogramHero } from '../../shared/heroes';
import { KINA_MONOGRAM } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaMonogram — "Bakır Varak Monogram": kına kahvesi kart, tepsi bakırından varak. */
export function KinaMonogram({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_MONOGRAM}
      renderHero={(props) => (
        <MonogramHero {...props} paper="#4a1a0e" edge="#e0955a" foil={['#8c4a24', '#e0955a', '#f8d0a8']} stock="dark" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(120% 80% at 50% 30%, #3e160c 0%, #2a0e08 100%)"
          scrim={false}
          vignette={{ strength: 0.3 }}
          parallax={0}
          grain={0.025}
          fadeTo="#2a0e08"
        />
      )}
    />
  );
}
