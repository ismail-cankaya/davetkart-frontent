import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanSuluboya — "Suluboya" nişan yorumu: buz mavisi, pudra ve adaçayı lekeler. */
const NISAN_SULUBOYA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8f9fb]',
  page: 'text-[#4c515a]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#e0e4ea]',
  heading: 'text-[#232830]',
  body: 'text-[#828894]',
  accent: 'text-[#7f8fb5]',
  accentBg: 'bg-[#7f8fb5]',
  accentSoft: 'bg-[#7f8fb5]/12',
  input:
    'w-full bg-white border border-[#e0e4ea] rounded-lg px-3.5 py-2.5 text-sm text-[#4c515a] placeholder:text-[#828894] focus:outline-none focus:border-[#7f8fb5] focus:ring-2 focus:ring-[#7f8fb5]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#232830] hover:bg-[#3a404a] text-[#f8f9fb] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d6dbe2] text-[#5c626c] hover:bg-[#eef1f5] hover:border-[#b4bcc7]',
  divider: 'bg-[#e0e4ea]',
  timelineLine: 'from-[#7f8fb5] via-[#d8b8c8]/60 to-transparent'
};

export function NisanSuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_SULUBOYA_THEME}
      renderHero={(props) => (
        <SuluboyaHero {...props} washes={['#a8b8d8', '#d8b8c8', '#c8d8c0']} seed={23} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfdfe 0%, #f3f5f8 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f8f9fb"
        />
      )}
    />
  );
}
