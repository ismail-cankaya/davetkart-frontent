import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

const VIDEO = videoSet('sunnet-yildiz', { landscape: '50% 50%', portrait: '50% 48%' });

/**
 * SunnetYildiz — Konsept 2, "Görkemli Masal Şatosu": yıldızların altında
 * ışıl ışıl bir şato, etrafında sessizce patlayan havai fişekler.
 *
 * Havai fişek parçacıkları gruplara bölünmüş dört bağımsız zamanlayıcıyla
 * patlar; tek zamanlayıcı olsaydı tüm ekran aynı anda parlayıp sönerdi ve
 * ritim mekanikleşirdi.
 */
const SUNNET_YILDIZ_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#060f26]',
  page: 'text-[#e2eafa]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/10',
  heading: 'text-[#e2eafa]',
  body: 'text-[#93a7c4]',
  accent: 'text-[#f2d79b]',
  accentBg: 'bg-[#f2d79b]',
  accentSoft: 'bg-[#f2d79b]/10',
  input:
    'w-full bg-white/[0.05] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e2eafa] placeholder:text-[#93a7c4] focus:outline-none focus:border-[#f2d79b]/50 focus:ring-2 focus:ring-[#f2d79b]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#f2d79b] hover:bg-[#f8e4b4] text-[#0a1633] shadow-lg shadow-[#f2d79b]/15',
  buttonGhost:
    'border border-white/15 text-[#e2eafa] hover:bg-white/5 hover:border-white/25',
  divider: 'bg-white/10',
  timelineLine: 'from-[#f2d79b] via-[#f2d79b]/40 to-transparent'
};

export function SunnetYildiz({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_YILDIZ_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="radial-gradient(ellipse 95% 75% at 50% 30%, #16305e 0%, #0a1738 55%, #04091c 100%)"
          scrim={{ from: 'both', strength: 0.45 }}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="242,215,155" size={64} x={50} y={36} opacity={0.26} duration={10} />}
          particles={[
            // Havai fişek: üst yarıda, seyrek aralıklarla, sıcak altın-pembe.
            {
              preset: 'fireworks',
              colors: ['#f2d79b', '#ffb3c7', '#9fd8ff', '#fff0c4'],
              blend: 'screen',
              density: 1,
              speed: 1,
              opacity: 0.9,
              pointerStrength: 0,
              depth: 0.8,
              seed: 21
            },
            // Sabit yıldız tozu: gökyüzünün kendi dokusu, imlece duyarlı.
            {
              preset: 'stardust',
              colors: ['#ffffff', '#f2d79b', '#bcd9ff'],
              blend: 'screen',
              density: 0.7,
              speed: 0.4,
              opacity: 0.65,
              pointerStrength: 1.2,
              depth: 1,
              seed: 77
            }
          ]}
          fadeTo="#060f26"
        />
      )}
    />
  );
}
