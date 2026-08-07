import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PlakHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DugunPlak — "Vinil Plak" düğün yorumu: ilk dansın plağı. Konyak etiket, gece zemini.
 */
const DUGUN_PLAK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#131110]',
  page: 'text-[#e2dcd4]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f7f2ea]',
  body: 'text-[#948c81]',
  accent: 'text-[#c98a5e]',
  accentBg: 'bg-[#c98a5e]',
  accentSoft: 'bg-[#c98a5e]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f7f2ea] placeholder:text-[#948c81] focus:outline-none focus:border-[#c98a5e]/60 focus:ring-2 focus:ring-[#c98a5e]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#c98a5e] hover:bg-[#d99e75] text-[#171310] shadow-lg shadow-[#c98a5e]/25',
  buttonGhost:
    'border border-white/16 text-[#e2dcd4] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#c98a5e] via-[#8a5a3c]/45 to-transparent'
};

export function DugunPlak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_PLAK_THEME}
      renderHero={(props) => <PlakHero {...props} label="#8a5a3c" labelInk="#fdf3e6" spinDuration={50} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #241d18 0%, #17130f 55%, #0c0a08 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="201,138,94" size={58} x={50} y={38} opacity={0.16} duration={13} />}
          parallax={6}
          grain={0.03}
          fadeTo="#131110"
        />
      )}
    />
  );
}
