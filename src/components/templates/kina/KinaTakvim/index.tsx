import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { TakvimHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaTakvim — "Takvim" yorumu: sıcak krem yaprak, bakır spiral ve kına kırmızısı daire. */
const KINA_TAKVIM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f3e7d9]',
  page: 'text-[#7e665c]',
  surface: 'bg-[#fcf4ea]/90 backdrop-blur-sm',
  border: 'border-[#a08a76]/25',
  heading: 'text-[#3a1d1d]',
  body: 'text-[#7e665c]',
  accent: 'text-[#b02a32]',
  accentBg: 'bg-[#6e1a22]',
  accentSoft: 'bg-[#b02a32]/10',
  input: 'w-full bg-[#fcf4ea] border border-[#a08a76]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#3a1d1d] placeholder:text-[#7e665c] focus:outline-none focus:border-[#b02a32] focus:ring-2 focus:ring-[#b02a32]/15 transition duration-300',
  buttonPrimary: 'bg-[#6e1a22] hover:brightness-125 text-[#fcf4ea] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#a08a76]/40 text-[#3a1d1d] hover:bg-[#a08a76]/10 hover:border-[#a08a76]/70 rounded-sm',
  divider: 'bg-[#a08a76]/20',
  timelineLine: 'from-[#b02a32] via-[#a08a76]/40 to-transparent',
};

export function KinaTakvim({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_TAKVIM_THEME}
      renderHero={(props) => (
        <TakvimHero {...props} paper="#fcf4ea" ink="#b02a32" metal="#a07a3c" note="#f6d0c0" noteInk="#4a1d1d" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(110% 70% at 50% 25%, #f6ebdd 0%, #e7d5c1 100%)"
          scrim={false}
          vignette={{ strength: 0.15 }}
          parallax={0}
          grain={0.03}
          fadeTo="#f3e7d9"
        />
      )}
    />
  );
}
