import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo, GoldSheen } from '../../shared/effects';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Kendi videosu: Nişan'ın şampanya çekimiyle karışmasın, kategori ayrışsın. */
const VIDEO = videoSet('dogum-gunu-zarif', { landscape: '50% 50%', portrait: '50% 45%' });

/**
 * DogumGunuZarif — Konsept 3, "Zarif Kutlama": kristal kadehten yükselen
 * altın baloncuklar, arkada hareket eden lüks ipek dokusu.
 *
 * Kabarcıklar iki katmanda: büyük ve yavaş olanlar arkada (kadehin dibi),
 * küçük ve hızlı olanlar önde (yüzeye yakın). Tek katman olsaydı sıvı
 * derinliği kaybolur, düz bir desen gibi okunurdu.
 */
const ZARIF_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#0c0a07]',
  page: 'text-[#e8ddc9]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-[#d9bd7c]/22',
  heading: 'text-[#faf1dd]',
  body: 'text-[#9c9078]',
  accent: 'text-[#d9bd7c]',
  accentBg: 'bg-[#d9bd7c]',
  accentSoft: 'bg-[#d9bd7c]/10',
  input:
    'w-full bg-white/[0.06] border border-[#d9bd7c]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#f3e9d5] placeholder:text-[#847a66] focus:outline-none focus:border-[#d9bd7c]/60 focus:ring-2 focus:ring-[#d9bd7c]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#d9bd7c] to-[#efdaa8] hover:from-[#e4ca8e] hover:to-[#f6e6bd] text-[#171208] shadow-lg shadow-[#d9bd7c]/20',
  buttonGhost:
    'border border-[#d9bd7c]/25 text-[#e8ddc9] hover:bg-[#d9bd7c]/10 hover:border-[#d9bd7c]/45',
  divider: 'bg-[#d9bd7c]/18',
  timelineLine: 'from-[#d9bd7c] via-[#d9bd7c]/40 to-transparent'
};

export function DogumGunuZarif({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={ZARIF_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="radial-gradient(ellipse 80% 70% at 50% 50%, #322612 0%, #16110a 55%, #0a0805 100%)"
          scrim={{ from: 'both', strength: 0.4 }}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Halo color="217,189,124" size={64} x={50} y={46} opacity={0.3} duration={9} />
              <GoldSheen color="239,218,168" opacity={0.2} duration={8} />
            </>
          }
          particles={[
            // Yüzeye yakın: küçük, hızlı, yoğun.
            {
              preset: 'bubbles',
              colors: ['#efdaa8', '#d9bd7c', '#fff4d8'],
              blend: 'screen',
              density: 1.2,
              speed: 1,
              opacity: 0.75,
              depth: 1,
              seed: 9
            },
            // Kadehin dibi: büyük, yavaş, sönük.
            {
              preset: 'bubbles',
              colors: ['#d9bd7c'],
              blend: 'screen',
              density: 0.5,
              speed: 0.45,
              opacity: 0.4,
              depth: 0.35,
              seed: 73
            }
          ]}
          fadeTo="#0c0a07"
        />
      )}
    />
  );
}
