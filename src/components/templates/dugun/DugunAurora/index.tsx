import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { Hale } from '../parts/Hale';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';

/**
 * DugunAurora — "Sedef": inci kabuğunun yanardöner iç yüzeyi gibi akan
 * şakayık, lila ve nane ışığı; üzerinde buzlu cam kartlar.
 *
 * Videosuz; tüm görsel yük CSS mesh + canvas parçacıklarında. Mesh üç
 * bağımsız lekeden oluştuğu için desen tekrar etmez.
 */
export function DugunAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunAurora}
      renderHero={(props) => <KurdeleHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 110% 90% at 50% 20%, #221a30 0%, #110d1a 55%, #09070e 100%)"
          // Mesh zaten yumuşak; scrim yalnızca metnin oturduğu banda iner.
          scrim={[
            { from: 'both', strength: 0.3 },
            { from: 'center', strength: 0.4, tint: '15,12,22' }
          ]}
          vignette={{ strength: 0.45 }}
          atmosphere={
            <>
              <AuroraMesh colors={['235,169,198', '199,184,226', '178,226,214']} opacity={0.55} duration={24} />
              <Hale color="240,181,207" size={62} x={50} y={40} opacity={0.2} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#f0b5cf', '#d9cdf3'],
              blend: 'screen',
              density: 0.7,
              speed: 0.45,
              opacity: 0.7,
              pointerStrength: 1.4,
              depth: 1,
              seed: 101
            }
          ]}
          grain={0.03}
          fadeTo="#0f0c16"
        />
      )}
    />
  );
}
