import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PlakHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetPlak — "Vinil Plak" sünnet yorumu: kehribar etiket, gece mavisi zemin.
 */
const SUNNET_PLAK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a1420]',
  page: 'text-[#dbe3ea]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f0f5fa]',
  body: 'text-[#83909c]',
  accent: 'text-[#e0a05c]',
  accentBg: 'bg-[#e0a05c]',
  accentSoft: 'bg-[#e0a05c]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f0f5fa] placeholder:text-[#83909c] focus:outline-none focus:border-[#e0a05c]/60 focus:ring-2 focus:ring-[#e0a05c]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#e0a05c] hover:bg-[#ebb478] text-[#12080a] shadow-lg shadow-[#e0a05c]/25',
  buttonGhost:
    'border border-white/16 text-[#dbe3ea] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#e0a05c] via-[#c47a2f]/45 to-transparent'
};

export function SunnetPlak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_PLAK_THEME}
      renderHero={(props) => <PlakHero {...props} label="#c47a2f" labelInk="#fdf3e4" spinDuration={46} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #14273a 0%, #0c1826 55%, #060b12 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="224,160,92" size={58} x={50} y={38} opacity={0.16} duration={12} />}
          parallax={6}
          grain={0.03}
          fadeTo="#0a1420"
        />
      )}
    />
  );
}
