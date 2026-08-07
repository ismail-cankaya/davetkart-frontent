import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PaperHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * MezuniyetKagit — "Kağıt & Mühür" mezuniyet yorumu: diploma kağıdı, lacivert mürekkep, bordo mühür.
 *
 * Kategoriyle en doğrudan eşleşen malzeme bu: diplomanın kendisi kabartma
 * baskılı bir kağıt ve mühürdür. Mühür rengi üniversite armalarının klasik
 * bordosundan alındı.
 */
const MEZUNIYET_KAGIT_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f2ea]',
  page: 'text-[#55503f]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#dcd5c4]',
  heading: 'text-[#221f18]',
  body: 'text-[#847c6c]',
  accent: 'text-[#1d3f76]',
  accentBg: 'bg-[#1d3f76]',
  accentSoft: 'bg-[#1d3f76]/12',
  input:
    'w-full bg-white border border-[#dcd5c4] rounded-lg px-3.5 py-2.5 text-sm text-[#55503f] placeholder:text-[#847c6c] focus:outline-none focus:border-[#1d3f76] focus:ring-2 focus:ring-[#1d3f76]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#221f18] hover:bg-[#3c3729] text-[#f7f4ec] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d1c9b6] text-[#645d4c] hover:bg-[#ebe7db] hover:border-[#b5ab93]',
  divider: 'bg-[#dcd5c4]',
  timelineLine: 'from-[#1d3f76] via-[#b6bfd0]/60 to-transparent'
};

export function MezuniyetKagit({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_KAGIT_THEME}
      renderHero={(props) => <PaperHero {...props} sealColor="#7c2233" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 40%, #f4f1e7 0%, #e9e4d5 55%, #ddd6c3 100%)"
          scrim={false}
          vignette={false}
          parallax={6}
          grain={0.02}
          fadeTo="#f4f2ea"
        />
      )}
    />
  );
}
