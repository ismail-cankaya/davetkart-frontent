import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { EbruSheet } from '../../shared/effects';
import { EbruHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetEbru — "Ebru" yorumu: lacivert, bordo ve eski altın; bir tören ebrusu. */
const MEZUNIYET_EBRU_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f1ede5]',
  page: 'text-[#666a74]',
  surface: 'bg-[#faf8f2]/90 backdrop-blur-sm',
  border: 'border-[#b8913e]/25',
  heading: 'text-[#1a2545]',
  body: 'text-[#666a74]',
  accent: 'text-[#7a2738]',
  accentBg: 'bg-[#1e2c52]',
  accentSoft: 'bg-[#7a2738]/10',
  input: 'w-full bg-[#faf8f2] border border-[#b8913e]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#1a2545] placeholder:text-[#666a74] focus:outline-none focus:border-[#7a2738] focus:ring-2 focus:ring-[#7a2738]/15 transition duration-300',
  buttonPrimary: 'bg-[#1e2c52] hover:brightness-125 text-[#faf8f2] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#b8913e]/40 text-[#1a2545] hover:bg-[#b8913e]/10 hover:border-[#b8913e]/70 rounded-sm',
  divider: 'bg-[#b8913e]/20',
  timelineLine: 'from-[#7a2738] via-[#b8913e]/40 to-transparent',
};

export function MezuniyetEbru({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_EBRU_THEME}
      renderHero={(props) => <EbruHero {...props} paper="#faf8f2" gold="#b8913e" ink="#7a2738" />}
      renderHeroBackground={({ revealed }) => (
        <EbruSheet
          ground="#e9e4da"
          inks={['#b7bfd0', '#d9b3b9', '#e3d3aa', '#c7ccd4', '#f1ece2']}
          stoneInks={['#1e2c52', '#7a2738', '#c39a43', '#6b7c93']}
          names={invitation.names}
          date={invitation.date}
          revealed={revealed}
          fadeTo="#f1ede5"
        />
      )}
    />
  );
}
