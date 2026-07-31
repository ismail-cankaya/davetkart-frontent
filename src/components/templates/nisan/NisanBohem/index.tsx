import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, FogDrift, Ridges, SunDisc } from '../../shared/effects';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * NisanBohem — Konsept 3, "Bohem Gün Batımı": pampa otları, tüller ve hasır
 * fenerlerin dalgalandığı çadırdan dışarı sinematik bakış.
 *
 * Tek açık temalı nişan konsepti. Sıcak toprak tonları altın saatten
 * geliyor; parçacıklar toz-altını, çünkü bohem dekorda uçuşan şey parıltı
 * değil, gün batımında görünür hale gelen toz.
 */
const BOHEM_THEME: SectionTheme = {
  id: 'stone',
  base: 'theme-cormorant bg-[#f6efe4]',
  page: 'text-[#5c4a3a]',
  surface: 'bg-white/70 backdrop-blur-md',
  border: 'border-[#e6d5c0]',
  heading: 'text-[#453528]',
  body: 'text-[#94806c]',
  accent: 'text-[#c08b5c]',
  accentBg: 'bg-[#c08b5c]',
  accentSoft: 'bg-[#c08b5c]/10',
  input:
    'w-full bg-white/85 border border-[#e6d5c0] rounded-lg px-3.5 py-2.5 text-sm text-[#5c4a3a] placeholder:text-[#b4a08b] focus:outline-none focus:border-[#c08b5c] focus:ring-2 focus:ring-[#c08b5c]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#a8703f] hover:bg-[#bb8250] text-[#f9f3ea] shadow-lg shadow-[#a8703f]/15',
  buttonGhost:
    'border border-[#dcc6ab] text-[#7d6650] hover:bg-[#f0e4d4] hover:border-[#c9ab89]',
  divider: 'bg-[#e6d5c0]',
  timelineLine: 'from-[#c08b5c] via-[#ddbe9a]/60 to-transparent'
};

export function NisanBohem({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={BOHEM_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(to bottom, #e8c79c 0%, #f6efe4 40%, #e4cdb2 100%)"
          scrim={{ from: 'both', strength: 0.38, tint: '255,250,242' }}
          vignette={{ strength: 0.26, tint: '120,85,55' }}
          atmosphere={
            <>
              {/* Alçalan güneş ufka yakın; çadır ağzından görünen kaynak. */}
              <SunDisc color="255,186,110" size={7} x={66} y={64} opacity={0.85} />
              {/* Uzak tepeler: yumuşak ve alçak — manzara derinliği verir,
                  dikkat çekmez. roughness düşük çünkü bohem sahne sakin. */}
              <Ridges color="122,86,62" opacity={0.5} height={0.3} layers={3} roughness={0.5} seed={19} />
              {/* Çadır ağzından giren yatık akşam ışığı: geniş açı, az sayı. */}
              <GodRays angle={26} origin={62} count={5} color="255,214,158" opacity={0.5} duration={20} />
              <FogDrift color="255,232,200" opacity={0.45} duration={46} />
            </>
          }
          particles={[
            // Gün batımında görünür hale gelen havada asılı toz.
            {
              preset: 'fairyDust',
              colors: ['#e8c08a', '#f3dcbc', '#d9a877'],
              blend: 'normal',
              density: 0.85,
              speed: 0.55,
              opacity: 0.6,
              depth: 1,
              seed: 29
            },
            // Pampa otundan kopan tüysü parçalar.
            {
              preset: 'feathers',
              colors: ['#e8d7bd', '#f2e6d2'],
              density: 0.6,
              speed: 0.6,
              opacity: 0.5,
              depth: 0.6,
              seed: 72
            }
          ]}
          grain={0.022}
          fadeTo="#f6efe4"
        />
      )}
    />
  );
}
