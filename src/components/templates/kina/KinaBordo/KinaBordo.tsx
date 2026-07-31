import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, SilkVeil, GoldSheen, Halo } from '../../shared/effects';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

const VIDEO = videoSet('kina-bordo', { landscape: '50% 50%', portrait: '50% 50%' });

/**
 * KinaBordo — "Bordo İpek": şarap kırmızısı ipek kıvrımları üzerinde süzülen altın ışık ve toz.
 * Palet doğrudan videonun renklerinden türetildi.
 */
const KINA_BORDO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#1d0710]',
  page: 'text-[#f2ded3]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/10',
  heading: 'text-[#f2ded3]',
  body: 'text-[#c0a094]',
  accent: 'text-[#e8c07a]',
  accentBg: 'bg-[#e8c07a]',
  accentSoft: 'bg-[#e8c07a]/10',
  input:
    'w-full bg-white/[0.05] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#f2ded3] placeholder:text-[#c0a094] focus:outline-none focus:border-[#e8c07a]/50 focus:ring-2 focus:ring-[#e8c07a]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#e8c07a] hover:bg-[#f0cf95] text-[#2b0a15] shadow-lg shadow-[#e8c07a]/15',
  buttonGhost:
    'border border-white/15 text-[#f2ded3] hover:bg-white/5 hover:border-white/25',
  divider: 'bg-white/10',
  timelineLine: 'from-[#e8c07a] via-[#e8c07a]/40 to-transparent'
};

export function KinaBordo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_BORDO_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="radial-gradient(ellipse 85% 70% at 50% 45%, #61121f 0%, #2c0810 55%, #150409 100%)"
          scrim={{ from: 'both', strength: 0.44 }}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              {/* Uçuşan yakut/bordo ipek tüller — konseptin ön katmanı. */}
              <SilkVeil color="150,25,52" opacity={0.5} duration={17} />
              <Halo color="226,186,110" size={62} x={50} y={44} opacity={0.3} duration={10} />
              {/* Altın varaklı mandala motifinin üzerinde gezen parlama. */}
              <GoldSheen color="240,208,140" opacity={0.2} duration={9} />
            </>
          }
          particles={[
            {
              preset: 'petals',
              colors: ['#8e1b2e', '#b8283f', '#e2ba6e'],
              density: 0.85,
              speed: 0.8,
              opacity: 0.8,
              depth: 1,
              seed: 12
            },
            {
              preset: 'fairyDust',
              colors: ['#e2ba6e', '#f5dda6'],
              blend: 'screen',
              density: 0.75,
              speed: 0.55,
              opacity: 0.6,
              depth: 0.5,
              seed: 58
            }
          ]}
          fadeTo="#1d0710"
        />
      )}
    />
  );
}
