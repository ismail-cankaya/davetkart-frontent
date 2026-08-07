import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuPano — "Mekanik Pano" doğum günü yorumu: kömür gövde, kehribar vurgu. */
const DOGUM_GUNU_PANO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#100e12]',
  page: 'text-[#e5e0e4]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f7f2f5]',
  body: 'text-[#8f8a8e]',
  accent: 'text-[#f5b04f]',
  accentBg: 'bg-[#f5b04f]',
  accentSoft: 'bg-[#f5b04f]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f7f2f5] placeholder:text-[#8f8a8e] focus:outline-none focus:border-[#f5b04f]/60 focus:ring-2 focus:ring-[#f5b04f]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#f5b04f] hover:bg-[#f9c274] text-[#171104] shadow-lg shadow-[#f5b04f]/25',
  buttonGhost: 'border border-white/16 text-[#e5e0e4] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f5b04f] via-[#e0607f]/45 to-transparent'
};

export function DogumGunuPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_PANO_THEME}
      renderHero={(props) => <PanoHero {...props} flap="#1a171d" ink="#f7f2f5" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #1d1a20 0%, #121016 55%, #08070a 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="245,176,79" size={56} x={50} y={42} opacity={0.15} duration={12} />}
          parallax={5}
          grain={0.028}
          fadeTo="#100e12"
        />
      )}
    />
  );
}
