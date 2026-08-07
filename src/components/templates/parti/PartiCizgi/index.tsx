import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HatHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiCizgi — "Tek Çizgi" parti yorumu: kireç beyazı zemin, indigo hat.
 *
 * Parti kategorisinin tamamı gece zeminli ve yüksek kontrastlı; bu şablon
 * kasıtlı olarak gündüz tarafında duruyor — brunch, açılış kokteyli,
 * bahçe partisi gibi davetlerin karşılığı.
 */
const PARTI_CIZGI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f4f2]',
  page: 'text-[#484850]',
  surface: 'bg-white/85',
  border: 'border-[#dedee0]',
  heading: 'text-[#121214]',
  body: 'text-[#7c7c84]',
  accent: 'text-[#5b4ff0]',
  accentBg: 'bg-[#5b4ff0]',
  accentSoft: 'bg-[#5b4ff0]/10',
  input:
    'w-full bg-white border border-[#dedee0] rounded-lg px-3.5 py-2.5 text-sm text-[#484850] placeholder:text-[#7c7c84] focus:outline-none focus:border-[#5b4ff0] focus:ring-2 focus:ring-[#5b4ff0]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#121214] hover:bg-[#2b2b30] text-[#f4f4f2] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d3d3d6] text-[#585860] hover:bg-[#eaeaec] hover:border-[#b0b0b5]',
  divider: 'bg-[#dedee0]',
  timelineLine: 'from-[#5b4ff0] via-[#b6b1f5]/60 to-transparent'
};

export function PartiCizgi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_CIZGI_THEME}
      renderHero={(props) => <HatHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fafafa 0%, #efeff0 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.016}
          fadeTo="#f4f4f2"
        />
      )}
    />
  );
}
