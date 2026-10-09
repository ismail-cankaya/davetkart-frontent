import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/** DugunSuluboya — "Suluboya" düğün yorumu: şakayık, lila ve mersin lekeleri; inci kağıt. */
export function DugunSuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunSuluboya}
      renderHero={(props) => (
        <SuluboyaHero {...props} washes={['#e2a3bd', '#c7b8e2', '#a9c6b5']} seed={7} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fefdfe 0%, #f4f1f6 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.026}
          fadeTo="#faf9fb"
        />
      )}
    />
  );
}
