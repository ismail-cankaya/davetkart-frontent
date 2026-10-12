import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { TakvimHero } from '../../shared/heroes';
import { KINA_TAKVIM } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaTakvim — "Takvim" kına yorumu: avuç kâğıdı yaprak, al işaret, bakır halka, kayısı not. */
export function KinaTakvim({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_TAKVIM}
      renderHero={(props) => (
        <TakvimHero {...props} paper="#fdf5ec" ink="#b0241c" metal="#b07a3c" note="#f6c9a8" noteInk="#4a1a0e" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(110% 70% at 50% 25%, #f9ecdf 0%, #ead2bc 100%)"
          scrim={false}
          vignette={{ strength: 0.15 }}
          parallax={0}
          grain={0.03}
          fadeTo="#f5e4d4"
        />
      )}
    />
  );
}
