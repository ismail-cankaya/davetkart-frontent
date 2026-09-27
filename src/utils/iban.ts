/**
 * IBAN yardımcıları — saf fonksiyonlar, ağ ya da DOM yok.
 *
 * 🔴 Doğrulama yalnızca biçim değil **mod-97 sağlama toplamıdır** (ISO 13616).
 * Tek hanesi yanlış yazılmış bir IBAN biçim olarak kusursuz görünür ve para
 * başka bir hesaba ya da hiçbir yere gider. Sağlama toplamı tek hane
 * hatalarının ve yan yana iki hanenin yer değiştirmesinin tamamını yakalar.
 */

/** Türkiye IBAN'ı: `TR` + 2 kontrol hanesi + 22 hane (5 banka kodu, 1 rezerv, 16 hesap). */
const TR_IBAN_PATTERN = /^TR\d{24}$/;

/** Boşlukları atar ve harfleri büyütür: `tr12 0006…` → `TR120006…`. */
export function normalizeIban(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}

/** Dörtlü gruplar hâlinde gösterim: `TR12 0006 1000 …`. Girdi normalize edilir. */
export function formatIban(value: string): string {
  return normalizeIban(value).replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Türkiye IBAN'ı biçim + mod-97 denetiminden geçiyor mu?
 *
 * Algoritma: ilk dört karakter sona alınır, harfler sayıya çevrilir
 * (A=10 … Z=35) ve ortaya çıkan sayının 97'ye bölümünden kalan 1 olmalıdır.
 * Sayı 30 haneyi aştığı için `Number` taşar; kalan, parça parça hesaplanır.
 */
export function isValidTrIban(value: string): boolean {
  const iban = normalizeIban(value);
  if (!TR_IBAN_PATTERN.test(iban)) return false;

  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const digits = /\d/.test(char) ? char : String(char.charCodeAt(0) - 55);
    for (const digit of digits) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder === 1;
}
