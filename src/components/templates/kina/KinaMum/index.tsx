import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { ParticleField } from '../../shared/effects';
import { KINA_MUM } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { KinaHero } from '../parts/KinaHero';
import { TemplateProps } from '../../types';
import { TepsiSahnesi } from './TepsiSahnesi';

/**
 * KinaMum — "Kına Tepsisi": karanlık odada bakır tepsi, ortasında kına,
 * çevresinde mumlar; tepsi ilk ekranın tepesinde, adlar tek satırda altında.
 * Tek yükselen efekt alevden kopan kor.
 */
export function KinaMum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_MUM}
      renderHero={(props) => <KinaHero {...props} names="line" ornament={false} flame="#ffc35f" className="pt-[210px] @md:pt-[280px] pb-24" />}
      renderHeroBackground={({ revealed }) => (
        <>
          <TepsiSahnesi revealed={revealed} />
          <ParticleField
            preset="embers"
            colors={['#ffb257', '#e0632f', '#ffd9a0']}
            blend="screen"
            density={0.5}
            speed={0.6}
            opacity={0.6}
            seed={37}
          />
        </>
      )}
    />
  );
}
