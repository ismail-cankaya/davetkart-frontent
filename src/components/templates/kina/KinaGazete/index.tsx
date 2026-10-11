import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { KINA_GAZETE } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaGazete — "Kına Gazetesi": sıcak gazete kâğıdı, al manşet. */
export function KinaGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_GAZETE}
      renderHero={(props) => <GazeteHero {...props} masthead="KINA GAZETESİ" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #faf3ea 0%, #f0e2d2 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.026}
          fadeTo="#f6ecdf"
        />
      )}
    />
  );
}
