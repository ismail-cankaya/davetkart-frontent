import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, LightLeak, GoldSheen, Halo, Arches } from '../../shared/effects';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaSaray — Konsept 2, "Saray Esintisi": Osmanlı kemerleri altında yüzlerce
 * kristalli avize, taşlardan yansıyan ışıkların ekranı süpürmesi.
 *
 * İki ayrı LightLeak farklı hızda çalışır: kristalin tek bir yansıma
 * üretmediğini, ışığın kırılarak çoğaldığını anlatan detay bu.
 */
const SARAY_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#1a0710]',
  page: 'text-[#f0dad8]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-[#e3bd72]/22',
  heading: 'text-[#fdeee2]',
  body: 'text-[#b08e8e]',
  accent: 'text-[#e3bd72]',
  accentBg: 'bg-[#e3bd72]',
  accentSoft: 'bg-[#e3bd72]/10',
  input:
    'w-full bg-white/[0.06] border border-[#e3bd72]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#f8e6dc] placeholder:text-[#8f7070] focus:outline-none focus:border-[#e3bd72]/60 focus:ring-2 focus:ring-[#e3bd72]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#e3bd72] to-[#f3d99e] hover:from-[#ecc986] hover:to-[#f9e5b4] text-[#1f0c07] shadow-lg shadow-[#e3bd72]/20',
  buttonGhost:
    'border border-[#e3bd72]/25 text-[#f0dad8] hover:bg-[#e3bd72]/10 hover:border-[#e3bd72]/45',
  divider: 'bg-[#e3bd72]/18',
  timelineLine: 'from-[#e3bd72] via-[#8e2233]/50 to-transparent'
};

export function KinaSaray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={SARAY_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 85% 70% at 50% 25%, #5c1a2a 0%, #2a0c15 55%, #14060c 100%)"
          scrim={{ from: 'both', strength: 0.46 }}
          vignette={{ strength: 0.56 }}
          atmosphere={
            <>
              <Halo color="227,189,114" size={60} x={50} y={28} opacity={0.34} duration={9} />
              {/* Sivri Osmanlı kemerleri: kadrajı "içeriden dışarı bakış"a
                  çevirir. Kemer boşlukları saydam kaldığı için avizenin
                  ışığı ve tüller onların arasından görünür. */}
              <Arches color="26,7,16" opacity={0.92} count={5} pointed seed={13} />
              {/* Kırılan kristal ışığı: iki farklı periyot, üst üste binmez. */}
              <LightLeak color="255,240,205" opacity={0.4} duration={10} />
              <LightLeak color="255,215,225" opacity={0.25} duration={15} />
              <GoldSheen color="243,217,158" opacity={0.18} duration={7} />
            </>
          }
          particles={[
            // Havada dönen kırmızı gül yaprakları.
            {
              preset: 'petals',
              colors: ['#a02236', '#c8354c', '#7d1628'],
              density: 0.9,
              speed: 0.85,
              opacity: 0.85,
              depth: 1,
              seed: 24
            },
            // Kristalden dökülen ışık kırıntıları.
            {
              preset: 'stardust',
              colors: ['#ffffff', '#e3bd72', '#ffe9c4'],
              blend: 'screen',
              density: 0.75,
              speed: 0.5,
              opacity: 0.7,
              pointerStrength: 1.3,
              depth: 0.6,
              seed: 68
            }
          ]}
          fadeTo="#1a0710"
        />
      )}
    />
  );
}
