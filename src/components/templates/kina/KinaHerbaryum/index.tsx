import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaHerbaryum — "Herbaryum" yorumu: kınanın sıcak tonlarını arşiv kağıdına presleyen yorum. */
const KINA_HERBARYUM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#faf1e0]',
  page: 'text-[#8a7a62]',
  surface: 'bg-[#fffcf2]/85 backdrop-blur-sm',
  border: 'border-[#8a6a3a]/25',
  heading: 'text-[#2d2116]',
  body: 'text-[#8a7a62]',
  accent: 'text-[#b8434f]',
  accentBg: 'bg-[#b8434f]',
  accentSoft: 'bg-[#b8434f]/10',
  input: 'w-full bg-[#fffcf2] border border-[#8a6a3a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#2d2116] placeholder:text-[#8a7a62] focus:outline-none focus:border-[#b8434f] focus:ring-2 focus:ring-[#b8434f]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#2d2116] hover:brightness-125 text-[#faf1e0] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#8a6a3a]/35 text-[#2d2116] hover:bg-[#8a6a3a]/10 hover:border-[#8a6a3a]/60 rounded-sm',
  divider: 'bg-[#8a6a3a]/20',
  timelineLine: 'from-[#b8434f] via-[#b8434f]/40 to-transparent',
};

export function KinaHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_HERBARYUM_THEME}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#faf1e0"
          tape="rgba(222,190,140,0.5)"
          specimen="#8a6a3a"
          label="#fffcf2"
          accession="No. 014"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fffbf0 0%, #faf1e0 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#faf1e0"
        />
      )}
    />
  );
}
