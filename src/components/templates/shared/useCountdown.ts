import { useEffect, useMemo, useState } from 'react';

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
 */
export function useCountdown(targetDate: string): Countdown {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
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
