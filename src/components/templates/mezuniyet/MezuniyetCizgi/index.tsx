import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HatHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * MezuniyetCizgi — "Tek Çizgi" mezuniyet yorumu: kitap kağıdı, şarap kırmızısı hat.
 */
const MEZUNIYET_CIZGI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f4f0]',
  page: 'text-[#4a4d54]',
  surface: 'bg-white/85',
  border: 'border-[#dfddd5]',
  heading: 'text-[#16181d]',
  body: 'text-[#7a7d85]',
  accent: 'text-[#7a2f39]',
  accentBg: 'bg-[#7a2f39]',
  accentSoft: 'bg-[#7a2f39]/10',
  input:
    'w-full bg-white border border-[#dfddd5] rounded-lg px-3.5 py-2.5 text-sm text-[#4a4d54] placeholder:text-[#7a7d85] focus:outline-none focus:border-[#7a2f39] focus:ring-2 focus:ring-[#7a2f39]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#16181d] hover:bg-[#2c2f36] text-[#f5f4f0] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d4d1c8] text-[#5a5d64] hover:bg-[#ebe9e2] hover:border-[#b2afa4]',
  divider: 'bg-[#dfddd5]',
  timelineLine: 'from-[#7a2f39] via-[#c9adb1]/60 to-transparent'
};

export function MezuniyetCizgi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_CIZGI_THEME}
      renderHero={(props) => <HatHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fafaf7 0%, #f0efe9 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.018}
          fadeTo="#f5f4f0"
        />
      )}
    />
  );
}
