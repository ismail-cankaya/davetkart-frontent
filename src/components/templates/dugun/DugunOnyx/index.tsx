import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { HeroStage, Halo, GoldSheen } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';

/** Sıvı metal hatlar kadrajın kenarlarında; merkez tipografi için temiz kalır. */
const VIDEO = videoSet('dugun-onyx', { landscape: '50% 50%', portrait: '50% 50%' });

/**
 * DugunOnyx — "Onyx & İnci": onyx siyahı zeminde akan sıvı metal hatlar.
 *
 * Videonun metali olduğu gibi kalır; üstündeki ışık katmanları altından
 * inciye çevrildi: hale, parlama ve tozun hepsi inci-lila. Scrim neredeyse
 * yok — video zaten %90 siyah, okunabilirliği metnin arkasındaki hale kurar.
 */
export function DugunOnyx({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunOnyx}
      renderHero={(props) => <KurdeleHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="radial-gradient(ellipse 90% 70% at 50% 45%, #16131a 0%, #0b0a0d 55%, #050506 100%)"
          // Zaten siyah videoda güçlü scrim = ölü kadraj. Alt bant ve hafif merkez.
          scrim={[
            { from: 'bottom', strength: 0.35 },
            { from: 'center', strength: 0.35 }
          ]}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Halo color="228,219,233" size={70} x={50} y={42} opacity={0.2} duration={9} />
              <GoldSheen color="239,232,243" opacity={0.14} duration={9} />
            </>
          }
          particles={[
            // Sıvı metalin etrafında asılı kalan inci parıltılar.
            {
              preset: 'stardust',
              colors: ['#efe8f3', '#d9cfe3', '#e8b9c9'],
              blend: 'screen',
              density: 0.8,
              speed: 0.6,
              opacity: 0.75,
              pointerStrength: 1.3,
              depth: 1,
              seed: 5
            },
            // Yukarı süzülen ince inci çizgiler — "sıvı" hissini uzatır.
            {
              preset: 'streaks',
              colors: ['#d9cfe3', '#8f8699'],
              blend: 'screen',
              density: 0.5,
              speed: 0.35,
              opacity: 0.3,
              depth: 0.4,
              seed: 91
            }
          ]}
          fadeTo="#09080b"
        />
      )}
    />
  );
}
