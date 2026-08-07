import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetDokuma — "Dokuma" mezuniyet yorumu: cübbe kumaşı; bordo, orman ve altın iplikler. */
const MEZUNIYET_DOKUMA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f3ea]',
  page: 'text-[#4f4c42]',
  surface: 'bg-[#faf9f3]/90',
  border: 'border-[#e0ddcd]',
  heading: 'text-[#26241c]',
  body: 'text-[#847f73]',
  accent: 'text-[#7a4f2f]',
  accentBg: 'bg-[#7a4f2f]',
  accentSoft: 'bg-[#7a4f2f]/12',
  input:
    'w-full bg-white border border-[#e0ddcd] rounded-lg px-3.5 py-2.5 text-sm text-[#4f4c42] placeholder:text-[#847f73] focus:outline-none focus:border-[#7a4f2f] focus:ring-2 focus:ring-[#7a4f2f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#26241c] hover:bg-[#3e3b2e] text-[#f5f3ea] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d6d2c0] text-[#5e5b50] hover:bg-[#eeece1] hover:border-[#b4ae99]',
  divider: 'bg-[#e0ddcd]',
  timelineLine: 'from-[#7a4f2f] via-[#2f5f4f]/50 to-transparent'
};

export function MezuniyetDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_DOKUMA_THEME}
      renderHero={(props) => (
        <DokumaHero
          {...props}
          threads={['#7a2f39', '#2f5f4f', '#b8933f']}
          weave="#a09a82"
          stitch="#7a4f2f"
          seed={53}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfaf4 0%, #f0eee3 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.028}
          fadeTo="#f5f3ea"
        />
      )}
    />
  );
}
