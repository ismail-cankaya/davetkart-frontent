import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PaperHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * BabyKagit — "Kağıt & Mühür": doğum duyurusu geleneği — deckle kenarlı kart, kabartma yazı, mühür.
 */
const BABY_KAGIT_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f1ea]',
  page: 'text-[#57503f]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#ddd6c6]',
  heading: 'text-[#2b2618]',
  body: 'text-[#867f6c]',
  accent: 'text-[#3f6b57]',
  accentBg: 'bg-[#3f6b57]',
  accentSoft: 'bg-[#3f6b57]/12',
  input:
    'w-full bg-white border border-[#ddd6c6] rounded-lg px-3.5 py-2.5 text-sm text-[#57503f] placeholder:text-[#867f6c] focus:outline-none focus:border-[#3f6b57] focus:ring-2 focus:ring-[#3f6b57]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#2b2618] hover:bg-[#443d29] text-[#f8f5ef] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d2cab6] text-[#67604e] hover:bg-[#ece7db] hover:border-[#b6ac93]',
  divider: 'bg-[#ddd6c6]',
  timelineLine: 'from-[#3f6b57] via-[#b9c9bd]/60 to-transparent'
};

export function BabyKagit({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_KAGIT_THEME}
      renderHero={(props) => <PaperHero {...props} sealColor="#3f6b57" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 40%, #f2eee4 0%, #e8e2d3 55%, #dcd4c1 100%)"
          scrim={false}
          vignette={false}
          parallax={6}
          grain={0.02}
          fadeTo="#f4f1ea"
        />
      )}
    />
  );
}
