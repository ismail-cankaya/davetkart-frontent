import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, FogDrift, Halo } from '../../shared/effects';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Kanatlar üst-orta bantta; dikeyde biraz yukarı sabitlenir. */
const VIDEO = videoSet('baby-melek', { landscape: '50% 48%', portrait: '50% 40%' });

/**
 * BabyMelek — Konsept 1, "Melek Kanatları": bembeyaz bulutlar arasından
 * süzülen altın melek kanatları, yumuşak güneş huzmeleri, uçuşan tüyler.
 *
 * Bu konseptte vinyet neredeyse kapalı. Kenarları karartmak "melek/bulut"
 * temasının hafifliğini bozar; derinlik bunun yerine sisin katmanlarıyla
 * kuruluyor.
 */
const MELEK_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fbf8f2]',
  page: 'text-[#6b6055]',
  surface: 'bg-white/80 backdrop-blur-md',
  border: 'border-[#eee4d5]',
  heading: 'text-[#4a4238]',
  body: 'text-[#9b8f80]',
  accent: 'text-[#c9a961]',
  accentBg: 'bg-[#c9a961]',
  accentSoft: 'bg-[#c9a961]/12',
  input:
    'w-full bg-white/88 border border-[#eee4d5] rounded-lg px-3.5 py-2.5 text-sm text-[#6b6055] placeholder:text-[#b8ac9c] focus:outline-none focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#c9a961] hover:bg-[#d6ba79] text-[#fffdf8] shadow-lg shadow-[#c9a961]/20',
  buttonGhost:
    'border border-[#e5d8c2] text-[#8a7c6b] hover:bg-[#f6efe2] hover:border-[#d4c1a4]',
  divider: 'bg-[#eee4d5]',
  timelineLine: 'from-[#c9a961] via-[#e2d3b4]/60 to-transparent'
};

export function BabyMelek({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={MELEK_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="linear-gradient(to bottom, #eef4fb 0%, #fbf8f2 50%, #f6ecdc 100%)"
          scrim={{ from: 'both', strength: 0.4, tint: '255,255,255' }}
          // Melek/bulut hafifliği için kenar karartması kapalı.
          vignette={false}
          atmosphere={
            <>
              <GodRays angle={10} origin={50} count={8} color="255,246,225" opacity={0.55} duration={18} />
              <Halo color="255,240,214" size={80} x={50} y={36} opacity={0.6} duration={10} />
              <FogDrift color="255,255,255" opacity={0.7} duration={42} />
            </>
          }
          particles={[
            // Uçuşan beyaz tüyler — konseptin imzası, yavaş ve az sayıda.
            {
              preset: 'feathers',
              colors: ['#ffffff', '#f7f1e4', '#f2e8d5'],
              density: 1,
              speed: 0.6,
              opacity: 0.85,
              depth: 1,
              seed: 22
            },
            // Kanatlardan dökülen altın parıltı.
            {
              preset: 'fairyDust',
              colors: ['#c9a961', '#f0e2be'],
              density: 0.65,
              speed: 0.45,
              opacity: 0.5,
              depth: 0.5,
              seed: 78
            }
          ]}
          grain={0.016}
          fadeTo="#fbf8f2"
        />
      )}
    />
  );
}
