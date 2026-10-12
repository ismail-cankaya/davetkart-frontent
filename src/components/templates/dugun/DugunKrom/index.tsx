import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, GoldSheen } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';

/**
 * DugunKrom — "Saten Gümüş": cilalı gümüşün yatay yansıma bantları; kategoride
 * tek soğuk gri, açık metal zemin. Bantlar yalnızca açık-orta gümüş aralığında
 * gezer ki koyu mürekkep her bantta okunsun. İsimler koyu metal degradeden
 * kesilir; bantların üstünde gümüş bir parlama süzülür.
 */
export function DugunKrom({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunKrom}
      renderHero={(props) => <KurdeleHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #e9ecf1 0%, #f7f8fa 14%, #cfd5de 30%, #eef1f5 44%, #c3cad4 58%, #f4f6f9 72%, #d3d9e1 86%, #eceff3 100%)"
          scrim={false}
          vignette={{ strength: 0.16, tint: '60,68,82' }}
          atmosphere={<GoldSheen color="255,255,255" opacity={0.5} duration={9} />}
          overlay={
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 48% at 50% 50%, rgba(238,241,245,0.55), rgba(238,241,245,0) 78%)' }}
            />
          }
          parallax={6}
          grain={0.025}
          fadeTo="#eceff3"
        />
      )}
    />
  );
}
