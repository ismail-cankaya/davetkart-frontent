import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunVitray — "Vitray Işık" düğün yorumu: şakayık–lila–mersin camlar,
 * arkadan vuran inci öğle ışığı.
 *
 * Nikâh mekânının penceresinden süzülen ışık fikri; kemer ve gül pencere
 * kompozisyonun tamamını taşıdığı için ayrıca bir çerçeve süsü yok.
 */
export function DugunVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunVitray}
      renderHero={(props) => (
        <VitrayHero {...props} glass={['#c95a86', '#b9a7e0', '#6f9c86']} glow="#f3dce8" seed={31} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #241b2e 0%, #140f1a 55%, #0a070e 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              {/* Huzmeler pencerenin ardındaki ışığı odanın içine taşır. */}
              <GodRays color="243,220,232" angle={14} count={6} origin={50} opacity={0.26} duration={16} />
              <Halo color="235,176,201" size={58} x={50} y={30} opacity={0.2} duration={12} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#f3dce8'],
              blend: 'screen',
              density: 0.45,
              speed: 0.28,
              opacity: 0.45,
              pointerStrength: 1.1,
              depth: 1,
              seed: 331
            }
          ]}
          parallax={8}
          grain={0.03}
          fadeTo="#110d16"
        />
      )}
    />
  );
}
