import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Sütunlu koridor perspektifi merkezde kaçar; iki oranda da merkez korunur. */
const VIDEO = videoSet('mezuniyet-kampus', { landscape: '50% 50%', portrait: '50% 45%' });

/**
 * MezuniyetKampus — Konsept 1, "Tarihi Okul & Kep Atma": sütunlu tarihi
 * koridor, havaya savrulan kitap sayfaları ve altın not kağıtları.
 *
 * Sayfalar aşağıdan yukarı gider ve tepede yavaşlar (motorda yerçekimi
 * yükselişi sönümler) — kep atma anının duraksaması bu sönümlemede yaşıyor.
 */
const KAMPUS_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#12100c]',
  page: 'text-[#e8e0cf]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-[#c9a961]/22',
  heading: 'text-[#f8f1e0]',
  body: 'text-[#a0937c]',
  accent: 'text-[#c9a961]',
  accentBg: 'bg-[#c9a961]',
  accentSoft: 'bg-[#c9a961]/10',
  input:
    'w-full bg-white/[0.06] border border-[#c9a961]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#f2ebda] placeholder:text-[#877b66] focus:outline-none focus:border-[#c9a961]/60 focus:ring-2 focus:ring-[#c9a961]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#c9a961] hover:bg-[#d8ba76] text-[#1a1409] shadow-lg shadow-[#c9a961]/20',
  buttonGhost:
    'border border-[#c9a961]/25 text-[#e8e0cf] hover:bg-[#c9a961]/10 hover:border-[#c9a961]/45',
  divider: 'bg-[#c9a961]/18',
  timelineLine: 'from-[#c9a961] via-[#c9a961]/40 to-transparent'
};

export function MezuniyetKampus({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={KAMPUS_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="linear-gradient(to bottom, #3a3225 0%, #201b14 50%, #100e0a 100%)"
          scrim={{ from: 'both', strength: 0.48 }}
          vignette={{ strength: 0.58 }}
          atmosphere={
            <>
              {/* Koridor kemerlerinden düşen ışık: dik açı, güçlü kontrast. */}
              <GodRays angle={8} origin={50} count={7} color="255,235,190" opacity={0.5} duration={19} />
              <Halo color="201,169,97" size={62} x={50} y={44} opacity={0.24} duration={11} />
            </>
          }
          particles={[
            // Uçuşan kitap sayfaları ve not kağıtları.
            {
              preset: 'pages',
              colors: ['#f3ead4', '#e6d9b8', '#c9a961'],
              density: 1,
              speed: 0.9,
              opacity: 0.85,
              depth: 1,
              seed: 34
            },
            // Kağıtlardan kopan altın toz — havada kalan kalıntı.
            {
              preset: 'fairyDust',
              colors: ['#c9a961', '#f0e0b4'],
              blend: 'screen',
              density: 0.6,
              speed: 0.5,
              opacity: 0.5,
              depth: 0.45,
              seed: 88
            }
          ]}
          fadeTo="#12100c"
        />
      )}
    />
  );
}
