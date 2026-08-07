import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { RisoHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DugunRiso — "Risograph Poster" düğün yorumu: fildişi kağıt, riso pembesi ve adaçayı yeşili iki mürekkep.
 *
 * Düğün dilinde altın/bordo yerleşiktir; buradaki pembe-yeşil ikilisi
 * bilinçli olarak matbaa mantığından geliyor — iki spot mürekkep, degrade yok.
 */
const DUGUN_RISO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7f3ea]',
  page: 'text-[#3b352c]',
  surface: 'bg-white/85',
  border: 'border-[#1b1712]/15',
  heading: 'text-[#1b1712]',
  body: 'text-[#6c655a]',
  accent: 'text-[#d9536f]',
  accentBg: 'bg-[#d9536f]',
  accentSoft: 'bg-[#5f7f57]/25',
  input:
    'w-full bg-white border border-[#1b1712]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#3b352c] placeholder:text-[#6c655a] focus:outline-none focus:border-[#d9536f] focus:ring-2 focus:ring-[#d9536f]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#1b1712] hover:bg-[#3b352c] text-[#f7f3ea] shadow-none',
  buttonGhost:
    'border-2 border-[#1b1712] text-[#1b1712] hover:bg-[#1b1712] hover:text-[#f7f3ea]',
  divider: 'bg-[#1b1712]/15',
  timelineLine: 'from-[#d9536f] via-[#5f7f57]/50 to-transparent'
};

export function DugunRiso({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_RISO_THEME}
      renderHero={(props) => <RisoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbf8f1 0%, #f2ecdf 100%)"
          scrim={false}
          vignette={false}
          parallax={5}
          grain={0.03}
          fadeTo="#f7f3ea"
        />
      )}
    />
  );
}
