/**
 * Alan gerçekten dolu mu?
 *
 * Yalnızca boşluktan oluşan değer "girilmemiş" sayılır: backend `TrimStrings`
 * ile onu zaten boşaltır, önizleme de boş bir kap çizmemelidir. `null` /
 * `undefined` kabul edilir, çünkü önizleme ağdan gelen veriyi de çizer.
 */
export function hasText(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim() !== '';
}
