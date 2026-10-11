import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { PlakHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { Hale } from '../parts/Hale';
import { DUGUN_RENK } from '../parts/palette';
import { TemplateProps } from '../../types';

/** DugunPlak — "Vinil Plak" düğün yorumu: ilk dansın plağı. Şakayık etiket, gece zemini. */
export function DugunPlak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunPlak}
      renderHero={(props) => (
        <PlakHero {...props} label={DUGUN_RENK.sakayik} labelInk="#fbf1f6" spinDuration={50} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #231c27 0%, #161219 55%, #0b090d 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Hale color="231,163,192" size={58} x={50} y={38} opacity={0.14} duration={13} />}
          parallax={6}
          grain={0.03}
          fadeTo="#121016"
        />
      )}
    />
  );
}
