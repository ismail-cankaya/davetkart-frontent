import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halftone } from '../../shared/effects';
import { TicketHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunBilet — "Davet Bileti" düğün yorumu: inci kart stoğu, şakayık mürekkep.
 *
 * Bilet dilinin diğer kategorilerdeki sürümleri gece zeminlidir (konser,
 * gala). Düğünde koçan mantığı korunup malzeme değiştirildi: matbaada
 * basılmış inci davet kartı.
 */
export function DugunBilet({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunBilet}
      renderHero={(props) => <TicketHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #f9f8fa 0%, #ece8ef 55%, #e0dae5 100%)"
          scrim={false}
          vignette={false}
          // Tram: kartın matbaa kağıdı dokusu, mürekkep renginde.
          atmosphere={<Halftone color="33,27,45" size={4} angle={22} opacity={0.07} />}
          parallax={6}
          grain={0.024}
          fadeTo="#f2f0f4"
        />
      )}
    />
  );
}
