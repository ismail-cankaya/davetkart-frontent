import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { RisoHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * NisanRiso — "Risograph Poster" nişan yorumu: soğuk gri kağıt, kobalt ve şeftali mürekkep.
 *
 * Kobalt tek başına serttir; ikinci mürekkep olarak şeftali seçildi çünkü
 * riso'da bindirme yapan sıcak-soğuk çifti baskıya derinlik veren tek şeydir.
 */
const NISAN_RISO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f2f4f7]',
  page: 'text-[#383d45]',
  surface: 'bg-white/85',
  border: 'border-[#161a20]/15',
  heading: 'text-[#161a20]',
  body: 'text-[#666d78]',
  accent: 'text-[#2f5fe0]',
  accentBg: 'bg-[#2f5fe0]',
  accentSoft: 'bg-[#f2856b]/28',
  input:
    'w-full bg-white border border-[#161a20]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#383d45] placeholder:text-[#666d78] focus:outline-none focus:border-[#2f5fe0] focus:ring-2 focus:ring-[#2f5fe0]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#161a20] hover:bg-[#383d45] text-[#f2f4f7] shadow-none',
  buttonGhost:
    'border-2 border-[#161a20] text-[#161a20] hover:bg-[#161a20] hover:text-[#f2f4f7]',
  divider: 'bg-[#161a20]/15',
  timelineLine: 'from-[#2f5fe0] via-[#f2856b]/50 to-transparent'
};

export function NisanRiso({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_RISO_THEME}
      renderHero={(props) => <RisoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #f8fafc 0%, #eceff4 100%)"
          scrim={false}
          vignette={false}
          parallax={5}
          grain={0.03}
          fadeTo="#f2f4f7"
        />
      )}
    />
  );
}
