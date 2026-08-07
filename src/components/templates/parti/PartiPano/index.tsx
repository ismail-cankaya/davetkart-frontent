import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiPano — "Mekanik Pano" parti yorumu: mürekkep siyahı kanatlar, nane yeşili vurgu. */
const PARTI_PANO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#08080a]',
  page: 'text-[#dcdedb]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f2ef]',
  body: 'text-[#87877f]',
  accent: 'text-[#4fe0a0]',
  accentBg: 'bg-[#4fe0a0]',
  accentSoft: 'bg-[#4fe0a0]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f2ef] placeholder:text-[#87877f] focus:outline-none focus:border-[#4fe0a0]/60 focus:ring-2 focus:ring-[#4fe0a0]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#4fe0a0] hover:bg-[#71e9b5] text-[#04140c] shadow-lg shadow-[#4fe0a0]/25',
  buttonGhost: 'border border-white/16 text-[#dcdedb] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#4fe0a0] via-[#4fb0e0]/45 to-transparent'
};

export function PartiPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_PANO_THEME}
      renderHero={(props) => <PanoHero {...props} flap="#141416" ink="#f2f2ef" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #121815 0%, #0a0c0b 55%, #060606 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="79,224,160" size={56} x={50} y={42} opacity={0.15} duration={11} />}
          parallax={5}
          grain={0.028}
          fadeTo="#08080a"
        />
      )}
    />
  );
}
