import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanPano — "Mekanik Pano" nişan yorumu: gece grisi gövde, buz mavisi vurgu. */
const NISAN_PANO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0c0f14]',
  page: 'text-[#dbe0e8]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#eef2f8]',
  body: 'text-[#868e9c]',
  accent: 'text-[#9fb8d8]',
  accentBg: 'bg-[#9fb8d8]',
  accentSoft: 'bg-[#9fb8d8]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eef2f8] placeholder:text-[#868e9c] focus:outline-none focus:border-[#9fb8d8]/60 focus:ring-2 focus:ring-[#9fb8d8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#9fb8d8] hover:bg-[#b6cae6] text-[#0c0f14] shadow-lg shadow-[#9fb8d8]/20',
  buttonGhost: 'border border-white/16 text-[#dbe0e8] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#9fb8d8] via-[#4f6a8c]/45 to-transparent'
};

export function NisanPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_PANO_THEME}
      renderHero={(props) => <PanoHero {...props} flap="#151a22" ink="#eef2f8" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #171d27 0%, #0d1117 55%, #06080b 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="159,184,216" size={56} x={50} y={42} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.026}
          fadeTo="#0c0f14"
        />
      )}
    />
  );
}
