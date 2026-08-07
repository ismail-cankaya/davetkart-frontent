import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { KinetikHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaKinetik — "Kinetik Tipografi" kına yorumu: koyu bordo zemin, gül kırmızısı akış.
 */
const KINA_KINETIK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#1a0710]',
  page: 'text-[#e8d8d2]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f9ece6]',
  body: 'text-[#9d8078]',
  accent: 'text-[#dd6b7a]',
  accentBg: 'bg-[#dd6b7a]',
  accentSoft: 'bg-[#dd6b7a]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f9ece6] placeholder:text-[#9d8078] focus:outline-none focus:border-[#dd6b7a]/60 focus:ring-2 focus:ring-[#dd6b7a]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#dd6b7a] hover:bg-[#e8838f] text-[#1a0710] shadow-lg shadow-[#dd6b7a]/25',
  buttonGhost:
    'border border-white/16 text-[#e8d8d2] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#dd6b7a] via-[#e0a75c]/45 to-transparent'
};

export function KinaKinetik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_KINETIK_THEME}
      renderHero={(props) => <KinetikHero {...props} topWord="KINA GECESİ" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #2c0d18 0%, #1a0710 55%, #0d040a 100%)"
          scrim={false}
          vignette={{ strength: 0.42 }}
          atmosphere={<Halo color="221,107,122" size={60} x={50} y={45} opacity={0.16} duration={12} />}
          parallax={5}
          grain={0.03}
          fadeTo="#1a0710"
        />
      )}
    />
  );
}
