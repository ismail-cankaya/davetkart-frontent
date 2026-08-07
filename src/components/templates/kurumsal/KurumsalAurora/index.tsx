import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh, Halo } from '../../shared/effects';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KurumsalAurora — "Aurora Cam" kurumsal yorumu: lansman gecesi. İndigo–mor mesh, cam yüzeyler.
 *
 * Kategorinin mevcut koyu şablonları turkuaz/çelik etrafında; indigo–mor
 * ikilisi ürün lansmanı ve teknoloji zirvesi dilini işaret eder.
 */
const KURUMSAL_AURORA_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#07070f]',
  page: 'text-[#dcdcea]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-white/12',
  heading: 'text-[#f4f4ff]',
  body: 'text-[#8b8ba3]',
  accent: 'text-[#8b7dff]',
  accentBg: 'bg-[#8b7dff]',
  accentSoft: 'bg-[#8b7dff]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f4f4ff] placeholder:text-[#8b8ba3] focus:outline-none focus:border-[#8b7dff]/60 focus:ring-2 focus:ring-[#8b7dff]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#8b7dff] to-[#4f9dff] hover:brightness-110 text-[#070714] shadow-lg shadow-[#8b7dff]/25',
  buttonGhost:
    'border border-white/16 text-[#dcdcea] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#8b7dff] via-[#4f9dff]/50 to-transparent'
};

export function KurumsalAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_AURORA_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 110% 90% at 50% 22%, #1a1840 0%, #0d0d20 55%, #05050c 100%)"
          scrim={{ from: 'both', strength: 0.3 }}
          vignette={{ strength: 0.45 }}
          atmosphere={
            <>
              <AuroraMesh colors={['139,125,255', '79,157,255', '200,140,255']} opacity={0.6} duration={25} />
              <Halo color="139,125,255" size={62} x={50} y={40} opacity={0.24} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#8b7dff', '#4f9dff'],
              blend: 'screen',
              density: 0.65,
              speed: 0.45,
              opacity: 0.65,
              pointerStrength: 1.4,
              depth: 1,
              seed: 311
            }
          ]}
          parallax={7}
          grain={0.03}
          fadeTo="#07070f"
        />
      )}
    />
  );
}
