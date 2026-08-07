import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetDokuma — "Dokuma" sünnet yorumu: çini mavisi, kiremit ve yeşil iplikler. */
const SUNNET_DOKUMA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f2e8]',
  page: 'text-[#4d5147]',
  surface: 'bg-[#faf9f2]/90',
  border: 'border-[#dedcc9]',
  heading: 'text-[#232a24]',
  body: 'text-[#82867a]',
  accent: 'text-[#3f7f5f]',
  accentBg: 'bg-[#3f7f5f]',
  accentSoft: 'bg-[#3f7f5f]/12',
  input:
    'w-full bg-white border border-[#dedcc9] rounded-lg px-3.5 py-2.5 text-sm text-[#4d5147] placeholder:text-[#82867a] focus:outline-none focus:border-[#3f7f5f] focus:ring-2 focus:ring-[#3f7f5f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#232a24] hover:bg-[#39423a] text-[#f4f2e8] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d3d1bd] text-[#5c6055] hover:bg-[#edebe0] hover:border-[#b0ae98]',
  divider: 'bg-[#dedcc9]',
  timelineLine: 'from-[#3f7f5f] via-[#1f5f8c]/50 to-transparent'
};

export function SunnetDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_DOKUMA_THEME}
      renderHero={(props) => (
        <DokumaHero
          {...props}
          threads={['#1f5f8c', '#c47a2f', '#3f7f5f']}
          weave="#9a9c84"
          stitch="#3f7f5f"
          seed={37}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #faf9f0 0%, #efeddf 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.028}
          fadeTo="#f4f2e8"
        />
      )}
    />
  );
}
