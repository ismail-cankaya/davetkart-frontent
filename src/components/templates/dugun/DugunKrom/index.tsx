import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Iridescent, Halo } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';

/**
 * DugunKrom — "Likit Krom": gümüş-inci metal, sıvı yansımalar.
 *
 * İsimler `bg-clip-text` ile degradeden kesilir; düz renk yerine metal
 * yüzeyin kendisi harflerin içinden geçer. KurdeleHero degradeyi her isim
 * satırının kendi öğesine verdiği için satırlar kayarken de kesim bozulmaz.
 */
export function DugunKrom({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunKrom}
      renderHero={(props) => <KurdeleHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(150deg, #191a26 0%, #0e0f16 55%, #07080c 100%)"
          scrim={{ from: 'both', strength: 0.42 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              {/* soft-light: iridesan katman zemini boyamaz, üstünde parlar. */}
              <Iridescent opacity={0.3} duration={16} className="mix-blend-soft-light" />
              <Halo color="217,205,234" size={64} x={50} y={40} opacity={0.2} duration={10} />
            </>
          }
          particles={[
            {
              preset: 'streaks',
              colors: ['#d9cdea', '#f0dce8', '#c3b8d4'],
              blend: 'screen',
              density: 0.7,
              speed: 0.6,
              opacity: 0.3,
              depth: 0.5,
              seed: 105
            },
            {
              preset: 'stardust',
              colors: ['#ffffff', '#e6deef'],
              blend: 'screen',
              density: 0.5,
              speed: 0.4,
              opacity: 0.55,
              pointerStrength: 1.5,
              depth: 1,
              seed: 106
            }
          ]}
          grain={0.03}
          fadeTo="#0b0b10"
        />
      )}
    />
  );
}
