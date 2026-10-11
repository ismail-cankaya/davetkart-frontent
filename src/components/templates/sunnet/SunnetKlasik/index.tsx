import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SEHZADE, SUNNET_KLASIK } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { OtagBackdrop } from '../parts/OtagBackdrop';
import { SehzadeHero } from '../parts/SehzadeHero';
import { TemplateProps } from '../../types';

/**
 * Sünnet — Klasik / "Şehzade": gündüz şenliğinde otağın içi. Sax–beyaz
 * saçak ve asılı fenerler, nar kuşakta başlık, lacivert italik ad.
 */
export function SunnetKlasik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_KLASIK}
      renderHeroBackground={(state) => <OtagBackdrop {...state} />}
      renderHero={(props) => (
        <SehzadeHero
          {...props}
          canopy
          ornament={SEHZADE.sax}
          sash={{ fill: SEHZADE.nar, ink: '#ffffff', stitch: SEHZADE.pirinc }}
        />
      )}
    />
  );
}
