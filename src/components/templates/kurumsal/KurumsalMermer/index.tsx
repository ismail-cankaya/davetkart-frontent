import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalMermer — "Mermer & Rölyef" kurumsal yorumu: yazının taşa oyulduğu yüzey. */
const KURUMSAL_MERMER_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0c0e10]',
  page: 'text-[#d8dcde]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#eef1f3]',
  body: 'text-[#848d92]',
  accent: 'text-[#6fb0c8]',
  accentBg: 'bg-[#6fb0c8]',
  accentSoft: 'bg-[#6fb0c8]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eef1f3] placeholder:text-[#848d92] focus:outline-none focus:border-[#6fb0c8]/60 focus:ring-2 focus:ring-[#6fb0c8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#6fb0c8] hover:brightness-110 text-[#0c0e10] shadow-lg shadow-[#6fb0c8]/25',
  buttonGhost: 'border border-white/16 text-[#d8dcde] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#6fb0c8] via-[#6fb0c8]/40 to-transparent',
};

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
          slab="linear-gradient(150deg, #191c1f 0%, #111315 45%, #0a0b0c 100%)"
          vein="#93a0a8"
          polish="dark"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #181c1f 0%, #0c0e10 55%, #0c0e10 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          parallax={5}
          grain={0.03}
          fadeTo="#0c0e10"
        />
      )}
    />
  );
}
