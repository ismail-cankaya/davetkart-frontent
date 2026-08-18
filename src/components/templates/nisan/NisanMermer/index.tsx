import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanMermer — "Mermer & Rölyef" nişan yorumu: yazının taşa oyulduğu yüzey. */
const NISAN_MERMER_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f6f7]',
  page: 'text-[#4c5158]',
  surface: 'bg-[#fbfbfc]/85 backdrop-blur-sm',
  border: 'border-[#e2e4e8]',
  heading: 'text-[#23272c]',
  body: 'text-[#828892]',
  accent: 'text-[#5f7f9f]',
  accentBg: 'bg-[#5f7f9f]',
  accentSoft: 'bg-[#5f7f9f]/12',
  input: 'w-full bg-white border border-[#e2e4e8] rounded-lg px-3.5 py-2.5 text-sm text-[#4c5158] placeholder:text-[#828892] focus:outline-none focus:border-[#5f7f9f] focus:ring-2 focus:ring-[#5f7f9f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#23272c] hover:brightness-125 text-[#f5f6f7] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e2e4e8] text-[#4c5158] hover:bg-[#f5f6f7] hover:border-[#5f7f9f]/40',
  divider: 'bg-[#e2e4e8]',
  timelineLine: 'from-[#5f7f9f] via-[#5f7f9f]/40 to-transparent',
};

export function NisanMermer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_MERMER_THEME}
      renderHero={(props) => (
        <MermerHero
          {...props}
          slab="linear-gradient(150deg, #fbfbfc 0%, #eff0f2 45%, #e4e6e9 100%)"
          vein="#9aa0a8"
          polish="light"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fcfcfd 0%, #f0f1f3 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f5f6f7"
        />
      )}
    />
  );
}
