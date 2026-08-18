import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaMermer — "Mermer & Rölyef" kına yorumu: yazının taşa oyulduğu yüzey. */
const KINA_MERMER_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f0e8]',
  page: 'text-[#564839]',
  surface: 'bg-[#fbf6ee]/85 backdrop-blur-sm',
  border: 'border-[#e5d9c8]',
  heading: 'text-[#2c211a]',
  body: 'text-[#8b7f6f]',
  accent: 'text-[#a04f4f]',
  accentBg: 'bg-[#a04f4f]',
  accentSoft: 'bg-[#a04f4f]/12',
  input: 'w-full bg-white border border-[#e5d9c8] rounded-lg px-3.5 py-2.5 text-sm text-[#564839] placeholder:text-[#8b7f6f] focus:outline-none focus:border-[#a04f4f] focus:ring-2 focus:ring-[#a04f4f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2c211a] hover:brightness-125 text-[#f6f0e8] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e5d9c8] text-[#564839] hover:bg-[#f6f0e8] hover:border-[#a04f4f]/40',
  divider: 'bg-[#e5d9c8]',
  timelineLine: 'from-[#a04f4f] via-[#a04f4f]/40 to-transparent',
};

export function KinaMermer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_MERMER_THEME}
      renderHero={(props) => (
        <MermerHero
          {...props}
          slab="linear-gradient(150deg, #fbf6ee 0%, #f1e9dd 45%, #e6dccb 100%)"
          vein="#b09274"
          polish="light"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fcf8f1 0%, #f2ebdf 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f6f0e8"
        />
      )}
    />
  );
}
