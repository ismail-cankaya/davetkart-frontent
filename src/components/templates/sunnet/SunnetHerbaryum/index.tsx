import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { SEHZADE, SUNNET_HERBARYUM } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetHerbaryum — "Herbaryum": töreni nazar turkuazı mürekkeple kayda geçiren föy. */
export function SunnetHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_HERBARYUM}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#f2f7f8"
          tape="rgba(42,167,184,0.28)"
          specimen={SEHZADE.turkuazMetin}
          label="#ffffff"
          accession="No. 001"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfdfd 0%, #eaf2f4 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f2f7f8"
        />
      )}
    />
  );
}
