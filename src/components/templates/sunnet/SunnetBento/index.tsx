import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { SUNNET_BENTO } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetBento — "Bento Editorial": şeker beyazı zemin, sax vurgu.
 *
 * Bento ızgarası bilgiyi öne çıkardığı için zemin bilinçli olarak açık:
 * kalabalık aile davetlerinde program ve mekân okunaklılığı süsten önemli.
 * Zemindeki mesh pelerin (sax), kuşak (nar) ve nazar (turkuaz) tonlarında.
 */
export function SunnetBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_BENTO}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #fbfcff 0%, #f1f4fc 55%, #e6ebf9 100%)"
          scrim={false}
          vignette={false}
          atmosphere={<AuroraMesh colors={['164,182,240', '240,176,186', '160,222,230']} opacity={0.24} duration={30} />}
          parallax={6}
          grain={0.016}
          fadeTo="#f4f6fc"
        />
      )}
    />
  );
}
