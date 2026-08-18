import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetMermer — "Mermer & Rölyef" sünnet yorumu: yazının taşa oyulduğu yüzey. */
const SUNNET_MERMER_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f2f5f7]',
  page: 'text-[#485259]',
  surface: 'bg-[#f9fbfc]/85 backdrop-blur-sm',
  border: 'border-[#dce3e8]',
  heading: 'text-[#1e2830]',
  body: 'text-[#7d8891]',
  accent: 'text-[#2f6f8c]',
  accentBg: 'bg-[#2f6f8c]',
  accentSoft: 'bg-[#2f6f8c]/12',
  input: 'w-full bg-white border border-[#dce3e8] rounded-lg px-3.5 py-2.5 text-sm text-[#485259] placeholder:text-[#7d8891] focus:outline-none focus:border-[#2f6f8c] focus:ring-2 focus:ring-[#2f6f8c]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#1e2830] hover:brightness-125 text-[#f2f5f7] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dce3e8] text-[#485259] hover:bg-[#f2f5f7] hover:border-[#2f6f8c]/40',
  divider: 'bg-[#dce3e8]',
  timelineLine: 'from-[#2f6f8c] via-[#2f6f8c]/40 to-transparent',
};

export function SunnetMermer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_MERMER_THEME}
      renderHero={(props) => (
        <MermerHero
          {...props}
          slab="linear-gradient(150deg, #f9fbfc 0%, #ecf0f3 45%, #e0e6ea 100%)"
          vein="#8f9ba5"
          polish="light"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fafcfd 0%, #edf1f4 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f2f5f7"
        />
      )}
    />
  );
}
