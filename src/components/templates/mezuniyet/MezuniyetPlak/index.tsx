import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PlakHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * MezuniyetPlak — "Vinil Plak" mezuniyet yorumu: okul yıllarının albümü. Orman yeşili etiket.
 */
const MEZUNIYET_PLAK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0e1016]',
  page: 'text-[#dde1e4]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f5f6]',
  body: 'text-[#878e92]',
  accent: 'text-[#7cbfa4]',
  accentBg: 'bg-[#7cbfa4]',
  accentSoft: 'bg-[#7cbfa4]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f5f6] placeholder:text-[#878e92] focus:outline-none focus:border-[#7cbfa4]/60 focus:ring-2 focus:ring-[#7cbfa4]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#7cbfa4] hover:bg-[#95d0b8] text-[#0b1512] shadow-lg shadow-[#7cbfa4]/25',
  buttonGhost:
    'border border-white/16 text-[#dde1e4] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#7cbfa4] via-[#2f5f4f]/45 to-transparent'
};

export function MezuniyetPlak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_PLAK_THEME}
      renderHero={(props) => <PlakHero {...props} label="#2f5f4f" labelInk="#eef7f2" spinDuration={48} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #182024 0%, #101418 55%, #07090c 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="124,191,164" size={56} x={50} y={38} opacity={0.15} duration={13} />}
          parallax={6}
          grain={0.03}
          fadeTo="#0e1016"
        />
      )}
    />
  );
}
