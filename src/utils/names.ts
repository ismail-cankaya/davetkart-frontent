/**
 * The invitation stores the hosts as a single display string ("Sophia & Elias").
 * The wizard edits them as two separate fields; these helpers convert between
 * the two shapes without losing a half-filled pair.
 *
 * 🔴 Tek isim girildiğinde hangi alana ait olduğu da saklanır. Yalnızca ikinci
 * alan (ör. "Damat Adı") doluysa değer `& Ali` olarak yazılır; ayraç olmasaydı
 * form yeniden açıldığında isim birinci alana ("Gelin Adı") kayardı. Bu işaret
 * bir SAKLAMA biçimidir — ekrana basılmadan önce `displayNames` ile temizlenir.
 */

const SEPARATOR = '&';

export function splitNames(names: string): [string, string] {
  const separatorIndex = names.indexOf(SEPARATOR);
  if (separatorIndex === -1) return [names.trim(), ''];
  return [names.slice(0, separatorIndex).trim(), names.slice(separatorIndex + 1).trim()];
}

export function joinNames(first: string, second: string): string {
  const a = first.trim();
  const b = second.trim();
  if (a && b) return `${a} ${SEPARATOR} ${b}`;
  // Yalnızca ikinci isim: ayraç, ismin hangi alana ait olduğunu korur.
  if (b) return `${SEPARATOR} ${b}`;
  return a;
}

/**
 * İsim metninin ekranda görünecek hâli: tek isim kaldığında baştaki ya da
 * sondaki ayraç gösterilmez (`& Ali` → `Ali`). İki isimli metin olduğu gibi kalır.
 */
export function displayNames(names: string): string {
  let shown = names.trim();
  if (shown.startsWith(SEPARATOR)) shown = shown.slice(SEPARATOR.length).trim();
  if (shown.endsWith(SEPARATOR)) shown = shown.slice(0, -SEPARATOR.length).trim();
  return shown;
}
