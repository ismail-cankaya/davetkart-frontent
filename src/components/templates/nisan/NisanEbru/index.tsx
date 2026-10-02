import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { EbruSheet } from '../../shared/effects';
import { EbruHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanEbru — "Ebru" yorumu: pudra, lila ve adaçayı; uçuk bir bahar ebrusu. */
const NISAN_EBRU_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f9f2f1]',
  page: 'text-[#75697a]',
  surface: 'bg-[#fefaf8]/90 backdrop-blur-sm',
  border: 'border-[#c4a073]/25',
  heading: 'text-[#3b3048]',
  body: 'text-[#75697a]',
  accent: 'text-[#b85c75]',
  accentBg: 'bg-[#3b3048]',
  accentSoft: 'bg-[#b85c75]/10',
  input: 'w-full bg-[#fefaf8] border border-[#c4a073]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#3b3048] placeholder:text-[#75697a] focus:outline-none focus:border-[#b85c75] focus:ring-2 focus:ring-[#b85c75]/15 transition duration-300',
  buttonPrimary: 'bg-[#3b3048] hover:brightness-125 text-[#fefaf8] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#c4a073]/40 text-[#3b3048] hover:bg-[#c4a073]/10 hover:border-[#c4a073]/70 rounded-sm',
  divider: 'bg-[#c4a073]/20',
  timelineLine: 'from-[#b85c75] via-[#c4a073]/40 to-transparent',
};

export function NisanEbru({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_EBRU_THEME}
      renderHero={(props) => <EbruHero {...props} paper="#fefaf8" gold="#c4a073" ink="#b85c75" />}
      renderHeroBackground={({ revealed }) => (
        <EbruSheet
          ground="#f5ecec"
          inks={['#efc6cf', '#d4cbe6', '#cfdccb', '#efe0c5', '#f8eeee']}
          stoneInks={['#c96f86', '#8f7fbf', '#7f9d7c', '#d7b98a']}
          names={invitation.names}
          date={invitation.date}
          revealed={revealed}
          fadeTo="#f9f2f1"
        />
      )}
    />
  );
}
