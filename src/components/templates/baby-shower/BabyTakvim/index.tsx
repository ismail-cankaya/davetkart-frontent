import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { TakvimHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyTakvim — "Takvim" yorumu: beyaz yaprak, bebek mavisi daire ve pembe not. */
const BABY_TAKVIM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#edf2f6]',
  page: 'text-[#748190]',
  surface: 'bg-[#fcfdfd]/90 backdrop-blur-sm',
  border: 'border-[#a9b6c2]/25',
  heading: 'text-[#3b4a5a]',
  body: 'text-[#748190]',
  accent: 'text-[#5f8fc4]',
  accentBg: 'bg-[#3b4a5a]',
  accentSoft: 'bg-[#5f8fc4]/10',
  input: 'w-full bg-[#fcfdfd] border border-[#a9b6c2]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#3b4a5a] placeholder:text-[#748190] focus:outline-none focus:border-[#5f8fc4] focus:ring-2 focus:ring-[#5f8fc4]/15 transition duration-300',
  buttonPrimary: 'bg-[#3b4a5a] hover:brightness-125 text-[#fcfdfd] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#a9b6c2]/40 text-[#3b4a5a] hover:bg-[#a9b6c2]/10 hover:border-[#a9b6c2]/70 rounded-sm',
  divider: 'bg-[#a9b6c2]/20',
  timelineLine: 'from-[#5f8fc4] via-[#a9b6c2]/40 to-transparent',
};

export function BabyTakvim({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_TAKVIM_THEME}
      renderHero={(props) => (
        <TakvimHero {...props} paper="#fcfdfd" ink="#5f93cc" metal="#c6d3df" note="#fde4ec" noteInk="#3b4a5a" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(110% 70% at 50% 25%, #f3f7fa 0%, #e2eaf1 100%)"
          scrim={false}
          vignette={{ strength: 0.15 }}
          parallax={0}
          grain={0.03}
          fadeTo="#edf2f6"
        />
      )}
    />
  );
}
