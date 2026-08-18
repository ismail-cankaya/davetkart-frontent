import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetMermer — "Mermer & Rölyef" mezuniyet yorumu: yazının taşa oyulduğu yüzey. */
const MEZUNIYET_MERMER_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f3f5f1]',
  page: 'text-[#4a5049]',
  surface: 'bg-[#f9fbf7]/85 backdrop-blur-sm',
  border: 'border-[#dee3da]',
  heading: 'text-[#212722]',
  body: 'text-[#7f877d]',
  accent: 'text-[#3f6b4f]',
  accentBg: 'bg-[#3f6b4f]',
  accentSoft: 'bg-[#3f6b4f]/12',
  input: 'w-full bg-white border border-[#dee3da] rounded-lg px-3.5 py-2.5 text-sm text-[#4a5049] placeholder:text-[#7f877d] focus:outline-none focus:border-[#3f6b4f] focus:ring-2 focus:ring-[#3f6b4f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#212722] hover:brightness-125 text-[#f3f5f1] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dee3da] text-[#4a5049] hover:bg-[#f3f5f1] hover:border-[#3f6b4f]/40',
  divider: 'bg-[#dee3da]',
  timelineLine: 'from-[#3f6b4f] via-[#3f6b4f]/40 to-transparent',
};

export function MezuniyetMermer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_MERMER_THEME}
      renderHero={(props) => (
        <MermerHero
          {...props}
          slab="linear-gradient(150deg, #f9fbf7 0%, #edf0e9 45%, #e2e6dc 100%)"
          vein="#93a08e"
          polish="light"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fafcf8 0%, #eef1ea 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f3f5f1"
        />
      )}
    />
  );
}
