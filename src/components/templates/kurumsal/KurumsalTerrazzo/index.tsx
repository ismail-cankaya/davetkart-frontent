import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { TerrazzoHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalTerrazzo — "Terrazzo" yorumu: kurumsal paleti taşın tesadüfi
 * dokusuna döken yorum. Çakıllar grafit, kobalt, platin ve tek tük işaret
 * kırmızısı. Terrazzo'nun yuvarlak dili korunur (köşe: serbest).
 */
const KURUMSAL_TERRAZZO_THEME = kurumsalTheme(
  {
    id: 'stone',
    base: 'bg-[#EFEFEB]',
    page: 'text-[#3E434B]',
    surface: 'bg-[#FCFCFA]/90 backdrop-blur-sm',
    border: 'border-[#101216]/12',
    heading: 'text-[#101216]',
    body: 'text-[#565B63]',
    accent: 'text-[#2B3FE0]',
    accentBg: 'bg-[#2B3FE0]',
    accentSoft: 'bg-[#2B3FE0]/10',
    input:
      'w-full bg-[#FCFCFA] border border-[#101216]/14 rounded-2xl px-4 py-2.5 text-sm text-[#101216] placeholder:text-[#6B7079] focus:outline-none focus:border-[#2B3FE0] focus:ring-2 focus:ring-[#2B3FE0]/20 transition duration-300',
    buttonPrimary: 'bg-[#101216] hover:bg-[#2B3FE0] text-[#EFEFEB] rounded-full shadow-lg shadow-black/10',
    buttonGhost: 'border border-[#101216]/18 text-[#101216] hover:bg-[#2B3FE0]/10 hover:border-[#2B3FE0]/50 rounded-full',
    divider: 'bg-[#101216]/12',
    timelineLine: 'from-[#2B3FE0] via-[#2B3FE0]/35 to-transparent'
  },
  { edge: 'serbest' }
);

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
          chips={['#2B3FE0', '#8F9CFF', '#C5CBD3', '#DCDCD5', '#101216', '#F0442A']}
          slab="#EFEFEB"
          seed={97}
        />
      )}
    />
  );
}
