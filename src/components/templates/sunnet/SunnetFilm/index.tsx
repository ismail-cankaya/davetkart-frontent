import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { FilmHero } from '../../shared/heroes';
import { SUNNET_FILM } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetFilm — "Film Şeridi": gece mavisi şeritte karesi karesine ilerleyen şenlik; nar ışığı. */
export function SunnetFilm({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_FILM}
      renderHero={(props) => <FilmHero {...props} strip="#151c4a" frame="#0e1440" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #18205a 0%, #0e1440 55%, #0c1236 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="255,138,150" size={56} x={50} y={40} opacity={0.12} duration={13} />}
          parallax={5}
          grain={0.03}
          fadeTo="#0c1236"
        />
      )}
    />
  );
}
