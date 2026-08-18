import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanGazete — "Gazete Manşeti" nişan yorumu: daveti haber olarak duyuran dizgi. */
const NISAN_GAZETE_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f5f6]',
  page: 'text-[#4b5058]',
  surface: 'bg-[#fafbfc]/85 backdrop-blur-sm',
  border: 'border-[#e1e3e7]',
  heading: 'text-[#15181d]',
  body: 'text-[#7f858e]',
  accent: 'text-[#2f5f8c]',
  accentBg: 'bg-[#2f5f8c]',
  accentSoft: 'bg-[#2f5f8c]/12',
  input: 'w-full bg-white border border-[#e1e3e7] rounded-lg px-3.5 py-2.5 text-sm text-[#4b5058] placeholder:text-[#7f858e] focus:outline-none focus:border-[#2f5f8c] focus:ring-2 focus:ring-[#2f5f8c]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#15181d] hover:brightness-125 text-[#f4f5f6] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e1e3e7] text-[#4b5058] hover:bg-[#f4f5f6] hover:border-[#2f5f8c]/40',
  divider: 'bg-[#e1e3e7]',
  timelineLine: 'from-[#2f5f8c] via-[#2f5f8c]/40 to-transparent',
};

export function NisanGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_GAZETE_THEME}
      renderHero={(props) => <GazeteHero {...props} masthead="NİŞAN GAZETESİ" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfcfd 0%, #eff1f3 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f4f5f6"
        />
      )}
    />
  );
}
