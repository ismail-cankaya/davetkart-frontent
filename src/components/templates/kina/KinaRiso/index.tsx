import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { RisoHero } from '../../shared/heroes';
import { KINA_RISO } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaRiso — "Risograph Poster" kına yorumu: avuç kâğıdına iki mürekkep,
 * kına turuncusu ve kuru kına yaprağı zeytini; üst üste bindikleri yer kahve.
 */
export function KinaRiso({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_RISO}
      renderHero={(props) => <RisoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbf1e5 0%, #f2dfcb 100%)"
          scrim={false}
          vignette={false}
          parallax={5}
          grain={0.03}
          fadeTo="#f8eadb"
        />
      )}
    />
  );
}
