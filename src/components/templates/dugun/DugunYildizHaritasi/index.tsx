import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunYildizHaritasi — "Yıldız Haritası" düğün yorumu: gece laciverti gök, şampanya takımyıldız. */
const DUGUN_YILDIZ_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a0c16]',
  page: 'text-[#dcdce8]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f6f2ea]',
  body: 'text-[#8b8b9c]',
  accent: 'text-[#f0d6a8]',
  accentBg: 'bg-[#f0d6a8]',
  accentSoft: 'bg-[#f0d6a8]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f6f2ea] placeholder:text-[#8b8b9c] focus:outline-none focus:border-[#f0d6a8]/60 focus:ring-2 focus:ring-[#f0d6a8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#f0d6a8] hover:bg-[#f7e4c4] text-[#0f1018] shadow-lg shadow-[#f0d6a8]/20',
  buttonGhost: 'border border-white/16 text-[#dcdce8] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f0d6a8] via-[#8f8fb8]/45 to-transparent'
};

export function DugunYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_YILDIZ_THEME}
      renderHero={(props) => <YildizHero {...props} star="#ffffff" line="#f0d6a8" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #14182c 0%, #0b0e1a 55%, #05060c 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="240,214,168" size={54} x={50} y={34} opacity={0.14} duration={14} />}
          parallax={6}
          grain={0.028}
          fadeTo="#0a0c16"
        />
      )}
    />
  );
}
