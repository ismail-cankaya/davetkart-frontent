import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { EbruSheet } from '../../shared/effects';
import { EbruHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyEbru — "Ebru" yorumu: bebek mavisi, pudra ve nane; yumuşacık bir ebru. */
const BABY_EBRU_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f9fb]',
  page: 'text-[#707d8c]',
  surface: 'bg-[#fdfeff]/90 backdrop-blur-sm',
  border: 'border-[#c7ad7c]/25',
  heading: 'text-[#33475f]',
  body: 'text-[#707d8c]',
  accent: 'text-[#5f8cbc]',
  accentBg: 'bg-[#33475f]',
  accentSoft: 'bg-[#5f8cbc]/10',
  input: 'w-full bg-[#fdfeff] border border-[#c7ad7c]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#33475f] placeholder:text-[#707d8c] focus:outline-none focus:border-[#5f8cbc] focus:ring-2 focus:ring-[#5f8cbc]/15 transition duration-300',
  buttonPrimary: 'bg-[#33475f] hover:brightness-125 text-[#fdfeff] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#c7ad7c]/40 text-[#33475f] hover:bg-[#c7ad7c]/10 hover:border-[#c7ad7c]/70 rounded-sm',
  divider: 'bg-[#c7ad7c]/20',
  timelineLine: 'from-[#5f8cbc] via-[#c7ad7c]/40 to-transparent',
};

export function BabyEbru({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_EBRU_THEME}
      renderHero={(props) => <EbruHero {...props} paper="#fdfeff" gold="#c7ad7c" ink="#6f9bc8" />}
      renderHeroBackground={({ revealed }) => (
        <EbruSheet
          ground="#f2f6f9"
          inks={['#cfe1f1', '#f6d6d9', '#d6ecdf', '#f6ecc6', '#f9fbfc']}
          stoneInks={['#88b4dc', '#eba9b0', '#9ccdb4', '#efd27f']}
          names={invitation.names}
          date={invitation.date}
          revealed={revealed}
          fadeTo="#f6f9fb"
        />
      )}
    />
  );
}
