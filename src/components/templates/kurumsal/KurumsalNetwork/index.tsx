import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Ağ merkezde yoğunlaşır; iki oranda da merkez korunur. */
const VIDEO = videoSet('kurumsal-network', { landscape: '50% 50%', portrait: '50% 50%' });

/**
 * KurumsalNetwork — Konsept 1, "Dinamik Ağ ve Veri": mat siyah zeminde
 * birbirine bağlanan mavi-mor fiber optik düğümler.
 *
 * Bağlantı çizgileri canvas'ta, düğümler arası mesafeye göre saydamlıkla
 * çizilir — sabit bir grafik değil, her karede yeniden hesaplanan canlı bir
 * topoloji. İşaretçi düğümleri kendine çeker: veri akışı kullanıcıyı takip
 * ediyormuş hissi buradan gelir.
 */
const NETWORK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#06070d]',
  page: 'text-[#dbe2f0]',
  surface: 'bg-white/[0.05] backdrop-blur-xl',
  border: 'border-[#5b8cf0]/22',
  heading: 'text-[#f2f6ff]',
  body: 'text-[#828da8]',
  accent: 'text-[#6ea8ff]',
  accentBg: 'bg-[#6ea8ff]',
  accentSoft: 'bg-[#6ea8ff]/12',
  input:
    'w-full bg-white/[0.05] border border-[#5b8cf0]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#e7ecf8] placeholder:text-[#6d7891] focus:outline-none focus:border-[#6ea8ff]/60 focus:ring-2 focus:ring-[#6ea8ff]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#4a7ef0] to-[#8b6cf0] hover:from-[#5a8bf5] hover:to-[#9a7cf5] text-[#f4f7ff] shadow-lg shadow-[#4a7ef0]/25',
  buttonGhost:
    'border border-[#5b8cf0]/28 text-[#dbe2f0] hover:bg-[#5b8cf0]/12 hover:border-[#5b8cf0]/48',
  divider: 'bg-[#5b8cf0]/18',
  timelineLine: 'from-[#6ea8ff] via-[#8b6cf0]/50 to-transparent'
};

export function KurumsalNetwork({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={NETWORK_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="radial-gradient(ellipse 85% 70% at 50% 45%, #131c3a 0%, #0a0d1c 55%, #05060c 100%)"
          scrim={{ from: 'both', strength: 0.4 }}
          vignette={{ strength: 0.58 }}
          atmosphere={<Halo color="110,168,255" size={66} x={50} y={45} opacity={0.26} duration={8} />}
          particles={[
            {
              preset: 'network',
              colors: ['#6ea8ff', '#8b6cf0', '#4a7ef0'],
              blend: 'screen',
              density: 1,
              speed: 0.8,
              opacity: 0.85,
              pointerStrength: 1.4,
              depth: 1,
              seed: 2
            }
          ]}
          parallax={11}
          fadeTo="#06070d"
        />
      )}
    />
  );
}
