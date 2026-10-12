import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { PlakHero } from '../../shared/heroes';
import { KINA_PLAK } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaPlak — "Vinil Plak" kına yorumu: kına türkülerinin plağı; al etiket, ıs zemin. */
export function KinaPlak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_PLAK}
      renderHero={(props) => <PlakHero {...props} label="#b0241c" labelInk="#fdebd8" spinDuration={44} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #3a1a0c 0%, #1f0e08 55%, #0c0503 100%)"
          scrim={false}
          vignette={{ strength: 0.52 }}
          atmosphere={<Halo color="242,160,102" size={58} x={50} y={38} opacity={0.16} duration={12} />}
          parallax={6}
          grain={0.03}
          fadeTo="#1b0c07"
        />
      )}
    />
  );
}
