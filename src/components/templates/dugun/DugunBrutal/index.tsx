import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunBrutal — "Brutal" yorumu: süsü kaldırıp daveti ham tipografi ve sert
 * kontrastla kuran anti-romantik yorum. Kategori renkleriyle: mürekkep,
 * canlı şakayık ve inci-lila.
 */
export function DugunBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunBrutal}
      renderHero={(props) => (
        <BrutalHero
          {...props}
          ink="#17131c"
          accent="#b8245a"
          accent2="#cfc3ee"
          onAccent="#fff5f8"
          onAccent2="#17131c"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="#f1eef3"
          scrim={false}
          vignette={false}
          parallax={0}
          grain={0.018}
          fadeTo="#f1eef3"
        />
      )}
    />
  );
}
