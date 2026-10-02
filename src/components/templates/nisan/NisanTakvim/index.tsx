import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { TakvimHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanTakvim — "Takvim" yorumu: pudra yaprak, gül altını spiral ve pembe mürekkep. */
const NISAN_TAKVIM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5eced]',
  page: 'text-[#7a6f78]',
  surface: 'bg-[#fefaf9]/90 backdrop-blur-sm',
  border: 'border-[#b6a3a8]/25',
  heading: 'text-[#3a3340]',
  body: 'text-[#7a6f78]',
  accent: 'text-[#c95c78]',
  accentBg: 'bg-[#3a3340]',
  accentSoft: 'bg-[#c95c78]/10',
  input: 'w-full bg-[#fefaf9] border border-[#b6a3a8]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#3a3340] placeholder:text-[#7a6f78] focus:outline-none focus:border-[#c95c78] focus:ring-2 focus:ring-[#c95c78]/15 transition duration-300',
  buttonPrimary: 'bg-[#3a3340] hover:brightness-125 text-[#fefaf9] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#b6a3a8]/40 text-[#3a3340] hover:bg-[#b6a3a8]/10 hover:border-[#b6a3a8]/70 rounded-sm',
  divider: 'bg-[#b6a3a8]/20',
  timelineLine: 'from-[#c95c78] via-[#b6a3a8]/40 to-transparent',
};

export function NisanTakvim({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_TAKVIM_THEME}
      renderHero={(props) => (
        <TakvimHero {...props} paper="#fefaf9" ink="#c95c78" metal="#c9a19a" note="#f9dfe5" noteInk="#4a3340" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(110% 70% at 50% 25%, #f8efee 0%, #ecdfe0 100%)"
          scrim={false}
          vignette={{ strength: 0.15 }}
          parallax={0}
          grain={0.03}
          fadeTo="#f5eced"
        />
      )}
    />
  );
}
