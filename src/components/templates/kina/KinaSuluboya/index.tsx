import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { KINA_SULUBOYA } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaSuluboya — "Suluboya" kına yorumu: kâğıda damlayan kına, duvak alı ve
 * kına yaprağı lekeleri; kınanın kendisi gibi kenarda koyulaşan su izleri.
 */
export function KinaSuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_SULUBOYA}
      renderHero={(props) => <SuluboyaHero {...props} washes={['#c4581d', '#b0241c', '#7d8338']} seed={19} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdf8f2 0%, #f7eadd 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.026}
          fadeTo="#fbf2e9"
        />
      )}
    />
  );
}
