import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { Hale } from '../parts/Hale';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TulVeil } from '../parts/TulVeil';
import { TemplateProps } from '../../types';

/**
 * DugunModern — "Gece Modası": koyu cam yüzeyler, köşelerde nefes alan
 * orkide ve lila ışık, kadrajı saran gece tülü.
 */
export function DugunModern({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunModern}
      renderHero={(props) => <KurdeleHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 110% 85% at 50% 18%, #241a33 0%, #120e1a 55%, #0b0910 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <Hale color="231,154,192" size={70} x={20} y={18} opacity={0.45} duration={12} />
              <Hale color="185,167,224" size={80} x={84} y={80} opacity={0.36} duration={15} />
            </>
          }
          overlay={<TulVeil tone="dark" strength={0.8} />}
          parallax={10}
          grain={0.03}
          fadeTo="#0f0c15"
        />
      )}
    />
  );
}
