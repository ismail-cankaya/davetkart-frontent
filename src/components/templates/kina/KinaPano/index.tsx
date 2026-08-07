import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaPano — "Mekanik Pano" kına yorumu: bordo gövde, mercan vurgu. */
const KINA_PANO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#160a0c]',
  page: 'text-[#e8d6d0]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f9ece6]',
  body: 'text-[#9b8480]',
  accent: 'text-[#e0785f]',
  accentBg: 'bg-[#e0785f]',
  accentSoft: 'bg-[#e0785f]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f9ece6] placeholder:text-[#9b8480] focus:outline-none focus:border-[#e0785f]/60 focus:ring-2 focus:ring-[#e0785f]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#e0785f] hover:bg-[#ec9179] text-[#190a0b] shadow-lg shadow-[#e0785f]/25',
  buttonGhost: 'border border-white/16 text-[#e8d6d0] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#e0785f] via-[#8a3340]/45 to-transparent'
};

export function KinaPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_PANO_THEME}
      renderHero={(props) => <PanoHero {...props} flap="#241012" ink="#f9ece6" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #2a1013 0%, #17090b 55%, #0c0507 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="224,120,95" size={56} x={50} y={42} opacity={0.15} duration={12} />}
          parallax={5}
          grain={0.028}
          fadeTo="#160a0c"
        />
      )}
    />
  );
}
