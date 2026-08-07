import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HatHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DogumGunuCizgi — "Tek Çizgi" doğum günü yorumu: krem kağıt, üzüm moru hat.
 *
 * Kategorinin en sessiz şablonu: konfeti ve neon yerine tek bir çizgi.
 * Yetişkin doğum günü davetlerinde aranan ton.
 */
const DOGUM_GUNU_CIZGI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fbf8f3]',
  page: 'text-[#4d4740]',
  surface: 'bg-white/85',
  border: 'border-[#e3dbcf]',
  heading: 'text-[#201d1a]',
  body: 'text-[#867f76]',
  accent: 'text-[#7a4fa8]',
  accentBg: 'bg-[#7a4fa8]',
  accentSoft: 'bg-[#7a4fa8]/10',
  input:
    'w-full bg-white border border-[#e3dbcf] rounded-lg px-3.5 py-2.5 text-sm text-[#4d4740] placeholder:text-[#867f76] focus:outline-none focus:border-[#7a4fa8] focus:ring-2 focus:ring-[#7a4fa8]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#201d1a] hover:bg-[#38332d] text-[#fbf8f3] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#dad2c4] text-[#5e584f] hover:bg-[#f3eee5] hover:border-[#bdb3a1]',
  divider: 'bg-[#e3dbcf]',
  timelineLine: 'from-[#7a4fa8] via-[#c4b0dc]/60 to-transparent'
};

export function DogumGunuCizgi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_CIZGI_THEME}
      renderHero={(props) => <HatHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fefcf8 0%, #f7f2e9 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.018}
          fadeTo="#fbf8f3"
        />
      )}
    />
  );
}
