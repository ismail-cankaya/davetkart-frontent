import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunHerbaryum — "Herbaryum" yorumu: günü preslenip arşivlenmiş bir örnek gibi kayda geçiren föy. */
const DUGUN_HERBARYUM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7f3e8]',
  page: 'text-[#837c68]',
  surface: 'bg-[#fffdf6]/85 backdrop-blur-sm',
  border: 'border-[#6b7f5c]/25',
  heading: 'text-[#2e2a1f]',
  body: 'text-[#837c68]',
  accent: 'text-[#9c3b46]',
  accentBg: 'bg-[#9c3b46]',
  accentSoft: 'bg-[#9c3b46]/10',
  input: 'w-full bg-[#fffdf6] border border-[#6b7f5c]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#2e2a1f] placeholder:text-[#837c68] focus:outline-none focus:border-[#9c3b46] focus:ring-2 focus:ring-[#9c3b46]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#2e2a1f] hover:brightness-125 text-[#f7f3e8] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#6b7f5c]/35 text-[#2e2a1f] hover:bg-[#6b7f5c]/10 hover:border-[#6b7f5c]/60 rounded-sm',
  divider: 'bg-[#6b7f5c]/20',
  timelineLine: 'from-[#9c3b46] via-[#9c3b46]/40 to-transparent',
};

export function DugunHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_HERBARYUM_THEME}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#f7f3e8"
          tape="rgba(214,199,164,0.55)"
          specimen="#6b7f5c"
          label="#fffdf6"
          accession="No. 001"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfbf3 0%, #f7f3e8 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f7f3e8"
        />
      )}
    />
  );
}
