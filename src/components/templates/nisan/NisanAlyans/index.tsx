import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo, LightLeak } from '../../shared/effects';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Alyanslar kadrajın merkezinde yükselir; her iki oranda da merkez korunur. */
const VIDEO = videoSet('nisan-alyans', { landscape: '50% 50%', portrait: '50% 50%' });

/**
 * NisanAlyans — Konsept 2, "Zarif Alyanslar": kadifemsi su yüzeyindeki
 * dairesel dalgalanmadan yükselen iki pırlantalı alyans.
 *
 * Efekt seçimi bilinçli olarak cimri: konseptin öznesi videodaki tek
 * hareket. Üstüne yoğun parçacık binerse pırlantanın parlaması kaybolur.
 * Bu yüzden yalnızca seyrek, soğuk beyaz kıvılcım ve merkezde tek hale var.
 */
const ALYANS_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#070a10]',
  page: 'text-[#dfe4ec]',
  surface: 'bg-white/[0.05] backdrop-blur-xl',
  border: 'border-[#9db4d0]/18',
  heading: 'text-[#f4f8ff]',
  body: 'text-[#8794a6]',
  accent: 'text-[#bcd4ea]',
  accentBg: 'bg-[#bcd4ea]',
  accentSoft: 'bg-[#bcd4ea]/10',
  input:
    'w-full bg-white/[0.05] border border-[#9db4d0]/18 rounded-lg px-3.5 py-2.5 text-sm text-[#eaf0f8] placeholder:text-[#71808f] focus:outline-none focus:border-[#bcd4ea]/55 focus:ring-2 focus:ring-[#bcd4ea]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#bcd4ea] to-[#e6eef8] hover:from-[#cadeef] hover:to-[#f2f7fd] text-[#0b1018] shadow-lg shadow-[#bcd4ea]/20',
  buttonGhost:
    'border border-[#9db4d0]/25 text-[#dfe4ec] hover:bg-[#9db4d0]/10 hover:border-[#9db4d0]/45',
  divider: 'bg-[#9db4d0]/15',
  timelineLine: 'from-[#bcd4ea] via-[#9db4d0]/40 to-transparent'
};

export function NisanAlyans({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={ALYANS_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="radial-gradient(ellipse 80% 65% at 50% 55%, #16202e 0%, #0a0f17 60%, #05070b 100%)"
          scrim={{ from: 'both', strength: 0.42 }}
          vignette={{ strength: 0.62 }}
          atmosphere={
            <>
              <Halo color="188,212,234" size={58} x={50} y={50} opacity={0.28} duration={8} />
              {/* Pırlanta yansıması gibi tek, uzun aralıklı ışık geçişi. */}
              <LightLeak color="235,245,255" opacity={0.3} duration={17} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#bcd4ea', '#e6eef8'],
              blend: 'screen',
              density: 0.55,
              speed: 0.45,
              opacity: 0.7,
              pointerStrength: 1.4,
              depth: 1,
              seed: 41
            }
          ]}
          parallax={10}
          fadeTo="#070a10"
        />
      )}
    />
  );
}
