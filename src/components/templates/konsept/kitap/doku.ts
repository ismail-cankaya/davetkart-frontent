import bez from './doku/bez.webp';

/**
 * Bez cilt dokusu: 192 px gri döşeme, 4 px adımlı düz dokuma. Önceden
 * üretildi (çalışma anında `feTurbulence` yok); bez rengiyle `multiply`
 * karışır. Döşemenin en açık değeri 0.973: bez yalnızca koyulaşır, üstündeki
 * yaldızın kontrastı düşmez.
 */
export const BEZ_DOKUSU = { url: bez, boy: 192 } as const;
