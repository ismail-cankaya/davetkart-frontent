import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { KinetikHero } from '../../shared/heroes';
import { SUNNET_KINETIK } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetKinetik — "Kinetik Tipografi": zemin pelerinin kendisi (doygun sax),
 * şeritte kuşağın nakışı gibi tekrar eden "MAŞALLAH".
 */
export function SunnetKinetik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_KINETIK}
      renderHero={(props) => <KinetikHero {...props} topWord="MAŞALLAH" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #2540c0 0%, #1b2f9e 55%, #14237a 100%)"
          scrim={false}
          vignette={{ strength: 0.35 }}
          atmosphere={<Halo color="255,201,74" size={58} x={50} y={45} opacity={0.12} duration={12} />}
          parallax={5}
          grain={0.028}
          fadeTo="#1b2f9e"
        />
      )}
    />
  );
}
