import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { KINA_BENTO } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaBento — "Bento Editorial" kına yorumu: avuç kâğıdı ızgara, al vurgu.
 * Kına gecesi bilgi yoğundur (akış, mekân, kıyafet notu); ızgara bunu hiyerarşiyle taşır.
 */
export function KinaBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_BENTO}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #fdf6ee 0%, #faf0e6 55%, #f3dfcd 100%)"
          scrim={false}
          vignette={false}
          atmosphere={<AuroraMesh colors={['240,170,120', '236,190,150', '214,120,100']} opacity={0.2} duration={31} />}
          parallax={6}
          grain={0.016}
          fadeTo="#faf0e6"
        />
      )}
    />
  );
}
