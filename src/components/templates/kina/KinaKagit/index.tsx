import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { PaperHero } from '../../shared/heroes';
import { KINA_KAGIT } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaKagit — "Kağıt & Mühür" kına yorumu: avuç kâğıdı, duvak alı mühür. */
export function KinaKagit({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_KAGIT}
      renderHero={(props) => <PaperHero {...props} paper="#fcf3ea" sealColor="#b0241c" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 40%, #f6e6d6 0%, #eed6c0 55%, #e4c7ae 100%)"
          scrim={false}
          vignette={false}
          parallax={6}
          grain={0.02}
          fadeTo="#f5e3d2"
        />
      )}
    />
  );
}
