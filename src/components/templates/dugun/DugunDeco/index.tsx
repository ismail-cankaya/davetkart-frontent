import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Sunburst, GoldSheen } from '../../shared/effects';
import { DecoHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunDeco — "Art Deco Gala" düğün yorumu: platin deco. Onyx zemin,
 * altın yerine inci yelpaze ve inci parlama — 1920'lerin platin mücevher dili.
 */
export function DugunDeco({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunDeco}
      renderHero={(props) => <DecoHero {...props} metal="217,208,226" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #1c1822 0%, #0f0d13 55%, #070609 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              {/* Dev yelpaze kadrajın merkezinden açılır; DecoHero kendi
                  küçük madalyonunu bunun üstüne bindirir. */}
              <Sunburst color="217,208,226" rays={48} opacity={0.2} x={50} y={38} />
              <GoldSheen color="239,232,243" opacity={0.12} duration={9} />
            </>
          }
          parallax={9}
          grain={0.032}
          fadeTo="#0e0c12"
        />
      )}
    />
  );
}
