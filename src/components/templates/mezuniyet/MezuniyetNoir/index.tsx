import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { NoirHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * MezuniyetNoir — "Noir Minimal": akademik ağırbaşlılık. Dev serif isim, altın saç teli çizgiler.
 */
const MEZUNIYET_NOIR_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#060606]',
  page: 'text-[#d5d1c8]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-[#b08d4f]/16',
  heading: 'text-[#f5f2ea]',
  body: 'text-[#8a8579]',
  accent: 'text-[#b08d4f]',
  accentBg: 'bg-[#b08d4f]',
  accentSoft: 'bg-[#b08d4f]/12',
  input:
    'w-full bg-white/[0.06] border border-[#b08d4f]/16 rounded-none px-3.5 py-2.5 text-sm text-[#f5f2ea] placeholder:text-[#8a8579] focus:outline-none focus:border-[#b08d4f]/60 focus:ring-2 focus:ring-[#b08d4f]/15 transition-all duration-300',
  buttonPrimary:
    'rounded-none bg-[#b08d4f] hover:bg-[#c29f63] text-[#0a0806] shadow-none',
  buttonGhost:
    'rounded-none border border-[#b08d4f]/22 text-[#d5d1c8] hover:bg-[#b08d4f]/8 hover:border-[#b08d4f]/40',
  divider: 'bg-[#b08d4f]/18',
  timelineLine: 'from-[#b08d4f] via-[#b08d4f]/30 to-transparent'
};

export function MezuniyetNoir({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_NOIR_THEME}
      renderHero={(props) => <NoirHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 42%, #121110 0%, #090908 55%, #040404 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="176,141,79" size={52} x={50} y={42} opacity={0.13} duration={15} />}
          parallax={8}
          grain={0.038}
          fadeTo="#060606"
        />
      )}
    />
  );
}
