import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halftone } from '../../shared/effects';
import { TicketHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { KurumsalFrame } from '../parts/KurumsalFrame';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalBilet — "Etkinlik Bileti" kurumsal yorumu: konferans yaka kartı
 * ve giriş bileti. Grafit zemin, antrasit bilet, kobalt ışığı vurgu.
 */
const KURUMSAL_BILET_THEME = kurumsalTheme({
  id: 'midnight',
  base: 'bg-[#0D0F13]',
  page: 'text-[#DADDE3]',
  surface: 'bg-[#181C23]/90 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#F3F4F1]',
  body: 'text-[#A2A8B0]',
  accent: 'text-[#8F9CFF]',
  accentBg: 'bg-[#8F9CFF]',
  accentSoft: 'bg-[#8F9CFF]/12',
  input:
    'w-full bg-white/[0.05] border border-white/14 px-3.5 py-2.5 text-sm text-[#F3F4F1] placeholder:text-[#8A9099] focus:outline-none focus:border-[#8F9CFF] focus:ring-2 focus:ring-[#8F9CFF]/20 transition duration-300',
  buttonPrimary: 'bg-[#8F9CFF] hover:bg-[#A9B3FF] text-[#0D0F13] shadow-[0_12px_30px_-14px_rgba(143,156,255,0.6)]',
  buttonGhost: 'border border-white/16 text-[#DADDE3] hover:bg-white/[0.06] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#8F9CFF] via-[#8F9CFF]/35 to-transparent'
});

export function KurumsalBilet({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_BILET_THEME}
      renderHero={(props) => <TicketHero {...props} />}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          base="linear-gradient(160deg, #1A1E27 0%, #11141A 55%, #0B0D11 100%)"
          scrim={false}
          vignette={{ strength: 0.4 }}
          // Tram dokusu: biletin matbaa kâğıdı hissi.
          atmosphere={<Halftone color="143,156,255" size={4} angle={22} opacity={0.08} />}
          overlay={<KurumsalFrame color="rgba(243,244,241,0.22)" revealed={revealed} />}
          parallax={7}
          grain={0.026}
          fadeTo="#0D0F13"
        />
      )}
    />
  );
}
