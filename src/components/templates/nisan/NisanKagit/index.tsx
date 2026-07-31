import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PaperHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * NisanKagit — "Kağıt & Mühür" nişan yorumu: soğuk gri-mavi el yapımı kağıt, lacivert mürekkep.
 */
const NISAN_KAGIT_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#eef0f2]',
  page: 'text-[#4e565e]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#cfd6dd]',
  heading: 'text-[#1e262e]',
  body: 'text-[#7d868f]',
  accent: 'text-[#2f5d8a]',
  accentBg: 'bg-[#2f5d8a]',
  accentSoft: 'bg-[#2f5d8a]/10',
  input:
    'w-full bg-white/80 border border-[#cfd6dd] rounded-lg px-3.5 py-2.5 text-sm text-[#4e565e] placeholder:text-[#9aa3ac] focus:outline-none focus:border-[#2f5d8a] focus:ring-2 focus:ring-[#2f5d8a]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#1e262e] hover:bg-[#333d47] text-[#f2f4f6] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#c3ccd5] text-[#5d666f] hover:bg-[#e4e8ec] hover:border-[#a6b3bf]',
  divider: 'bg-[#cfd6dd]',
  timelineLine: 'from-[#2f5d8a] via-[#a9bccc]/60 to-transparent'
};

export function NisanKagit({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_KAGIT_THEME}
      renderHero={(props) => <PaperHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 40%, #eceff2 0%, #e0e5ea 55%, #d3dae0 100%)"
          scrim={false}
          vignette={false}
          parallax={6}
          grain={0.02}
          fadeTo="#eef0f2"
        />
      )}
    />
  );
}
