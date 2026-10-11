import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MonogramHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaMonogram — "Varak Monogram" yorumu: bordo kart üzerinde altın varak; kına gecesinin sıcaklığı. */
const KINA_MONOGRAM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#24070d]',
  page: 'text-[#c9a9a0]',
  surface: 'bg-[#3a0e18]/90 backdrop-blur-sm',
  border: 'border-[#c8a052]/25',
  heading: 'text-[#f6e7cf]',
  body: 'text-[#c9a9a0]',
  accent: 'text-[#d4ad5c]',
  accentBg: 'bg-[#d4ad5c]',
  accentSoft: 'bg-[#d4ad5c]/10',
  input: 'w-full bg-[#3a0e18] border border-[#c8a052]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#f6e7cf] placeholder:text-[#c9a9a0] focus:outline-none focus:border-[#d4ad5c] focus:ring-2 focus:ring-[#d4ad5c]/15 transition duration-300',
  buttonPrimary: 'bg-[#d4ad5c] hover:brightness-110 text-[#2a0910] rounded-sm shadow-lg shadow-black/30',
  buttonGhost: 'border border-[#c8a052]/40 text-[#f6e7cf] hover:bg-[#c8a052]/10 hover:border-[#c8a052]/70 rounded-sm',
  divider: 'bg-[#c8a052]/20',
  timelineLine: 'from-[#d4ad5c] via-[#c8a052]/40 to-transparent',
};

export function KinaMonogram({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_MONOGRAM_THEME}
      renderHero={(props) => (
        <MonogramHero {...props} paper="#5a1420" edge="#c8a052" foil={['#8c6a2b', '#d4ad5c', '#f8e6ad']} stock="dark" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(120% 80% at 50% 30%, #3a0c15 0%, #24070d 100%)"
          scrim={false}
          vignette={{ strength: 0.3 }}
          parallax={0}
          grain={0.025}
          fadeTo="#24070d"
        />
      )}
    />
  );
}
