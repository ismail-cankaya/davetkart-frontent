import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/** DugunPano — "Mekanik Pano" düğün yorumu: gece mürekkebi kanatlar, inci harfler. */
export function DugunPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunPano}
      renderHero={(props) => <PanoHero {...props} flap="#1d1825" ink="#f3eef6" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #1f1a26 0%, #141018 55%, #0a080c 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="234,176,200" size={56} x={50} y={42} opacity={0.12} duration={13} />}
          parallax={5}
          grain={0.028}
          fadeTo="#120f17"
        />
      )}
    />
  );
}
