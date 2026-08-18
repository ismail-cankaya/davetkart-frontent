import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { FilmHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetFilm — "Film Şeridi" mezuniyet yorumu: karesi karesine ilerleyen sekans. */
const MEZUNIYET_FILM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b0d12]',
  page: 'text-[#dbdfe6]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f0f2f6]',
  body: 'text-[#858b95]',
  accent: 'text-[#c9a961]',
  accentBg: 'bg-[#c9a961]',
  accentSoft: 'bg-[#c9a961]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f0f2f6] placeholder:text-[#858b95] focus:outline-none focus:border-[#c9a961]/60 focus:ring-2 focus:ring-[#c9a961]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#c9a961] hover:brightness-110 text-[#0b0d12] shadow-lg shadow-[#c9a961]/25',
  buttonGhost: 'border border-white/16 text-[#dbdfe6] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#c9a961] via-[#c9a961]/40 to-transparent',
};

export function MezuniyetFilm({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_FILM_THEME}
      renderHero={(props) => <FilmHero {...props} strip="#171a21" frame="#0d1015" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #161a22 0%, #0c0f14 55%, #0b0d12 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="201,169,97" size={56} x={50} y={40} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.03}
          fadeTo="#0b0d12"
        />
      )}
    />
  );
}
