import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PaperHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaKagit — "Kağıt & Mühür" kına yorumu: pudra kağıt, bordo mürekkep ve mühür.
 */
const KINA_KAGIT_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7ecec]',
  page: 'text-[#5f4448]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#e3ccce]',
  heading: 'text-[#33161b]',
  body: 'text-[#96777c]',
  accent: 'text-[#9c2436]',
  accentBg: 'bg-[#9c2436]',
  accentSoft: 'bg-[#9c2436]/10',
  input:
    'w-full bg-white/80 border border-[#e3ccce] rounded-lg px-3.5 py-2.5 text-sm text-[#5f4448] placeholder:text-[#b09296] focus:outline-none focus:border-[#9c2436] focus:ring-2 focus:ring-[#9c2436]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#8e1b2e] hover:bg-[#a52b40] text-[#faf1f1] shadow-lg shadow-[#8e1b2e]/15',
  buttonGhost:
    'border border-[#dbbdc0] text-[#7a5c60] hover:bg-[#f0e0e1] hover:border-[#c79ba0]',
  divider: 'bg-[#e3ccce]',
  timelineLine: 'from-[#9c2436] via-[#d3a9ad]/60 to-transparent'
};

export function KinaKagit({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_KAGIT_THEME}
      renderHero={(props) => <PaperHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 40%, #f5e9e9 0%, #eddcdd 55%, #e2cccd 100%)"
          scrim={false}
          vignette={false}
          parallax={6}
          grain={0.02}
          fadeTo="#f7ecec"
        />
      )}
    />
  );
}
