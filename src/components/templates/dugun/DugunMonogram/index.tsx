import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MonogramHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunMonogram — "Varak Monogram" yorumu: fildişi pamuk kart, altın varak arma ve altın boyalı kenar. */
const DUGUN_MONOGRAM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f1ece2]',
  page: 'text-[#7a7266]',
  surface: 'bg-[#faf7f0]/90 backdrop-blur-sm',
  border: 'border-[#b8924a]/25',
  heading: 'text-[#2b2620]',
  body: 'text-[#7a7266]',
  accent: 'text-[#a8823c]',
  accentBg: 'bg-[#2b2620]',
  accentSoft: 'bg-[#a8823c]/10',
  input: 'w-full bg-[#faf7f0] border border-[#b8924a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#2b2620] placeholder:text-[#7a7266] focus:outline-none focus:border-[#a8823c] focus:ring-2 focus:ring-[#a8823c]/15 transition duration-300',
  buttonPrimary: 'bg-[#2b2620] hover:brightness-125 text-[#f8f4ea] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#b8924a]/40 text-[#2b2620] hover:bg-[#b8924a]/10 hover:border-[#b8924a]/70 rounded-sm',
  divider: 'bg-[#b8924a]/20',
  timelineLine: 'from-[#a8823c] via-[#b8924a]/40 to-transparent',
};

export function DugunMonogram({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_MONOGRAM_THEME}
      renderHero={(props) => (
        <MonogramHero {...props} paper="#faf7f0" edge="#c9a35a" foil={['#8a6a2a', '#c9a456', '#f6e7b4']} stock="light" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(120% 80% at 50% 30%, #f7f3ea 0%, #ebe4d6 100%)"
          scrim={false}
          vignette={{ strength: 0.18 }}
          parallax={0}
          grain={0.025}
          fadeTo="#f1ece2"
        />
      )}
    />
  );
}
