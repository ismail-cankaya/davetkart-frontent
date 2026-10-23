/**
 * "Hikâye Kitabı" paleti. Kontrast tablosu ve kurallar:
 * docs/rehber/tasarim/KITAP-KONSEPTI.md §2.
 *
 * Koyu bez yalnızca kapakta (hero ya da kapak kapısı) durur; iç sayfalar
 * şamuadır. Yaldız düz renktir ve yalnızca bez üstünde kullanılır.
 */

/**
 * Bez ciltler: preset başına bir tane. Üstlerinde yalnızca yaldız yazılır.
 * Aynı konseptte iki kategori aynı kapağı taşımaz (KITAP-KONSEPTI §11, K7):
 * düğün `sise` + `lacivert`, kına `sarap`, nişan `murdum`, doğum günü `kestane`.
 */
export const BEZLER = {
  sise: '#1F3A2E',
  sarap: '#5B1E24',
  lacivert: '#1C2541',
  /** Mürdüm eriği: mora çalan koyu erik. Yaldız 5.94, şamua 11.70 (hesaplandı). Nişan. */
  murdum: '#3D2337',
  /**
   * Kestane: sıcak, koyu kahve — eski masal kitaplarının bezi. Yaldız 5.78,
   * şamua 11.38 (hesaplandı). Doğum günü (masal kitabı).
   */
  kestane: '#3B2A1E'
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
