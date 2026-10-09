import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Sunburst, GoldSheen } from '../../shared/effects';
import { DecoHero } from '../../shared/heroes';
import { SUNNET_DECO } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetDeco — "Art Deco Gala": siyah değil kraliyet gecesi üzerinde pirinç
 * yelpaze; simetrik kademeli çerçeve sünnet düğününün ihtişamına oturur.
 */
export function SunnetDeco({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_DECO}
      renderHero={(props) => <DecoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #1a2670 0%, #0e1650 55%, #070b2c 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Sunburst color="233,178,58" rays={48} opacity={0.2} x={50} y={38} />
              <GoldSheen color="246,215,126" opacity={0.12} duration={9} />
            </>
          }
          parallax={9}
          grain={0.032}
          fadeTo="#0b1240"
        />
      )}
    />
  );
}
