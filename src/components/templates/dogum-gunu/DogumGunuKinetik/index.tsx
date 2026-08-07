import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { KinetikHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DogumGunuKinetik — "Kinetik Tipografi" doğum günü yorumu: kömür siyahı zemin, asit sarısı akış.
 */
const DOGUM_GUNU_KINETIK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#111014]',
  page: 'text-[#e4e2d6]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f7f5ea]',
  body: 'text-[#8d8a80]',
  accent: 'text-[#f5e050]',
  accentBg: 'bg-[#f5e050]',
  accentSoft: 'bg-[#f5e050]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f7f5ea] placeholder:text-[#8d8a80] focus:outline-none focus:border-[#f5e050]/60 focus:ring-2 focus:ring-[#f5e050]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#f5e050] hover:bg-[#f9ea7c] text-[#171509] shadow-lg shadow-[#f5e050]/25',
  buttonGhost:
    'border border-white/16 text-[#e4e2d6] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f5e050] via-[#ff8fb0]/45 to-transparent'
};

export function DogumGunuKinetik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_KINETIK_THEME}
      renderHero={(props) => <KinetikHero {...props} topWord="DOĞUM GÜNÜ" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #1c1a20 0%, #121116 55%, #0a0a0c 100%)"
          scrim={false}
          vignette={{ strength: 0.4 }}
          atmosphere={<Halo color="245,224,80" size={58} x={50} y={45} opacity={0.13} duration={11} />}
          parallax={5}
          grain={0.03}
          fadeTo="#111014"
        />
      )}
    />
  );
}
