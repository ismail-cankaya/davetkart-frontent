import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MonogramHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyMonogram — "Varak Monogram" yorumu: beyaz kart, gümüş varak ve bebek mavisi boyalı kenar. */
const BABY_MONOGRAM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#eef3f7]',
  page: 'text-[#73808e]',
  surface: 'bg-[#fbfcfd]/90 backdrop-blur-sm',
  border: 'border-[#9fb6cf]/25',
  heading: 'text-[#34465e]',
  body: 'text-[#73808e]',
  accent: 'text-[#6f8fb3]',
  accentBg: 'bg-[#34465e]',
  accentSoft: 'bg-[#6f8fb3]/10',
  input: 'w-full bg-[#fbfcfd] border border-[#9fb6cf]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#34465e] placeholder:text-[#73808e] focus:outline-none focus:border-[#6f8fb3] focus:ring-2 focus:ring-[#6f8fb3]/15 transition duration-300',
  buttonPrimary: 'bg-[#34465e] hover:brightness-125 text-[#fbfcfd] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#9fb6cf]/40 text-[#34465e] hover:bg-[#9fb6cf]/10 hover:border-[#9fb6cf]/70 rounded-sm',
  divider: 'bg-[#9fb6cf]/20',
  timelineLine: 'from-[#6f8fb3] via-[#9fb6cf]/40 to-transparent',
};

export function BabyMonogram({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_MONOGRAM_THEME}
      renderHero={(props) => (
        <MonogramHero {...props} paper="#fbfcfd" edge="#a8c4e0" foil={['#55657a', '#93a8c0', '#e6edf5']} stock="light" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(120% 80% at 50% 30%, #f4f8fb 0%, #e4ecf3 100%)"
          scrim={false}
          vignette={{ strength: 0.18 }}
          parallax={0}
          grain={0.025}
          fadeTo="#eef3f7"
        />
      )}
    />
  );
}
