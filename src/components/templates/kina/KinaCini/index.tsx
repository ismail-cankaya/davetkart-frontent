import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { CiniHero } from '../../shared/heroes';
import { KINA_CINI } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaCini — "Çini" kına yorumu: kobalt kontur yerine kına kahvesi, sırlar
 * kına turuncusu, duvak alı ve yaprak zeytini; derz avuç tonunda.
 */
export function KinaCini({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_CINI}
      renderHero={(props) => (
        <CiniHero
          {...props}
          glaze="#fbf1e6"
          cobalt="#7a2a12"
          turquoise="#c4581d"
          coral="#b0241c"
          leaf="#666a2c"
          grout="#ecd3bf"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage base="#ecd3bf" scrim={false} vignette={false} parallax={0} grain={0.02} fadeTo="#f8ebdf" />
      )}
    />
  );
}
