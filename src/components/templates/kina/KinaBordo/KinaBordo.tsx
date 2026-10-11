import React, { useId } from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { HeroStage, SilkVeil, Halo } from '../../shared/effects';
import { KINA_BORDO } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { KinaHero } from '../parts/KinaHero';
import { TemplateProps } from '../../types';

const VIDEO = videoSet('kina-bordo', { landscape: '50% 50%', portrait: '50% 50%' });

/** Duvak oyası: ipek kenarına iğneyle örülen kavisler ve altlarında çiçek pulları. */
function OyaKenar({ className }: { className?: string }) {
  const id = `kina-oya-${useId().replace(/:/g, '')}`;
  return (
    <svg aria-hidden="true" className={className} width="100%" height="18" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="24" height="18" patternUnits="userSpaceOnUse">
          <path d="M0 2Q6 13 12 2Q18 13 24 2" fill="none" stroke="currentColor" strokeWidth="0.9" />
          <circle cx="6" cy="11.5" r="1.3" fill="currentColor" />
          <circle cx="18" cy="11.5" r="1.3" fill="currentColor" />
          <circle cx="6" cy="15.6" r="0.7" fill="currentColor" fillOpacity="0.7" />
          <circle cx="18" cy="15.6" r="0.7" fill="currentColor" fillOpacity="0.7" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="1" fill="currentColor" />
      <rect x="0" y="0" width="100%" height="18" fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * KinaBordo — "Al Duvak": şarap ipeği videosunun üstünde duvağın oyalı kenarı,
 * dalgalanan al tül ve sırma pullar. Metin okuma halesiyle videodan ayrılır.
 */
export function KinaBordo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_BORDO}
      renderHero={(props) => <KinaHero {...props} halo="24,5,12" flame="#ffd27f" className="pt-24" />}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="radial-gradient(ellipse 85% 70% at 50% 45%, #61121f 0%, #2c0810 55%, #150409 100%)"
          scrim={{ from: 'both', strength: 0.5 }}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <SilkVeil color="176,36,28" opacity={0.42} duration={17} />
              <Halo color="242,160,102" size={62} x={50} y={44} opacity={0.16} duration={10} />
            </>
          }
          particles={[
            {
              preset: 'fairyDust',
              colors: ['#d8a24a', '#ffd27f', '#f2a066'],
              blend: 'screen',
              density: 0.7,
              speed: 0.5,
              opacity: 0.6,
              depth: 0.6,
              seed: 58
            }
          ]}
          overlay={<OyaKenar className="absolute top-0 inset-x-0 text-[#d8a24a]/75" />}
          fadeTo="#1d0710"
        />
      )}
    />
  );
}
