import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { KinetikHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetKinetik — "Kinetik Tipografi" sünnet yorumu: kobalt zemin, mercan vurgu.
 */
const SUNNET_KINETIK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b1b3a]',
  page: 'text-[#dbe4f2]',
  surface: 'bg-white/[0.07] backdrop-blur-md',
  border: 'border-white/14',
  heading: 'text-[#eef4ff]',
  body: 'text-[#8794ab]',
  accent: 'text-[#ff7a5c]',
  accentBg: 'bg-[#ff7a5c]',
  accentSoft: 'bg-[#ff7a5c]/12',
  input:
    'w-full bg-white/[0.07] border border-white/14 rounded-lg px-3.5 py-2.5 text-sm text-[#eef4ff] placeholder:text-[#8794ab] focus:outline-none focus:border-[#ff7a5c]/60 focus:ring-2 focus:ring-[#ff7a5c]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#ff7a5c] hover:bg-[#ff9077] text-[#0b1b3a] shadow-lg shadow-[#ff7a5c]/25',
  buttonGhost:
    'border border-white/18 text-[#dbe4f2] hover:bg-white/[0.08] hover:border-white/32',
  divider: 'bg-white/14',
  timelineLine: 'from-[#ff7a5c] via-[#7fa8e0]/45 to-transparent'
};

export function SunnetKinetik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_KINETIK_THEME}
      renderHero={(props) => <KinetikHero {...props} topWord="SÜNNET" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #122c5c 0%, #0b1b3a 55%, #050d1e 100%)"
          scrim={false}
          vignette={{ strength: 0.4 }}
          atmosphere={<Halo color="255,122,92" size={58} x={50} y={45} opacity={0.14} duration={12} />}
          parallax={5}
          grain={0.028}
          fadeTo="#0b1b3a"
        />
      )}
    />
  );
}
