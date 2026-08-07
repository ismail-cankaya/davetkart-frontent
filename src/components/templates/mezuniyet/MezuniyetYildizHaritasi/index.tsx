import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetYildizHaritasi — "Yıldız Haritası" mezuniyet yorumu: rasathane gecesi, altın takımyıldız. */
const MEZUNIYET_YILDIZ_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#060a14]',
  page: 'text-[#d9dee8]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f4f8]',
  body: 'text-[#838a97]',
  accent: 'text-[#d8c890]',
  accentBg: 'bg-[#d8c890]',
  accentSoft: 'bg-[#d8c890]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f4f8] placeholder:text-[#838a97] focus:outline-none focus:border-[#d8c890]/60 focus:ring-2 focus:ring-[#d8c890]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#d8c890] hover:bg-[#e5d8ae] text-[#0b0e16] shadow-lg shadow-[#d8c890]/20',
  buttonGhost: 'border border-white/16 text-[#d9dee8] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#d8c890] via-[#5f7f9f]/45 to-transparent'
};

export function MezuniyetYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_YILDIZ_THEME}
      renderHero={(props) => <YildizHero {...props} star="#ffffff" line="#d8c890" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #10182c 0%, #080d18 55%, #03050a 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="216,200,144" size={54} x={50} y={34} opacity={0.14} duration={14} />}
          parallax={6}
          grain={0.026}
          fadeTo="#060a14"
        />
      )}
    />
  );
}
