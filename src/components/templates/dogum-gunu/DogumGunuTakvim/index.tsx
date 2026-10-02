import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { TakvimHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuTakvim — "Takvim" yorumu: siyah spiral, mandalina mürekkep ve sarı yapışkan not. */
const DOGUM_GUNU_TAKVIM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fbefdf]',
  page: 'text-[#776c74]',
  surface: 'bg-[#fffaf1]/90 backdrop-blur-sm',
  border: 'border-[#b3a39a]/25',
  heading: 'text-[#2b2340]',
  body: 'text-[#776c74]',
  accent: 'text-[#e0502f]',
  accentBg: 'bg-[#2b2340]',
  accentSoft: 'bg-[#e0502f]/10',
  input: 'w-full bg-[#fffaf1] border border-[#b3a39a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#2b2340] placeholder:text-[#776c74] focus:outline-none focus:border-[#e0502f] focus:ring-2 focus:ring-[#e0502f]/15 transition duration-300',
  buttonPrimary: 'bg-[#2b2340] hover:brightness-125 text-[#fffaf1] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#b3a39a]/40 text-[#2b2340] hover:bg-[#b3a39a]/10 hover:border-[#b3a39a]/70 rounded-sm',
  divider: 'bg-[#b3a39a]/20',
  timelineLine: 'from-[#e0502f] via-[#b3a39a]/40 to-transparent',
};

export function DogumGunuTakvim({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_TAKVIM_THEME}
      renderHero={(props) => (
        <TakvimHero {...props} paper="#fffaf1" ink="#e8532f" metal="#2b2340" note="#ffe27a" noteInk="#2b2340" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(110% 70% at 50% 25%, #fff4e4 0%, #f6e2c8 100%)"
          scrim={false}
          vignette={{ strength: 0.15 }}
          parallax={0}
          grain={0.03}
          fadeTo="#fbefdf"
        />
      )}
    />
  );
}
