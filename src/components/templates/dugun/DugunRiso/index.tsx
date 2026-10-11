import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { RisoHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunRiso — "Risograph Poster" düğün yorumu: inci kağıt, floresan
 * şakayık ve mersin yeşili iki spot mürekkep.
 *
 * Kategori paletinin matbaa karşılığı: iki mürekkep, degrade yok.
 */
export function DugunRiso({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunRiso}
      renderHero={(props) => <RisoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfafb 0%, #f1eef2 100%)"
          scrim={false}
          vignette={false}
          parallax={5}
          grain={0.03}
          fadeTo="#f7f5f6"
        />
      )}
    />
  );
}
