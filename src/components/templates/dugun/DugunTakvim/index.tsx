import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { TakvimHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunTakvim — "Takvim" yorumu: kırık beyaz yaprak, altın spiral ve gülkurusu mürekkeple çizilmiş gün. */
const DUGUN_TAKVIM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#efebe4]',
  page: 'text-[#76706a]',
  surface: 'bg-[#fbfaf7]/90 backdrop-blur-sm',
  border: 'border-[#9a9087]/25',
  heading: 'text-[#2f2a26]',
  body: 'text-[#76706a]',
  accent: 'text-[#a8453f]',
  accentBg: 'bg-[#2f2a26]',
  accentSoft: 'bg-[#a8453f]/10',
  input: 'w-full bg-[#fbfaf7] border border-[#9a9087]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#2f2a26] placeholder:text-[#76706a] focus:outline-none focus:border-[#a8453f] focus:ring-2 focus:ring-[#a8453f]/15 transition duration-300',
  buttonPrimary: 'bg-[#2f2a26] hover:brightness-125 text-[#fbfaf7] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#9a9087]/40 text-[#2f2a26] hover:bg-[#9a9087]/10 hover:border-[#9a9087]/70 rounded-sm',
  divider: 'bg-[#9a9087]/20',
  timelineLine: 'from-[#a8453f] via-[#9a9087]/40 to-transparent',
};

export function DugunTakvim({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_TAKVIM_THEME}
      renderHero={(props) => (
        <TakvimHero {...props} paper="#fbfaf7" ink="#a8453f" metal="#b9a06a" note="#f3e3c6" noteInk="#3a3128" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(110% 70% at 50% 25%, #f6f3ee 0%, #e6e0d6 100%)"
          scrim={false}
          vignette={{ strength: 0.15 }}
          parallax={0}
          grain={0.03}
          fadeTo="#efebe4"
        />
      )}
    />
  );
}
