import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { TakvimHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunTakvim — "Takvim" yorumu: tül yaprak, inci spiral, şakayık mürekkeple
 * çizilmiş gün ve pudra şakayık yapışkan not.
 */
export function DugunTakvim({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunTakvim}
      renderHero={(props) => (
        <TakvimHero {...props} paper="#fdfcfe" ink="#9b3a63" metal="#b4a9c0" note="#f3dde7" noteInk="#211b2d" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(110% 70% at 50% 25%, #f8f6f9 0%, #e5dfea 100%)"
          scrim={false}
          vignette={{ strength: 0.14, tint: '33,27,45' }}
          parallax={0}
          grain={0.03}
          fadeTo="#f2f0f4"
        />
      )}
    />
  );
}
