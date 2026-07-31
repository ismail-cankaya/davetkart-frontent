import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { NoirHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * NisanNoir — "Noir Minimal" nişan yorumu: siyah zemin, platin vurgu.
 *
 * Düğün noir'ı şampanya altını; bu platin/buz. Aynı disiplin, farklı metal —
 * nişan yüzüğünün soğuk parıltısı.
 */
const NISAN_NOIR_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#060708]',
  page: 'text-[#d2d6dc]',
  surface: 'bg-white/[0.035] backdrop-blur-md',
  border: 'border-[#c4d0dd]/16',
  heading: 'text-[#f2f5f8]',
  body: 'text-[#848b95]',
  accent: 'text-[#c4d0dd]',
  accentBg: 'bg-[#c4d0dd]',
  accentSoft: 'bg-[#c4d0dd]/10',
  input:
    'w-full bg-white/[0.035] border border-[#c4d0dd]/16 rounded-none px-3.5 py-2.5 text-sm text-[#e8ecf1] placeholder:text-[#71777f] focus:outline-none focus:border-[#c4d0dd]/55 focus:ring-0 transition-all duration-300',
  buttonPrimary:
    'rounded-none bg-[#c4d0dd] hover:bg-[#d6e0ea] text-[#08090b] shadow-none',
  buttonGhost:
    'rounded-none border border-[#c4d0dd]/22 text-[#d2d6dc] hover:bg-[#c4d0dd]/8 hover:border-[#c4d0dd]/40',
  divider: 'bg-[#c4d0dd]/18',
  timelineLine: 'from-[#c4d0dd] via-[#c4d0dd]/30 to-transparent'
};

export function NisanNoir({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_NOIR_THEME}
      renderHero={(props) => <NoirHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 42%, #101418 0%, #08090b 55%, #040405 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="196,208,221" size={52} x={50} y={42} opacity={0.13} duration={15} />}
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#c4d0dd'],
              blend: 'screen',
              density: 0.28,
              speed: 0.3,
              opacity: 0.45,
              pointerStrength: 0.8,
              depth: 1,
              seed: 113
            }
          ]}
          parallax={8}
          grain={0.038}
          fadeTo="#060708"
        />
      )}
    />
  );
}
