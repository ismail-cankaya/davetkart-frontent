import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PlakHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiPlak — "Vinil Plak" parti yorumu: DJ seti. Mor etiket, en hızlı dönüş.
 */
const PARTI_PLAK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#08080a]',
  page: 'text-[#ded9ea]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f4f1fb]',
  body: 'text-[#8b8598]',
  accent: 'text-[#a78bfa]',
  accentBg: 'bg-[#a78bfa]',
  accentSoft: 'bg-[#a78bfa]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f4f1fb] placeholder:text-[#8b8598] focus:outline-none focus:border-[#a78bfa]/60 focus:ring-2 focus:ring-[#a78bfa]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#a78bfa] hover:bg-[#bda4fc] text-[#0b0616] shadow-lg shadow-[#a78bfa]/25',
  buttonGhost:
    'border border-white/16 text-[#ded9ea] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#a78bfa] via-[#6d28d9]/45 to-transparent'
};

export function PartiPlak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_PLAK_THEME}
      renderHero={(props) => <PlakHero {...props} label="#6d28d9" labelInk="#f4eeff" spinDuration={30} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #1a1030 0%, #0e0a18 55%, #06050a 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="167,139,250" size={58} x={50} y={38} opacity={0.2} duration={10} />}
          parallax={7}
          grain={0.03}
          fadeTo="#08080a"
        />
      )}
    />
  );
}
