import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { TerrazzoHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalTerrazzo — "Terrazzo" yorumu: kurumsal maviyi taşın tesadüfi dokusuyla yumuşatan yorum. */
const KURUMSAL_TERRAZZO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f1f4f5]',
  page: 'text-[#67737a]',
  surface: 'bg-[#fdfeff]/85 backdrop-blur-sm',
  border: 'border-[#dde4e7]',
  heading: 'text-[#1a2024]',
  body: 'text-[#67737a]',
  accent: 'text-[#2f6f8c]',
  accentBg: 'bg-[#2f6f8c]',
  accentSoft: 'bg-[#2f6f8c]/12',
  input: 'w-full bg-[#fdfeff] border border-[#dde4e7] rounded-2xl px-4 py-2.5 text-sm text-[#1a2024] placeholder:text-[#67737a] focus:outline-none focus:border-[#2f6f8c] focus:ring-2 focus:ring-[#2f6f8c]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#1a2024] hover:brightness-125 text-[#f1f4f5] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dde4e7] text-[#1a2024] hover:bg-[#2f6f8c]/10 hover:border-[#2f6f8c]/50 rounded-full',
  divider: 'bg-[#dde4e7]',
  timelineLine: 'from-[#2f6f8c] via-[#2f6f8c]/40 to-transparent',
};

export function KurumsalTerrazzo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_TERRAZZO_THEME}
      renderHero={(props) => (
        <TerrazzoHero
          {...props}
          chips={['#2f6f8c', '#8fb3c4', '#c3ccd1', '#dfe5e7', '#1a2024']}
          slab="#f1f4f5"
          seed={97}
        />
      )}
    />
  );
}
