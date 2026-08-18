import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiGazete — "Gazete Manşeti" parti yorumu: daveti haber olarak duyuran dizgi. */
const PARTI_GAZETE_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0c0c0d]',
  page: 'text-[#dcdcda]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f4f4f2]',
  body: 'text-[#888883]',
  accent: 'text-[#ff4f3f]',
  accentBg: 'bg-[#ff4f3f]',
  accentSoft: 'bg-[#ff4f3f]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f4f4f2] placeholder:text-[#888883] focus:outline-none focus:border-[#ff4f3f]/60 focus:ring-2 focus:ring-[#ff4f3f]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#ff4f3f] hover:brightness-110 text-[#0c0c0d] shadow-lg shadow-[#ff4f3f]/25',
  buttonGhost: 'border border-white/16 text-[#dcdcda] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ff4f3f] via-[#ff4f3f]/40 to-transparent',
};

export function PartiGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_GAZETE_THEME}
      renderHero={(props) => <GazeteHero {...props} masthead="GECE POSTASI" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #17171a 0%, #0b0b0c 55%, #0c0c0d 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          parallax={5}
          grain={0.03}
          fadeTo="#0c0c0d"
        />
      )}
    />
  );
}
