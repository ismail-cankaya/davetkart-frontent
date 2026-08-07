import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyDokuma — "Dokuma" baby shower yorumu: örgü battaniye; adaçayı, pudra ve kum iplikler. */
const BABY_DOKUMA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#faf7f0]',
  page: 'text-[#54514a]',
  surface: 'bg-[#fdfbf6]/90',
  border: 'border-[#e5e0d3]',
  heading: 'text-[#2b2a24]',
  body: 'text-[#89857b]',
  accent: 'text-[#7f9f8f]',
  accentBg: 'bg-[#7f9f8f]',
  accentSoft: 'bg-[#7f9f8f]/14',
  input:
    'w-full bg-white border border-[#e5e0d3] rounded-lg px-3.5 py-2.5 text-sm text-[#54514a] placeholder:text-[#89857b] focus:outline-none focus:border-[#7f9f8f] focus:ring-2 focus:ring-[#7f9f8f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2b2a24] hover:bg-[#44423a] text-[#faf7f0] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dcd6c7] text-[#625f56] hover:bg-[#f2eee4] hover:border-[#bfb8a5]',
  divider: 'bg-[#e5e0d3]',
  timelineLine: 'from-[#7f9f8f] via-[#e8b8b0]/60 to-transparent'
};

export function BabyDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_DOKUMA_THEME}
      renderHero={(props) => (
        <DokumaHero
          {...props}
          threads={['#8fb8a8', '#e8b8b0', '#d8c88f']}
          weave="#a8a08c"
          stitch="#7f9f8f"
          seed={61}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fefdf9 0%, #f5f1e7 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#faf7f0"
        />
      )}
    />
  );
}
