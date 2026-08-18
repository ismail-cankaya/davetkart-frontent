import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuMermer — "Mermer & Rölyef" doğum günü yorumu: yazının taşa oyulduğu yüzey. */
const DOGUM_GUNU_MERMER_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8f2f2]',
  page: 'text-[#544449]',
  surface: 'bg-[#fdf8f8]/85 backdrop-blur-sm',
  border: 'border-[#ebdcdc]',
  heading: 'text-[#2c2224]',
  body: 'text-[#8a7b7f]',
  accent: 'text-[#c05f7f]',
  accentBg: 'bg-[#c05f7f]',
  accentSoft: 'bg-[#c05f7f]/12',
  input: 'w-full bg-white border border-[#ebdcdc] rounded-lg px-3.5 py-2.5 text-sm text-[#544449] placeholder:text-[#8a7b7f] focus:outline-none focus:border-[#c05f7f] focus:ring-2 focus:ring-[#c05f7f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2c2224] hover:brightness-125 text-[#f8f2f2] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#ebdcdc] text-[#544449] hover:bg-[#f8f2f2] hover:border-[#c05f7f]/40',
  divider: 'bg-[#ebdcdc]',
  timelineLine: 'from-[#c05f7f] via-[#c05f7f]/40 to-transparent',
};

export function DogumGunuMermer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_MERMER_THEME}
      renderHero={(props) => (
        <MermerHero
          {...props}
          slab="linear-gradient(150deg, #fdf8f8 0%, #f3ebeb 45%, #e9dede 100%)"
          vein="#b39a9a"
          polish="light"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fefafa 0%, #f4eded 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f8f2f2"
        />
      )}
    />
  );
}
