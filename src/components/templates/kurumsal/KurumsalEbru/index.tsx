import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { EbruSheet } from '../../shared/effects';
import { EbruHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalEbru — "Ebru" yorumu: petrol, arduvaz ve pirinç; ölçülü bir kurumsal ebru. */
const KURUMSAL_EBRU_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#eef2f4]',
  page: 'text-[#5f6d77]',
  surface: 'bg-[#fbfcfc]/90 backdrop-blur-sm',
  border: 'border-[#a98a55]/25',
  heading: 'text-[#18303d]',
  body: 'text-[#5f6d77]',
  accent: 'text-[#1f4e63]',
  accentBg: 'bg-[#18303d]',
  accentSoft: 'bg-[#1f4e63]/10',
  input: 'w-full bg-[#fbfcfc] border border-[#a98a55]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#18303d] placeholder:text-[#5f6d77] focus:outline-none focus:border-[#1f4e63] focus:ring-2 focus:ring-[#1f4e63]/15 transition duration-300',
  buttonPrimary: 'bg-[#18303d] hover:brightness-125 text-[#fbfcfc] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#a98a55]/40 text-[#18303d] hover:bg-[#a98a55]/10 hover:border-[#a98a55]/70 rounded-sm',
  divider: 'bg-[#a98a55]/20',
  timelineLine: 'from-[#1f4e63] via-[#a98a55]/40 to-transparent',
};

export function KurumsalEbru({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_EBRU_THEME}
      renderHero={(props) => <EbruHero {...props} paper="#fbfcfc" gold="#a98a55" ink="#1f4e63" />}
      renderHeroBackground={({ revealed }) => (
        <EbruSheet
          ground="#e6ebee"
          inks={['#b9c8d2', '#c9d5dc', '#d8cdb6', '#aebdc8', '#eef2f4']}
          stoneInks={['#1f4e63', '#5b7083', '#b58b4b', '#8fa7b8']}
          names={invitation.names}
          date={invitation.date}
          revealed={revealed}
          fadeTo="#eef2f4"
        />
      )}
    />
  );
}
