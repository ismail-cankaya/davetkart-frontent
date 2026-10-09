import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { HatHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunCizgi — "Tek Çizgi" düğün yorumu: tül kağıt, mor mürekkepli tek hat.
 *
 * Zemin neredeyse boş bırakıldı; monoline dilde kompozisyonu boşluk kurar,
 * arka planın işi yalnızca kağıdı taklit etmek.
 */
export function DugunCizgi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunCizgi}
      renderHero={(props) => <HatHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfcfd 0%, #f3f0f5 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.018}
          fadeTo="#f9f8fa"
        />
      )}
    />
  );
}
