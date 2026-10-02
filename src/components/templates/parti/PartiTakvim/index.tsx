import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { TakvimHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiTakvim — "Takvim" yorumu: gece takvimi: koyu yaprak, neon pembe daire ve fosforlu not. */
const PARTI_TAKVIM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0d0b13]',
  page: 'text-[#a49fb8]',
  surface: 'bg-[#1a1724]/90 backdrop-blur-sm',
  border: 'border-[#6f6888]/25',
  heading: 'text-[#f1ecff]',
  body: 'text-[#a49fb8]',
  accent: 'text-[#ff4f8b]',
  accentBg: 'bg-[#f1ecff]',
  accentSoft: 'bg-[#ff4f8b]/10',
  input: 'w-full bg-[#1a1724] border border-[#6f6888]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#f1ecff] placeholder:text-[#a49fb8] focus:outline-none focus:border-[#ff4f8b] focus:ring-2 focus:ring-[#ff4f8b]/15 transition duration-300',
  buttonPrimary: 'bg-[#f1ecff] hover:brightness-110 text-[#0d0b13] rounded-sm shadow-lg shadow-black/30',
  buttonGhost: 'border border-[#6f6888]/40 text-[#f1ecff] hover:bg-[#6f6888]/10 hover:border-[#6f6888]/70 rounded-sm',
  divider: 'bg-[#6f6888]/20',
  timelineLine: 'from-[#ff4f8b] via-[#6f6888]/40 to-transparent',
};

export function PartiTakvim({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_TAKVIM_THEME}
      renderHero={(props) => (
        <TakvimHero {...props} paper="#17141f" ink="#ff4f8b" metal="#8a85a3" note="#d6ff3d" noteInk="#17141f" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(110% 70% at 50% 25%, #1d1828 0%, #0b0910 100%)"
          scrim={false}
          vignette={{ strength: 0.3 }}
          parallax={0}
          grain={0.03}
          fadeTo="#0d0b13"
        />
      )}
    />
  );
}
