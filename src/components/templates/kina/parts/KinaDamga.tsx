import React, { useId } from 'react';
import { cn } from '../../../../utils/cn';
import { KINA } from './palette';

/** Lekenin üç tonu: merkez (açık), gövde, kenar halkası (kına kenarda koyulaşır). */
export type DamgaColors = readonly [string, string, string];

export const DAMGA_KINA: DamgaColors = ['#dc7536', KINA.kina, '#8e3510'];
export const DAMGA_AL: DamgaColors = ['#c8402f', KINA.al, KINA.alKoyu];

const BLOB =
  'M51 5C69 4 86 14 93 31C99 47 97 67 85 81C73 94 54 98 37 93C20 88 7 74 5 56C3 37 13 19 30 10C36 7 44 5 51 5Z';
const CORE =
  'M47 18C61 16 76 25 80 39C84 53 78 68 64 75C51 81 35 79 26 68C18 58 19 41 28 30C33 23 40 19 47 18Z';

/**
 * Kına damgası — avuca konan kınanın düzensiz, kenarı koyulaşan lekesi.
 * Ampersan yuvası, filigran ve sahne lekesi olarak kullanılır; içerik ortalanır.
 */
export function KinaDamga({
  colors = DAMGA_KINA,
  className,
  style,
  children
}: {
  colors?: DamgaColors;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const id = `kina-damga-${useId().replace(/:/g, '')}`;
  const [light, mid, rim] = colors;
  return (
    <span className={cn('relative inline-flex items-center justify-center', className)} style={style}>
      <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
        <defs>
          <radialGradient id={id} cx="46%" cy="42%" r="60%">
            <stop offset="0%" stopColor={light} />
            <stop offset="62%" stopColor={mid} />
            <stop offset="92%" stopColor={rim} />
          </radialGradient>
        </defs>
        <path d={BLOB} fill={`url(#${id})`} />
        <path d={CORE} fill={light} fillOpacity="0.32" />
      </svg>
      {children !== undefined && <span className="relative">{children}</span>}
    </span>
  );
}
