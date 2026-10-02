import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { EbruSheet } from '../../shared/effects';
import { EbruHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetEbru — "Ebru" yorumu: lacivert, firuze ve altın; şehzade ebrusu. */
const SUNNET_EBRU_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#eef4f7]',
  page: 'text-[#5d6f82]',
  surface: 'bg-[#fbfcfd]/90 backdrop-blur-sm',
  border: 'border-[#c39a3b]/25',
  heading: 'text-[#102a55]',
  body: 'text-[#5d6f82]',
  accent: 'text-[#b8892c]',
  accentBg: 'bg-[#17356b]',
  accentSoft: 'bg-[#b8892c]/10',
  input: 'w-full bg-[#fbfcfd] border border-[#c39a3b]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#102a55] placeholder:text-[#5d6f82] focus:outline-none focus:border-[#b8892c] focus:ring-2 focus:ring-[#b8892c]/15 transition duration-300',
  buttonPrimary: 'bg-[#17356b] hover:brightness-125 text-[#fbfcfd] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#c39a3b]/40 text-[#102a55] hover:bg-[#c39a3b]/10 hover:border-[#c39a3b]/70 rounded-sm',
  divider: 'bg-[#c39a3b]/20',
  timelineLine: 'from-[#b8892c] via-[#c39a3b]/40 to-transparent',
};

export function SunnetEbru({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_EBRU_THEME}
      renderHero={(props) => <EbruHero {...props} paper="#fbfcfd" gold="#c39a3b" ink="#17356b" />}
      renderHeroBackground={({ revealed }) => (
        <EbruSheet
          ground="#e7eff4"
          inks={['#b5cde0', '#a9dbe2', '#ead7a3', '#d2dfe9', '#f2f6f8']}
          stoneInks={['#17356b', '#2aa0b4', '#d4a332', '#7fb8dc']}
          names={invitation.names}
          date={invitation.date}
          revealed={revealed}
          fadeTo="#eef4f7"
        />
      )}
    />
  );
}
