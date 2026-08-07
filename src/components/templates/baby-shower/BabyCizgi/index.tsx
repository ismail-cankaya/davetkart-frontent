import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HatHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * BabyCizgi — "Tek Çizgi" baby shower yorumu: süt beyazı kağıt, duman mavisi hat.
 */
const BABY_CIZGI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f9f8f5]',
  page: 'text-[#4f4f48]',
  surface: 'bg-white/85',
  border: 'border-[#e2e0d8]',
  heading: 'text-[#2a2a26]',
  body: 'text-[#87877e]',
  accent: 'text-[#6f86a8]',
  accentBg: 'bg-[#6f86a8]',
  accentSoft: 'bg-[#6f86a8]/12',
  input:
    'w-full bg-white border border-[#e2e0d8] rounded-lg px-3.5 py-2.5 text-sm text-[#4f4f48] placeholder:text-[#87877e] focus:outline-none focus:border-[#6f86a8] focus:ring-2 focus:ring-[#6f86a8]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#2a2a26] hover:bg-[#42423b] text-[#f9f8f5] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d9d7cd] text-[#5f5f57] hover:bg-[#f0efe9] hover:border-[#bcbaad]',
  divider: 'bg-[#e2e0d8]',
  timelineLine: 'from-[#6f86a8] via-[#bcc7d8]/60 to-transparent'
};

export function BabyCizgi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_CIZGI_THEME}
      renderHero={(props) => <HatHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfdfb 0%, #f4f3ee 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.016}
          fadeTo="#f9f8f5"
        />
      )}
    />
  );
}
