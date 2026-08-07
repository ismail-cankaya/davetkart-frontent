import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HatHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DugunCizgi — "Tek Çizgi" düğün yorumu: fildişi kağıt, mürekkep mavisi tek hat.
 *
 * Zemin neredeyse boş bırakıldı; monoline dilde kompozisyonu boşluk kurar,
 * arka planın işi yalnızca kağıdı taklit etmek.
 */
const DUGUN_CIZGI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#faf7f2]',
  page: 'text-[#4c4740]',
  surface: 'bg-white/85',
  border: 'border-[#ddd6ca]',
  heading: 'text-[#23201b]',
  body: 'text-[#847d72]',
  accent: 'text-[#4a5b7a]',
  accentBg: 'bg-[#4a5b7a]',
  accentSoft: 'bg-[#4a5b7a]/10',
  input:
    'w-full bg-white border border-[#ddd6ca] rounded-lg px-3.5 py-2.5 text-sm text-[#4c4740] placeholder:text-[#847d72] focus:outline-none focus:border-[#4a5b7a] focus:ring-2 focus:ring-[#4a5b7a]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#23201b] hover:bg-[#3b362e] text-[#faf7f2] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d5cdbf] text-[#5d574d] hover:bg-[#f1ece3] hover:border-[#b8ae9c]',
  divider: 'bg-[#ddd6ca]',
  timelineLine: 'from-[#4a5b7a] via-[#b6bfcf]/60 to-transparent'
};

export function DugunCizgi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_CIZGI_THEME}
      renderHero={(props) => <HatHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfbf7 0%, #f6f2ea 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.018}
          fadeTo="#faf7f2"
        />
      )}
    />
  );
}
