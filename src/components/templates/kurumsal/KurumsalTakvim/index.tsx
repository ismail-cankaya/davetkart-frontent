import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { TakvimHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalTakvim — "Takvim" yorumu: sade bir ofis takvimi: antrasit spiral ve petrol mavisi işaret. */
const KURUMSAL_TAKVIM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#e9edf0]',
  page: 'text-[#5f6b76]',
  surface: 'bg-[#f8f9fa]/90 backdrop-blur-sm',
  border: 'border-[#98a4ae]/25',
  heading: 'text-[#1c2833]',
  body: 'text-[#5f6b76]',
  accent: 'text-[#1f6f8b]',
  accentBg: 'bg-[#1c2833]',
  accentSoft: 'bg-[#1f6f8b]/10',
  input: 'w-full bg-[#f8f9fa] border border-[#98a4ae]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#1c2833] placeholder:text-[#5f6b76] focus:outline-none focus:border-[#1f6f8b] focus:ring-2 focus:ring-[#1f6f8b]/15 transition duration-300',
  buttonPrimary: 'bg-[#1c2833] hover:brightness-125 text-[#f8f9fa] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#98a4ae]/40 text-[#1c2833] hover:bg-[#98a4ae]/10 hover:border-[#98a4ae]/70 rounded-sm',
  divider: 'bg-[#98a4ae]/20',
  timelineLine: 'from-[#1f6f8b] via-[#98a4ae]/40 to-transparent',
};

export function KurumsalTakvim({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_TAKVIM_THEME}
      renderHero={(props) => (
        <TakvimHero {...props} paper="#f8f9fa" ink="#1f6f8b" metal="#4a5866" note="#e3edf2" noteInk="#1c2833" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(110% 70% at 50% 25%, #eff2f4 0%, #dde3e8 100%)"
          scrim={false}
          vignette={{ strength: 0.15 }}
          parallax={0}
          grain={0.03}
          fadeTo="#e9edf0"
        />
      )}
    />
  );
}
