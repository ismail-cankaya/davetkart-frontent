import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiYildizHaritasi — "Yıldız Haritası" parti yorumu: mürekkep gecesi, nane takımyıldız. */
const PARTI_YILDIZ_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#06060c]',
  page: 'text-[#dcdee4]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f4f6]',
  body: 'text-[#84878f]',
  accent: 'text-[#7ff0d8]',
  accentBg: 'bg-[#7ff0d8]',
  accentSoft: 'bg-[#7ff0d8]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f4f6] placeholder:text-[#84878f] focus:outline-none focus:border-[#7ff0d8]/60 focus:ring-2 focus:ring-[#7ff0d8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#7ff0d8] hover:bg-[#9df5e4] text-[#04140f] shadow-lg shadow-[#7ff0d8]/25',
  buttonGhost: 'border border-white/16 text-[#dcdee4] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#7ff0d8] via-[#5f7fd8]/45 to-transparent'
};

export function PartiYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_YILDIZ_THEME}
      renderHero={(props) => <YildizHero {...props} star="#ffffff" line="#7ff0d8" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #0e1a24 0%, #070b12 55%, #030407 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="127,240,216" size={54} x={50} y={34} opacity={0.16} duration={12} />}
          parallax={6}
          grain={0.028}
          fadeTo="#06060c"
        />
      )}
    />
  );
}
