const TRY_WHOLE = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0
});

const TRY_WITH_CENTS = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2
});

/**
 * Türk lirası gösterimi: `₺399` ya da (`withCents`) `₺399,00`.
 *
 * Kuruşlu hâl havale ekranı içindir: kullanıcı tutarı bankasına elle yazar
 * ve "tam olarak bu" olduğunu görmelidir.
 */
export function formatTry(amount: number, withCents = false): string {
  return (withCents ? TRY_WITH_CENTS : TRY_WHOLE).format(amount);
}

/**
 * Kuruş cinsinden tutarı (backend `…Minor` alanları) gösterir — Faz 11.
 *
 * Kuruşu varsa kuruşlu (`₺199,50`), yoksa tam (`₺199`) yazar. Hep tam yazmak
 * `199,50`'yi `200`'e yuvarlardı: kullanıcı ödeyeceğinden fazlasını görürdü.
 * Bölme yalnızca GÖSTERİM içindir; hesap backend'de tam sayıyla yapılır.
 */
export function formatTryMinor(amountMinor: number): string {
  return formatTry(amountMinor / 100, amountMinor % 100 !== 0);
}
