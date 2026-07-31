import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo, FogDrift } from '../../shared/effects';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * Kendi videosunu kullanır. Düğün'ün "mum-isigi" çekimini paylaşmak varlık
 * maliyetini düşürürdü ama aynı görsel iki kategoride birden listelenir ve
 * temalar kategoriye göre ayrışmaz — kategori kimliği maliyetten önce gelir.
 */
const VIDEO = videoSet('kina-mum', { landscape: '50% 55%', portrait: '50% 58%' });

/**
 * KinaMum — Konsept 3, "Mistik Mumlar": su üzerinde yüzen yüzlerce kırmızı
 * mum ve kına gülü, titreşen yansımalar.
 *
 * Buradaki tek "yükselen" efekt kor (embers): mum alevinden kopan sıcak
 * zerreler. Yaprak ya da toz eklemek suyun durgunluğunu bozardı — konseptin
 * gücü hareketin azlığında.
 */
const KINA_MUM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#120608]',
  page: 'text-[#eed9cf]',
  surface: 'bg-white/[0.05] backdrop-blur-xl',
  border: 'border-[#e09a5e]/20',
  heading: 'text-[#fbeadb]',
  body: 'text-[#a88579]',
  accent: 'text-[#e09a5e]',
  accentBg: 'bg-[#e09a5e]',
  accentSoft: 'bg-[#e09a5e]/10',
  input:
    'w-full bg-white/[0.05] border border-[#e09a5e]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#f6e4d6] placeholder:text-[#8a6a5f] focus:outline-none focus:border-[#e09a5e]/60 focus:ring-2 focus:ring-[#e09a5e]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#b3323f] hover:bg-[#c64450] text-[#fdeee6] shadow-lg shadow-[#b3323f]/25',
  buttonGhost:
    'border border-[#e09a5e]/25 text-[#eed9cf] hover:bg-[#e09a5e]/10 hover:border-[#e09a5e]/45',
  divider: 'bg-[#e09a5e]/16',
  timelineLine: 'from-[#e09a5e] via-[#b3323f]/50 to-transparent'
};

export function KinaMum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_MUM_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="radial-gradient(ellipse 80% 65% at 50% 62%, #4a1a12 0%, #22090b 55%, #0e0405 100%)"
          scrim={{ from: 'both', strength: 0.44 }}
          vignette={{ strength: 0.62 }}
          atmosphere={
            <>
              <Halo color="224,154,94" size={70} x={50} y={58} opacity={0.35} duration={7} />
              {/* Su yüzeyinde biriken hafif buhar. */}
              <FogDrift color="255,190,150" opacity={0.28} duration={44} />
            </>
          }
          particles={[
            {
              preset: 'embers',
              colors: ['#ffb257', '#e0632f', '#ffd9a0'],
              blend: 'screen',
              density: 0.9,
              speed: 0.7,
              opacity: 0.8,
              depth: 1,
              seed: 37
            }
          ]}
          parallax={10}
          fadeTo="#120608"
        />
      )}
    />
  );
}
