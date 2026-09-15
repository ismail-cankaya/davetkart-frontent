/**
 * Davetiyenin saatini **duvar saati** olarak ele alan zaman yardımcıları.
 *
 * 🔴 Bir tarihin saat dilimi yoktur; bir **anın** vardır. Backend
 * `date` alanını `2026-11-14T19:00` biçiminde, yani **offset'siz** gönderir
 * (`Y-m-d\TH:i`) ve saat dilimini ayrı bir alanda taşır (`timezone`, IANA).
 *
 * Bu ayrım kasıtlıdır: *"19:00"* düğünün **olduğu yerin** saatidir,
 * misafirin tarayıcısının değil. `new Date('2026-11-14T19:00')` ise bu metni
 * **tarayıcının yerel saati** sayar — Berlin'deki bir misafir için geri sayım
 * iki saat kayar ve bu hata hiçbir yerde hata gibi görünmez.
 *
 * Backend bu bedeli üç faz erteleyip Faz 7'de ödedi (K71). Frontend o bedelin
 * karşılığını ancak alanı okuyunca alır.
 */

/** Duvar saati metninin parçaları. */
interface WallClockParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const WALL_CLOCK = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/;

function parseWallClock(value: string): WallClockParts | null {
  const match = WALL_CLOCK.exec(value.trim());
  if (!match) return null;

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
  };
}

/** Geçersiz bir IANA kimliği `Intl`'de istisna fırlatır; önce sınanır. */
export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone) return false;

  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Verilen **an** için saat diliminin UTC'ye göre farkı (ms).
 *
 * `Intl` bize "bu anda orada saat kaç" sorusunun cevabını verir; farkı da
 * oradan hesaplarız. Yaz saati geçişleri dahil her tarihte doğrudur, çünkü
 * sabit bir offset varsaymaz.
 */
function zoneOffsetMs(instant: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instant));

  const read = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((part) => part.type === type)?.value ?? '0');

  // Bazı ortamlar gece yarısını `hour12: false` altında '24' olarak verir.
  const hour = read('hour') % 24;

  const asUtc = Date.UTC(read('year'), read('month') - 1, read('day'), hour, read('minute'), read('second'));
  return asUtc - instant;
}

/**
 * Duvar saatini gerçek bir ana (epoch ms) çevirir.
 *
 * Saat dilimi boş ya da geçersizse tarayıcının yerel saati kullanılır: bu,
 * kullanıcının henüz bir saat dilimi seçmediği editör önizlemesinin dürüst
 * karşılığıdır — uydurma bir bölge seçmek, olmayan bir bilgiyi varmış gibi
 * göstermek olurdu.
 *
 * @returns Epoch ms, ya da metin ayrıştırılamıyorsa `null`.
 */
export function wallClockToInstant(wallClock: string, timeZone: string): number | null {
  const parts = parseWallClock(wallClock);
  if (!parts) return null;

  if (!isValidTimeZone(timeZone)) {
    const local = new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
    const time = local.getTime();
    return Number.isNaN(time) ? null : time;
  }

  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);

  // İlk tahmin: farkı "sanki UTC'ymiş gibi" okunan andan al.
  const firstGuess = zoneOffsetMs(asUtc, timeZone);
  let instant = asUtc - firstGuess;

  // 🔴 Tek geçiş yetmez. Yaz saati sınırının yakınında ilk tahminin farkı
  // yanlış tarafta kalabilir; bulunan anın gerçek farkıyla bir kez daha
  // düzeltiyoruz. (Var olmayan saatlerde — ileri alınan saatin atladığı
  // aralıkta — sonuç geçişin sonrasına düşer, ki beklenen davranış budur.)
  const refined = zoneOffsetMs(instant, timeZone);
  if (refined !== firstGuess) instant = asUtc - refined;

  return instant;
}

/**
 * Bir anı, hedef saat diliminin duvar saati metnine çevirir
 * (`YYYY-MM-DDTHH:mm`). Takvim dışa aktarımı bunu kullanır: etkinlik
 * mekânın saatinde yaşanır, misafirin saatinde değil.
 */
export function instantToWallClock(instant: number, timeZone: string): string {
  const pad = (value: number) => String(value).padStart(2, '0');

  if (!isValidTimeZone(timeZone)) {
    const local = new Date(instant);
    return (
      `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(local.getDate())}` +
      `T${pad(local.getHours())}:${pad(local.getMinutes())}`
    );
  }

  const offset = zoneOffsetMs(instant, timeZone);
  const shifted = new Date(instant + offset);

  return (
    `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}` +
    `T${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}`
  );
}
