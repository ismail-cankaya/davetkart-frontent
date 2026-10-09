import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { Hale } from '../parts/Hale';
import { TemplateProps } from '../../types';

/** DugunYildizHaritasi — "Yıldız Haritası" düğün yorumu: menekşe gece göğü, inci-lila takımyıldız. */
export function DugunYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunYildizHaritasi}
      renderHero={(props) => <YildizHero {...props} star="#ffffff" line="#d8c9f0" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #1a1630 0%, #0e0c1c 55%, #06050d 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Hale color="216,201,240" size={54} x={50} y={34} opacity={0.14} duration={14} />}
          parallax={6}
          grain={0.028}
          fadeTo="#0c0b16"
        />
      )}
    />
  );
}
