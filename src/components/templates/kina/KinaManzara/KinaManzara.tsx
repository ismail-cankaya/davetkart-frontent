import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { KINA_MANZARA } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { KinaHero } from '../parts/KinaHero';
import { DAMGA_AL } from '../parts/KinaDamga';
import { TemplateProps } from '../../types';
import { TepelerSahnesi } from './TepelerSahnesi';

/**
 * KinaManzara — "Yüksek Tepeler": kına türküsündeki uzak tepelerin akşamı.
 * Kategorinin vitrin şablonu (ana sayfa); metin gökte, tepeler altta.
 */
export function KinaManzara({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_MANZARA}
      renderHero={(props) => <KinaHero {...props} damga={DAMGA_AL} className="pt-16 pb-52 @md:pb-64" />}
      renderHeroBackground={({ revealed }) => <TepelerSahnesi revealed={revealed} />}
    />
  );
}
