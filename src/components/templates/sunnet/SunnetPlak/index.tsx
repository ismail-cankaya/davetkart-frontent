import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { PlakHero } from '../../shared/heroes';
import { SEHZADE, SUNNET_PLAK } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetPlak — "Vinil Plak": kuşak kırmızısı etiket, gece mavisi zemin, fener pirinci vurgu. */
export function SunnetPlak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_PLAK}
      renderHero={(props) => <PlakHero {...props} label={SEHZADE.nar} labelInk="#fff4dc" spinDuration={46} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #1a2468 0%, #0f1645 55%, #070a24 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="242,193,78" size={58} x={50} y={38} opacity={0.14} duration={12} />}
          parallax={6}
          grain={0.03}
          fadeTo="#0c1236"
        />
      )}
    />
  );
}
