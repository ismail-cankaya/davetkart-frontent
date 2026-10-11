import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { HatHero } from '../../shared/heroes';
import { KINA_CIZGI } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaCizgi — "Tek Çizgi" kına yorumu: açık avuç kâğıdı, kuru kına yaprağı
 * zeytini hat. Kategorinin kırmızısız, en sade çizgisi.
 */
export function KinaCizgi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_CIZGI}
      renderHero={(props) => <HatHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdf8f1 0%, #f7eadc 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.02}
          fadeTo="#fbf2e8"
        />
      )}
    />
  );
}
