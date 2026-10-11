import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { KINA_AURORA } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { KinaHero } from '../parts/KinaHero';
import { TemplateProps } from '../../types';

/**
 * KinaAurora — "Kına Ateşi": kına turuncusu, duvak alı ve sırma sarısından
 * akışkan bir renk kütlesi; metin önünde buzlu cam bir kartta durur.
 */
export function KinaAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_AURORA}
      renderHero={(props) => <KinaHero {...props} panel="cam" flame="#ffd27f" className="pt-14 pb-20" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 110% 90% at 50% 22%, #4a1a0c 0%, #2a0e08 55%, #140705 100%)"
          scrim={false}
          vignette={{ strength: 0.4 }}
          atmosphere={<AuroraMesh colors={['226,110,50', '176,36,28', '232,170,80']} opacity={0.72} duration={24} />}
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffd27f', '#ffffff', '#f2a066'],
              blend: 'screen',
              density: 0.55,
              speed: 0.4,
              opacity: 0.6,
              pointerStrength: 1.2,
              depth: 1,
              seed: 121
            }
          ]}
          grain={0.035}
          fadeTo="#1a0907"
        />
      )}
    />
  );
}
