import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { FilmHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/** DugunFilm — "Film Şeridi" düğün yorumu: gece şerit, inci ışıklı kareler. */
export function DugunFilm({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunFilm}
      renderHero={(props) => <FilmHero {...props} strip="#1b1720" frame="#120f16" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #1d1922 0%, #120f15 55%, #100d13 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="221,211,230" size={56} x={50} y={40} opacity={0.12} duration={13} />}
          parallax={5}
          grain={0.03}
          fadeTo="#100d13"
        />
      )}
    />
  );
}
