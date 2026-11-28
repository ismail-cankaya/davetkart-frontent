import React, { useMemo } from 'react';
import qrcode from 'qrcode-generator';

/**
 * QR kodu (Faz 29, K327, K328): kütüphane yalnızca modül matrisini hesaplar, SVG React ile çizilir (HTML enjeksiyonu
 * yok). Bu modül paylaş menüsü ya da "telefonda aç" açılınca yüklenir (tembel parça, K237). UTF-8 bayt kipi.
 */
export default function QrCode({ value, size = 184, label }: { value: string; size?: number; label: string }) {
  const { path, count } = useMemo(() => {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
    const code = qrcode(0, 'M');
    code.addData(value, 'Byte');
    code.make();
    const n = code.getModuleCount();
    let d = '';
    for (let row = 0; row < n; row += 1) {
      for (let col = 0; col < n; col += 1) {
        if (code.isDark(row, col)) d += `M${col} ${row}h1v1h-1z`;
      }
    }
    return { path: d, count: n };
  }, [value]);

  const margin = 2;
  return (
    <svg
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox={`${-margin} ${-margin} ${count + margin * 2} ${count + margin * 2}`}
      shapeRendering="crispEdges"
      className="rounded-2xl bg-white"
    >
      <rect x={-margin} y={-margin} width={count + margin * 2} height={count + margin * 2} fill="#fff" />
      <path d={path} fill="#0f1a15" />
    </svg>
  );
}
