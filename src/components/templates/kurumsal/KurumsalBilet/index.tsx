import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halftone } from '../../shared/effects';
import { TicketHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KurumsalBilet — "Etkinlik Bileti" kurumsal yorumu: arduvaz gri, turkuaz vurgu. Konferans ve lansman.
 */
const KURUMSAL_BILET_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0d1013]',
  page: 'text-[#dde3e8]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f6f9]',
  body: 'text-[#8b959e]',
  accent: 'text-[#4fd1c5]',
  accentBg: 'bg-[#4fd1c5]',
  accentSoft: 'bg-[#4fd1c5]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eaeff3] placeholder:text-[#767f88] focus:outline-none focus:border-[#4fd1c5] focus:ring-2 focus:ring-[#4fd1c5]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#4fd1c5] hover:bg-[#6bdbd1] text-[#062522] shadow-lg shadow-[#4fd1c5]/22',
  buttonGhost:
    'border border-white/16 text-[#dde3e8] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#4fd1c5] via-[#4fd1c5]/40 to-transparent'
};

export function KurumsalBilet({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_BILET_THEME}
      renderHero={(props) => <TicketHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #1a2226 0%, #10161a 55%, #0a0d10 100%)"
          scrim={false}
          vignette={{ strength: 0.4 }}
          // Tram dokusu: biletin matbaa kağıdı hissi.
          atmosphere={
            <Halftone color="255,255,255" size={4} angle={22} opacity={0.1} />
          }
          parallax={7}
          grain={0.026}
          fadeTo="#0d1013"
        />
      )}
    />
  );
}
