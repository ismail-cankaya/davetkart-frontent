import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunGazete — "Gazete Manşeti" düğün yorumu: daveti haber olarak duyuran dizgi. */
const DUGUN_GAZETE_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f2e9]',
  page: 'text-[#4f4a3f]',
  surface: 'bg-[#faf7ef]/85 backdrop-blur-sm',
  border: 'border-[#e2dccb]',
  heading: 'text-[#1a180f]',
  body: 'text-[#847d6e]',
  accent: 'text-[#8c3f2f]',
  accentBg: 'bg-[#8c3f2f]',
  accentSoft: 'bg-[#8c3f2f]/12',
  input: 'w-full bg-white border border-[#e2dccb] rounded-lg px-3.5 py-2.5 text-sm text-[#4f4a3f] placeholder:text-[#847d6e] focus:outline-none focus:border-[#8c3f2f] focus:ring-2 focus:ring-[#8c3f2f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#1a180f] hover:brightness-125 text-[#f5f2e9] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e2dccb] text-[#4f4a3f] hover:bg-[#f5f2e9] hover:border-[#8c3f2f]/40',
  divider: 'bg-[#e2dccb]',
  timelineLine: 'from-[#8c3f2f] via-[#8c3f2f]/40 to-transparent',
};

export function DugunGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_GAZETE_THEME}
      renderHero={(props) => <GazeteHero {...props} masthead="GÜNÜN HABERİ" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #faf8f0 0%, #f0ece0 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f5f2e9"
        />
      )}
    />
  );
}
