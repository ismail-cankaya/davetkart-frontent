import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/** DugunMermer — "Mermer & Rölyef" düğün yorumu: inci-lila damarlı beyaz taşa oyulmuş yazı. */
export function DugunMermer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunMermer}
      renderHero={(props) => (
        <MermerHero
          {...props}
          slab="linear-gradient(150deg, #fbfafc 0%, #efebf2 45%, #e3dde8 100%)"
          vein="#b4a9c0"
          polish="light"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfafc 0%, #efecf2 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f4f2f5"
        />
      )}
    />
  );
}
