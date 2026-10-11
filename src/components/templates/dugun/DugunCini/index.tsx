import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { CiniHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunCini — "Gül Çini": İznik'in kobalt–firuze–mercan üçlüsü kategori
 * paletine çevrildi: inci sır üstünde mürekkep moru hat, mersin yeşili ikinci
 * sır, şakayık çiçek; derz inci.
 */
export function DugunCini({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunCini}
      renderHero={(props) => (
        <CiniHero
          {...props}
          glaze="#fdfcfe"
          cobalt="#2c2340"
          turquoise="#6f9c86"
          coral="#a3365f"
          leaf="#41604f"
          grout="#e4dee9"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage base="#e4dee9" scrim={false} vignette={false} parallax={0} grain={0.02} fadeTo="#f5f3f7" />
      )}
    />
  );
}
