import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetBrutal — "Brutal" yorumu: töreni pastel değil yüksek kontrastlı grafik dille kutlayan yorum. */
const SUNNET_BRUTAL_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#e9f3f5]',
  page: 'text-[#5f7078]',
  surface: 'bg-[#fbfeff]',
  border: 'border-[#0a1418]/20',
  heading: 'text-[#0a1418]',
  body: 'text-[#5f7078]',
  accent: 'text-[#0d8f7a]',
  accentBg: 'bg-[#0d8f7a]',
  accentSoft: 'bg-[#0d8f7a]/12',
  input: 'w-full bg-[#fbfeff] border-2 border-[#0a1418] rounded-none px-3.5 py-2.5 text-sm text-[#0a1418] placeholder:text-[#5f7078] focus:outline-none focus:border-[#0d8f7a] focus:ring-0 transition-colors duration-200',
  buttonPrimary: 'bg-[#0d8f7a] hover:brightness-110 text-[#eafff9] border-2 border-[#0a1418] rounded-none font-black uppercase tracking-wide shadow-[4px_4px_0_0_#0a1418]',
  buttonGhost: 'bg-[#fbfeff] border-2 border-[#0a1418] text-[#0a1418] rounded-none font-black uppercase tracking-wide hover:bg-[#f7b32b] hover:text-[#0a1418]',
  divider: 'bg-[#0a1418]/20',
  timelineLine: 'from-[#0d8f7a] via-[#0d8f7a]/40 to-transparent',
};

export function SunnetBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_BRUTAL_THEME}
      renderHero={(props) => (
        <BrutalHero
          {...props}
          ink="#0a1418"
          accent="#0d8f7a"
          accent2="#f7b32b"
          onAccent="#eafff9"
          onAccent2="#0a1418"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="#e9f3f5"
          scrim={false}
          vignette={false}
          parallax={0}
          grain={0.018}
          fadeTo="#e9f3f5"
        />
      )}
    />
  );
}
