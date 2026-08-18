import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MermerHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiMermer — "Mermer & Rölyef" parti yorumu: yazının taşa oyulduğu yüzey. */
const PARTI_MERMER_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0d0d0f]',
  page: 'text-[#dcdce0]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f2f4]',
  body: 'text-[#8a8a92]',
  accent: 'text-[#d8c08f]',
  accentBg: 'bg-[#d8c08f]',
  accentSoft: 'bg-[#d8c08f]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f2f4] placeholder:text-[#8a8a92] focus:outline-none focus:border-[#d8c08f]/60 focus:ring-2 focus:ring-[#d8c08f]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#d8c08f] hover:brightness-110 text-[#0d0d0f] shadow-lg shadow-[#d8c08f]/25',
  buttonGhost: 'border border-white/16 text-[#dcdce0] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#d8c08f] via-[#d8c08f]/40 to-transparent',
};

export function PartiMermer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_MERMER_THEME}
      renderHero={(props) => (
        <MermerHero
          {...props}
          slab="linear-gradient(150deg, #1b1b1f 0%, #121215 45%, #0b0b0d 100%)"
          vein="#9fa0a8"
          polish="dark"
          seed={11}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #1a1a1e 0%, #0d0d10 55%, #0d0d0f 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          parallax={5}
          grain={0.03}
          fadeTo="#0d0d0f"
        />
      )}
    />
  );
}
