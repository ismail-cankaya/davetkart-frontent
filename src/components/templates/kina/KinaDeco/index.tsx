import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Sunburst, GoldSheen } from '../../shared/effects';
import { DecoHero } from '../../shared/heroes';
import { KINA_DECO } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Bakır: kına tepsisinin metali; Deco çerçevesi ve yelpazesi altın yerine bununla döner. */
const BAKIR = '217,134,82';

/**
 * KinaDeco — "Art Deco Gala" kına yorumu: kına kahvesi zemin, bakır yelpaze.
 * Üç Deco'dan ayrışma metalle: düğün inci, nişan platin, kına bakır.
 */
export function KinaDeco({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_DECO}
      renderHero={(props) => <DecoHero {...props} metal={BAKIR} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #33180e 0%, #1c0d08 55%, #0e0604 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Sunburst color={BAKIR} rays={44} opacity={0.18} x={50} y={38} />
              <GoldSheen color="242,190,150" opacity={0.12} duration={9} />
            </>
          }
          parallax={9}
          grain={0.032}
          fadeTo="#1c0d08"
        />
      )}
    />
  );
}
