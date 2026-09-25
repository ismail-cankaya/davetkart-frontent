import { isSubscriptionTier, SubscriptionTier } from '../types';

/**
 * Son başlatılan checkout'un bağlamı: hangi sipariş, hangi davetiye, hangi plan.
 *
 * 🔴 Neden gerekli: kullanıcı ödeme sayfasına **tam sayfa** gider ve geri
 * döndüğünde uygulama sıfırdan açılır — paywall'ın bildiği davetiye kimliği
 * bellekte değildir. Dönüş sayfası *"şimdi yayınla"* ya da *"tekrar dene"*
 * diyebilmek için bu bağlamı bilmek zorunda.
 *
 * Sunucu tek otoritedir: `GET /orders/{id}` `invitationId` taşıdığında o
 * kullanılır. Bu kayıt yalnızca sunucunun söylemediğini tamamlar ve
 * `sessionStorage`'da durur — aynı sekmede ödemeye gidip dönmek için yeter,
 * başka sekmeye ya da cihaza sızmaz.
 */
export interface CheckoutContext {
  orderId: string;
  /** `null` = hesap paketi (K42). */
  invitationId: string | null;
  tier: SubscriptionTier;
}

const STORAGE_KEY = 'davetkart_last_checkout';

function isCheckoutContext(value: unknown): value is CheckoutContext {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.orderId === 'string' &&
    (typeof v.invitationId === 'string' || v.invitationId === null) &&
    isSubscriptionTier(v.tier)
  );
}

export const checkoutMemory = {
  remember(context: CheckoutContext): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    } catch {
      // Gizli pencere / engellenmiş depolama: dönüş sayfası sunucunun
      // söylediğiyle yetinir.
    }
  },

  /** Yalnızca AYNI siparişe ait bağlamı döndürür; başkası `null`. */
  recall(orderId: string): CheckoutContext | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      return isCheckoutContext(parsed) && parsed.orderId === orderId ? parsed : null;
    } catch {
      return null;
    }
  },

  forget(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Yazılamayan depolama silinemez de; yapılacak bir şey yok.
    }
  }
};
