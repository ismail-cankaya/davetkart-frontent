import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalMermer — "Mermer & Rölyef" kurumsal yorumu: yazının grafit taşa
 * oyulduğu yüzey; damarlar platin. Gala dilinde: serif başlık korunur.
 */
const KURUMSAL_MERMER_THEME = kurumsalTheme(
  {
    id: 'midnight',
    base: 'bg-[#0E1013]',
    page: 'text-[#D8DBDF]',
    surface: 'bg-[#171A1F]/85 backdrop-blur-md',
    border: 'border-white/12',
    heading: 'text-[#F3F4F1]',
    body: 'text-[#A0A6AE]',
    accent: 'text-[#C5CBD3]',
    accentBg: 'bg-[#C5CBD3]',
    accentSoft: 'bg-[#C5CBD3]/12',
    input:
      'w-full bg-white/[0.05] border border-white/14 px-3.5 py-2.5 text-sm text-[#F3F4F1] placeholder:text-[#8A9099] focus:outline-none focus:border-[#C5CBD3]/70 focus:ring-2 focus:ring-[#C5CBD3]/15 transition duration-300',
    buttonPrimary: 'bg-[#C5CBD3] hover:bg-[#DDE1E6] text-[#0E1013] shadow-[0_12px_30px_-14px_rgba(197,203,211,0.45)]',
    buttonGhost: 'border border-white/16 text-[#D8DBDF] hover:bg-white/[0.06] hover:border-white/30',
    divider: 'bg-white/12',
    timelineLine: 'from-[#C5CBD3] via-[#C5CBD3]/35 to-transparent'
  },
  { type: 'serif' }
);

export function KurumsalMermer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_MERMER_THEME}
      renderHero={(props) => (
        <MermerHero
          {...props}
          slab="linear-gradient(150deg, #1B1E23 0%, #121418 45%, #0B0C0F 100%)"
          vein="#9AA3AE"
          polish="dark"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #1A1D22 0%, #0E1013 55%, #0E1013 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          parallax={5}
          grain={0.03}
          fadeTo="#0E1013"
        />
      )}
    />
  );
}
