import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { KenarParcacik } from '../parts/KenarParcacik';
import { TemplateProps } from '../../types';

/** Işık kaynağı üst kısımda; dikeyde kırpma biraz yukarıyı korur. */
const VIDEO = videoSet('gul-yapraklari', { landscape: '50% 50%', portrait: '50% 45%' });

/**
 * DugunGulYapraklari — "Gül Yaprakları": pudra zemine süzülen şakayık
 * yaprakları.
 *
 * Videonun kendi yaprakları arka planda kalır; canvas katmanı onların
 * ÖNÜNDE, alan derinliği (depth) farkıyla ikinci bir düzlem açar.
 */
export function DugunGulYapraklari({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunGulYapraklari}
      renderHero={(props) => <KurdeleHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="linear-gradient(to bottom, #f7e3e8 0%, #fbf3f5 45%, #f1e1e8 100%)"
          // Açık zemin: scrim beyaz tonda — yıkama yapıyor, karartma değil.
          scrim={[
            { from: 'both', strength: 0.5, tint: '255,255,255' },
            { from: 'center', strength: 0.7, tint: '251,243,245' }
          ]}
          vignette={{ strength: 0.2, tint: '110,60,85' }}
          atmosphere={
            <>
              <GodRays angle={12} origin={42} count={6} color="255,238,244" opacity={0.45} duration={18} />
              <Halo color="255,222,234" size={75} x={50} y={40} opacity={0.5} duration={10} />
            </>
          }
          grain={0.02}
          overlay={
            <KenarParcacik
              fields={[
                // Ön düzlem: büyük, hızlı, işaretçiden kaçan şakayık yaprakları (yalnız kenarlarda).
                {
                  preset: 'petals',
                  colors: ['#f0bfd0', '#e3a2bb', '#f7dde6', '#d4a8d0'],
                  density: 1,
                  speed: 1,
                  opacity: 0.9,
                  seed: 3
                },
                // Arka düzlem: küçük, yavaş, neredeyse sabit — mesafe hissi.
                {
                  preset: 'petals',
                  colors: ['#f7dde6', '#e6d3ec'],
                  density: 0.55,
                  speed: 0.5,
                  opacity: 0.45,
                  pointerStrength: 0.3,
                  seed: 64
                }
              ]}
            />
          }
          fadeTo="#fbf3f5"
        />
      )}
    />
  );
}
