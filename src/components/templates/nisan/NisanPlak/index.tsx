import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PlakHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * NisanPlak — "Vinil Plak" nişan yorumu: gece mavisi etiket, çelik gri zemin.
 */
const NISAN_PLAK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0d1016]',
  page: 'text-[#dbe0e8]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f5fa]',
  body: 'text-[#868e9c]',
  accent: 'text-[#8aa8d8]',
  accentBg: 'bg-[#8aa8d8]',
  accentSoft: 'bg-[#8aa8d8]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f5fa] placeholder:text-[#868e9c] focus:outline-none focus:border-[#8aa8d8]/60 focus:ring-2 focus:ring-[#8aa8d8]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#8aa8d8] hover:bg-[#a2bce6] text-[#0d1016] shadow-lg shadow-[#8aa8d8]/25',
  buttonGhost:
    'border border-white/16 text-[#dbe0e8] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#8aa8d8] via-[#3a5a8c]/45 to-transparent'
};

export function NisanPlak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_PLAK_THEME}
      renderHero={(props) => <PlakHero {...props} label="#3a5a8c" labelInk="#f0f5fd" spinDuration={48} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #1a2130 0%, #101420 55%, #07090e 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="138,168,216" size={58} x={50} y={38} opacity={0.16} duration={13} />}
          parallax={6}
          grain={0.03}
          fadeTo="#0d1016"
        />
      )}
    />
  );
}
