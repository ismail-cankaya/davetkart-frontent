import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MonogramHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetMonogram — "Varak Monogram" yorumu: lacivert kart üzerinde altın varak; şehzadeye yakışan bir arma. */
const SUNNET_MONOGRAM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a1634]',
  page: 'text-[#a9b3c9]',
  surface: 'bg-[#13254f]/90 backdrop-blur-sm',
  border: 'border-[#d4ab55]/25',
  heading: 'text-[#f2e8cf]',
  body: 'text-[#a9b3c9]',
  accent: 'text-[#d9b25c]',
  accentBg: 'bg-[#d9b25c]',
  accentSoft: 'bg-[#d9b25c]/10',
  input: 'w-full bg-[#13254f] border border-[#d4ab55]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#f2e8cf] placeholder:text-[#a9b3c9] focus:outline-none focus:border-[#d9b25c] focus:ring-2 focus:ring-[#d9b25c]/15 transition duration-300',
  buttonPrimary: 'bg-[#d9b25c] hover:brightness-110 text-[#0a1634] rounded-sm shadow-lg shadow-black/30',
  buttonGhost: 'border border-[#d4ab55]/40 text-[#f2e8cf] hover:bg-[#d4ab55]/10 hover:border-[#d4ab55]/70 rounded-sm',
  divider: 'bg-[#d4ab55]/20',
  timelineLine: 'from-[#d9b25c] via-[#d4ab55]/40 to-transparent',
};

export function SunnetMonogram({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_MONOGRAM_THEME}
      renderHero={(props) => (
        <MonogramHero {...props} paper="#13254f" edge="#d4ab55" foil={['#8c6a2b', '#d4ad5c', '#f8e6ad']} stock="dark" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(120% 80% at 50% 30%, #0e1d40 0%, #081330 100%)"
          scrim={false}
          vignette={{ strength: 0.3 }}
          parallax={0}
          grain={0.025}
          fadeTo="#0a1634"
        />
      )}
    />
  );
}
