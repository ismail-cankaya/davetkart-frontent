import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { EbruSheet } from '../../shared/effects';
import { EbruHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunEbru — "Ebru" yorumu: fildişi su üstünde tozlu mavi, gül ve kum; altın cetvelli koltuk. */
const DUGUN_EBRU_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5efe4]',
  page: 'text-[#6f6a62]',
  surface: 'bg-[#fbf6ea]/90 backdrop-blur-sm',
  border: 'border-[#b08a4a]/25',
  heading: 'text-[#28324a]',
  body: 'text-[#6f6a62]',
  accent: 'text-[#8e3b46]',
  accentBg: 'bg-[#28324a]',
  accentSoft: 'bg-[#8e3b46]/10',
  input: 'w-full bg-[#fbf6ea] border border-[#b08a4a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#28324a] placeholder:text-[#6f6a62] focus:outline-none focus:border-[#8e3b46] focus:ring-2 focus:ring-[#8e3b46]/15 transition duration-300',
  buttonPrimary: 'bg-[#28324a] hover:brightness-125 text-[#fbf6ea] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#b08a4a]/40 text-[#28324a] hover:bg-[#b08a4a]/10 hover:border-[#b08a4a]/70 rounded-sm',
  divider: 'bg-[#b08a4a]/20',
  timelineLine: 'from-[#8e3b46] via-[#b08a4a]/40 to-transparent',
};

export function DugunEbru({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_EBRU_THEME}
      renderHero={(props) => <EbruHero {...props} paper="#fbf6ea" gold="#b08a4a" ink="#8e3b46" />}
      renderHeroBackground={({ revealed }) => (
        <EbruSheet
          ground="#efe7d8"
          inks={['#a7b9cc', '#e3c0bb', '#e8d5b0', '#c9d3dc', '#f3e9da']}
          stoneInks={['#2d3e5c', '#6d88a8', '#c98d8d', '#d9b98a']}
          names={invitation.names}
          date={invitation.date}
          revealed={revealed}
          fadeTo="#f5efe4"
        />
      )}
    />
  );
}
