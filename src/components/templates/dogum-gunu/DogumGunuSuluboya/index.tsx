import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuSuluboya — "Suluboya" doğum günü yorumu: şeker pembesi, limon ve turkuaz lekeler. */
const DOGUM_GUNU_SULUBOYA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fdf9f4]',
  page: 'text-[#524940]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#ebe0d2]',
  heading: 'text-[#2b2320]',
  body: 'text-[#8b8175]',
  accent: 'text-[#e07fa8]',
  accentBg: 'bg-[#e07fa8]',
  accentSoft: 'bg-[#e07fa8]/12',
  input:
    'w-full bg-white border border-[#ebe0d2] rounded-lg px-3.5 py-2.5 text-sm text-[#524940] placeholder:text-[#8b8175] focus:outline-none focus:border-[#e07fa8] focus:ring-2 focus:ring-[#e07fa8]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2b2320] hover:bg-[#443832] text-[#fdf9f4] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e2d7c8] text-[#625849] hover:bg-[#f6efe6] hover:border-[#c6b9a6]',
  divider: 'bg-[#ebe0d2]',
  timelineLine: 'from-[#e07fa8] via-[#f5d07a]/60 to-transparent'
};

export function DogumGunuSuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_SULUBOYA_THEME}
      renderHero={(props) => (
        <SuluboyaHero {...props} washes={['#f0a0c0', '#f5d07a', '#8fd0d8']} seed={41} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fffdfa 0%, #f9f3ec 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#fdf9f4"
        />
      )}
    />
  );
}
