import { TimelineEvent } from '../types';
import { hasText } from './text';

/**
 * Program akışı adımlarının yardımcıları.
 *
 * Başlangıçtaki iki boş adım `data.ts` → `DEFAULT_TIMELINE_EVENTS`'te durur;
 * kullanıcının sonradan eklediği adımlar buradan doğar. İkisi aynı biçimdedir:
 * `id: null`, benzersiz `localKey`, boş alanlar.
 */

let keySequence = 0;

/**
 * Yeni bir adımın yerel React anahtarı.
 *
 * 🔴 Benzersizliği SAYAÇ garanti eder: modül içinde tekdüze artan sıra aynı
 * oturumda tekrar etmez. Eski `tl-${Date.now()}-${events.length}` biçimi,
 * bir adım silinip aynı milisaniyede yenisi eklendiğinde liste uzunluğu aynı
 * kaldığı için AYNI anahtarı yeniden üretebiliyordu. Zaman damgası yalnızca
 * modül yeniden yüklendiğinde (Vite HMR) sıfırlanan sayaca karşı sigortadır.
 */
export function createTimelineEventKey(): string {
  keySequence += 1;
  return `tl-${Date.now().toString(36)}-${keySequence.toString(36)}`;
}

/** Kullanıcının dolduracağı boş bir program adımı (K44: kimliği sunucu verir). */
export function createTimelineEvent(): TimelineEvent {
  return { id: null, localKey: createTimelineEventKey(), time: '', title: '', description: '' };
}

/**
 * Adımın en az bir alanı dolu mu?
 *
 * Önizleme yalnızca bu adımları çizer: boş adım, kullanıcının formda
 * doldurmayı beklediği bir satırdır, misafire gösterilecek bir program değil.
 */
export function hasTimelineEventContent(event: TimelineEvent): boolean {
  return hasText(event.time) || hasText(event.title) || hasText(event.description);
}
