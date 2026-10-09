import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunBento — "Bento Editorial": bilgiyi hücre alanına göre hiyerarşiye
 * sokan yapılandırılmış ızgara, tül zeminde.
 *
 * Bu dilde arka plan bilinçli olarak sakin: inci mesh %18 opaklıkta,
 * parçacık yok. Bento'nun gücü düzenin netliğinde.
 */
export function DugunBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunBento}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #fcfbfd 0%, #f5f2f7 55%, #ede8f1 100%)"
          scrim={false}
          vignette={false}
          atmosphere={
            // Çok düşük opaklık: inci sıcaklığı verir, dikkat çekmez.
            <AuroraMesh colors={['243,221,231', '221,213,240', '214,230,221']} opacity={0.18} duration={30} />
          }
          parallax={6}
          grain={0.016}
          fadeTo="#f8f6f9"
        />
      )}
    />
  );
}
