import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/** DugunGazete — "Gazete Manşeti" düğün yorumu: daveti bir evlilik ilanı olarak basan dizgi. */
export function DugunGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunGazete}
      renderHero={(props) => <GazeteHero {...props} masthead="EVLİLİK İLANI" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #f9f8f7 0%, #ecebe9 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f3f2f1"
        />
      )}
    />
  );
}
