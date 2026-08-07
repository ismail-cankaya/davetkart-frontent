import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaYildizHaritasi — "Yıldız Haritası" kına yorumu: bordo gece, bakır takımyıldız. */
const KINA_YILDIZ_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#12060e]',
  page: 'text-[#e7d8d6]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#fbeee8]',
  body: 'text-[#998184]',
  accent: 'text-[#e0a878]',
  accentBg: 'bg-[#e0a878]',
  accentSoft: 'bg-[#e0a878]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#fbeee8] placeholder:text-[#998184] focus:outline-none focus:border-[#e0a878]/60 focus:ring-2 focus:ring-[#e0a878]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#e0a878] hover:bg-[#ebbd95] text-[#180a10] shadow-lg shadow-[#e0a878]/25',
  buttonGhost: 'border border-white/16 text-[#e7d8d6] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#e0a878] via-[#a03f52]/45 to-transparent'
};

export function KinaYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_YILDIZ_THEME}
      renderHero={(props) => <YildizHero {...props} star="#ffe8d8" line="#e0785f" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #2a0f1c 0%, #170811 55%, #0a0408 100%)"
          scrim={false}
          vignette={{ strength: 0.52 }}
          atmosphere={<Halo color="224,168,120" size={54} x={50} y={34} opacity={0.15} duration={13} />}
          parallax={6}
          grain={0.028}
          fadeTo="#12060e"
        />
      )}
    />
  );
}
