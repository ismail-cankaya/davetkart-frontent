import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { EbruSheet } from '../../shared/effects';
import { EbruHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiEbru — "Ebru" yorumu: gece ebrusu: koyu suda fuşya, mor ve altın. */
const PARTI_EBRU_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0f0d18]',
  page: 'text-[#a69fb6]',
  surface: 'bg-[#1b1726]/90 backdrop-blur-sm',
  border: 'border-[#d9ae52]/25',
  heading: 'text-[#f4eefc]',
  body: 'text-[#a69fb6]',
  accent: 'text-[#ff5c91]',
  accentBg: 'bg-[#f4eefc]',
  accentSoft: 'bg-[#ff5c91]/10',
  input: 'w-full bg-[#1b1726] border border-[#d9ae52]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#f4eefc] placeholder:text-[#a69fb6] focus:outline-none focus:border-[#ff5c91] focus:ring-2 focus:ring-[#ff5c91]/15 transition duration-300',
  buttonPrimary: 'bg-[#f4eefc] hover:brightness-110 text-[#0f0d18] rounded-sm shadow-lg shadow-black/30',
  buttonGhost: 'border border-[#d9ae52]/40 text-[#f4eefc] hover:bg-[#d9ae52]/10 hover:border-[#d9ae52]/70 rounded-sm',
  divider: 'bg-[#d9ae52]/20',
  timelineLine: 'from-[#ff5c91] via-[#d9ae52]/40 to-transparent',
};

export function PartiEbru({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_EBRU_THEME}
      renderHero={(props) => <EbruHero {...props} paper="#16131f" gold="#d9ae52" ink="#ff5c91" />}
      renderHeroBackground={({ revealed }) => (
        <EbruSheet
          ground="#120f1c"
          inks={['#3b2a55', '#5a2244', '#2a3f5c', '#4a3a1f', '#1f1a2e']}
          stoneInks={['#e0457b', '#7b5cff', '#e7b94c', '#3cc7d9']}
          names={invitation.names}
          date={invitation.date}
          revealed={revealed}
          fadeTo="#0f0d18"
        />
      )}
    />
  );
}
