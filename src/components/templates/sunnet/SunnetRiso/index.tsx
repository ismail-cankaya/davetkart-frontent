import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { RisoHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetRiso — "Risograph Poster" sünnet yorumu: elektrik mavisi ve sarı mürekkep.
 */
const SUNNET_RISO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f3ea]',
  page: 'text-[#35332c]',
  surface: 'bg-white/85',
  border: 'border-[#181712]/15',
  heading: 'text-[#181712]',
  body: 'text-[#67655c]',
  accent: 'text-[#1c5fe0]',
  accentBg: 'bg-[#1c5fe0]',
  accentSoft: 'bg-[#ffc93c]/35',
  input:
    'w-full bg-white/85 border border-[#181712]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#35332c] placeholder:text-[#96948a] focus:outline-none focus:border-[#1c5fe0] focus:ring-2 focus:ring-[#1c5fe0]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#181712] hover:bg-[#35332c] text-[#f5f3ea] shadow-none',
  buttonGhost:
    'border-2 border-[#181712] text-[#181712] hover:bg-[#181712] hover:text-[#f5f3ea]',
  divider: 'bg-[#181712]/15',
  timelineLine: 'from-[#1c5fe0] via-[#ffc93c]/60 to-transparent'
};

export function SunnetRiso({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_RISO_THEME}
      renderHero={(props) => <RisoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #f8f6ee 0%, #f0ede2 100%)"
          scrim={false}
          vignette={false}
          parallax={5}
          grain={0.03}
          fadeTo="#f5f3ea"
        />
      )}
    />
  );
}
