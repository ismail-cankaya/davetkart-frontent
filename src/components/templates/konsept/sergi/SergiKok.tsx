import React, { useMemo } from 'react';
import { sergiDegiskenleri, type EserRengi } from './palet';
import { useSergiFontlari } from './fontlar';

/**
 * Sergi şablonunun kökü: preset'in eser rengine göre CSS değişkenlerini
 * yazar ve fontları yükler. `display: contents` — kendi kutusu yoktur,
 * değişkenleri altındaki kompozisyona, kapıya ve bölümlere miras bırakır.
 */
export function SergiKok({ eser, children }: { eser: EserRengi; children: React.ReactNode }) {
  useSergiFontlari();
  const style = useMemo(() => sergiDegiskenleri(eser), [eser]);
  return (
    <div className="contents" style={style}>
      {children}
    </div>
  );
}
