import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh, Halo } from '../../shared/effects';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * MezuniyetAurora — "Aurora Cam" mezuniyet yorumu: gece laciverti mesh, nane–indigo cam.
 *
 * Kategorinin tamamı altın/lacivert akademik paletle kurulu; buradaki nane
 * vurgusu mezuniyeti "bitiş" değil "başlangıç" tarafından anlatmak için —
 * aynı ciddiyette ama daha ileriye bakan bir ton.
 */
const MEZUNIYET_AURORA_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#070b16]',
  page: 'text-[#dbe3ef]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-white/12',
  heading: 'text-[#f2f6ff]',
  body: 'text-[#8a93a8]',
  accent: 'text-[#6fd7c4]',
  accentBg: 'bg-[#6fd7c4]',
  accentSoft: 'bg-[#6fd7c4]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f6ff] placeholder:text-[#8a93a8] focus:outline-none focus:border-[#6fd7c4]/60 focus:ring-2 focus:ring-[#6fd7c4]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#6fd7c4] to-[#6c8cf0] hover:brightness-110 text-[#06131a] shadow-lg shadow-[#6fd7c4]/25',
  buttonGhost:
    'border border-white/16 text-[#dbe3ef] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#6fd7c4] via-[#6c8cf0]/50 to-transparent'
};

export function MezuniyetAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_AURORA_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 110% 90% at 50% 22%, #102a3c 0%, #0a1524 55%, #05080f 100%)"
          scrim={{ from: 'both', strength: 0.3 }}
          vignette={{ strength: 0.45 }}
          atmosphere={
            <>
              <AuroraMesh colors={['111,215,196', '108,140,240', '170,200,255']} opacity={0.58} duration={27} />
              <Halo color="111,215,196" size={62} x={50} y={40} opacity={0.22} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#6fd7c4', '#6c8cf0'],
              blend: 'screen',
              density: 0.7,
              speed: 0.45,
              opacity: 0.68,
              pointerStrength: 1.4,
              depth: 1,
              seed: 233
            }
          ]}
          parallax={7}
          grain={0.03}
          fadeTo="#070b16"
        />
      )}
    />
  );
}
