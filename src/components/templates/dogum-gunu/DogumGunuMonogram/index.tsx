import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MonogramHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuMonogram — "Varak Monogram" yorumu: krem kart, altın varak ve siyah boyalı kenar. */
const DOGUM_GUNU_MONOGRAM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f2ece4]',
  page: 'text-[#77716a]',
  surface: 'bg-[#fbf8f3]/90 backdrop-blur-sm',
  border: 'border-[#b99b5a]/25',
  heading: 'text-[#1f1f24]',
  body: 'text-[#77716a]',
  accent: 'text-[#a8843f]',
  accentBg: 'bg-[#1f1f24]',
  accentSoft: 'bg-[#a8843f]/10',
  input: 'w-full bg-[#fbf8f3] border border-[#b99b5a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#1f1f24] placeholder:text-[#77716a] focus:outline-none focus:border-[#a8843f] focus:ring-2 focus:ring-[#a8843f]/15 transition duration-300',
  buttonPrimary: 'bg-[#1f1f24] hover:brightness-125 text-[#fbf8f3] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#b99b5a]/40 text-[#1f1f24] hover:bg-[#b99b5a]/10 hover:border-[#b99b5a]/70 rounded-sm',
  divider: 'bg-[#b99b5a]/20',
  timelineLine: 'from-[#a8843f] via-[#b99b5a]/40 to-transparent',
};

export function DogumGunuMonogram({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_MONOGRAM_THEME}
      renderHero={(props) => (
        <MonogramHero {...props} paper="#fbf8f3" edge="#1f1f24" foil={['#7d6a3c', '#c8ad6a', '#f3e4b2']} stock="light" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(120% 80% at 50% 30%, #f6f1ea 0%, #e9e1d6 100%)"
          scrim={false}
          vignette={{ strength: 0.18 }}
          parallax={0}
          grain={0.025}
          fadeTo="#f2ece4"
        />
      )}
    />
  );
}
