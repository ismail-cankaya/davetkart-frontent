import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MonogramHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalMonogram — "Varak Monogram" yorumu: açık gri kart, platin varak ve antrasit boyalı kenar. */
const KURUMSAL_MONOGRAM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#eaedf0]',
  page: 'text-[#66707a]',
  surface: 'bg-[#f7f8f9]/90 backdrop-blur-sm',
  border: 'border-[#8f9aa5]/25',
  heading: 'text-[#1e2833]',
  body: 'text-[#66707a]',
  accent: 'text-[#4d5d6c]',
  accentBg: 'bg-[#1e2833]',
  accentSoft: 'bg-[#4d5d6c]/10',
  input: 'w-full bg-[#f7f8f9] border border-[#8f9aa5]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#1e2833] placeholder:text-[#66707a] focus:outline-none focus:border-[#4d5d6c] focus:ring-2 focus:ring-[#4d5d6c]/15 transition duration-300',
  buttonPrimary: 'bg-[#1e2833] hover:brightness-125 text-[#f7f8f9] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#8f9aa5]/40 text-[#1e2833] hover:bg-[#8f9aa5]/10 hover:border-[#8f9aa5]/70 rounded-sm',
  divider: 'bg-[#8f9aa5]/20',
  timelineLine: 'from-[#4d5d6c] via-[#8f9aa5]/40 to-transparent',
};

export function KurumsalMonogram({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_MONOGRAM_THEME}
      renderHero={(props) => (
        <MonogramHero {...props} paper="#f7f8f9" edge="#2a3642" foil={['#4b5560', '#97a1ac', '#e4e8ec']} stock="light" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(120% 80% at 50% 30%, #eef0f2 0%, #dde1e5 100%)"
          scrim={false}
          vignette={{ strength: 0.18 }}
          parallax={0}
          grain={0.025}
          fadeTo="#eaedf0"
        />
      )}
    />
  );
}
