import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Işık kaynağı üst kısımda; dikeyde kırpma biraz yukarıyı korur. */
const VIDEO = videoSet('gul-yapraklari', { landscape: '50% 50%', portrait: '50% 45%' });

/**
 * DugunGulYapraklari — Konsept 3, "Büyülü Botanik Bahçe": pudra zemine
 * süzülen şakayık ve gül yaprakları.
 *
 * Videonun kendi yaprakları arka planda kalır; canvas katmanı onların
 * ÖNÜNDE, alan derinliği (depth) farkıyla ikinci bir düzlem açar. İki
 * düzlemin farklı hızda akması kamerayı çiçeklerin arasına sokar.
 */
const GUL_THEME: SectionTheme = {
  id: 'stone',
  base: 'theme-cormorant bg-[#fdf4f2]',
  page: 'text-[#59403f]',
  surface: 'bg-white/75 backdrop-blur-md',
  border: 'border-[#f0dcd9]',
  heading: 'text-[#48302f]',
  body: 'text-[#92777a]',
  accent: 'text-[#bf7f88]',
  accentBg: 'bg-[#bf7f88]',
  accentSoft: 'bg-[#bf7f88]/10',
  input:
    'w-full bg-white/85 border border-[#f0dcd9] rounded-lg px-3.5 py-2.5 text-sm text-[#59403f] placeholder:text-[#bda3a3] focus:outline-none focus:border-[#bf7f88] focus:ring-2 focus:ring-[#bf7f88]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#a8616c] hover:bg-[#b9737f] text-[#fdf4f2] shadow-lg shadow-[#a8616c]/15',
  buttonGhost:
    'border border-[#e8ccc9] text-[#7d5a5e] hover:bg-[#f8e8e6] hover:border-[#d9b3b0]',
  divider: 'bg-[#f0dcd9]',
  timelineLine: 'from-[#bf7f88] via-[#e3c2c4]/60 to-transparent'
};

export function DugunGulYapraklari({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={GUL_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="linear-gradient(to bottom, #f7e3e0 0%, #fdf4f2 45%, #f3dfe4 100%)"
          // Açık zemin: scrim beyaz tonda, koyu değil — yıkama yapıyor,
          // karartma değil.
          scrim={{ from: 'both', strength: 0.4, tint: '255,255,255' }}
          vignette={{ strength: 0.22, tint: '120,80,90' }}
          atmosphere={
            <>
              <GodRays angle={12} origin={42} count={6} color="255,240,238" opacity={0.45} duration={18} />
              <Halo color="255,225,228" size={75} x={50} y={40} opacity={0.5} duration={10} />
            </>
          }
          particles={[
            // Ön düzlem: büyük, hızlı, işaretçiden kaçan yapraklar.
            {
              preset: 'petals',
              colors: ['#f2c4cb', '#e7a9b4', '#f7dde0', '#d9a7c7'],
              density: 1,
              speed: 1,
              opacity: 0.9,
              depth: 1,
              seed: 3
            },
            // Arka düzlem: küçük, yavaş, neredeyse sabit — mesafe hissi.
            {
              preset: 'petals',
              colors: ['#f7dde0', '#ecc8d6'],
              density: 0.55,
              speed: 0.5,
              opacity: 0.45,
              pointerStrength: 0.3,
              depth: 0.3,
              seed: 64
            }
          ]}
          grain={0.02}
          fadeTo="#fdf4f2"
        />
      )}
    />
  );
}
