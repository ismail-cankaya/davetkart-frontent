import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { TakvimHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetTakvim — "Takvim" yorumu: lacivert spiral ve altın mürekkep; ajandadan koparılmış bir sayfa. */
const MEZUNIYET_TAKVIM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#ebe9e2]',
  page: 'text-[#636874]',
  surface: 'bg-[#f8f7f3]/90 backdrop-blur-sm',
  border: 'border-[#9b9a94]/25',
  heading: 'text-[#1b2541]',
  body: 'text-[#636874]',
  accent: 'text-[#9c7425]',
  accentBg: 'bg-[#1b2541]',
  accentSoft: 'bg-[#9c7425]/10',
  input: 'w-full bg-[#f8f7f3] border border-[#9b9a94]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#1b2541] placeholder:text-[#636874] focus:outline-none focus:border-[#9c7425] focus:ring-2 focus:ring-[#9c7425]/15 transition duration-300',
  buttonPrimary: 'bg-[#1b2541] hover:brightness-125 text-[#f8f7f3] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#9b9a94]/40 text-[#1b2541] hover:bg-[#9b9a94]/10 hover:border-[#9b9a94]/70 rounded-sm',
  divider: 'bg-[#9b9a94]/20',
  timelineLine: 'from-[#9c7425] via-[#9b9a94]/40 to-transparent',
};

export function MezuniyetTakvim({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_TAKVIM_THEME}
      renderHero={(props) => (
        <TakvimHero {...props} paper="#f8f7f3" ink="#a87b25" metal="#1b2541" note="#e9e2cd" noteInk="#1b2541" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(110% 70% at 50% 25%, #f0efea 0%, #dedcd3 100%)"
          scrim={false}
          vignette={{ strength: 0.15 }}
          parallax={0}
          grain={0.03}
          fadeTo="#ebe9e2"
        />
      )}
    />
  );
}
