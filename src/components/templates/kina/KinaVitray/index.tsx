import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { KINA_VITRAY } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaVitray — "Vitray Işık" kına yorumu: al, kına ve sırma camlar; ışık gün
 * değil, akşam mumunun sıcaklığında.
 */
export function KinaVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_VITRAY}
      renderHero={(props) => (
        <VitrayHero {...props} glass={['#b0241c', '#d0682a', '#d8a24a']} lead="#140906" glow="#f2a066" seed={37} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #33150a 0%, #1c0c07 55%, #0b0503 100%)"
          scrim={false}
          vignette={{ strength: 0.58 }}
          atmosphere={
            <>
              <GodRays color="242,170,100" angle={16} count={6} origin={50} opacity={0.28} duration={15} />
              <Halo color="208,104,42" size={58} x={50} y={30} opacity={0.2} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'embers',
              colors: ['#f2a066', '#d8a24a'],
              blend: 'screen',
              density: 0.4,
              speed: 0.3,
              opacity: 0.4,
              depth: 1,
              seed: 337
            }
          ]}
          parallax={8}
          grain={0.032}
          fadeTo="#140906"
        />
      )}
    />
  );
}
