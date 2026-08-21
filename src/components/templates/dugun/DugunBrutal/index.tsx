import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunBrutal — "Brutal" yorumu: süsü tamamen kaldırıp daveti ham tipografi ve sert kontrastla kuran anti-romantik yorum. */
const DUGUN_BRUTAL_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f2efe6]',
  page: 'text-[#6e6a60]',
  surface: 'bg-[#fffdf7]',
  border: 'border-[#121110]/20',
  heading: 'text-[#121110]',
  body: 'text-[#6e6a60]',
  accent: 'text-[#d92b3a]',
  accentBg: 'bg-[#d92b3a]',
  accentSoft: 'bg-[#d92b3a]/12',
  input: 'w-full bg-[#fffdf7] border-2 border-[#121110] rounded-none px-3.5 py-2.5 text-sm text-[#121110] placeholder:text-[#6e6a60] focus:outline-none focus:border-[#d92b3a] focus:ring-0 transition-colors duration-200',
  buttonPrimary: 'bg-[#d92b3a] hover:brightness-110 text-[#fff4ee] border-2 border-[#121110] rounded-none font-black uppercase tracking-wide shadow-[4px_4px_0_0_#121110]',
  buttonGhost: 'bg-[#fffdf7] border-2 border-[#121110] text-[#121110] rounded-none font-black uppercase tracking-wide hover:bg-[#f2b705] hover:text-[#121110]',
  divider: 'bg-[#121110]/20',
  timelineLine: 'from-[#d92b3a] via-[#d92b3a]/40 to-transparent',
};

export function DugunBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_BRUTAL_THEME}
      renderHero={(props) => (
        <BrutalHero
          {...props}
          ink="#121110"
          accent="#d92b3a"
          accent2="#f2b705"
          onAccent="#fff4ee"
          onAccent2="#121110"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="#f2efe6"
          scrim={false}
          vignette={false}
          parallax={0}
          grain={0.018}
          fadeTo="#f2efe6"
        />
      )}
    />
  );
}
