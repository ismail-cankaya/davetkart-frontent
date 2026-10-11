import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { EbruSheet } from '../../shared/effects';
import { EbruHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaEbru — "Ebru" yorumu: kına kırmızısı, safran ve mürdüm; sıcak bir gece ebrusu. */
const KINA_EBRU_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7eadb]',
  page: 'text-[#7d6658]',
  surface: 'bg-[#fdf5e8]/90 backdrop-blur-sm',
  border: 'border-[#b5893a]/25',
  heading: 'text-[#3f1219]',
  body: 'text-[#7d6658]',
  accent: 'text-[#9b2230]',
  accentBg: 'bg-[#6e1622]',
  accentSoft: 'bg-[#9b2230]/10',
  input: 'w-full bg-[#fdf5e8] border border-[#b5893a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#3f1219] placeholder:text-[#7d6658] focus:outline-none focus:border-[#9b2230] focus:ring-2 focus:ring-[#9b2230]/15 transition duration-300',
  buttonPrimary: 'bg-[#6e1622] hover:brightness-125 text-[#fdf5e8] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#b5893a]/40 text-[#3f1219] hover:bg-[#b5893a]/10 hover:border-[#b5893a]/70 rounded-sm',
  divider: 'bg-[#b5893a]/20',
  timelineLine: 'from-[#9b2230] via-[#b5893a]/40 to-transparent',
};

export function KinaEbru({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_EBRU_THEME}
      renderHero={(props) => <EbruHero {...props} paper="#fdf5e8" gold="#b5893a" ink="#9b2230" />}
      renderHeroBackground={({ revealed }) => (
        <EbruSheet
          ground="#f2e2cf"
          inks={['#e2b49a', '#efcf9a', '#d9a3a0', '#c9b28a', '#f6e6cf']}
          stoneInks={['#8e1f2a', '#d0902f', '#4b1d2c', '#7a7a3a']}
          names={invitation.names}
          date={invitation.date}
          revealed={revealed}
          fadeTo="#f7eadb"
        />
      )}
    />
  );
}
