import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiSuluboya — "Suluboya" parti yorumu: KOYU zeminde suya damlatılmış mürekkep.
 *
 * Suluboyanın tek gece sürümü. Hero, koyu temada lekeleri çarpma yerine
 * ekran modunda bastığı için boya kağıda emilmiyor, suda dağılıyor gibi
 * duruyor — aynı teknik, tamamen başka bir malzeme hissi.
 */
const PARTI_SULUBOYA_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0e0b14]',
  page: 'text-[#e4dcec]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f6f0fa]',
  body: 'text-[#948aa0]',
  accent: 'text-[#ff7fbf]',
  accentBg: 'bg-[#ff7fbf]',
  accentSoft: 'bg-[#ff7fbf]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f6f0fa] placeholder:text-[#948aa0] focus:outline-none focus:border-[#ff7fbf]/60 focus:ring-2 focus:ring-[#ff7fbf]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#ff7fbf] hover:bg-[#ff9bcd] text-[#160a14] shadow-lg shadow-[#ff7fbf]/25',
  buttonGhost: 'border border-white/16 text-[#e4dcec] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ff7fbf] via-[#5fd0f0]/45 to-transparent'
};

export function PartiSuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_SULUBOYA_THEME}
      renderHero={(props) => (
        <SuluboyaHero {...props} washes={['#ff5fa8', '#5fd0f0', '#c08ff0']} seed={71} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 35%, #1c1230 0%, #100b18 55%, #07050c 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          parallax={5}
          grain={0.03}
          fadeTo="#0e0b14"
        />
      )}
    />
  );
}
