import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * BabyBento — "Bento Editorial": pastel ızgara. Bebek davetinin bilgisi (tarih, mekân, hediye listesi) hücrelerde net durur.
 */
const BABY_BENTO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7f6f2]',
  page: 'text-[#4a4842]',
  surface: 'bg-white/90 backdrop-blur-sm',
  border: 'border-[#e5e3db]',
  heading: 'text-[#1f1e1a]',
  body: 'text-[#807d75]',
  accent: 'text-[#7fa88c]',
  accentBg: 'bg-[#7fa88c]',
  accentSoft: 'bg-[#7fa88c]/12',
  input:
    'w-full bg-white border border-[#e5e3db] rounded-lg px-3.5 py-2.5 text-sm text-[#4a4842] placeholder:text-[#807d75] focus:outline-none focus:border-[#7fa88c] focus:ring-2 focus:ring-[#7fa88c]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#1f1e1a] hover:bg-[#37352f] text-[#f7f6f2] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d8d5cb] text-[#5b584f] hover:bg-[#eeece5] hover:border-[#bcb8ab]',
  divider: 'bg-[#e5e3db]',
  timelineLine: 'from-[#7fa88c] via-[#c2d3c7]/60 to-transparent'
};

export function BabyBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_BENTO_THEME}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #fcfbf9 0%, #f4f3ee 55%, #eceae2 100%)"
          scrim={false}
          vignette={false}
          atmosphere={<AuroraMesh colors={['194,211,199', '222,214,204', '206,214,224']} opacity={0.22} duration={32} />}
          parallax={6}
          grain={0.016}
          fadeTo="#f7f6f2"
        />
      )}
    />
  );
}
