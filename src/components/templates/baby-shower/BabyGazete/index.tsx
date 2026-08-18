import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyGazete — "Gazete Manşeti" baby shower yorumu: daveti haber olarak duyuran dizgi. */
const BABY_GAZETE_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f9f7f0]',
  page: 'text-[#53514a]',
  surface: 'bg-[#fdfcf7]/85 backdrop-blur-sm',
  border: 'border-[#e6e2d6]',
  heading: 'text-[#1c1c17]',
  body: 'text-[#87857c]',
  accent: 'text-[#5f8f7f]',
  accentBg: 'bg-[#5f8f7f]',
  accentSoft: 'bg-[#5f8f7f]/12',
  input: 'w-full bg-white border border-[#e6e2d6] rounded-lg px-3.5 py-2.5 text-sm text-[#53514a] placeholder:text-[#87857c] focus:outline-none focus:border-[#5f8f7f] focus:ring-2 focus:ring-[#5f8f7f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#1c1c17] hover:brightness-125 text-[#f9f7f0] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e6e2d6] text-[#53514a] hover:bg-[#f9f7f0] hover:border-[#5f8f7f]/40',
  divider: 'bg-[#e6e2d6]',
  timelineLine: 'from-[#5f8f7f] via-[#5f8f7f]/40 to-transparent',
};

export function BabyGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_GAZETE_THEME}
      renderHero={(props) => <GazeteHero {...props} masthead="BEBEK POSTASI" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fefdf9 0%, #f4f2e9 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f9f7f0"
        />
      )}
    />
  );
}
