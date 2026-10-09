import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/** DugunHerbaryum — "Herbaryum" yorumu: günü preslenmiş bir mersin dalı gibi inci föye kaydeden arşiv. */
export function DugunHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunHerbaryum}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#f5f4f6"
          tape="rgba(203,194,211,0.55)"
          specimen="#3f6b55"
          label="#fdfcfd"
          accession="No. 001"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfcfd 0%, #f5f4f6 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f5f4f6"
        />
      )}
    />
  );
}
