import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { KINA_BRUTAL } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaBrutal — "Brutal" kına yorumu: avuç zemin, kahve mürekkep, al ve kına blokları. */
export function KinaBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_BRUTAL}
      renderHero={(props) => (
        <BrutalHero {...props} ink="#2a0f08" accent="#b0241c" accent2="#e8894a" onAccent="#fff1e6" onAccent2="#2a0f08" />
      )}
      renderHeroBackground={() => (
        <HeroStage base="#f8ebdf" scrim={false} vignette={false} parallax={0} grain={0.018} fadeTo="#f8ebdf" />
      )}
    />
  );
}
