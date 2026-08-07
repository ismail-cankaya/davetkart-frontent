import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { KinetikHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * MezuniyetKinetik — "Kinetik Tipografi" mezuniyet yorumu: afiş kağıdı, koyu yeşil vurgu.
 *
 * Kampüs afişlerinin dili: iri kontur tipografi ve tek renk. Kayan şerit
 * "tören yürüyüşü" ritmini taşıyor.
 */
const MEZUNIYET_KINETIK_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f2ec]',
  page: 'text-[#494c54]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#e0ded6]',
  heading: 'text-[#14171f]',
  body: 'text-[#767a84]',
  accent: 'text-[#2f6b4f]',
  accentBg: 'bg-[#2f6b4f]',
  accentSoft: 'bg-[#2f6b4f]/12',
  input:
    'w-full bg-white border border-[#e0ded6] rounded-lg px-3.5 py-2.5 text-sm text-[#494c54] placeholder:text-[#767a84] focus:outline-none focus:border-[#2f6b4f] focus:ring-2 focus:ring-[#2f6b4f]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#14171f] hover:bg-[#2a2e38] text-[#f4f2ec] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d5d2c8] text-[#5a5d66] hover:bg-[#eae7de] hover:border-[#b3b0a4]',
  divider: 'bg-[#e0ded6]',
  timelineLine: 'from-[#2f6b4f] via-[#a9c2b3]/60 to-transparent'
};

export function MezuniyetKinetik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_KINETIK_THEME}
      renderHero={(props) => <KinetikHero {...props} topWord="MEZUNİYET" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #f9f8f3 0%, #efede5 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f4f2ec"
        />
      )}
    />
  );
}
