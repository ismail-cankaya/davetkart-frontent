import React from 'react';
import { BASLIK_YIGINI, METIN_YIGINI, useKitapFontlari } from './fontlar';

const DEGISKENLER = {
  '--kt-baslik-font': BASLIK_YIGINI,
  '--kt-metin-font': METIN_YIGINI
} as React.CSSProperties;

/**
 * Kitap şablonunun kökü: font değişkenlerini yazar, fontları yükler ve dili
 * Türkçe işaretler (CSS büyük harfi `i` → `İ` yapsın, `hyphens: auto`
 * Türkçe hecelesin).
 *
 * `display: contents` — kendi kutusu yoktur; yalnızca değişkenleri ve `lang`'ı
 * kompozisyona, kapak kapısına ve bölümlere miras bırakır.
 */
export function KitapKok({ children }: { children: React.ReactNode }) {
  useKitapFontlari();
  return (
    <div lang="tr" className="contents" style={DEGISKENLER}>
      {children}
    </div>
  );
}
