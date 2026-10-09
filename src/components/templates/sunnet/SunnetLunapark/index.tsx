import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo, LightLeak, Spires } from '../../shared/effects';
import { SEHZADE, SUNNET_LUNAPARK } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { Sacak } from '../parts/Sacak';
import { SehzadeHero } from '../parts/SehzadeHero';
import { TemplateProps } from '../../types';

/**
 * SunnetLunapark — "Eğlenceli Lunapark": gece panayırı. Tepede nar–krem
 * çadır saçağı, ufukta külahlı kuleler, aşağıdan yükselen kabarcıklar ve
 * üstten dökülen konfeti.
 *
 * Konfeti düşer, kabarcık yükselir: iki parçacık aynı yöne aksaydı kadraj
 * okunmaz olurdu. Saçak, otağdaki (Klasik) dilin gece panayırı karşılığıdır.
 */
export function SunnetLunapark({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_LUNAPARK}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          // Altta panayırın ışık kubbesi, üstte menekşe gece: koyu siluet
          // ancak arkasındaki bu parlak bantla okunur.
          base="radial-gradient(ellipse 70% 34% at 50% 96%, rgba(255,150,70,0.5) 0%, rgba(255,120,40,0) 72%), radial-gradient(ellipse 90% 75% at 50% 32%, #2e2470 0%, #171248 55%, #0c0a2c 100%)"
          scrim={{ from: 'both', strength: 0.46 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <Halo color="255,196,86" size={68} x={50} y={38} opacity={0.26} duration={6} />
              <Spires color="10,8,34" opacity={0.95} height={0.5} count={9} roofs="cone" seed={53} />
              <LightLeak color="255,190,120" opacity={0.3} duration={9} />
            </>
          }
          particles={[
            {
              preset: 'bubbles',
              colors: ['#ffc456', '#ff6b7d', '#6fd6e2', '#a99bff'],
              density: 1,
              speed: 0.95,
              opacity: 0.7,
              depth: 1,
              seed: 13
            },
            {
              preset: 'confetti',
              colors: ['#ffc456', SEHZADE.nar, '#fff4e6'],
              density: 0.65,
              speed: 0.9,
              opacity: 0.8,
              depth: 0.7,
              seed: 66
            }
          ]}
          overlay={<Sacak stripes={[SEHZADE.nar, '#fff4e6']} trim={SEHZADE.pirinc} tassel="#ffc456" revealed={revealed} />}
          fadeTo="#120f3d"
        />
      )}
      renderHero={(props) => (
        <SehzadeHero
          {...props}
          canopy
          halo="12,10,44"
          sash={{ fill: SEHZADE.nar, ink: '#fff4e6', stitch: '#ffc456' }}
        />
      )}
    />
  );
}
