import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalHerbaryum — "Herbaryum" yorumu: etkinliği kurumsal arşivin bir kaydı olarak sunan föy. */
const KURUMSAL_HERBARYUM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f3f5f2]',
  page: 'text-[#737d78]',
  surface: 'bg-[#fdfffc]/85 backdrop-blur-sm',
  border: 'border-[#5f7a6a]/25',
  heading: 'text-[#222824]',
  body: 'text-[#737d78]',
  accent: 'text-[#2f6f8c]',
  accentBg: 'bg-[#2f6f8c]',
  accentSoft: 'bg-[#2f6f8c]/10',
  input: 'w-full bg-[#fdfffc] border border-[#5f7a6a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#222824] placeholder:text-[#737d78] focus:outline-none focus:border-[#2f6f8c] focus:ring-2 focus:ring-[#2f6f8c]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#222824] hover:brightness-125 text-[#f3f5f2] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#5f7a6a]/35 text-[#222824] hover:bg-[#5f7a6a]/10 hover:border-[#5f7a6a]/60 rounded-sm',
  divider: 'bg-[#5f7a6a]/20',
  timelineLine: 'from-[#2f6f8c] via-[#2f6f8c]/40 to-transparent',
};

export function KurumsalHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_HERBARYUM_THEME}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#f3f5f2"
          tape="rgba(200,208,200,0.5)"
          specimen="#5f7a6a"
          label="#fdfffc"
          accession="No. 090"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfcfa 0%, #f3f5f2 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f3f5f2"
        />
      )}
    />
  );
}
