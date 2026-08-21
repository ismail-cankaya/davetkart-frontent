import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyBrutal — "Brutal" yorumu: bebek pastelini grafik posterin netliğiyle buluşturan yorum. */
const BABY_BRUTAL_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#edf5f3]',
  page: 'text-[#667571]',
  surface: 'bg-[#fcfffe]',
  border: 'border-[#0d1513]/20',
  heading: 'text-[#0d1513]',
  body: 'text-[#667571]',
  accent: 'text-[#2f9ad9]',
  accentBg: 'bg-[#2f9ad9]',
  accentSoft: 'bg-[#2f9ad9]/12',
  input: 'w-full bg-[#fcfffe] border-2 border-[#0d1513] rounded-none px-3.5 py-2.5 text-sm text-[#0d1513] placeholder:text-[#667571] focus:outline-none focus:border-[#2f9ad9] focus:ring-0 transition-colors duration-200',
  buttonPrimary: 'bg-[#2f9ad9] hover:brightness-110 text-[#eef9ff] border-2 border-[#0d1513] rounded-none font-black uppercase tracking-wide shadow-[4px_4px_0_0_#0d1513]',
  buttonGhost: 'bg-[#fcfffe] border-2 border-[#0d1513] text-[#0d1513] rounded-none font-black uppercase tracking-wide hover:bg-[#ffb0b0] hover:text-[#0d1513]',
  divider: 'bg-[#0d1513]/20',
  timelineLine: 'from-[#2f9ad9] via-[#2f9ad9]/40 to-transparent',
};

export function BabyBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_BRUTAL_THEME}
      renderHero={(props) => (
        <BrutalHero
          {...props}
          ink="#0d1513"
          accent="#2f9ad9"
          accent2="#ffb0b0"
          onAccent="#eef9ff"
          onAccent2="#0d1513"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="#edf5f3"
          scrim={false}
          vignette={false}
          parallax={0}
          grain={0.018}
          fadeTo="#edf5f3"
        />
      )}
    />
  );
}
