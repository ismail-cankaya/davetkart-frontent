import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PaperHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetKagit — "Kağıt & Mühür" sünnet yorumu: açık mavi-gri kağıt, gece mavisi mürekkep.
 */
const SUNNET_KAGIT_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#edf1f6]',
  page: 'text-[#4a5566]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#ccd7e4]',
  heading: 'text-[#16243a]',
  body: 'text-[#79859a]',
  accent: 'text-[#1f4e8c]',
  accentBg: 'bg-[#1f4e8c]',
  accentSoft: 'bg-[#1f4e8c]/10',
  input:
    'w-full bg-white/80 border border-[#ccd7e4] rounded-lg px-3.5 py-2.5 text-sm text-[#4a5566] placeholder:text-[#95a2b3] focus:outline-none focus:border-[#1f4e8c] focus:ring-2 focus:ring-[#1f4e8c]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#16243a] hover:bg-[#293a53] text-[#f0f4f9] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#bfcddd] text-[#5a6675] hover:bg-[#e2e9f1] hover:border-[#9db0c6]',
  divider: 'bg-[#ccd7e4]',
  timelineLine: 'from-[#1f4e8c] via-[#a3bad3]/60 to-transparent'
};

export function SunnetKagit({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_KAGIT_THEME}
      renderHero={(props) => <PaperHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 40%, #eaf0f7 0%, #dde6f0 55%, #cfdbe8 100%)"
          scrim={false}
          vignette={false}
          parallax={6}
          grain={0.02}
          fadeTo="#edf1f6"
        />
      )}
    />
  );
}
