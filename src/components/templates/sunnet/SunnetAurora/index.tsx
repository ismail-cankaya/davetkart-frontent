import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, AuroraMesh, Halo } from '../../shared/effects';
import { SUNNET_AURORA } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { SehzadeHero } from '../parts/SehzadeHero';
import { TemplateProps } from '../../types';

/**
 * SunnetAurora — "Aurora Cam": sax, nazar turkuazı ve nar lekeleriyle akan
 * mesh üzerinde cam yüzeyler. Düzen Şehzade hero'su; kuşak buz camı tonunda.
 */
export function SunnetAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_AURORA}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 110% 90% at 50% 22%, #17287a 0%, #0c1550 55%, #060a2a 100%)"
          scrim={{ from: 'both', strength: 0.3 }}
          vignette={{ strength: 0.45 }}
          atmosphere={
            <>
              <AuroraMesh colors={['35,72,198', '42,167,184', '195,38,60']} opacity={0.55} duration={26} />
              <Halo color="111,214,226" size={60} x={50} y={40} opacity={0.18} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#6fd6e2', '#a5b4ff'],
              blend: 'screen',
              density: 0.7,
              speed: 0.45,
              opacity: 0.7,
              pointerStrength: 1.4,
              depth: 1,
              seed: 211
            }
          ]}
          parallax={7}
          grain={0.03}
          fadeTo="#0a1242"
        />
      )}
      renderHero={(props) => (
        <SehzadeHero
          {...props}
          halo="8,14,60"
          sash={{
            fill: 'linear-gradient(100deg, rgba(255,255,255,0.92), rgba(214,244,248,0.92))',
            ink: '#0a1242',
            stitch: 'rgba(13,111,128,0.45)'
          }}
        />
      )}
    />
  );
}
