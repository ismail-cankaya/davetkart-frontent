import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { FilmHero } from '../../shared/heroes';
import { KINA_FILM } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaFilm — "Film Şeridi" kına yorumu: kahve şerit, mum ışığında kareler. */
export function KinaFilm({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_FILM}
      renderHero={(props) => <FilmHero {...props} strip="#2a140c" frame="#170b06" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #2e160c 0%, #170b06 55%, #120805 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="242,160,102" size={56} x={50} y={40} opacity={0.12} duration={13} />}
          parallax={5}
          grain={0.03}
          fadeTo="#120805"
        />
      )}
    />
  );
}
