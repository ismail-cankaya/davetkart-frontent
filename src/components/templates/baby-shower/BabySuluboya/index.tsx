import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabySuluboya — "Suluboya" baby shower yorumu: bebe mavisi, pudra ve fıstık yeşili lekeler. */
const BABY_SULUBOYA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fbfaf7]',
  page: 'text-[#514f47]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#e5e2d8]',
  heading: 'text-[#2b2b26]',
  body: 'text-[#88867d]',
  accent: 'text-[#7fa8b8]',
  accentBg: 'bg-[#7fa8b8]',
  accentSoft: 'bg-[#7fa8b8]/14',
  input:
    'w-full bg-white border border-[#e5e2d8] rounded-lg px-3.5 py-2.5 text-sm text-[#514f47] placeholder:text-[#88867d] focus:outline-none focus:border-[#7fa8b8] focus:ring-2 focus:ring-[#7fa8b8]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2b2b26] hover:bg-[#43433b] text-[#fbfaf7] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dcd9cd] text-[#605e55] hover:bg-[#f2f0ea] hover:border-[#bfbcae]',
  divider: 'bg-[#e5e2d8]',
  timelineLine: 'from-[#7fa8b8] via-[#f5d0d0]/60 to-transparent'
};

export function BabySuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_SULUBOYA_THEME}
      renderHero={(props) => (
        <SuluboyaHero {...props} washes={['#c8dce8', '#f5d0d0', '#d8e8c8']} seed={61} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fefefc 0%, #f6f4ee 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.02}
          fadeTo="#fbfaf7"
        />
      )}
    />
  );
}
