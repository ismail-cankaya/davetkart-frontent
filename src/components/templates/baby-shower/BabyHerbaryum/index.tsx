import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyHerbaryum — "Herbaryum" yorumu: bekleyişi en yumuşak tonlarla arşivleyen botanik föy. */
const BABY_HERBARYUM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fbf8f1]',
  page: 'text-[#85806f]',
  surface: 'bg-[#fffefa]/85 backdrop-blur-sm',
  border: 'border-[#93a98a]/25',
  heading: 'text-[#2b2a23]',
  body: 'text-[#85806f]',
  accent: 'text-[#8fa8b8]',
  accentBg: 'bg-[#8fa8b8]',
  accentSoft: 'bg-[#8fa8b8]/10',
  input: 'w-full bg-[#fffefa] border border-[#93a98a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#2b2a23] placeholder:text-[#85806f] focus:outline-none focus:border-[#8fa8b8] focus:ring-2 focus:ring-[#8fa8b8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#2b2a23] hover:brightness-125 text-[#fbf8f1] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#93a98a]/35 text-[#2b2a23] hover:bg-[#93a98a]/10 hover:border-[#93a98a]/60 rounded-sm',
  divider: 'bg-[#93a98a]/20',
  timelineLine: 'from-[#8fa8b8] via-[#8fa8b8]/40 to-transparent',
};

export function BabyHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_HERBARYUM_THEME}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#fbf8f1"
          tape="rgba(220,212,196,0.5)"
          specimen="#93a98a"
          label="#fffefa"
          accession="No. 068"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fffefa 0%, #fbf8f1 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#fbf8f1"
        />
      )}
    />
  );
}
