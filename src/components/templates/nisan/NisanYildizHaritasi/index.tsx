import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanYildizHaritasi — "Yıldız Haritası" nişan yorumu: safir gece, buz mavisi takımyıldız. */
const NISAN_YILDIZ_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#080c18]',
  page: 'text-[#dae0ec]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f0f4fc]',
  body: 'text-[#848da0]',
  accent: 'text-[#a8c0f0]',
  accentBg: 'bg-[#a8c0f0]',
  accentSoft: 'bg-[#a8c0f0]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f0f4fc] placeholder:text-[#848da0] focus:outline-none focus:border-[#a8c0f0]/60 focus:ring-2 focus:ring-[#a8c0f0]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#a8c0f0] hover:bg-[#bed1f6] text-[#080c18] shadow-lg shadow-[#a8c0f0]/20',
  buttonGhost: 'border border-white/16 text-[#dae0ec] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#a8c0f0] via-[#5f6f9f]/45 to-transparent'
};

export function NisanYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_YILDIZ_THEME}
      renderHero={(props) => <YildizHero {...props} star="#ffffff" line="#a8c0f0" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #131c34 0%, #0a0f1e 55%, #04060c 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="168,192,240" size={54} x={50} y={34} opacity={0.14} duration={14} />}
          parallax={6}
          grain={0.026}
          fadeTo="#080c18"
        />
      )}
    />
  );
}
