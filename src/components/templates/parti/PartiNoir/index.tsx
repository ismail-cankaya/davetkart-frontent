import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { NoirHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiNoir — "Noir Minimal": siyah kravat partisi. Neon ve konfeti yerine sessizlik — davetin kendisi lüks sinyali.
 */
const PARTI_NOIR_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#070708]',
  page: 'text-[#d8d4cc]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-[#c9a961]/16',
  heading: 'text-[#f6f3ec]',
  body: 'text-[#8b8780]',
  accent: 'text-[#c9a961]',
  accentBg: 'bg-[#c9a961]',
  accentSoft: 'bg-[#c9a961]/12',
  input:
    'w-full bg-white/[0.06] border border-[#c9a961]/16 rounded-none px-3.5 py-2.5 text-sm text-[#f6f3ec] placeholder:text-[#8b8780] focus:outline-none focus:border-[#c9a961]/60 focus:ring-2 focus:ring-[#c9a961]/15 transition-all duration-300',
  buttonPrimary:
    'rounded-none bg-[#c9a961] hover:bg-[#d8ba76] text-[#0b0a07] shadow-none',
  buttonGhost:
    'rounded-none border border-[#c9a961]/22 text-[#d8d4cc] hover:bg-[#c9a961]/8 hover:border-[#c9a961]/40',
  divider: 'bg-[#c9a961]/18',
  timelineLine: 'from-[#c9a961] via-[#c9a961]/30 to-transparent'
};

export function PartiNoir({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_NOIR_THEME}
      renderHero={(props) => <NoirHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 42%, #131211 0%, #0a0a09 55%, #050505 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="201,169,97" size={54} x={50} y={42} opacity={0.14} duration={14} />}
          parallax={8}
          grain={0.038}
          fadeTo="#070708"
        />
      )}
    />
  );
}
