import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { PostaHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/** DugunPosta — "Posta Damgası" düğün yorumu: şakayık–mürekkep şeritli zarf, inci pul. */
export function DugunPosta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunPosta}
      renderHero={(props) => (
        <PostaHero {...props} stripe={['#a3365f', '#2c2340']} stamp="#d9d0e2" postmark="#3d3355" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfcfd 0%, #f0edf2 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f7f5f8"
        />
      )}
    />
  );
}
