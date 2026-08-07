import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetSuluboya — "Suluboya" mezuniyet yorumu: lacivert, altın ve zeytin lekeler. */
const MEZUNIYET_SULUBOYA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f9f8f4]',
  page: 'text-[#4b4e55]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#e3e1d8]',
  heading: 'text-[#22252b]',
  body: 'text-[#7e828a]',
  accent: 'text-[#5f7f9f]',
  accentBg: 'bg-[#5f7f9f]',
  accentSoft: 'bg-[#5f7f9f]/12',
  input:
    'w-full bg-white border border-[#e3e1d8] rounded-lg px-3.5 py-2.5 text-sm text-[#4b4e55] placeholder:text-[#7e828a] focus:outline-none focus:border-[#5f7f9f] focus:ring-2 focus:ring-[#5f7f9f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#22252b] hover:bg-[#383c44] text-[#f9f8f4] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d8d5cb] text-[#5b5f66] hover:bg-[#efeee7] hover:border-[#b6b3a7]',
  divider: 'bg-[#e3e1d8]',
  timelineLine: 'from-[#5f7f9f] via-[#d8c08f]/60 to-transparent'
};

export function MezuniyetSuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_SULUBOYA_THEME}
      renderHero={(props) => (
        <SuluboyaHero {...props} washes={['#8fa8c8', '#d8c08f', '#a8b8a0']} seed={53} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfdfa 0%, #f4f3ed 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f9f8f4"
        />
      )}
    />
  );
}
