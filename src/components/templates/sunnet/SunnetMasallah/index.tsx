import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, GoldSheen, Halo, SilkVeil } from '../../shared/effects';
import { SEHZADE, SUNNET_MASALLAH } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { KusakHero } from '../parts/KusakHero';
import { TemplateProps } from '../../types';

/**
 * SunnetMasallah — "Geleneksel Şölen": kadrajı boydan boya kesen, sırmalı
 * kırmızı "Maşallah" kuşağı; üstten süzülen sax ve sedef balonlar.
 *
 * Kuşağın kırmızısı ile balonların mavisi aynı yoğunlukta yarışırsa
 * kompozisyon dağılır: zemin ve tipografi kuşağa bağlı, mavi yalnızca
 * parçacıklarda yaşar.
 */
export function SunnetMasallah({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_MASALLAH}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 85% 70% at 50% 42%, #4a1320 0%, #280b13 55%, #15060a 100%)"
          scrim={{ from: 'both', strength: 0.4 }}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Halo color="242,196,90" size={62} x={50} y={30} opacity={0.26} duration={9} />
              <SilkVeil color="164,28,44" opacity={0.36} duration={15} />
              <GoldSheen color="255,224,150" opacity={0.16} duration={8} />
            </>
          }
          particles={[
            {
              preset: 'balloons',
              colors: [SEHZADE.sax, '#6f8fe6', '#f2ece0', '#1c3aa6'],
              density: 0.9,
              speed: 0.85,
              opacity: 0.85,
              depth: 1,
              seed: 8
            },
            {
              preset: 'fairyDust',
              colors: ['#f2c45a', '#f6dfa8'],
              blend: 'screen',
              density: 0.6,
              speed: 0.7,
              opacity: 0.55,
              depth: 0.5,
              seed: 55
            }
          ]}
          fadeTo="#1d0910"
        />
      )}
      renderHero={(props) => (
        <KusakHero
          {...props}
          band="linear-gradient(180deg, #8c1427 0%, #b51f35 38%, #c3263c 55%, #8f1529 100%)"
          thread="#f7d27a"
        />
      )}
    />
  );
}
