import { create } from 'zustand';
import { CheckoutResult, Invitation, SubscriptionTier } from '../types';
import { paymentService } from '../services/payments';
import { checkoutMemory } from '../services/checkoutMemory';

/** Planları sıralar ki "X planı Y gereksinimini karşılıyor mu" tek kıyas olsun. */
export const TIER_RANK: Record<SubscriptionTier, number> = {
  standart: 0,
  gold: 1,
  elit: 2
};

/**
 * Davetiyede açık olan modülleri karşılayan en ucuz plan.
 *
 * 🔴 Bu bir **SUNUM** kopyasıdır, yetki kararı değil. İkizi backend'de
 * `TierResolver` olarak duruyor ve **asıl otorite odur**: yayınlamaya izin
 * verip vermeme kararını sunucu verir, `orders` tablosuna bakarak.
 *
 * Burada kalmasının tek sebebi paywall'daki *"Tavsiye Edilen"* rozetidir —
 * kullanıcı 402 almadan önce hangi planın işini göreceğini görebilsin diye.
 * İki kopya bir gün ayrışırsa, ayrışma **görünür** olur: sunucu 402 döner ve
 * kullanıcı doğru ekranı görür. Bu yüzden buradaki değere göre yayınlamayı
 * atlamak (eski `activeTier` kestirmesi) kaldırıldı.
 */
export function getRequiredTier(invitation: Invitation): SubscriptionTier {
  if (invitation.showGallery || invitation.showGift) return 'elit';
  if (invitation.showEnvelope || invitation.showTimeline) return 'gold';
  return 'standart';
}

/**
 * 🔴 Paywall'ın neden açıldığı. İki ayrı 402 kodu **iki ayrı ekran** ister:
 *
 * | Kod | Kullanıcının önündeki eylem |
 * |---|---|
 * | `PAYMENT_REQUIRED` | *"Önce bir plan al"* |
 * | `PAYWALL_TIER_INSUFFICIENT` | *"Planını yükselt"* |
 *
 * Aynı ekranı göstermek, backend'in bu ayrımı yapmak için ödediği bedeli
 * çöpe atar (K74'ün aynı ailesi).
 */
export type PaywallReason = 'purchase' | 'upgrade';

interface OpenPaywallOptions {
  /** Sunucunun bildirdiği gereken plan (`error.params.requiredTier`). */
  requiredTier: SubscriptionTier;
  reason: PaywallReason;
  /** Checkout'un yazılacağı davetiye; `null` = hesap paketi (K42). */
  invitationId: string | null;
}

interface SubscriptionState {
  isPaywallOpen: boolean;
  requiredTier: SubscriptionTier;
  reason: PaywallReason;
  selectedTier: SubscriptionTier;
  invitationId: string | null;
  isProcessing: boolean;
  /**
   * Başlatılmış ama **tamamlanmamış** sipariş. Kullanıcı ödeme sayfasına
   * yönlendirilemediğinde ekranda ne olduğunu anlatabilmek için tutulur.
   */
  pendingOrder: CheckoutResult | null;
  openPaywall: (options: OpenPaywallOptions) => void;
  closePaywall: () => void;
  selectTier: (tier: SubscriptionTier) => void;
  /**
   * Seçili plan için checkout **başlatır**.
   *
   * 🔴 Adı bilerek `purchase` değil: bu çağrı satın almayı bitirmez. 201 ile
   * dönen sipariş `pending`'dir ve ödeme, kullanıcı `redirectUrl`'e gidip
   * işlemi tamamladıktan sonra webhook ile `paid` olur.
   */
  startCheckout: (tier?: SubscriptionTier) => Promise<CheckoutResult | null>;
  /**
   * Ödeme dönüş sayfasından, başarısız siparişle AYNI davetiye ve plan için
   * yeni bir sipariş açar. Sayfa yeniden yüklendiği için paywall'ın
   * `invitationId`'si bellekte değildir; önce o yazılır.
   */
  retryCheckout: (context: { invitationId: string | null; tier: SubscriptionTier }) => Promise<CheckoutResult | null>;
}

export const useSubscriptionStore = create<SubscriptionState>()((set, get) => ({
  isPaywallOpen: false,
  requiredTier: 'standart',
  reason: 'purchase',
  selectedTier: 'standart',
  invitationId: null,
  isProcessing: false,
  pendingOrder: null,

  // Tavsiye edilen plan önceden seçili gelir ki tek tıkla ilerlenebilsin.
  openPaywall: ({ requiredTier, reason, invitationId }) =>
    set({
      isPaywallOpen: true,
      requiredTier,
      reason,
      invitationId,
      selectedTier: requiredTier,
      pendingOrder: null
    }),

  closePaywall: () => {
    // Sipariş oluşturulurken kapatma: durum çözülmeden kapanmamalı.
    if (!get().isProcessing) set({ isPaywallOpen: false });
  },

  selectTier: (tier) => {
    // Gereksinimin altındaki planlar bu davetiyenin modüllerini taşıyamaz.
    if (TIER_RANK[tier] >= TIER_RANK[get().requiredTier]) set({ selectedTier: tier });
  },

  startCheckout: async (tier) => {
    const { isProcessing, invitationId } = get();
    if (isProcessing) return null;

    const chosen = tier ?? get().selectedTier;
    set({ isProcessing: true, selectedTier: chosen });

    try {
      // Davetiye kimliği varsa o davetiyeye, yoksa hesaba yazılır.
      const result = invitationId
        ? await paymentService.checkoutForInvitation(invitationId, chosen)
        : await paymentService.checkoutForAccount(chosen);

      // Kullanıcı ödeme sayfasına gidip döndüğünde uygulama sıfırdan açılır;
      // dönüş sayfası hangi davetiyenin yayınlanacağını buradan öğrenir.
      checkoutMemory.remember({ orderId: result.orderId, invitationId, tier: chosen });

      set({ isProcessing: false, pendingOrder: result });
      return result;
    } catch (error) {
      set({ isProcessing: false });
      throw error;
    }
  },

  retryCheckout: ({ invitationId, tier }) => {
    if (get().isProcessing) return Promise.resolve(null);
    set({ invitationId });
    return get().startCheckout(tier);
  }
}));
