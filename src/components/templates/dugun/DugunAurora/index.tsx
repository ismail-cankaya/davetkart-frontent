import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh, Halo } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DugunAurora — "Aurora Cam": akışkan renk mesh'i üzerinde buzlu cam kartlar.
 *
 * Videosuz; tüm görsel yük CSS mesh + canvas parçacıklarında. Mesh üç
 * bağımsız lekeden oluştuğu için desen tekrar etmez ve hero her açılışta
 * farklı bir anında yakalanır.
 *
 * Palet gül–menekşe–turkuaz: düğün için romantik ama modern, pudra
 * klişesine düşmeyen bir üçlü.
 */
const DUGUN_AURORA_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b0a14]',
  page: 'text-[#e6e1f0]',
  // Cam yüzeyler bu temanın imzası: doygunluk artışı olmadan blur rengi soldurur.
  surface: 'bg-white/[0.07] backdrop-blur-2xl backdrop-saturate-150',
  border: 'border-white/14',
  heading: 'text-[#faf7ff]',
  body: 'text-[#a49cbd]',
  accent: 'text-[#f0abd0]',
  accentBg: 'bg-[#f0abd0]',
  accentSoft: 'bg-[#f0abd0]/12',
  input:
    'w-full bg-white/[0.07] border border-white/14 rounded-lg px-3.5 py-2.5 text-sm text-[#efeafc] placeholder:text-[#8b83a6] focus:outline-none focus:border-[#f0abd0]/60 focus:ring-2 focus:ring-[#f0abd0]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#f0abd0] to-[#a78bfa] hover:from-[#f4bcda] hover:to-[#b79dfb] text-[#140f1e] shadow-lg shadow-[#a78bfa]/25',
  buttonGhost:
    'border border-white/16 text-[#e6e1f0] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f0abd0] via-[#a78bfa]/50 to-transparent'
};

export function DugunAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_AURORA_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 110% 90% at 50% 20%, #1c1430 0%, #0e0b1a 55%, #08070f 100%)"
          // Mesh zaten yumuşak; scrim yalnızca metnin oturduğu banda iner.
          scrim={{ from: 'both', strength: 0.3 }}
          vignette={{ strength: 0.45 }}
          atmosphere={
            <>
              <AuroraMesh colors={['236,140,200', '167,139,250', '56,189,248']} opacity={0.62} duration={24} />
              <Halo color="240,171,208" size={62} x={50} y={40} opacity={0.24} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#f0abd0', '#a78bfa'],
              blend: 'screen',
              density: 0.7,
              speed: 0.45,
              opacity: 0.7,
              pointerStrength: 1.4,
              depth: 1,
              seed: 101
            }
          ]}
          grain={0.03}
          fadeTo="#0b0a14"
        />
      )}
    />
  );
}
