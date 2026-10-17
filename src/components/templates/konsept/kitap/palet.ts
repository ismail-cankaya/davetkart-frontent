/**
 * "Hikâye Kitabı" paleti. Kontrast tablosu ve kurallar:
 * docs/rehber/tasarim/KITAP-KONSEPTI.md §2.
 *
 * Koyu bez yalnızca kapakta (hero ya da kapak kapısı) durur; iç sayfalar
 * şamuadır. Yaldız düz renktir ve yalnızca bez üstünde kullanılır.
 */

/** Bez ciltler: preset başına bir tane. Üstlerinde yalnızca yaldız yazılır. */
export const BEZLER = {
  sise: '#1F3A2E',
  sarap: '#5B1E24',
  lacivert: '#1C2541'
} as const;

export type BezAdi = keyof typeof BEZLER;

/** İç sayfa renkleri. */
export const SAYFA = {
  samua: '#F2EAD3',
  murekkep: '#231F1A',
  soluk: '#5E5446',
  kurdele: '#8C2F2F',
  /** Düğmenin üstüne gelinmiş hâli; üstünde şamua 8.52. */
  kurdeleKoyu: '#74262A',
  yaldiz: '#C9A35C'
} as const;

/**
 * Kapağın iç yüzü (yan kâğıdı). Kapak açılırken bir an görünür; üstünde metin
 * yoktur. Şamuanın bir ton koyusu: sayfayla aynı aileden, ondan ayrılır.
 */
export const YAN_KAGIDI = '#E4D8B8';
