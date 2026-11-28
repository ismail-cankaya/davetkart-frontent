import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { KinetikHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';
import { useInvText } from '../../../../invitationText/InvitationTextContext';

/**
 * DugunKinetik — "Kinetik Tipografi" düğün yorumu: tül kağıt, mürekkep
 * kontur, şakayık vurgu; şeritte kategorinin sözü akar.
 *
 * Zemin bilinçle sessiz: hareketi taşıyan tek şey tipografi.
 */
export function DugunKinetik({ invitation, mode = 'preview' }: TemplateProps) {
  const t = useInvText();
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunKinetik}
      renderHero={(props) => <KinetikHero {...props} topWord={t('design.dugun-kinetik.ustKelime')} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfafc 0%, #efecf2 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f6f5f7"
        />
      )}
    />
  );
}
