import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { SUNNET_GAZETE } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetGazete — "Gazete Manşeti": şenliği kırmızı manşetle duyuran dizgi. */
export function SunnetGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_GAZETE}
      renderHero={(props) => <GazeteHero {...props} masthead="ŞENLİK GAZETESİ" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfbfd 0%, #eceef5 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f4f5f9"
        />
      )}
    />
  );
}
