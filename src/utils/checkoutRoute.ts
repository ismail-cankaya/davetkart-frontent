import { isSubscriptionTier } from '../types';
import type { CheckoutContext } from '../stores/useCheckoutStore';

/**
 * Ödeme sayfasının adresi — yazan (paywall) ve okuyan (CheckoutPage) aynı
 * dosyadan geçer ki parametre adları iki yerde ayrışmasın.
 *
 * `/odeme?tier=gold&invitation=01J…`
 *
 * Bağlam store'da değil URL'de durur: sayfa yenilendiğinde ya da bağlantı
 * yeni sekmede açıldığında aynı ödeme ekranı geri kurulabilmeli. Backend'in
 * dönüş rotaları da aynı ağaçta (`/odeme/basarili`, `/odeme/hata` — 10.27).
 */
export const CHECKOUT_PATH = '/odeme';

export function checkoutHref({ tier, invitationId }: CheckoutContext): string {
  const params = new URLSearchParams({ tier });
  if (invitationId) params.set('invitation', invitationId);
  return `${CHECKOUT_PATH}?${params.toString()}`;
}

/**
 * Adres çubuğundan bağlamı okur; paket tanınmıyorsa `null`.
 *
 * 🔴 URL kullanıcının elindedir. Tanınmayan bir `tier`'la sayfayı çizmek
 * fiyatsız bir özet ve sahipsiz bir ödeme düğmesi demek olurdu. Fiyatın
 * kendisi zaten URL'den okunmaz: gösterim `data.ts`'ten, tahsilat backend
 * config'inden gelir (M6).
 */
export function parseCheckoutSearch(params: URLSearchParams): CheckoutContext | null {
  const tier = params.get('tier');
  if (!isSubscriptionTier(tier)) return null;

  const invitationId = params.get('invitation')?.trim() || null;
  return { tier, invitationId };
}
