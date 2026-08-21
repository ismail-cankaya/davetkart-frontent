import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiBrutal — "Brutal" yorumu: asit yeşiliyle karanlıkta bağıran kulüp afişi. */
const PARTI_BRUTAL_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0d0d10]',
  page: 'text-[#8f8f99]',
  surface: 'bg-[#16161b]',
  border: 'border-[#f2f2f0]/20',
  heading: 'text-[#f2f2f0]',
  body: 'text-[#8f8f99]',
  accent: 'text-[#d6ff3d]',
  accentBg: 'bg-[#d6ff3d]',
  accentSoft: 'bg-[#d6ff3d]/12',
  input: 'w-full bg-[#16161b] border-2 border-[#f2f2f0] rounded-none px-3.5 py-2.5 text-sm text-[#f2f2f0] placeholder:text-[#8f8f99] focus:outline-none focus:border-[#d6ff3d] focus:ring-0 transition-colors duration-200',
  buttonPrimary: 'bg-[#d6ff3d] hover:brightness-110 text-[#0d0d10] border-2 border-[#f2f2f0] rounded-none font-black uppercase tracking-wide shadow-[4px_4px_0_0_#f2f2f0]',
  buttonGhost: 'bg-[#16161b] border-2 border-[#f2f2f0] text-[#f2f2f0] rounded-none font-black uppercase tracking-wide hover:bg-[#ff2e88] hover:text-[#0d0d10]',
  divider: 'bg-[#f2f2f0]/20',
  timelineLine: 'from-[#d6ff3d] via-[#d6ff3d]/40 to-transparent',
};

export function PartiBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_BRUTAL_THEME}
      renderHero={(props) => (
        <BrutalHero
          {...props}
          ink="#f2f2f0"
          accent="#d6ff3d"
          accent2="#ff2e88"
          onAccent="#0d0d10"
          onAccent2="#0d0d10"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="#0d0d10"
          scrim={false}
          vignette={false}
          parallax={0}
          grain={0.018}
          fadeTo="#0d0d10"
        />
      )}
    />
  );
}
