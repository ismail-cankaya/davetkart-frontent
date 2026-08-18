import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaGazete — "Gazete Manşeti" kına yorumu: daveti haber olarak duyuran dizgi. */
const KINA_GAZETE_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8f1e5]',
  page: 'text-[#54473a]',
  surface: 'bg-[#fcf6ec]/85 backdrop-blur-sm',
  border: 'border-[#e6d9c3]',
  heading: 'text-[#20180f]',
  body: 'text-[#877c6b]',
  accent: 'text-[#b8323f]',
  accentBg: 'bg-[#b8323f]',
  accentSoft: 'bg-[#b8323f]/12',
  input: 'w-full bg-white border border-[#e6d9c3] rounded-lg px-3.5 py-2.5 text-sm text-[#54473a] placeholder:text-[#877c6b] focus:outline-none focus:border-[#b8323f] focus:ring-2 focus:ring-[#b8323f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#20180f] hover:brightness-125 text-[#f8f1e5] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e6d9c3] text-[#54473a] hover:bg-[#f8f1e5] hover:border-[#b8323f]/40',
  divider: 'bg-[#e6d9c3]',
  timelineLine: 'from-[#b8323f] via-[#b8323f]/40 to-transparent',
};

export function KinaGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_GAZETE_THEME}
      renderHero={(props) => <GazeteHero {...props} masthead="KINA POSTASI" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdf7ec 0%, #f3ebdb 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f8f1e5"
        />
      )}
    />
  );
}
