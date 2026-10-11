import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { PaperHero } from '../../shared/heroes';
import { SEHZADE, SUNNET_KAGIT } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetKagit — "Kağıt & Mühür": soğuk beyaz kağıt, kuşak kırmızısı mum mühür. */
export function SunnetKagit({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_KAGIT}
      renderHero={(props) => <PaperHero {...props} sealColor={SEHZADE.nar} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 40%, #eef2fb 0%, #dfe5f5 55%, #d0d9ef 100%)"
          scrim={false}
          vignette={false}
          parallax={6}
          grain={0.02}
          fadeTo="#f1f4fb"
        />
      )}
    />
  );
}
