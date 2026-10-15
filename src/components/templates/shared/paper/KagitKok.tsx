import React, { useMemo } from 'react';
import { kagitDegiskenleri, type KagitSeti } from './palet';
import { useKagitFontlari } from './fontlar';

/**
 * Kâğıt şablonunun kökü: setin CSS değişkenlerini yazar ve fontlarını yükler.
 *
 * `display: contents` — kendi kutusu yoktur, düzene karışmaz; yalnızca
 * değişkenleri altındaki her şeye (kompozisyon, zarf, bölümler) miras bırakır.
 * Tema dizgileri sabit olduğu için renk bu tek noktadan gelir.
 */
export function KagitKok({ set, children }: { set: KagitSeti; children: React.ReactNode }) {
  useKagitFontlari(set.el);
  const style = useMemo(() => kagitDegiskenleri(set), [set]);
  return (
    <div className="contents" style={style}>
      {children}
    </div>
  );
}
