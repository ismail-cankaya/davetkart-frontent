import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunMermer — "Mermer & Rölyef" düğün yorumu: yazının taşa oyulduğu yüzey. */
const DUGUN_MERMER_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f2ed]',
  page: 'text-[#544d43]',
  surface: 'bg-[#faf8f4]/85 backdrop-blur-sm',
  border: 'border-[#e2ddd2]',
  heading: 'text-[#2b2620]',
  body: 'text-[#857e73]',
  accent: 'text-[#9c7f5f]',
  accentBg: 'bg-[#9c7f5f]',
  accentSoft: 'bg-[#9c7f5f]/12',
  input: 'w-full bg-white border border-[#e2ddd2] rounded-lg px-3.5 py-2.5 text-sm text-[#544d43] placeholder:text-[#857e73] focus:outline-none focus:border-[#9c7f5f] focus:ring-2 focus:ring-[#9c7f5f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2b2620] hover:brightness-125 text-[#f4f2ed] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e2ddd2] text-[#544d43] hover:bg-[#f4f2ed] hover:border-[#9c7f5f]/40',
  divider: 'bg-[#e2ddd2]',
  timelineLine: 'from-[#9c7f5f] via-[#9c7f5f]/40 to-transparent',
};

export function DugunMermer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_MERMER_THEME}
      renderHero={(props) => (
        <MermerHero
          {...props}
          slab="linear-gradient(150deg, #faf8f4 0%, #efece5 45%, #e4e0d7 100%)"
          vein="#a89f92"
          polish="light"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbf9f5 0%, #f0ede6 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f4f2ed"
        />
      )}
    />
  );
}
