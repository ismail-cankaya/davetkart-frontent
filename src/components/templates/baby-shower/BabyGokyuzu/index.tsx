import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo, FogDrift } from '../../shared/effects';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * Kendi videosu: Düğün'ün "gokyuzu-ruyasi" çekimi burada tekrar edilmez,
 * böylece iki kategori aynı kapakla listelenmez.
 */
const VIDEO = videoSet('baby-gokyuzu', { landscape: '50% 50%', portrait: '50% 42%' });

/**
 * BabyGokyuzu — Konsept 3, "Gökyüzü Macerası": gün batımında pastel gökte
 * süzülen devasa sıcak hava balonları, sepetlerinden sarkan tül kurdeleler.
 *
 * Balon parçacıkları büyük ve seyrek (density 0.6): videodaki gerçek
 * balonlarla yarışmasınlar, onlara eşlik etsinler diye. Yoğunluk artarsa
 * kompozisyon oyuncak gibi görünür, sinematik olmaktan çıkar.
 */
const BABY_GOKYUZU_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f2f6fb]',
  page: 'text-[#54637a]',
  surface: 'bg-white/78 backdrop-blur-md',
  border: 'border-[#dde7f2]',
  heading: 'text-[#33455e]',
  body: 'text-[#8494a8]',
  accent: 'text-[#e8917f]',
  accentBg: 'bg-[#e8917f]',
  accentSoft: 'bg-[#e8917f]/12',
  input:
    'w-full bg-white/88 border border-[#dde7f2] rounded-lg px-3.5 py-2.5 text-sm text-[#54637a] placeholder:text-[#a5b3c4] focus:outline-none focus:border-[#e8917f] focus:ring-2 focus:ring-[#e8917f]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#5b7ba6] hover:bg-[#6c8cb7] text-[#f4f8fc] shadow-lg shadow-[#5b7ba6]/18',
  buttonGhost:
    'border border-[#cddcec] text-[#68798f] hover:bg-[#e8f0f8] hover:border-[#aec6de]',
  divider: 'bg-[#dde7f2]',
  timelineLine: 'from-[#e8917f] via-[#a9c3dd]/60 to-transparent'
};

export function BabyGokyuzu({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_GOKYUZU_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="linear-gradient(to bottom, #b9d4ee 0%, #f2ddd6 55%, #f2f6fb 100%)"
          scrim={{ from: 'both', strength: 0.38, tint: '255,255,255' }}
          vignette={{ strength: 0.2, tint: '80,110,150' }}
          atmosphere={
            <>
              <Halo color="255,220,205" size={76} x={50} y={42} opacity={0.55} duration={11} />
              <FogDrift color="255,255,255" opacity={0.5} duration={48} />
            </>
          }
          particles={[
            // Uzaktaki balon filosu: büyük, yavaş, seyrek.
            {
              preset: 'balloons',
              colors: ['#e8917f', '#f2c48c', '#8fb4d9', '#e9a8c0'],
              density: 0.6,
              speed: 0.55,
              opacity: 0.7,
              depth: 0.5,
              seed: 26
            },
            // Kurdelelerden kopan hafif tüller.
            {
              preset: 'feathers',
              colors: ['#ffffff', '#fbe4dc'],
              density: 0.5,
              speed: 0.5,
              opacity: 0.45,
              depth: 1,
              seed: 87
            }
          ]}
          grain={0.016}
          fadeTo="#f2f6fb"
        />
      )}
    />
  );
}
