import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanBrutal — "Brutal" yorumu: nişanın zarafetini kalın çerçeve ve dev tipografiyle yeniden yazan ters okuma. */
const NISAN_BRUTAL_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#eef1f7]',
  page: 'text-[#646c7c]',
  surface: 'bg-[#fdfdff]',
  border: 'border-[#0e1117]/20',
  heading: 'text-[#0e1117]',
  body: 'text-[#646c7c]',
  accent: 'text-[#3b5bdb]',
  accentBg: 'bg-[#3b5bdb]',
  accentSoft: 'bg-[#3b5bdb]/12',
  input: 'w-full bg-[#fdfdff] border-2 border-[#0e1117] rounded-none px-3.5 py-2.5 text-sm text-[#0e1117] placeholder:text-[#646c7c] focus:outline-none focus:border-[#3b5bdb] focus:ring-0 transition-colors duration-200',
  buttonPrimary: 'bg-[#3b5bdb] hover:brightness-110 text-[#eef2ff] border-2 border-[#0e1117] rounded-none font-black uppercase tracking-wide shadow-[4px_4px_0_0_#0e1117]',
  buttonGhost: 'bg-[#fdfdff] border-2 border-[#0e1117] text-[#0e1117] rounded-none font-black uppercase tracking-wide hover:bg-[#f7a8c4] hover:text-[#0e1117]',
  divider: 'bg-[#0e1117]/20',
  timelineLine: 'from-[#3b5bdb] via-[#3b5bdb]/40 to-transparent',
};

export function NisanBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_BRUTAL_THEME}
      renderHero={(props) => (
        <BrutalHero
          {...props}
          ink="#0e1117"
          accent="#3b5bdb"
          accent2="#f7a8c4"
          onAccent="#eef2ff"
          onAccent2="#0e1117"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="#eef1f7"
          scrim={false}
          vignette={false}
          parallax={0}
          grain={0.018}
          fadeTo="#eef1f7"
        />
      )}
    />
  );
}
