import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalPano — "Mekanik Pano" kurumsal yorumu: terminal panosu; grafit gövde, gök mavisi vurgu. */
const KURUMSAL_PANO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b0e12]',
  page: 'text-[#d9dee3]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#eef2f5]',
  body: 'text-[#828b96]',
  accent: 'text-[#4fb0e0]',
  accentBg: 'bg-[#4fb0e0]',
  accentSoft: 'bg-[#4fb0e0]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eef2f5] placeholder:text-[#828b96] focus:outline-none focus:border-[#4fb0e0]/60 focus:ring-2 focus:ring-[#4fb0e0]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#4fb0e0] hover:bg-[#6ec2ea] text-[#04121c] shadow-lg shadow-[#4fb0e0]/25',
  buttonGhost: 'border border-white/16 text-[#d9dee3] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#4fb0e0] via-[#2f6f8c]/45 to-transparent'
};

export function KurumsalPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_PANO_THEME}
      renderHero={(props) => <PanoHero {...props} flap="#141920" ink="#eef2f5" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #151d26 0%, #0c1014 55%, #06080a 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="79,176,224" size={56} x={50} y={42} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.026}
          fadeTo="#0b0e12"
        />
      )}
    />
  );
}
