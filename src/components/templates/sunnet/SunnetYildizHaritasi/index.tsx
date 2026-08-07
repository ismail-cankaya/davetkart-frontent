import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetYildizHaritasi — "Yıldız Haritası" sünnet yorumu: derin mavi gök, yeşim takımyıldız. */
const SUNNET_YILDIZ_HARITASI_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#050e18]',
  page: 'text-[#d8e2ea]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#eef4f8]',
  body: 'text-[#818e98]',
  accent: 'text-[#7fd0c0]',
  accentBg: 'bg-[#7fd0c0]',
  accentSoft: 'bg-[#7fd0c0]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eef4f8] placeholder:text-[#818e98] focus:outline-none focus:border-[#7fd0c0]/60 focus:ring-2 focus:ring-[#7fd0c0]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#7fd0c0] hover:bg-[#9adcd0] text-[#04141a] shadow-lg shadow-[#7fd0c0]/25',
  buttonGhost: 'border border-white/16 text-[#d8e2ea] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#7fd0c0] via-[#2b5fa8]/45 to-transparent'
};

export function SunnetYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_YILDIZ_HARITASI_THEME}
      renderHero={(props) => <YildizHero {...props} star="#ffffff" line="#7fd0c0" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #0d2438 0%, #06131f 55%, #03080d 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="127,208,192" size={54} x={50} y={34} opacity={0.14} duration={14} />}
          parallax={6}
          grain={0.028}
          fadeTo="#050e18"
        />
      )}
    />
  );
}
