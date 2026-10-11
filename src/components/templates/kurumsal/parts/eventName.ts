import { splitNames } from '../../../../utils/names';

/**
 * Kurumsal ad alanını kurum ve etkinlik olarak ayırır.
 *
 * Sihirbaz bu kategoride ad alanını "Kurum / Marka" & "Etkinlik Adı" olarak
 * toplar. Tek ad girildiyse o etkinliğin adıdır; kurum boş kalır.
 */
export function splitHostAndEvent(names: string): { host: string; event: string } {
  const [first, second] = splitNames(names);
  return second ? { host: first, event: second } : { host: '', event: first };
}
