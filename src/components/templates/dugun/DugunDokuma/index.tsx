import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/** DugunDokuma — "Dokuma" düğün yorumu: keten-inci zemin; şakayık, mersin ve lila iplikler. */
export function DugunDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunDokuma}
      renderHero={(props) => (
        <DokumaHero
          {...props}
          threads={['#a3365f', '#3f6b55', '#7d6aa8']}
          weave="#b3a8bd"
          stitch="#8f2f57"
          seed={5}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #faf8f9 0%, #f0ecef 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.03}
          fadeTo="#f5f2f4"
        />
      )}
    />
  );
}
