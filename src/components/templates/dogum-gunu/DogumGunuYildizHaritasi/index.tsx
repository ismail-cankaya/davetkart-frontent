import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuYildizHaritasi — "Yıldız Haritası" doğum günü yorumu: mor gece, şeker pembesi takımyıldız. */
const DOGUM_GUNU_YILDIZ_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0e0a18]',
  page: 'text-[#e4dcec]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f8f0fa]',
  body: 'text-[#928aa0]',
  accent: 'text-[#f0a0d0]',
  accentBg: 'bg-[#f0a0d0]',
  accentSoft: 'bg-[#f0a0d0]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f8f0fa] placeholder:text-[#928aa0] focus:outline-none focus:border-[#f0a0d0]/60 focus:ring-2 focus:ring-[#f0a0d0]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#f0a0d0] hover:bg-[#f6b8dd] text-[#16081a] shadow-lg shadow-[#f0a0d0]/25',
  buttonGhost: 'border border-white/16 text-[#e4dcec] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f0a0d0] via-[#8f7fd8]/45 to-transparent'
};

export function DogumGunuYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_YILDIZ_THEME}
      renderHero={(props) => <YildizHero {...props} star="#fff0f8" line="#f0a0d0" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #221338 0%, #120c20 55%, #07040c 100%)"
          scrim={false}
          vignette={{ strength: 0.48 }}
          atmosphere={<Halo color="240,160,208" size={54} x={50} y={34} opacity={0.16} duration={12} />}
          parallax={6}
          grain={0.028}
          fadeTo="#0e0a18"
        />
      )}
    />
  );
}
