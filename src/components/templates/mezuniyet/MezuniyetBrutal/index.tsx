import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetBrutal — "Brutal" yorumu: akademik ciddiyeti afiş estetiğine çeviren keskin yorum. */
const MEZUNIYET_BRUTAL_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f0ede2]',
  page: 'text-[#6c6858]',
  surface: 'bg-[#fffdf4]',
  border: 'border-[#12110d]/20',
  heading: 'text-[#12110d]',
  body: 'text-[#6c6858]',
  accent: 'text-[#8b1e3f]',
  accentBg: 'bg-[#8b1e3f]',
  accentSoft: 'bg-[#8b1e3f]/12',
  input: 'w-full bg-[#fffdf4] border-2 border-[#12110d] rounded-none px-3.5 py-2.5 text-sm text-[#12110d] placeholder:text-[#6c6858] focus:outline-none focus:border-[#8b1e3f] focus:ring-0 transition-colors duration-200',
  buttonPrimary: 'bg-[#8b1e3f] hover:brightness-110 text-[#ffeef2] border-2 border-[#12110d] rounded-none font-black uppercase tracking-wide shadow-[4px_4px_0_0_#12110d]',
  buttonGhost: 'bg-[#fffdf4] border-2 border-[#12110d] text-[#12110d] rounded-none font-black uppercase tracking-wide hover:bg-[#c9a227] hover:text-[#12110d]',
  divider: 'bg-[#12110d]/20',
  timelineLine: 'from-[#8b1e3f] via-[#8b1e3f]/40 to-transparent',
};

export function MezuniyetBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_BRUTAL_THEME}
      renderHero={(props) => (
        <BrutalHero
          {...props}
          ink="#12110d"
          accent="#8b1e3f"
          accent2="#c9a227"
          onAccent="#ffeef2"
          onAccent2="#12110d"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="#f0ede2"
          scrim={false}
          vignette={false}
          parallax={0}
          grain={0.018}
          fadeTo="#f0ede2"
        />
      )}
    />
  );
}
