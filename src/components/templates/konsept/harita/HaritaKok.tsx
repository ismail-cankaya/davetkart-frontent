import React, { useMemo } from 'react';
import { useMotionValue } from 'motion/react';
import { HARITA_YAZI, useHaritaFontlari } from './fontlar';
import { HaritaBaglamiContext, PERDE_DISARIDA } from './baglam';

const DEGISKENLER = {
  '--hr-etiket': HARITA_YAZI.etiket,
  '--hr-govde': HARITA_YAZI.govde,
  '--hr-italik': HARITA_YAZI.italik
} as React.CSSProperties;

/**
 * Harita şablonunun kökü: yazı değişkenlerini yazar, fontları yükler ve
 * kapakla sahnenin paylaştığı bağlamı kurar (bkz. `baglam.ts`).
 * `display: contents` — düzene karışmaz.
 */
export function HaritaKok({ children }: { children: React.ReactNode }) {
  useHaritaFontlari();
  const kapakAlti = useMotionValue(PERDE_DISARIDA);
  const baglam = useMemo(() => ({ kapakAlti }), [kapakAlti]);
  return (
    <HaritaBaglamiContext.Provider value={baglam}>
      <div className="contents" style={DEGISKENLER}>
        {children}
      </div>
    </HaritaBaglamiContext.Provider>
  );
}
