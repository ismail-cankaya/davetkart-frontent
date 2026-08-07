import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { KinetikHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DugunKinetik — "Kinetik Tipografi" düğün yorumu: fildişi kağıt, bronz vurgu, akan kontur yazı.
 *
 * Zemin bilinçle sessiz: hareketi taşıyan tek şey tipografi olduğu için
 * arka planda renk ya da doku yarışması yok.
 */
const DUGUN_KINETIK_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f1ea]',
  page: 'text-[#4a453c]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#e2dacc]',
  heading: 'text-[#1a1712]',
  body: 'text-[#7a7266]',
  accent: 'text-[#a8804f]',
  accentBg: 'bg-[#a8804f]',
  accentSoft: 'bg-[#a8804f]/12',
  input:
    'w-full bg-white border border-[#e2dacc] rounded-lg px-3.5 py-2.5 text-sm text-[#4a453c] placeholder:text-[#7a7266] focus:outline-none focus:border-[#a8804f] focus:ring-2 focus:ring-[#a8804f]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#1a1712] hover:bg-[#332e26] text-[#f5f1ea] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d8cfbe] text-[#5c554a] hover:bg-[#ece6da] hover:border-[#bcb09a]',
  divider: 'bg-[#e2dacc]',
  timelineLine: 'from-[#a8804f] via-[#d4c3a5]/60 to-transparent'
};

export function DugunKinetik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_KINETIK_THEME}
      renderHero={(props) => <KinetikHero {...props} topWord="DÜĞÜN" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #faf7f1 0%, #f0ebe1 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f5f1ea"
        />
      )}
    />
  );
}
