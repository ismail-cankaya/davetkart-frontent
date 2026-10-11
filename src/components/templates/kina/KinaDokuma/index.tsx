import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { KINA_DOKUMA } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaDokuma — "Dokuma" kına yorumu: al, kına ve yaprak iplikleri; kahve dikiş. */
export function KinaDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_DOKUMA}
      renderHero={(props) => (
        <DokumaHero {...props} threads={['#b0241c', '#c4581d', '#666a2c']} weave="#c9a07c" stitch="#7a4532" seed={17} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbf1e6 0%, #f1dcc8 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.03}
          fadeTo="#f7e8da"
        />
      )}
    />
  );
}
