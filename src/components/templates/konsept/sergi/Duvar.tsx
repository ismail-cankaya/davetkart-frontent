import React from 'react';

/**
 * `renderBackdrop` sahnesi: kaydırma kabının arkasında sabit, düz duvar.
 * Bölümler aynı duvarda asılı gibi akar; desen, doku, degrade yok (§4.2).
 */
export function Duvar() {
  return <div aria-hidden="true" className="absolute inset-0 bg-[var(--sg-duvar)]" />;
}
