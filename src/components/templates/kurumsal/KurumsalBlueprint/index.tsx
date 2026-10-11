import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { BlueprintHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalBlueprint — "Teknik Çizim" yorumu: etkinliği bir mühendislik
 * paftası gibi sunan yorum. Pafta kobalt gecesi, çizgi buz beyazı; vurgular
 * "kırmızı kalem" — revizyon işaretinin rengi. Köşe sıfır.
 */
const KURUMSAL_BLUEPRINT_THEME = kurumsalTheme(
  {
    id: 'midnight',
    base: 'bg-[#0F1A5C]',
    page: 'text-[#E8ECFF]/80',
    surface: 'bg-white/[0.05] backdrop-blur-sm',
    border: 'border-[#E8ECFF]/25',
    heading: 'text-[#E8ECFF]',
    body: 'text-[#E8ECFF]/72',
    accent: 'text-[#FF8A6B]',
    accentBg: 'bg-[#FF8A6B]',
    accentSoft: 'bg-[#FF8A6B]/14',
    input:
      'w-full bg-white/[0.05] border border-[#E8ECFF]/30 px-3.5 py-2.5 text-sm text-[#E8ECFF] placeholder:text-[#E8ECFF]/60 focus:outline-none focus:border-[#FF8A6B] focus:ring-1 focus:ring-[#FF8A6B]/30 transition-colors duration-200',
    buttonPrimary: 'bg-[#FF8A6B] hover:brightness-110 text-[#0F1A5C] font-bold shadow-lg shadow-black/25',
    buttonGhost: 'border border-[#E8ECFF]/35 text-[#E8ECFF] hover:bg-[#E8ECFF]/10 hover:border-[#E8ECFF]/60',
    divider: 'bg-[#E8ECFF]/20',
    timelineLine: 'from-[#FF8A6B] via-[#E8ECFF]/35 to-transparent'
  },
  { edge: 'sert' }
);

export function KurumsalBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_BLUEPRINT_THEME}
      renderHero={(props) => (
        <BlueprintHero {...props} paper="#0F1A5C" line="#E8ECFF" accent="#FF8A6B" sheetCode="KR-09" />
      )}
    />
  );
}
