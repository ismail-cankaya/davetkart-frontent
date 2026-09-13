/**
 * LCV durumunun **sunum** katmanı.
 *
 * Ağda üç değer dolaşır — `attending`, `pending`, `declined` — ve backend
 * bunları hiçbir zaman çevirmez (K20/K21: backend *ne olduğunu* bilir,
 * frontend *nasıl anlatılacağını*). Kullanıcının gördüğü her metin ve renk
 * bu dosyada durur; başka hiçbir yerde ham değer karşılaştırması yapılmaz.
 */
import type { RsvpStatus } from '../types';

/** Formlarda ve panelde kullanılan sabit sıra: olumludan olumsuza. */
export const RSVP_STATUSES: readonly RsvpStatus[] = ['attending', 'pending', 'declined'];

/** Panelde ve listelerde kullanılan kısa etiket. */
export const RSVP_STATUS_LABELS: Record<RsvpStatus, string> = {
  attending: 'Katılıyor',
  pending: 'Bekleniyor',
  declined: 'Katılamıyor',
};

/**
 * Misafirin kendi adına seçtiği seçenek — birinci tekil.
 * Panelin üçüncü şahıs etiketinden ("Katılıyor") bilerek ayrıdır.
 */
export const RSVP_STATUS_CHOICES: Record<RsvpStatus, string> = {
  attending: 'Katılıyorum',
  pending: 'Belirsiz',
  declined: 'Katılamıyorum',
};

/** Durum rozetinin Tailwind sınıfları. */
export const RSVP_STATUS_BADGE: Record<RsvpStatus, string> = {
  attending: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  declined: 'bg-red-100 text-red-800',
};

/**
 * Sunucudan gelen değeri güvenle bir duruma çevirir.
 *
 * Backend enum'a yeni bir değer eklerse eski istemci onu tanımaz; çökmek
 * yerine `pending` sayılır — bilinmeyen bir yanıtı "katılıyor" saymak
 * ev sahibinin sayımını bozar, "bekleniyor" saymak yalnızca geciktirir.
 */
export function toRsvpStatus(value: unknown): RsvpStatus {
  return RSVP_STATUSES.includes(value as RsvpStatus) ? (value as RsvpStatus) : 'pending';
}
