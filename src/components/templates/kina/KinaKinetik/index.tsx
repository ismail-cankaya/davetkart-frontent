import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { KinetikHero } from '../../shared/heroes';
import { KINA_KINETIK } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaKinetik — "Kinetik Tipografi" kına yorumu: zemin duvağın alı, üstünden
 * krem harflerle "KINA GECESİ" akar. Kategorinin tek doygun kırmızı zemini.
 */
export function KinaKinetik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_KINETIK}
      renderHero={(props) => <KinetikHero {...props} topWord="KINA GECESİ" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #a32019 0%, #8c1a14 55%, #6a120d 100%)"
          scrim={false}
          vignette={{ strength: 0.35 }}
          atmosphere={<Halo color="255,160,100" size={62} x={50} y={45} opacity={0.14} duration={12} />}
          parallax={5}
          grain={0.035}
          fadeTo="#8c1a14"
        />
      )}
    />
  );
}
