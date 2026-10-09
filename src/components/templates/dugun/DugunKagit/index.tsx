import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { PaperHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { DUGUN_RENK } from '../parts/palette';
import { TemplateProps } from '../../types';

/**
 * DugunKagit — "Kağıt & Mühür": deckle kenarlı kart, kabartma tipografi,
 * bordo değil şakayık mum mührü; kart inci-lila bir masa örtüsünün üstünde.
 *
 * Hero tam ekran KAPLAMAZ — kenar boşluğu kağıdın nesne olduğunu söyler.
 */
export function DugunKagit({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunKagit}
      renderHero={(props) => <PaperHero {...props} sealColor={DUGUN_RENK.sakayik} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 40%, #f1eef3 0%, #e6e1ea 55%, #d9d2df 100%)"
          scrim={false}
          vignette={false}
          parallax={6}
          grain={0.02}
          fadeTo="#f3f1f4"
        />
      )}
    />
  );
}
