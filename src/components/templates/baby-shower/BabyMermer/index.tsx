import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyMermer — "Mermer & Rölyef" baby shower yorumu: yazının taşa oyulduğu yüzey. */
const BABY_MERMER_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#faf7f2]',
  page: 'text-[#565045]',
  surface: 'bg-[#fefcf8]/85 backdrop-blur-sm',
  border: 'border-[#e8e1d5]',
  heading: 'text-[#2b2823]',
  body: 'text-[#8a8378]',
  accent: 'text-[#8fa8b8]',
  accentBg: 'bg-[#8fa8b8]',
  accentSoft: 'bg-[#8fa8b8]/12',
  input: 'w-full bg-white border border-[#e8e1d5] rounded-lg px-3.5 py-2.5 text-sm text-[#565045] placeholder:text-[#8a8378] focus:outline-none focus:border-[#8fa8b8] focus:ring-2 focus:ring-[#8fa8b8]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2b2823] hover:brightness-125 text-[#faf7f2] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e8e1d5] text-[#565045] hover:bg-[#faf7f2] hover:border-[#8fa8b8]/40',
  divider: 'bg-[#e8e1d5]',
  timelineLine: 'from-[#8fa8b8] via-[#8fa8b8]/40 to-transparent',
};

export function BabyMermer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_MERMER_THEME}
      renderHero={(props) => (
        <MermerHero
          {...props}
          slab="linear-gradient(150deg, #fefcf8 0%, #f5f1e9 45%, #ebe5da 100%)"
          vein="#b3a894"
          polish="light"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fffdfa 0%, #f6f2ea 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#faf7f2"
        />
      )}
    />
  );
}
