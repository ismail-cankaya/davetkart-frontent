import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetGazete — "Gazete Manşeti" mezuniyet yorumu: daveti haber olarak duyuran dizgi. */
const MEZUNIYET_GAZETE_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f3ed]',
  page: 'text-[#4c4e48]',
  surface: 'bg-[#faf9f4]/85 backdrop-blur-sm',
  border: 'border-[#e0dfd3]',
  heading: 'text-[#161814]',
  body: 'text-[#7f827a]',
  accent: 'text-[#2f5f4f]',
  accentBg: 'bg-[#2f5f4f]',
  accentSoft: 'bg-[#2f5f4f]/12',
  input: 'w-full bg-white border border-[#e0dfd3] rounded-lg px-3.5 py-2.5 text-sm text-[#4c4e48] placeholder:text-[#7f827a] focus:outline-none focus:border-[#2f5f4f] focus:ring-2 focus:ring-[#2f5f4f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#161814] hover:brightness-125 text-[#f4f3ed] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e0dfd3] text-[#4c4e48] hover:bg-[#f4f3ed] hover:border-[#2f5f4f]/40',
  divider: 'bg-[#e0dfd3]',
  timelineLine: 'from-[#2f5f4f] via-[#2f5f4f]/40 to-transparent',
};

export function MezuniyetGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_GAZETE_THEME}
      renderHero={(props) => <GazeteHero {...props} masthead="KAMPÜS GAZETESİ" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfaf5 0%, #efeee6 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f4f3ed"
        />
      )}
    />
  );
}
