import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, AuroraMesh, Iridescent } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';

/**
 * DugunAurora — "Sedef": inci kabuğunun açık, yanardöner iç yüzeyi.
 * Pudra şakayık, lila ve nane lekeleri inci zeminde akar; üstünde yumuşak
 * bir iridesan parıltı. Koyu değil açık — sedef ışığı karanlıkta değil
 * gün ışığında okunur. Videosuz; yük CSS mesh'te.
 */
export function DugunAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunAurora}
      renderHero={(props) => <KurdeleHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(165deg, #fbf9fc 0%, #f1ecf6 50%, #ece6f2 100%)"
          scrim={false}
          vignette={false}
          atmosphere={
            <>
              <AuroraMesh colors={['243,196,216', '206,193,240', '190,226,214']} opacity={0.7} duration={24} />
              <Iridescent opacity={0.22} duration={18} className="mix-blend-soft-light" />
            </>
          }
          overlay={
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 62% 50% at 50% 50%, rgba(246,243,248,0.7), rgba(246,243,248,0) 78%)' }}
            />
          }
          parallax={10}
          grain={0.02}
          fadeTo="#f6f3f8"
        />
      )}
    />
  );
}
