import { AccountSession, EntitlementState, OrderStatus, SubscriptionTier } from '../types';

/**
 * Hesap ayarları ekranlarının sunum etiketleri (Faz 14).
 *
 * Sözleşme İngilizce KOD taşır (`in_use`, `refunded`); Türkçe metin burada.
 * `utils/rsvpStatus.ts` ile aynı ayrım (K21).
 */

export const TIER_LABEL: Record<SubscriptionTier, string> = {
  standart: 'Standart',
  gold: 'Gold',
  elit: 'Elit',
};

export const ENTITLEMENT_STATE_LABEL: Record<EntitlementState, string> = {
  available: 'Kullanılabilir',
  in_use: 'Kullanımda',
  refund_requested: 'İptal talebi bekliyor',
  pending: 'Ödeme onayı bekliyor',
  consumed: 'Kullanıldı',
  refunded: 'İade edildi',
};

/** Rozet tonları: yeşil = hak, amber = karar bekliyor, gri = geçmiş. */
export const ENTITLEMENT_STATE_TONE: Record<EntitlementState, string> = {
  available: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  in_use: 'bg-brand/5 text-brand border-brand/15',
  refund_requested: 'bg-amber-50 text-amber-800 border-amber-200',
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  consumed: 'bg-stone-100 text-stone-600 border-stone-200',
  refunded: 'bg-stone-100 text-stone-600 border-stone-200',
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Bekliyor',
  paid: 'Ödendi',
  failed: 'Başarısız',
  expired: 'Süresi doldu',
  refunded: 'İade edildi',
};

export const ORDER_STATUS_TONE: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
  expired: 'bg-stone-100 text-stone-600 border-stone-200',
  refunded: 'bg-stone-100 text-stone-600 border-stone-200',
};

/** "Chrome · Windows" — tanınmayan parça atlanır, ikisi de yoksa genel ad. */
export function sessionDeviceLabel(session: Pick<AccountSession, 'browser' | 'system'>): string {
  const parts = [session.browser, session.system].filter((part): part is string => Boolean(part));
  return parts.length > 0 ? parts.join(' · ') : 'Bilinmeyen cihaz';
}

const DATE = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' });
const DATE_TIME = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });

/** ISO tarih → "25 Eki 2026"; boş ya da bozuksa tire. */
export function formatAccountDate(iso: string | null | undefined, withTime = false): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return (withTime ? DATE_TIME : DATE).format(date);
}
