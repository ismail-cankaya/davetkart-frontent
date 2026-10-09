import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { SUNNET_YILDIZ_HARITASI } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetYildizHaritasi — "Yıldız Haritası": kraliyet gecesinde nazar turkuazı takımyıldız. */
export function SunnetYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_YILDIZ_HARITASI}
      renderHero={(props) => <YildizHero {...props} star="#ffffff" line="#6fd6e2" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #142070 0%, #0a1244 55%, #04071f 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="111,214,226" size={54} x={50} y={34} opacity={0.12} duration={14} />}
          parallax={6}
          grain={0.028}
          fadeTo="#070d33"
        />
      )}
    />
  );
}
