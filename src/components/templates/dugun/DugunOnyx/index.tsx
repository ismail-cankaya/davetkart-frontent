import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { HeroStage, Halo, GoldSheen } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';

/** Sıvı metal hatlar kadrajın kenarlarında; merkez tipografi için temiz kalır. */
const VIDEO = videoSet('dugun-onyx', { landscape: '50% 50%', portrait: '50% 50%' });

/** Stel: kadrajı boydan boya iki inci kıl çizgi ve ortalarında birer elmas. */
function Stel() {
  const rail = 'absolute top-[5%] bottom-[5%] w-px bg-gradient-to-b from-transparent via-[#e4dbe9]/45 to-transparent';
  const gem = 'absolute top-1/2 w-2 h-2 -translate-y-1/2 rotate-45 border border-[#e4dbe9]/60 bg-[#070708]';
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <span className={`${rail} left-[3%]`} />
      <span className={`${rail} right-[3%]`} />
      <span className={`${gem} left-[3%] -translate-x-1/2`} />
      <span className={`${gem} right-[3%] translate-x-1/2`} />
    </div>
  );
}

/**
 * DugunOnyx — "Onyx & İnci": saf siyah zeminde akan sıvı metal; metin
 * kadrajı boydan boya taşıyan iki inci kıl çizginin (stel) arasında,
 * kategorinin en iri isimleriyle durur.
 */
export function DugunOnyx({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunOnyx}
      renderHero={(props) => (
        <KurdeleHero {...props} nameClassName="text-[3.2rem] @sm:text-6xl @lg:text-7xl leading-[0.98]" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="radial-gradient(ellipse 90% 70% at 50% 45%, #121114 0%, #09090a 55%, #040405 100%)"
          // Zaten siyah videoda güçlü scrim = ölü kadraj. Alt bant ve hafif merkez.
          scrim={[
            { from: 'bottom', strength: 0.35 },
            { from: 'center', strength: 0.4 }
          ]}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Halo color="228,219,233" size={70} x={50} y={42} opacity={0.14} duration={9} />
              <GoldSheen color="239,232,243" opacity={0.12} duration={9} />
            </>
          }
          particles={[
            // Sıvı metalin etrafında asılı kalan inci parıltılar.
            {
              preset: 'stardust',
              colors: ['#efe8f3', '#d9cfe3', '#e8b9c9'],
              blend: 'screen',
              density: 0.7,
              speed: 0.6,
              opacity: 0.7,
              pointerStrength: 1.3,
              depth: 1,
              seed: 5
            }
          ]}
          overlay={<Stel />}
          fadeTo="#070708"
        />
      )}
    />
  );
}
