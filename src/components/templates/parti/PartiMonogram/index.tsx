import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MonogramHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiMonogram — "Varak Monogram" yorumu: siyah kart üzerinde altın varak; gala gecesinin arması. */
const PARTI_MONOGRAM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b0a0e]',
  page: 'text-[#a39d92]',
  surface: 'bg-[#17161c]/90 backdrop-blur-sm',
  border: 'border-[#d8b45c]/25',
  heading: 'text-[#f3ecdc]',
  body: 'text-[#a39d92]',
  accent: 'text-[#e0bd66]',
  accentBg: 'bg-[#e0bd66]',
  accentSoft: 'bg-[#e0bd66]/10',
  input: 'w-full bg-[#17161c] border border-[#d8b45c]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#f3ecdc] placeholder:text-[#a39d92] focus:outline-none focus:border-[#e0bd66] focus:ring-2 focus:ring-[#e0bd66]/15 transition duration-300',
  buttonPrimary: 'bg-[#e0bd66] hover:brightness-110 text-[#0b0a0e] rounded-sm shadow-lg shadow-black/30',
  buttonGhost: 'border border-[#d8b45c]/40 text-[#f3ecdc] hover:bg-[#d8b45c]/10 hover:border-[#d8b45c]/70 rounded-sm',
  divider: 'bg-[#d8b45c]/20',
  timelineLine: 'from-[#e0bd66] via-[#d8b45c]/40 to-transparent',
};

export function PartiMonogram({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_MONOGRAM_THEME}
      renderHero={(props) => (
        <MonogramHero {...props} paper="#121116" edge="#d8b45c" foil={['#8c6a2b', '#d4ad5c', '#f8e6ad']} stock="dark" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(120% 80% at 50% 30%, #1a1820 0%, #0a090d 100%)"
          scrim={false}
          vignette={{ strength: 0.3 }}
          parallax={0}
          grain={0.025}
          fadeTo="#0b0a0e"
        />
      )}
    />
  );
}
