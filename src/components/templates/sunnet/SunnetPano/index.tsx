import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetPano — "Mekanik Pano" sünnet yorumu: gece mavisi gövde, yeşim vurgu. */
const SUNNET_PANO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#08111c]',
  page: 'text-[#dae3ec]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#eaf2fa]',
  body: 'text-[#83909c]',
  accent: 'text-[#4fa88f]',
  accentBg: 'bg-[#4fa88f]',
  accentSoft: 'bg-[#4fa88f]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eaf2fa] placeholder:text-[#83909c] focus:outline-none focus:border-[#4fa88f]/60 focus:ring-2 focus:ring-[#4fa88f]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#4fa88f] hover:bg-[#68bda5] text-[#04140f] shadow-lg shadow-[#4fa88f]/20',
  buttonGhost: 'border border-white/16 text-[#dae3ec] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#4fa88f] via-[#2b5fa8]/45 to-transparent'
};

export function SunnetPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_PANO_THEME}
      renderHero={(props) => <PanoHero {...props} flap="#0f1b2a" ink="#eaf2fa" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #10233a 0%, #091624 55%, #050b12 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="79,168,143" size={56} x={50} y={42} opacity={0.15} duration={13} />}
          parallax={5}
          grain={0.028}
          fadeTo="#08111c"
        />
      )}
    />
  );
}
