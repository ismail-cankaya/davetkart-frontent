import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { EbruSheet } from '../../shared/effects';
import { EbruHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuEbru — "Ebru" yorumu: mandalina, böğürtlen ve limon; neşeli bir doğum günü ebrusu. */
const DOGUM_GUNU_EBRU_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fdf5ea]',
  page: 'text-[#786a74]',
  surface: 'bg-[#fffbf4]/90 backdrop-blur-sm',
  border: 'border-[#d19a3c]/25',
  heading: 'text-[#3a2346]',
  body: 'text-[#786a74]',
  accent: 'text-[#d24a7a]',
  accentBg: 'bg-[#3a2346]',
  accentSoft: 'bg-[#d24a7a]/10',
  input: 'w-full bg-[#fffbf4] border border-[#d19a3c]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#3a2346] placeholder:text-[#786a74] focus:outline-none focus:border-[#d24a7a] focus:ring-2 focus:ring-[#d24a7a]/15 transition duration-300',
  buttonPrimary: 'bg-[#3a2346] hover:brightness-125 text-[#fffbf4] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d19a3c]/40 text-[#3a2346] hover:bg-[#d19a3c]/10 hover:border-[#d19a3c]/70 rounded-sm',
  divider: 'bg-[#d19a3c]/20',
  timelineLine: 'from-[#d24a7a] via-[#d19a3c]/40 to-transparent',
};

export function DogumGunuEbru({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_EBRU_THEME}
      renderHero={(props) => <EbruHero {...props} paper="#fffbf4" gold="#d19a3c" ink="#d24a7a" />}
      renderHeroBackground={({ revealed }) => (
        <EbruSheet
          ground="#fdf1e2"
          inks={['#f8c3a1', '#f1b2c8', '#f6e19a', '#a9dcd4', '#fdf6ec']}
          stoneInks={['#ef7b45', '#d24a7a', '#f1c232', '#2fa59a']}
          names={invitation.names}
          date={invitation.date}
          revealed={revealed}
          fadeTo="#fdf5ea"
        />
      )}
    />
  );
}
