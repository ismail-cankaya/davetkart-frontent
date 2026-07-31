import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halftone } from '../../shared/effects';
import { TicketHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiBilet — "Etkinlik Bileti" parti yorumu: gece siyahı, neon fuşya. Konser bileti enerjisi.
 */
const PARTI_BILET_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a0710]',
  page: 'text-[#e8dff0]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#faf5ff]',
  body: 'text-[#978aa8]',
  accent: 'text-[#ff4fa3]',
  accentBg: 'bg-[#ff4fa3]',
  accentSoft: 'bg-[#ff4fa3]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2ebf8] placeholder:text-[#7f7291] focus:outline-none focus:border-[#ff4fa3] focus:ring-2 focus:ring-[#ff4fa3]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#ff4fa3] hover:bg-[#ff6cb4] text-[#1a0410] shadow-lg shadow-[#ff4fa3]/25',
  buttonGhost:
    'border border-white/16 text-[#e8dff0] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ff4fa3] via-[#8b5cf6]/45 to-transparent'
};

export function PartiBilet({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_BILET_THEME}
      renderHero={(props) => <TicketHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #1e1030 0%, #12081c 55%, #08040e 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          // Tram dokusu: biletin matbaa kağıdı hissi.
          atmosphere={
            <Halftone color="255,255,255" size={4} angle={22} opacity={0.1} />
          }
          parallax={7}
          grain={0.026}
          fadeTo="#0a0710"
        />
      )}
    />
  );
}
