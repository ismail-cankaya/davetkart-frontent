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
