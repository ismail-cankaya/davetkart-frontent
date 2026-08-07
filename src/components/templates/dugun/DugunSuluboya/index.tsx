import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunSuluboya — "Suluboya" düğün yorumu: gül, şampanya ve gök mavisi lekeler; sıcak kağıt. */
const DUGUN_SULUBOYA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fbf8f4]',
  page: 'text-[#514a41]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#e6ded0]',
  heading: 'text-[#2e2620]',
  body: 'text-[#8a8074]',
  accent: 'text-[#b5798f]',
  accentBg: 'bg-[#b5798f]',
  accentSoft: 'bg-[#b5798f]/12',
  input:
    'w-full bg-white border border-[#e6ded0] rounded-lg px-3.5 py-2.5 text-sm text-[#514a41] placeholder:text-[#8a8074] focus:outline-none focus:border-[#b5798f] focus:ring-2 focus:ring-[#b5798f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2e2620] hover:bg-[#463c32] text-[#fbf8f4] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#ded5c5] text-[#615a4f] hover:bg-[#f3eee5] hover:border-[#c2b7a2]',
  divider: 'bg-[#e6ded0]',
  timelineLine: 'from-[#b5798f] via-[#e8cea0]/60 to-transparent'
};

export function DugunSuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_SULUBOYA_THEME}
      renderHero={(props) => (
        <SuluboyaHero {...props} washes={['#d9a3b8', '#e8cea0', '#9fb8d8']} seed={7} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fefcf9 0%, #f7f2ea 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.026}
          fadeTo="#fbf8f4"
        />
      )}
    />
  );
}
