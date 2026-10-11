import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { NoirHero } from '../../shared/heroes';
import { KINA_NOIR } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaNoir — "Noir Minimal" kına yorumu: sıcak siyah zemin, duvak alı yalnızca
 * çizgi ve işaret olarak; tek ışık, tepsideki bir mumun koru.
 */
export function KinaNoir({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_NOIR}
      renderHero={(props) => <NoirHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 42%, #1e0d08 0%, #0e0604 55%, #060302 100%)"
          scrim={false}
          vignette={{ strength: 0.52 }}
          atmosphere={<Halo color="226,83,63" size={52} x={50} y={42} opacity={0.12} duration={13} />}
          particles={[
            {
              preset: 'embers',
              colors: ['#ee6d55', '#f2a066'],
              blend: 'screen',
              density: 0.3,
              speed: 0.4,
              opacity: 0.45,
              pointerStrength: 0.6,
              depth: 1,
              seed: 123
            }
          ]}
          parallax={8}
          grain={0.038}
          fadeTo="#0c0604"
        />
      )}
    />
  );
}
