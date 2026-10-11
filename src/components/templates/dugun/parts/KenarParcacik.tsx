import React from 'react';
import { ParticleField, ParticleFieldProps } from '../../shared/effects';

/** Ortadaki metin kolonunu temiz bırakan yatay maske. */
const MASK = 'linear-gradient(90deg, #000 0%, #000 10%, transparent 20%, transparent 80%, #000 90%, #000 100%)';

/**
 * Parçacıkları yalnızca kadrajın iki kenarında gezdirir.
 *
 * HeroStage'e verilen parçacıklar tüm kadrajda dolaşır ve isimlerin, tarihin,
 * sayacın üstünden geçer. Burada alan yatay bir maskeyle kenarlara sınırlanır;
 * metin kolonu tam genişliği kaplayan dar kaplarda (`@md` altı) hiç çizilmez.
 * "Hareketi azalt" davranışı `ParticleField`'ın kendisinde (tek durağan kare).
 */
export function KenarParcacik({ fields }: { fields: ParticleFieldProps[] }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none hidden @md:block"
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    >
      {fields.map((field, i) => (
        <React.Fragment key={`${field.preset}-${i}`}>
          <ParticleField {...field} />
        </React.Fragment>
      ))}
    </div>
  );
}
