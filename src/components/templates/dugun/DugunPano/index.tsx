import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunPano — "Mekanik Pano" düğün yorumu: sıcak grafit kanatlar, şampanya vurgu. */
const DUGUN_PANO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#12100e]',
  page: 'text-[#e0d9cd]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f7f2e8]',
  body: 'text-[#948c80]',
  accent: 'text-[#d8b98a]',
  accentBg: 'bg-[#d8b98a]',
  accentSoft: 'bg-[#d8b98a]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f7f2e8] placeholder:text-[#948c80] focus:outline-none focus:border-[#d8b98a]/60 focus:ring-2 focus:ring-[#d8b98a]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#d8b98a] hover:bg-[#e6cda6] text-[#17130e] shadow-lg shadow-[#d8b98a]/20',
  buttonGhost: 'border border-white/16 text-[#e0d9cd] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#d8b98a] via-[#8a7a5f]/45 to-transparent'
};

export function DugunPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_PANO_THEME}
      renderHero={(props) => <PanoHero {...props} flap="#1b1815" ink="#f3ede2" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #1e1a16 0%, #13100d 55%, #0a0807 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="216,185,138" size={56} x={50} y={42} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.028}
          fadeTo="#12100e"
        />
      )}
    />
  );
}
