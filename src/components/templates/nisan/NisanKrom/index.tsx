import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Iridescent, Halo } from '../../shared/effects';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * NisanKrom — "Likit Krom" nişan yorumu: buzul mavisi iridesan metal.
 *
 * Düğün kromu lila–mavi karışımı; burada tayf daha dar ve soğuk tutuldu
 * (turkuaz–çelik), böylece iki krom şablonu yan yana konduğunda ayırt
 * edilebiliyor.
 */
const NISAN_KROM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#080c12]',
  page: 'text-[#dbe4ee]',
  surface: 'bg-white/[0.07] backdrop-blur-2xl backdrop-saturate-150',
  border: 'border-white/16',
  heading:
    'text-transparent bg-clip-text bg-gradient-to-br from-[#f0f8ff] via-[#a9d8ec] to-[#8fb4e0]',
  body: 'text-[#8f9cb0]',
  accent: 'text-[#9fd0e8]',
  accentBg: 'bg-[#9fd0e8]',
  accentSoft: 'bg-[#9fd0e8]/12',
  input:
    'w-full bg-white/[0.07] border border-white/16 rounded-xl px-3.5 py-2.5 text-sm text-[#e8eef7] placeholder:text-[#78849a] focus:outline-none focus:border-[#9fd0e8]/60 focus:ring-2 focus:ring-[#9fd0e8]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#dff0fa] via-[#a9d8ec] to-[#8fb4e0] hover:brightness-110 text-[#0a1119] shadow-lg shadow-[#9fd0e8]/20',
  buttonGhost:
    'border border-white/18 text-[#dbe4ee] hover:bg-white/[0.08] hover:border-white/32',
  divider: 'bg-white/14',
  timelineLine: 'from-[#9fd0e8] via-[#8fb4e0]/50 to-transparent'
};

export function NisanKrom({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_KROM_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(150deg, #101c2b 0%, #0a1119 55%, #060a0f 100%)"
          scrim={{ from: 'both', strength: 0.42 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              {/* hue-rotate ile tayfı soğuk uca kaydırır: aynı katman, başka metal. */}
              <Iridescent
                opacity={0.3}
                duration={17}
                className="mix-blend-soft-light [filter:hue-rotate(200deg)_saturate(0.85)]"
              />
              <Halo color="159,208,232" size={62} x={50} y={40} opacity={0.2} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'streaks',
              colors: ['#9fd0e8', '#c2e9fb', '#8fb4e0'],
              blend: 'screen',
              density: 0.7,
              speed: 0.6,
              opacity: 0.3,
              depth: 0.5,
              seed: 115
            },
            {
              preset: 'stardust',
              colors: ['#ffffff', '#a9d8ec'],
              blend: 'screen',
              density: 0.5,
              speed: 0.4,
              opacity: 0.55,
              pointerStrength: 1.5,
              depth: 1,
              seed: 116
            }
          ]}
          grain={0.03}
          fadeTo="#080c12"
        />
      )}
    />
  );
}
