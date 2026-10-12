import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { KINA_HERBARYUM } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaHerbaryum — "Lawsonia": kına bitkisinin (Lawsonia inermis) kurutulmuş
 * yaprağı herbaryum kâğıdında; zeytin numune, sırma bant.
 */
export function KinaHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_HERBARYUM}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#fbf2e6"
          tape="rgba(216,162,74,0.45)"
          specimen="#666a2c"
          label="#fffaf3"
          accession="Lawsonia · No. 014"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fcf5ec 0%, #f4e2d0 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f8ecdf"
        />
      )}
    />
  );
}
