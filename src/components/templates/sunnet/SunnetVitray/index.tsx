import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { SEHZADE, SUNNET_VITRAY } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetVitray — "Vitray Işık": camlar pelerin mavisi, kuşak kırmızısı ve
 * sırma pirinci; kemer formu çini geleneğinin diliyle kategoriye en doğal
 * oturan sürüm. Işık pirinç huzmelerle süzülür.
 */
export function SunnetVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_VITRAY}
      renderHero={(props) => (
        <VitrayHero {...props} glass={[SEHZADE.sax, SEHZADE.nar, SEHZADE.pirinc]} glow={SEHZADE.fener} seed={43} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #1a2470 0%, #0e1548 55%, #060a26 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <GodRays color="242,193,78" angle={15} count={6} origin={50} opacity={0.24} duration={16} />
              <Halo color="195,38,60" size={58} x={50} y={30} opacity={0.16} duration={12} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', SEHZADE.fener],
              blend: 'screen',
              density: 0.45,
              speed: 0.28,
              opacity: 0.45,
              pointerStrength: 1.1,
              depth: 1,
              seed: 343
            }
          ]}
          parallax={8}
          grain={0.03}
          fadeTo="#0a1036"
        />
      )}
    />
  );
}
