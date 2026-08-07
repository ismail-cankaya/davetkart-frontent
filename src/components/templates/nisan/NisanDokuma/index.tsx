import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanDokuma — "Dokuma" nişan yorumu: soğuk keten; çini mavisi, tuğla ve zeytin iplikler. */
const NISAN_DOKUMA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f4ee]',
  page: 'text-[#4e5058]',
  surface: 'bg-[#fbfaf6]/90',
  border: 'border-[#e0dfd4]',
  heading: 'text-[#242830]',
  body: 'text-[#82858d]',
  accent: 'text-[#5f7f9f]',
  accentBg: 'bg-[#5f7f9f]',
  accentSoft: 'bg-[#5f7f9f]/12',
  input:
    'w-full bg-white border border-[#e0dfd4] rounded-lg px-3.5 py-2.5 text-sm text-[#4e5058] placeholder:text-[#82858d] focus:outline-none focus:border-[#5f7f9f] focus:ring-2 focus:ring-[#5f7f9f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#242830] hover:bg-[#3a3f49] text-[#f6f4ee] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d5d4c8] text-[#5d6068] hover:bg-[#eeece4] hover:border-[#b2b1a4]',
  divider: 'bg-[#e0dfd4]',
  timelineLine: 'from-[#5f7f9f] via-[#c08f7f]/50 to-transparent'
};

export function NisanDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_DOKUMA_THEME}
      renderHero={(props) => (
        <DokumaHero
          {...props}
          threads={['#5f7f9f', '#c08f7f', '#8f9f6f']}
          weave="#9a9a86"
          stitch="#5f7f9f"
          seed={29}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfaf6 0%, #f1efe7 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.028}
          fadeTo="#f6f4ee"
        />
      )}
    />
  );
}
