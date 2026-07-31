import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halftone } from '../../shared/effects';
import { TicketHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * MezuniyetBilet — "Etkinlik Bileti": perforasyonlu koçan, barkod, etiketli alanlar. Tören daveti.
 */
const MEZUNIYET_BILET_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b1220]',
  page: 'text-[#dbe3f0]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f4f8ff]',
  body: 'text-[#8d99ad]',
  accent: 'text-[#e8b45c]',
  accentBg: 'bg-[#e8b45c]',
  accentSoft: 'bg-[#e8b45c]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eaf0f9] placeholder:text-[#77839a] focus:outline-none focus:border-[#e8b45c] focus:ring-2 focus:ring-[#e8b45c]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#e8b45c] hover:bg-[#f0c47a] text-[#1a1206] shadow-lg shadow-[#e8b45c]/22',
  buttonGhost:
    'border border-white/16 text-[#dbe3f0] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#e8b45c] via-[#5b7bb0]/45 to-transparent'
};

export function MezuniyetBilet({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_BILET_THEME}
      renderHero={(props) => <TicketHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #17233c 0%, #0d1626 55%, #080d17 100%)"
          scrim={false}
          vignette={{ strength: 0.4 }}
          // Tram dokusu: biletin matbaa kağıdı hissi.
          atmosphere={
            <Halftone color="255,255,255" size={4} angle={22} opacity={0.1} />
          }
          parallax={7}
          grain={0.026}
          fadeTo="#0b1220"
        />
      )}
    />
  );
}
