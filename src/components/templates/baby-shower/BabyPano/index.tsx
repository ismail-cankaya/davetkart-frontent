import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * BabyPano — "Mekanik Pano" baby shower yorumu: KREM kanatlar, açık zemin.
 *
 * Panonun tek gündüz sürümü: kanatlar siyah metal değil, eski bir oyuncak
 * takvimin kartonu gibi krem. Mekanizma aynı, malzeme çocuk odasına ait.
 */
const BABY_PANO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7f5f0]',
  page: 'text-[#565247]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#e2dccc]',
  heading: 'text-[#2e2b24]',
  body: 'text-[#8a8478]',
  accent: 'text-[#a88f5f]',
  accentBg: 'bg-[#a88f5f]',
  accentSoft: 'bg-[#a88f5f]/14',
  input:
    'w-full bg-white border border-[#e2dccc] rounded-lg px-3.5 py-2.5 text-sm text-[#565247] placeholder:text-[#8a8478] focus:outline-none focus:border-[#a88f5f] focus:ring-2 focus:ring-[#a88f5f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2e2b24] hover:bg-[#464236] text-[#f7f5f0] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d9d2be] text-[#645f52] hover:bg-[#efebe0] hover:border-[#bdb49a]',
  divider: 'bg-[#e2dccc]',
  timelineLine: 'from-[#a88f5f] via-[#d8cbae]/60 to-transparent'
};

export function BabyPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_PANO_THEME}
      renderHero={(props) => <PanoHero {...props} flap="#e6dfd0" ink="#2e2b24" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfcf9 0%, #f3f0e8 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.02}
          fadeTo="#f7f5f0"
        />
      )}
    />
  );
}
