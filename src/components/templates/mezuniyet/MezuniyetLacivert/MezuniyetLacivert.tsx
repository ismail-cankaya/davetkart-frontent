import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

const VIDEO = videoSet('mezuniyet-lacivert', { landscape: '50% 50%', portrait: '50% 50%' });

/**
 * MezuniyetLacivert — "Tören Işığı": lacivert geceyi kat eden ışık huzmesi ve yükselen altın zerreler.
 * Palet doğrudan videonun renklerinden türetildi.
 */
const MEZUNIYET_LACIVERT_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#071328]',
  page: 'text-[#dee7f4]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/10',
  heading: 'text-[#dee7f4]',
  body: 'text-[#8fa2bd]',
  accent: 'text-[#f0c761]',
  accentBg: 'bg-[#f0c761]',
  accentSoft: 'bg-[#f0c761]/10',
  input:
    'w-full bg-white/[0.05] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#dee7f4] placeholder:text-[#8fa2bd] focus:outline-none focus:border-[#f0c761]/50 focus:ring-2 focus:ring-[#f0c761]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#f0c761] hover:bg-[#f6d780] text-[#071328] shadow-lg shadow-[#f0c761]/15',
  buttonGhost:
    'border border-white/15 text-[#dee7f4] hover:bg-white/5 hover:border-white/25',
  divider: 'bg-white/10',
  timelineLine: 'from-[#f0c761] via-[#f0c761]/40 to-transparent'
};

export function MezuniyetLacivert({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_LACIVERT_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="linear-gradient(to top, #071328 0%, #0d2444 45%, #041022 100%)"
          scrim={{ from: 'both', strength: 0.45 }}
          vignette={{ strength: 0.52 }}
          atmosphere={<Halo color="120,190,255" size={68} x={50} y={52} opacity={0.28} duration={8} />}
          particles={[
            // Aşağıdan yukarı fırlayan başarı hüzmeleri — konseptin ekseni.
            {
              preset: 'streaks',
              colors: ['#7cc4ff', '#f2d79b', '#bfe4ff'],
              blend: 'screen',
              density: 1.2,
              speed: 1.1,
              opacity: 0.55,
              depth: 1,
              seed: 19
            },
            {
              preset: 'stardust',
              colors: ['#ffffff', '#9fd4ff'],
              blend: 'screen',
              density: 0.6,
              speed: 0.5,
              opacity: 0.6,
              pointerStrength: 1.2,
              depth: 0.7,
              seed: 52
            }
          ]}
          fadeTo="#071328"
        />
      )}
    />
  );
}
