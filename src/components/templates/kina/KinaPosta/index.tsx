import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { PostaHero } from '../../shared/heroes';
import { KINA_POSTA } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaPosta — "Posta Damgası" kına yorumu: al-kına şeritli zarf, sırma pul, al damga. */
export function KinaPosta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_POSTA}
      renderHero={(props) => <PostaHero {...props} stripe={['#b0241c', '#c4581d']} stamp="#d8a24a" postmark="#871a15" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdf6ee 0%, #f3e0cf 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f9eee3"
        />
      )}
    />
  );
}
