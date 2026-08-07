import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyYildizHaritasi — "Yıldız Haritası" baby shower yorumu: çocuk odasının gece lambası; yumuşak lacivert. */
const BABY_YILDIZ_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0c1020]',
  page: 'text-[#dbe1ee]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f5fc]',
  body: 'text-[#868ea2]',
  accent: 'text-[#c8d8f0]',
  accentBg: 'bg-[#c8d8f0]',
  accentSoft: 'bg-[#c8d8f0]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f5fc] placeholder:text-[#868ea2] focus:outline-none focus:border-[#c8d8f0]/60 focus:ring-2 focus:ring-[#c8d8f0]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#c8d8f0] hover:bg-[#dae5f6] text-[#0c1020] shadow-lg shadow-[#c8d8f0]/20',
  buttonGhost: 'border border-white/16 text-[#dbe1ee] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#c8d8f0] via-[#8f9fc8]/45 to-transparent'
};

export function BabyYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_YILDIZ_THEME}
      renderHero={(props) => <YildizHero {...props} star="#ffffff" line="#c8d8f0" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #172140 0%, #0d1226 55%, #06080f 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="200,216,240" size={54} x={50} y={34} opacity={0.16} duration={15} />}
          parallax={6}
          grain={0.024}
          fadeTo="#0c1020"
        />
      )}
    />
  );
}
