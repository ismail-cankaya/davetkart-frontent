import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo, GoldSheen } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Sıvı altın hatlar kadrajın kenarlarında; merkez tipografi için temiz kalır. */
const VIDEO = videoSet('dugun-onyx', { landscape: '50% 50%', portrait: '50% 50%' });

/**
 * DugunOnyx — Konsept 2, "Modern Lüks Soyut": onyx siyahı zeminde birbirine
 * geçen sıvı altın ve rose-gold hatlar.
 *
 * Bu konseptte scrim neredeyse yok: video zaten %90 siyah, üstüne koyu
 * katman binerse altın hatlar ölür. Okunabilirliği scrim yerine metnin
 * arkasındaki Halo üstleniyor — kontrast eklenerek değil, ışık eklenerek
 * kuruluyor.
 */
const ONYX_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#080807]',
  page: 'text-[#e0d8c8]',
  surface: 'bg-white/[0.05] backdrop-blur-xl',
  border: 'border-[#d4af5f]/20',
  heading: 'text-[#f7edd6]',
  body: 'text-[#8f8677]',
  accent: 'text-[#d4af5f]',
  accentBg: 'bg-[#d4af5f]',
  accentSoft: 'bg-[#d4af5f]/10',
  input:
    'w-full bg-white/[0.05] border border-[#d4af5f]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#f0e7d5] placeholder:text-[#7a7264] focus:outline-none focus:border-[#d4af5f]/60 focus:ring-2 focus:ring-[#d4af5f]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#d4af5f] to-[#e8c987] hover:from-[#e0bd70] hover:to-[#f0d59a] text-[#14100a] shadow-lg shadow-[#d4af5f]/20',
  buttonGhost:
    'border border-[#d4af5f]/25 text-[#e0d8c8] hover:bg-[#d4af5f]/10 hover:border-[#d4af5f]/45',
  divider: 'bg-[#d4af5f]/15',
  timelineLine: 'from-[#d4af5f] via-[#d4af5f]/35 to-transparent'
};

export function DugunOnyx({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={ONYX_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="radial-gradient(ellipse 90% 70% at 50% 45%, #17140e 0%, #0b0a08 55%, #050504 100%)"
          // Zaten siyah videoda güçlü scrim = ölü kadraj. Sadece alt bantta.
          scrim={{ from: 'bottom', strength: 0.35 }}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Halo color="212,175,95" size={70} x={50} y={42} opacity={0.3} duration={9} />
              <GoldSheen color="232,201,135" opacity={0.18} duration={9} />
            </>
          }
          particles={[
            // Sıvı altının etrafında asılı kalan metalik parıltılar.
            {
              preset: 'stardust',
              colors: ['#d4af5f', '#e8c987', '#e0a99b'],
              blend: 'screen',
              density: 0.8,
              speed: 0.6,
              opacity: 0.75,
              pointerStrength: 1.3,
              depth: 1,
              seed: 5
            },
            // Yukarı süzülen ince altın çizgiler — "sıvı" hissini uzatır.
            {
              preset: 'streaks',
              colors: ['#d4af5f', '#8c7440'],
              blend: 'screen',
              density: 0.5,
              speed: 0.35,
              opacity: 0.3,
              depth: 0.4,
              seed: 91
            }
          ]}
          fadeTo="#080807"
        />
      )}
    />
  );
}
