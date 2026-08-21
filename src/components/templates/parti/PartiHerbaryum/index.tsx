import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiHerbaryum — "Herbaryum" yorumu: gece toplanmış bitkileri koyu föye presleyen yorum. */
const PARTI_HERBARYUM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#17150f]',
  page: 'text-[#9a9382]',
  surface: 'bg-[#201d16]/85 backdrop-blur-sm',
  border: 'border-[#9fbf8a]/25',
  heading: 'text-[#ece7d8]',
  body: 'text-[#9a9382]',
  accent: 'text-[#ff7fa8]',
  accentBg: 'bg-[#ff7fa8]',
  accentSoft: 'bg-[#ff7fa8]/10',
  input: 'w-full bg-[#201d16] border border-[#9fbf8a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#ece7d8] placeholder:text-[#9a9382] focus:outline-none focus:border-[#ff7fa8] focus:ring-2 focus:ring-[#ff7fa8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#ece7d8] hover:brightness-125 text-[#17150f] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#9fbf8a]/35 text-[#ece7d8] hover:bg-[#9fbf8a]/10 hover:border-[#9fbf8a]/60 rounded-sm',
  divider: 'bg-[#9fbf8a]/20',
  timelineLine: 'from-[#ff7fa8] via-[#ff7fa8]/40 to-transparent',
};

export function PartiHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_HERBARYUM_THEME}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#17150f"
          tape="rgba(150,140,116,0.32)"
          specimen="#9fbf8a"
          label="#201d16"
          accession="No. 071"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #211e15 0%, #17150f 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#17150f"
        />
      )}
    />
  );
}
