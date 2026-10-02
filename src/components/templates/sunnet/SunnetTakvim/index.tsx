import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { TakvimHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetTakvim — "Takvim" yorumu: buz mavisi yaprak, gümüş spiral ve altın daire. */
const SUNNET_TAKVIM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#e9f0f5]',
  page: 'text-[#5d6f84]',
  surface: 'bg-[#f8fbfd]/90 backdrop-blur-sm',
  border: 'border-[#93a4b8]/25',
  heading: 'text-[#142a4f]',
  body: 'text-[#5d6f84]',
  accent: 'text-[#b0821c]',
  accentBg: 'bg-[#142a4f]',
  accentSoft: 'bg-[#b0821c]/10',
  input: 'w-full bg-[#f8fbfd] border border-[#93a4b8]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#142a4f] placeholder:text-[#5d6f84] focus:outline-none focus:border-[#b0821c] focus:ring-2 focus:ring-[#b0821c]/15 transition duration-300',
  buttonPrimary: 'bg-[#142a4f] hover:brightness-125 text-[#f8fbfd] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#93a4b8]/40 text-[#142a4f] hover:bg-[#93a4b8]/10 hover:border-[#93a4b8]/70 rounded-sm',
  divider: 'bg-[#93a4b8]/20',
  timelineLine: 'from-[#b0821c] via-[#93a4b8]/40 to-transparent',
};

export function SunnetTakvim({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_TAKVIM_THEME}
      renderHero={(props) => (
        <TakvimHero {...props} paper="#f8fbfd" ink="#b8861c" metal="#9fb2c7" note="#dcecf7" noteInk="#142a4f" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(110% 70% at 50% 25%, #eef4f8 0%, #dbe5ee 100%)"
          scrim={false}
          vignette={{ strength: 0.15 }}
          parallax={0}
          grain={0.03}
          fadeTo="#e9f0f5"
        />
      )}
    />
  );
}
