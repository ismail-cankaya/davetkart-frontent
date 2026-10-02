import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { CiniHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanCini — "Çini" yorumu: Kütahya'nın yumuşak tonları; lavanta mavisi, adaçayı firuzesi ve gül kurusu. */
const NISAN_CINI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8f3f1]',
  page: 'text-[#6f6f80]',
  surface: 'bg-[#fcf9f7]/90 backdrop-blur-sm',
  border: 'border-[#4b5d97]/25',
  heading: 'text-[#2c3558]',
  body: 'text-[#6f6f80]',
  accent: 'text-[#c0607a]',
  accentBg: 'bg-[#4b5d97]',
  accentSoft: 'bg-[#c0607a]/10',
  input: 'w-full bg-[#fcf9f7] border border-[#4b5d97]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#2c3558] placeholder:text-[#6f6f80] focus:outline-none focus:border-[#c0607a] focus:ring-2 focus:ring-[#c0607a]/15 transition duration-300',
  buttonPrimary: 'bg-[#4b5d97] hover:brightness-125 text-[#fcf9f7] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#4b5d97]/40 text-[#2c3558] hover:bg-[#4b5d97]/10 hover:border-[#4b5d97]/70 rounded-sm',
  divider: 'bg-[#4b5d97]/20',
  timelineLine: 'from-[#c0607a] via-[#4b5d97]/40 to-transparent',
};

export function NisanCini({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_CINI_THEME}
      renderHero={(props) => (
        <CiniHero
          {...props}
          glaze="#fcf9f7"
          cobalt="#4b5d97"
          turquoise="#7fb4ad"
          coral="#cf6f84"
          leaf="#7c9a76"
          grout="#ebe3e1"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage base="#ebe3e1" scrim={false} vignette={false} parallax={0} grain={0.02} fadeTo="#f8f3f1" />
      )}
    />
  );
}
