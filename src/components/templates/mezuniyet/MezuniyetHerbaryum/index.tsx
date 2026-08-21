import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetHerbaryum — "Herbaryum" yorumu: mezuniyeti koleksiyonun en kıymetli kaydı yapan föy. */
const MEZUNIYET_HERBARYUM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f1e6]',
  page: 'text-[#7f7a66]',
  surface: 'bg-[#fffdf5]/85 backdrop-blur-sm',
  border: 'border-[#5f6b4a]/25',
  heading: 'text-[#262319]',
  body: 'text-[#7f7a66]',
  accent: 'text-[#7a2f39]',
  accentBg: 'bg-[#7a2f39]',
  accentSoft: 'bg-[#7a2f39]/10',
  input: 'w-full bg-[#fffdf5] border border-[#5f6b4a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#262319] placeholder:text-[#7f7a66] focus:outline-none focus:border-[#7a2f39] focus:ring-2 focus:ring-[#7a2f39]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#262319] hover:brightness-125 text-[#f5f1e6] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#5f6b4a]/35 text-[#262319] hover:bg-[#5f6b4a]/10 hover:border-[#5f6b4a]/60 rounded-sm',
  divider: 'bg-[#5f6b4a]/20',
  timelineLine: 'from-[#7a2f39] via-[#7a2f39]/40 to-transparent',
};

export function MezuniyetHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_HERBARYUM_THEME}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#f5f1e6"
          tape="rgba(210,196,160,0.5)"
          specimen="#5f6b4a"
          label="#fffdf5"
          accession="No. 052"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfbf3 0%, #f5f1e6 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f5f1e6"
        />
      )}
    />
  );
}
