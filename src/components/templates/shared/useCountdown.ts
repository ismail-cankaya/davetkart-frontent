import { useEffect, useMemo, useState } from 'react';
import { wallClockToInstant } from '../../../utils/eventTime';

export interface Countdown {
  /** Tarih ayrıştırılabildi mi — geçersizse sayaç hiç gösterilmez. */
  valid: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Etkinliğe kalan süre, saniyede bir yenilenir.
 *
 * Summary dışındaki hero düzenleri (Bento, Noir) de sayaç gösterdiği için
 * mantık paylaşılan bir kancaya alındı; her hero kendi biçimlendirmesini
 * yapar ama zamanı tek bir yerden okur.
 *
 * 🔴 **Saat dilimi zorunlu bir parametredir.** Hedef tarih bir duvar
 * saatidir (`2026-11-14T19:00`, offset yok) ve `Date.now()` gerçek bir andır;
 * ikisini karşılaştırmak ancak duvar saati kendi saat diliminde bir ana
 * çevrildikten sonra doğrudur. Eskiden `new Date(targetDate)` kullanılıyordu,
 * yani metin tarayıcının yerel saati sayılıyordu: Berlin'deki bir misafirin
 * geri sayımı İstanbul'daki bir düğün için **iki saat** kayardı — ve bu,
 * ekranda hata gibi görünmeyen bir hatadır.
 *
 * @param targetDate Duvar saati (`YYYY-MM-DDTHH:mm`).
 * @param timeZone   IANA kimliği; boş/geçersizse tarayıcının saati kullanılır.
 */
export function useCountdown(targetDate: string, timeZone: string): Countdown {
  const target = useMemo(
    () => wallClockToInstant(targetDate, timeZone) ?? Number.NaN,
    [targetDate, timeZone]
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const diff = Math.max(0, target - now);

  return {
    valid: !Number.isNaN(target),
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60
  };
}
