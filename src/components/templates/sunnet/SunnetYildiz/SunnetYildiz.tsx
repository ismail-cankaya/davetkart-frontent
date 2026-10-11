import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { HeroStage, Halo } from '../../shared/effects';
import { SEHZADE, SUNNET_YILDIZ } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { SehzadeHero } from '../parts/SehzadeHero';
import { TemplateProps } from '../../types';

const VIDEO = videoSet('sunnet-yildiz', { landscape: '50% 50%', portrait: '50% 48%' });

/**
 * SunnetYildiz — "Görkemli Masal Şatosu": yıldızların altında ışıl ışıl bir
 * şato, çevresinde sessizce patlayan donanma fişekleri.
 *
 * Fişekler şenliğin üç rengiyle patlar (fener pirinci, nar, sax ışığı);
 * şampanya altın tek renk olsaydı kategori ailesinden kopardı. Video hareketli
 * olduğu için hero okuma halesiyle gelir.
 */
export function SunnetYildiz({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_YILDIZ}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="radial-gradient(ellipse 95% 75% at 50% 30%, #1d2a7a 0%, #0f1650 55%, #060a2a 100%)"
          scrim={{ from: 'both', strength: 0.45 }}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="242,193,78" size={64} x={50} y={36} opacity={0.24} duration={10} />}
          particles={[
            // Donanma: üst yarıda, seyrek aralıklarla, şenliğin üç rengi.
            {
              preset: 'fireworks',
              colors: [SEHZADE.fener, '#ff8a96', '#9db0ff', '#fff4dc'],
              blend: 'screen',
              density: 1,
              speed: 1,
              opacity: 0.9,
              pointerStrength: 0,
              depth: 0.8,
              seed: 21
            },
            // Sabit yıldız tozu: gökyüzünün kendi dokusu, imlece duyarlı.
            {
              preset: 'stardust',
              colors: ['#ffffff', SEHZADE.fener, '#bcc8ff'],
              blend: 'screen',
              density: 0.7,
              speed: 0.4,
              opacity: 0.65,
              pointerStrength: 1.2,
              depth: 1,
              seed: 77
            }
          ]}
          fadeTo="#0b1240"
        />
      )}
      renderHero={(props) => (
        <SehzadeHero
          {...props}
          halo="6,10,42"
          sash={{ fill: SEHZADE.nar, ink: '#fff4dc', stitch: SEHZADE.fener }}
        />
      )}
    />
  );
}
