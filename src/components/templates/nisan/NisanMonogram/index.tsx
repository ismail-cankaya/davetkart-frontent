import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MonogramHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanMonogram — "Varak Monogram" yorumu: pudra kart, gül altını varak ve gül boyalı kenar. */
const NISAN_MONOGRAM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5ebe8]',
  page: 'text-[#806c6d]',
  surface: 'bg-[#fdf7f5]/90 backdrop-blur-sm',
  border: 'border-[#c98f86]/25',
  heading: 'text-[#3d2b2e]',
  body: 'text-[#806c6d]',
  accent: 'text-[#b36f63]',
  accentBg: 'bg-[#3d2b2e]',
  accentSoft: 'bg-[#b36f63]/10',
  input: 'w-full bg-[#fdf7f5] border border-[#c98f86]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#3d2b2e] placeholder:text-[#806c6d] focus:outline-none focus:border-[#b36f63] focus:ring-2 focus:ring-[#b36f63]/15 transition duration-300',
  buttonPrimary: 'bg-[#3d2b2e] hover:brightness-125 text-[#fbf3f1] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#c98f86]/40 text-[#3d2b2e] hover:bg-[#c98f86]/10 hover:border-[#c98f86]/70 rounded-sm',
  divider: 'bg-[#c98f86]/20',
  timelineLine: 'from-[#b36f63] via-[#c98f86]/40 to-transparent',
};

export function NisanMonogram({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_MONOGRAM_THEME}
      renderHero={(props) => (
        <MonogramHero {...props} paper="#fbf3f1" edge="#d9a3a7" foil={['#9a5f4e', '#d39a85', '#f7d9c9']} stock="light" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(120% 80% at 50% 30%, #f8eeec 0%, #ecdcd8 100%)"
          scrim={false}
          vignette={{ strength: 0.18 }}
          parallax={0}
          grain={0.025}
          fadeTo="#f5ebe8"
        />
      )}
    />
  );
}
