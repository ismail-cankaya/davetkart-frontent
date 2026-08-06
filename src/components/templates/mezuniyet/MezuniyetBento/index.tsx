import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * MezuniyetBento — "Bento Editorial": tören programı, salon ve kontenjan bilgisi ızgarada net okunur.
 */
const MEZUNIYET_BENTO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f5f1]',
  page: 'text-[#474439]',
  surface: 'bg-white/90 backdrop-blur-sm',
  border: 'border-[#e2dfd4]',
  heading: 'text-[#1c1a14]',
  body: 'text-[#7d7a6e]',
  accent: 'text-[#8a6d2f]',
  accentBg: 'bg-[#8a6d2f]',
  accentSoft: 'bg-[#8a6d2f]/12',
  input:
    'w-full bg-white border border-[#e2dfd4] rounded-lg px-3.5 py-2.5 text-sm text-[#474439] placeholder:text-[#7d7a6e] focus:outline-none focus:border-[#8a6d2f] focus:ring-2 focus:ring-[#8a6d2f]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#1c1a14] hover:bg-[#332f26] text-[#f6f5f1] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d5d1c4] text-[#57544a] hover:bg-[#edeae0] hover:border-[#bab5a4]',
  divider: 'bg-[#e2dfd4]',
  timelineLine: 'from-[#8a6d2f] via-[#c9bfa2]/60 to-transparent'
};

export function MezuniyetBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_BENTO_THEME}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #fbfaf7 0%, #f3f1ea 55%, #eae7dd 100%)"
          scrim={false}
          vignette={false}
          atmosphere={<AuroraMesh colors={['201,191,162', '214,206,186', '190,196,180']} opacity={0.2} duration={32} />}
          parallax={6}
          grain={0.016}
          fadeTo="#f6f5f1"
        />
      )}
    />
  );
}
