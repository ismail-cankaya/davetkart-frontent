import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PlakHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaPlak — "Vinil Plak" kına yorumu: türkülerin plağı. Kızıl etiket, koyu bordo zemin.
 */
const KINA_PLAK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#170a0c]',
  page: 'text-[#e9d8d4]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#faeee9]',
  body: 'text-[#9b8480]',
  accent: 'text-[#e08a72]',
  accentBg: 'bg-[#e08a72]',
  accentSoft: 'bg-[#e08a72]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#faeee9] placeholder:text-[#9b8480] focus:outline-none focus:border-[#e08a72]/60 focus:ring-2 focus:ring-[#e08a72]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#e08a72] hover:bg-[#eda189] text-[#1a0b0c] shadow-lg shadow-[#e08a72]/25',
  buttonGhost:
    'border border-white/16 text-[#e9d8d4] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#e08a72] via-[#b8323f]/45 to-transparent'
};

export function KinaPlak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_PLAK_THEME}
      renderHero={(props) => <PlakHero {...props} label="#b8323f" labelInk="#fdf1e8" spinDuration={44} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #2e1216 0%, #1c0b0e 55%, #0d0507 100%)"
          scrim={false}
          vignette={{ strength: 0.52 }}
          atmosphere={<Halo color="224,138,114" size={58} x={50} y={38} opacity={0.18} duration={12} />}
          parallax={6}
          grain={0.03}
          fadeTo="#170a0c"
        />
      )}
    />
  );
}
