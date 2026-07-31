import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo, FogDrift, CloudBank } from '../../shared/effects';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DogumGunuBulut — Konsept 2, "Sihirli Bulutlar" (çocuklar için): pamuk
 * şekeri bulutlar, zıplayan animasyon karakterleri, yağan yıldız ve şeker.
 *
 * Tek açık temalı doğum günü konsepti. Çocuk davetiyesinde koyu zemin
 * kaygı verir; pastel zemin + koyu metin tercih edildi. Scrim bu yüzden
 * beyaz tonda: karartmıyor, yumuşatıyor.
 */
const BULUT_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fdf2f8]',
  page: 'text-[#5d4560]',
  surface: 'bg-white/78 backdrop-blur-md',
  border: 'border-[#f3d8ea]',
  heading: 'text-[#43304a]',
  body: 'text-[#96809c]',
  accent: 'text-[#e277b0]',
  accentBg: 'bg-[#e277b0]',
  accentSoft: 'bg-[#e277b0]/12',
  input:
    'w-full bg-white/88 border border-[#f3d8ea] rounded-lg px-3.5 py-2.5 text-sm text-[#5d4560] placeholder:text-[#b8a3bd] focus:outline-none focus:border-[#e277b0] focus:ring-2 focus:ring-[#e277b0]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#e277b0] hover:bg-[#ea8dbe] text-[#fff5fa] shadow-lg shadow-[#e277b0]/25',
  buttonGhost:
    'border border-[#edc9e0] text-[#8a6e90] hover:bg-[#fbe8f3] hover:border-[#e0aacd]',
  divider: 'bg-[#f3d8ea]',
  timelineLine: 'from-[#e277b0] via-[#a6c8f0]/60 to-transparent'
};

export function DogumGunuBulut({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={BULUT_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(to bottom, #c8e0fb 0%, #f6dcee 50%, #fdf2f8 100%)"
          scrim={{ from: 'both', strength: 0.42, tint: '255,255,255' }}
          vignette={{ strength: 0.2, tint: '140,100,150' }}
          atmosphere={
            <>
              <Halo color="255,214,236" size={78} x={50} y={36} opacity={0.55} duration={8} />
              {/* Pamuk şekeri bulutları: pembe ve mavi iki bank üst üste —
                  karakterlerin üzerinde zıpladığı zemin. */}
              <CloudBank color="200,224,251" opacity={0.5} height={0.32} puffs={16} seed={61} />
              <CloudBank color="255,232,246" opacity={0.9} height={0.44} puffs={12} seed={67} />
              <FogDrift color="255,255,255" opacity={0.6} duration={38} />
            </>
          }
          particles={[
            // Gökyüzünden yağan yıldızlar ve renkli şekerlemeler.
            {
              preset: 'confetti',
              colors: ['#e277b0', '#7cb8f0', '#ffd166', '#8ce0c0'],
              density: 0.85,
              speed: 0.7,
              opacity: 0.85,
              depth: 1,
              seed: 15
            },
            {
              preset: 'stardust',
              colors: ['#ffffff', '#ffd166', '#f7b6d8'],
              density: 0.8,
              speed: 0.5,
              opacity: 0.75,
              pointerStrength: 1.4,
              depth: 0.7,
              seed: 61
            }
          ]}
          grain={0.018}
          fadeTo="#fdf2f8"
        />
      )}
    />
  );
}
