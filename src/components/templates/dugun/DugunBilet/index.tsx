import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halftone } from '../../shared/effects';
import { TicketHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DugunBilet — "Davet Bileti" düğün yorumu: krem kart stoğu, şarap kırmızısı mürekkep.
 *
 * Bilet dilinin diğer kategorilerdeki sürümleri gece zeminlidir (konser,
 * gala). Düğünde koçan mantığı korunup malzeme değiştirildi: siyah bilet
 * değil, matbaada basılmış krem davet kartı.
 */
const DUGUN_BILET_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4efe6]',
  page: 'text-[#4a4237]',
  surface: 'bg-white/90 backdrop-blur-sm',
  border: 'border-[#ded3c0]',
  heading: 'text-[#26201a]',
  body: 'text-[#867c6c]',
  accent: 'text-[#9c3b46]',
  accentBg: 'bg-[#9c3b46]',
  accentSoft: 'bg-[#9c3b46]/12',
  input:
    'w-full bg-white border border-[#ded3c0] rounded-lg px-3.5 py-2.5 text-sm text-[#4a4237] placeholder:text-[#867c6c] focus:outline-none focus:border-[#9c3b46] focus:ring-2 focus:ring-[#9c3b46]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#26201a] hover:bg-[#3f372c] text-[#f8f4ec] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d5c9b4] text-[#5b5245] hover:bg-[#ebe4d6] hover:border-[#b8a98d]',
  divider: 'bg-[#ded3c0]',
  timelineLine: 'from-[#9c3b46] via-[#d3b9a3]/60 to-transparent'
};

export function DugunBilet({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_BILET_THEME}
      renderHero={(props) => <TicketHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #faf6ee 0%, #efe8db 55%, #e4dbc9 100%)"
          scrim={false}
          vignette={false}
          // Tram: kartın matbaa kağıdı dokusu. Koyu bilet sürümlerinde beyaz
          // basılır, krem kağıtta siyah — doku her iki zeminde de görünür.
          atmosphere={<Halftone color="0,0,0" size={4} angle={22} opacity={0.07} />}
          parallax={6}
          grain={0.024}
          fadeTo="#f4efe6"
        />
      )}
    />
  );
}
