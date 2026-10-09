import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Iridescent, Halo } from '../../shared/effects';
import { SUNNET_KROM } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { SehzadeHero } from '../parts/SehzadeHero';
import { TemplateProps } from '../../types';

/**
 * SunnetKrom — "Likit Krom": gece mavisi metal, buz mavisi–turkuaz yansımalar.
 *
 * Ad `bg-clip-text` ile metalik degradeden kesilir; kuşak da aynı krom
 * levhadan dövülmüş gibi açık metal tonda. Sax burada boya değil, yüzeyden
 * yansıyan ışıktır.
 */
export function SunnetKrom({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_KROM}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(150deg, #18234f 0%, #0d1330 55%, #060818 100%)"
          scrim={{ from: 'both', strength: 0.42 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <Iridescent opacity={0.3} duration={17} className="mix-blend-soft-light" />
              <Halo color="159,216,240" size={62} x={50} y={40} opacity={0.2} duration={10} />
            </>
          }
          particles={[
            {
              preset: 'streaks',
              colors: ['#9fd8f0', '#b7c8f4', '#8fe3ec'],
              blend: 'screen',
              density: 0.7,
              speed: 0.6,
              opacity: 0.3,
              depth: 0.5,
              seed: 141
            },
            {
              preset: 'stardust',
              colors: ['#ffffff', '#b7c8f4'],
              blend: 'screen',
              density: 0.5,
              speed: 0.4,
              opacity: 0.55,
              pointerStrength: 1.5,
              depth: 1,
              seed: 142
            }
          ]}
          grain={0.03}
          fadeTo="#090d24"
        />
      )}
      renderHero={(props) => (
        <SehzadeHero
          {...props}
          sash={{
            fill: 'linear-gradient(100deg, #e6eeff 0%, #b7c8f4 52%, #8fe3ec 100%)',
            ink: '#0a1018',
            stitch: 'rgba(10,16,24,0.35)'
          }}
        />
      )}
    />
  );
}
