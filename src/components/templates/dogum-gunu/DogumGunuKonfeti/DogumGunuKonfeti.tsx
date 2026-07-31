import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo, LightLeak } from '../../shared/effects';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

const VIDEO = videoSet('dogum-gunu-konfeti', { landscape: '50% 50%', portrait: '50% 45%' });

/**
 * DogumGunuKonfeti — "Konfeti": krem zemine dönerek düşen sınırlı paletli konfeti.
 * Palet doğrudan videonun renklerinden türetildi.
 */
const DOGUM_KONFETI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fffaf6]',
  page: 'text-[#8b7a72]',
  surface: 'bg-white/78 backdrop-blur-md',
  border: 'border-[#f3e2d8]',
  heading: 'text-[#37271f]',
  body: 'text-[#8b7a72]',
  accent: 'text-[#e8705f]',
  accentBg: 'bg-[#e8705f]',
  accentSoft: 'bg-[#e8705f]/10',
  input:
    'w-full bg-white/85 border border-[#f3e2d8] rounded-lg px-3.5 py-2.5 text-sm text-[#37271f] placeholder:text-[#8b7a72] focus:outline-none focus:border-[#e8705f] focus:ring-2 focus:ring-[#e8705f]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#e8705f] hover:bg-[#f0836f] text-white shadow-lg shadow-[#e8705f]/20',
  buttonGhost:
    'border border-[#f0d8cd] text-[#7a6259] hover:bg-[#fdf0e9] hover:border-[#e3bfae]',
  divider: 'bg-[#f3e2d8]',
  timelineLine: 'from-[#e8705f] via-[#e8705f]/50 to-transparent'
};

export function DogumGunuKonfeti({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_KONFETI_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="linear-gradient(to bottom, #fffdfb 0%, #fdf3ec 55%, #fbe8dd 100%)"
          // Zemin fildişi: scrim beyaz tonda yıkama yapar, karartmaz.
          scrim={{ from: 'both', strength: 0.4, tint: '255,255,255' }}
          vignette={{ strength: 0.18, tint: '150,110,90' }}
          atmosphere={
            <>
              <Halo color="255,225,205" size={76} x={50} y={38} opacity={0.5} duration={8} />
              <LightLeak color="255,240,228" opacity={0.3} duration={13} />
            </>
          }
          particles={[
            // Videonun kendi pastel konfetisini ön düzlemde sürdürür.
            {
              preset: 'confetti',
              colors: ['#f2a3b8', '#f5c86a', '#9b8ce0', '#5fc4b8', '#ef8b7c'],
              density: 1,
              speed: 0.8,
              opacity: 0.9,
              depth: 1,
              seed: 6
            }
          ]}
          grain={0.018}
          fadeTo="#fffaf6"
        />
      )}
    />
  );
}
