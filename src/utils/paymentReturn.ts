import type { OrderStatus } from '../types';

/**
 * Ödeme dönüş sayfasının (`/odeme/basarili`, `/odeme/hata`) karar mantığı —
 * Faz 10, 10.27. Sayfa yalnızca yoklar ve çizer; NE göstereceğine burası karar
 * verir. Saf fonksiyonlar: `verify:payment` onları doğrudan sınar.
 *
 * Sağlayıcı kullanıcıyı iki adresten birine geri gönderir (backend
 * `config/payment.php` → `return_urls`). Adres bir İPUCUDUR, gerçek değil:
 * ödemenin sonucu yalnızca siparişin backend'deki durumudur ve o durumu
 * sağlayıcının webhook'u yazar.
 */
export type ReturnKind = 'success' | 'failure';

/** Yoklama aralığı ve üst sınırı: 15 × 2 sn = 30 sn. */
export const POLL_INTERVAL_MS = 2000;
export const POLL_LIMIT = 15;

export type ReturnView =
  | 'verifying' // yoklama sürüyor
  | 'confirmed' // paid
  | 'delayed' // yoklama bitti, hâlâ pending
  | 'expired' // ödeme penceresi doldu (K89)
  | 'failed' // sağlayıcı reddetti ya da ödeme tamamlanmadı
  | 'refunded';

interface ViewContext {
  kind: ReturnKind;
  /** Yoklama bitti mi (sınır doldu ya da son durum geldi)? */
  settled: boolean;
}

/**
 * 🔴 `Record<OrderStatus, …>`: backend yarın bir durum eklerse (10.3'teki
 * `expired` gibi) bu satır DERLEME HATASI verir ve eksik kol unutulamaz.
 * `switch` + `default` o korumayı sessizce kapatırdı.
 */
const VIEW_BY_STATUS: Record<OrderStatus, (ctx: ViewContext) => ReturnView> = {
  paid: () => 'confirmed',

  // Hata adresinden dönüldüyse beklemeye gerek yok: ödeme tamamlanmadı.
  // Başarı adresinden dönüldüyse webhook henüz gelmemiş olabilir.
  pending: ({ kind, settled }) => (kind === 'failure' ? 'failed' : settled ? 'delayed' : 'verifying'),

  // K89: süresi dolmuş sipariş GEÇ gelen bir ödemeyle yine `paid` olabilir.
  // Yoklama sürerken "süresi doldu" demek erken bir hüküm olurdu.
  expired: ({ kind, settled }) => (kind === 'failure' || settled ? 'expired' : 'verifying'),

  failed: () => 'failed',
  refunded: () => 'refunded',
};

export function returnViewFor(status: OrderStatus, ctx: ViewContext): ReturnView {
  return VIEW_BY_STATUS[status](ctx);
}

/**
 * Bir sonraki yoklama yapılsın mı?
 *
 * - Hata adresi: tek okuma yeter; sağlayıcı "tamamlanmadı" dedi.
 * - `pending` ve `expired`: webhook yolda olabilir, sınır dolana kadar sor.
 * - `paid`, `failed`, `refunded`: son durum, sormaya devam etmenin anlamı yok.
 */
export function shouldKeepPolling(status: OrderStatus, kind: ReturnKind, attempts: number): boolean {
  if (kind === 'failure' || attempts >= POLL_LIMIT) return false;
  return status === 'pending' || status === 'expired';
}

/**
 * Adres çubuğundaki `?order=` değeri. Boş ya da yoksa `null`.
 *
 * Kimliğin biçimi burada DOĞRULANMAZ: backend `whereUlid` ile reddeder (404)
 * ve servis değeri yola kodlayarak yazar (`encodeURIComponent`).
 */
export function orderIdFrom(params: URLSearchParams): string | null {
  return params.get('order')?.trim() || null;
}
