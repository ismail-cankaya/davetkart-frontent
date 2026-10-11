import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { NoirHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KenarParcacik } from '../parts/KenarParcacik';
import { TemplateProps } from '../../types';

/**
 * DugunNoir — "Noir Minimal": neredeyse siyah zemin, dev serif başlık,
 * şampanya altını yerine inci kıl çizgiler.
 *
 * Efekt bütçesi bilinçli olarak en düşük: tek bir sönük inci hale ve çok
 * seyrek inci toz. Sessiz lüksün mantığı budur — her eklenen öğe başlığın
 * ağırlığından çalar.
 */
export function DugunNoir({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunNoir}
      renderHero={(props) => <NoirHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 42%, #15121a 0%, #0b0a0e 55%, #050506 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="217,208,226" size={54} x={50} y={42} opacity={0.12} duration={14} />}
          parallax={8}
          grain={0.038}
          overlay={
            <KenarParcacik
              fields={[
                {
                  preset: 'fairyDust',
                  colors: ['#d9d0e2', '#f3eef6'],
                  blend: 'screen',
                  density: 0.3,
                  speed: 0.35,
                  opacity: 0.42,
                  pointerStrength: 0.6,
                  seed: 103
                }
              ]}
            />
          }
          fadeTo="#0d0b10"
        />
      )}
    />
  );
}
