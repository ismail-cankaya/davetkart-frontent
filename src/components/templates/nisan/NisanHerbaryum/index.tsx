import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanHerbaryum — "Herbaryum" yorumu: nişanı koleksiyona giren ilk örnek olarak kaydeden föy. */
const NISAN_HERBARYUM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f4ee]',
  page: 'text-[#7f8278]',
  surface: 'bg-[#fffefa]/85 backdrop-blur-sm',
  border: 'border-[#7d8c74]/25',
  heading: 'text-[#2a2b26]',
  body: 'text-[#7f8278]',
  accent: 'text-[#6f7fa3]',
  accentBg: 'bg-[#6f7fa3]',
  accentSoft: 'bg-[#6f7fa3]/10',
  input: 'w-full bg-[#fffefa] border border-[#7d8c74]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#2a2b26] placeholder:text-[#7f8278] focus:outline-none focus:border-[#6f7fa3] focus:ring-2 focus:ring-[#6f7fa3]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#2a2b26] hover:brightness-125 text-[#f6f4ee] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#7d8c74]/35 text-[#2a2b26] hover:bg-[#7d8c74]/10 hover:border-[#7d8c74]/60 rounded-sm',
  divider: 'bg-[#7d8c74]/20',
  timelineLine: 'from-[#6f7fa3] via-[#6f7fa3]/40 to-transparent',
};

export function NisanHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_HERBARYUM_THEME}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#f6f4ee"
          tape="rgba(200,205,190,0.5)"
          specimen="#7d8c74"
          label="#fffefa"
          accession="No. 027"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfcf7 0%, #f6f4ee 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f6f4ee"
        />
      )}
    />
  );
}
