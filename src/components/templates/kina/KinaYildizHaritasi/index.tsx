import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { KINA_YILDIZ } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaYildizHaritasi — kına gecesinin gökyüzü: kahve-erik gece, krem yıldız, kına çizgisi. */
export function KinaYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_YILDIZ}
      renderHero={(props) => <YildizHero {...props} star="#ffe6cc" line="#d0682a" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #2e1414 0%, #190b0c 55%, #0a0405 100%)"
          scrim={false}
          vignette={{ strength: 0.52 }}
          atmosphere={<Halo color="242,168,122" size={54} x={50} y={34} opacity={0.13} duration={13} />}
          parallax={6}
          grain={0.028}
          fadeTo="#150a0b"
        />
      )}
    />
  );
}
