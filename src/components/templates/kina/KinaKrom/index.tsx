import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Iridescent } from '../../shared/effects';
import { KINA_KROM } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { KinaHero } from '../parts/KinaHero';
import { DAMGA_KINA } from '../parts/KinaDamga';
import { TemplateProps } from '../../types';

/** Dövme bakırın çekiç izleri: iç içe, kaydırmalı ince halkalar. */
function CekicIzi() {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute -right-[38%] top-[8%] w-[110%] @md:w-[56%] @md:-right-[8%] aspect-square opacity-60">
      {[46, 39, 32, 25, 18, 11].map((r, i) => (
        <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#f4b48c" strokeOpacity={0.22 - i * 0.025} strokeWidth="0.35" />
      ))}
    </svg>
  );
}

/**
 * KinaKrom — "Bakır Tepsi": kına tepsisinin dövme bakırı. Sıcak iridesan
 * yansıma, köşede çekiç halkaları ve sola yaslı, bakır degradeli iri adlar.
 */
export function KinaKrom({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_KROM}
      renderHero={(props) => <KinaHero {...props} align="start" damga={DAMGA_KINA} flame="#ffd9b0" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(150deg, #33180e 0%, #1c0d08 55%, #0e0604 100%)"
          scrim={{ from: 'both', strength: 0.38 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <Iridescent
                opacity={0.3}
                duration={16}
                className="mix-blend-soft-light [filter:hue-rotate(330deg)_saturate(1.3)]"
              />
              <CekicIzi />
            </>
          }
          particles={[
            {
              preset: 'streaks',
              colors: ['#f4b48c', '#de8a5e', '#ffd9c0'],
              blend: 'screen',
              density: 0.6,
              speed: 0.55,
              opacity: 0.28,
              depth: 0.5,
              seed: 125
            }
          ]}
          grain={0.03}
          fadeTo="#140a07"
        />
      )}
    />
  );
}
