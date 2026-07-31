import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, FogDrift } from '../../shared/effects';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Huzmeler üstten girer; dikeyde üst bant korunacak şekilde kadraj yukarıda. */
const VIDEO = videoSet('nisan-orman', { landscape: '50% 45%', portrait: '50% 38%' });

/**
 * NisanOrman — Konsept 1, "Rustik Orman Rüyası": ulu ağaçlar arasından
 * süzülen güneş huzmeleri, dallarda makrome ve peri ışıkları.
 *
 * Katman mantığı: huzme (CSS) → sis (CSS) → ateşböceği (canvas). Sis
 * huzmelerin ÜSTÜNDE durur ki ışık sisin içinde kırılıyormuş gibi okunsun;
 * ateşböcekleri en önde, sisin içinden parlar.
 */
const ORMAN_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#101a13]',
  page: 'text-[#dfe2d3]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-[#9fb08a]/20',
  heading: 'text-[#f2f0e2]',
  body: 'text-[#94a086]',
  accent: 'text-[#d8b26a]',
  accentBg: 'bg-[#d8b26a]',
  accentSoft: 'bg-[#d8b26a]/10',
  input:
    'w-full bg-white/[0.05] border border-[#9fb08a]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#eceedf] placeholder:text-[#7d8a72] focus:outline-none focus:border-[#d8b26a]/55 focus:ring-2 focus:ring-[#d8b26a]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#d8b26a] hover:bg-[#e4c384] text-[#1a1409] shadow-lg shadow-[#d8b26a]/20',
  buttonGhost:
    'border border-[#9fb08a]/25 text-[#dfe2d3] hover:bg-[#9fb08a]/10 hover:border-[#9fb08a]/45',
  divider: 'bg-[#9fb08a]/18',
  timelineLine: 'from-[#d8b26a] via-[#9fb08a]/45 to-transparent'
};

export function NisanOrman({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={ORMAN_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="linear-gradient(165deg, #24361f 0%, #16241a 45%, #0d1510 100%)"
          scrim={{ from: 'both', strength: 0.5 }}
          vignette={{ strength: 0.6 }}
          atmosphere={
            <>
              {/* Dar açı + yüksek sayı: ağaç gövdeleri arasından sızan ışık. */}
              <GodRays angle={14} origin={46} count={11} color="255,232,170" opacity={0.55} duration={17} />
              <FogDrift color="200,220,190" opacity={0.4} duration={40} />
            </>
          }
          particles={[
            {
              preset: 'fireflies',
              colors: ['#ffd97a', '#e8f0a0', '#ffc95e'],
              blend: 'screen',
              density: 1.1,
              speed: 0.9,
              opacity: 0.95,
              pointerStrength: 1.2,
              depth: 1,
              seed: 17
            },
            // Dallardaki sabit peri ışıkları: çok yavaş, neredeyse durgun.
            {
              preset: 'fireflies',
              colors: ['#fff0c4'],
              blend: 'screen',
              density: 0.5,
              speed: 0.25,
              opacity: 0.5,
              pointerStrength: 0,
              depth: 0.25,
              seed: 83
            }
          ]}
          fadeTo="#101a13"
        />
      )}
    />
  );
}
