import { create } from 'zustand';
import { Invitation, SubscriptionTier, isSubscriptionTier } from '../types';
import { apiErrorCode, apiErrorParams } from '../services/api';
import { TEMPLATE_PRESETS } from '../data';

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
  // Faz 10 (FE 10.20 · K102): premium (videolu) tema en az Gold.
  if (TEMPLATE_PRESETS.find((preset) => preset.id === invitation.imageTheme)?.minimumTier === 'gold') {
    return 'gold';
  }
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

export interface OpenPaywallOptions {
  /** Sunucunun bildirdiği gereken plan (`error.params.requiredTier`). */
  requiredTier: SubscriptionTier;
  reason: PaywallReason;
  /** Checkout'un yazılacağı davetiye; `null` = davetiyesiz paket; ilk yayında bağlanır (K42, K99). */
  invitationId: string | null;
}

/**
 * Bir API hatasını paywall açılış seçeneklerine çevirir; paywall 402'si
 * değilse `null`.
 *
 * 🔴 TEK eşleme noktası (C3). Aynı 402 iki yoldan gelir — yayınlama
 * (`EditorWorkspace`) ve yayındaki davetiyenin otomatik kaydı
 * (`useInvitationStore`, Faz 10 / K88) — ve ikisi AYNI ekranı açmalıdır.
 * Eşleme iki yerde yazılsaydı biri `requiredTier`'ı sunucudan, öbürü
 * yerel kopyadan okurdu ve iki ekran farklı planı önerirdi.
 *
 * Gereken planı SUNUCU bildirir. `getRequiredTier()` yalnızca yanıt onu
 * taşımıyorsa (beklenmeyen bir durum) yedek olarak kullanılır.
 */
export function paywallFromError(
  error: unknown,
  invitation: Invitation,
  invitationId: string | null
): OpenPaywallOptions | null {
  const code = apiErrorCode(error);
  if (code !== 'PAYMENT_REQUIRED' && code !== 'PAYWALL_TIER_INSUFFICIENT') return null;

  const serverTier = apiErrorParams(error).requiredTier;

  return {
    requiredTier: isSubscriptionTier(serverTier) ? serverTier : getRequiredTier(invitation),
    reason: code === 'PAYMENT_REQUIRED' ? 'purchase' : 'upgrade',
    invitationId
  };
}

interface SubscriptionState {
  isPaywallOpen: boolean;
  requiredTier: SubscriptionTier;
  reason: PaywallReason;
  selectedTier: SubscriptionTier;
  invitationId: string | null;
  openPaywall: (options: OpenPaywallOptions) => void;
  closePaywall: () => void;
  selectTier: (tier: SubscriptionTier) => void;
}

/**
 * Plan duvarının durumu: hangi paket, hangi sebeple, hangi davetiye için.
 *
 * 🔴 Siparişi bu store AÇMAZ. Duvardaki "Ödemeye Geç" kullanıcıyı ödeme
 * sayfasına (`/odeme`, bkz. `utils/checkoutRoute.ts`) gönderir; siparişin
 * akışı orada, `useCheckoutStore`'da yaşar. Duvar bir modaldır, ödeme ise
 * yenilendiğinde bağlamını URL'den geri kurabilen bir sayfa.
 */
export const useSubscriptionStore = create<SubscriptionState>()((set, get) => ({
  isPaywallOpen: false,
  requiredTier: 'standart',
  reason: 'purchase',
  selectedTier: 'standart',
  invitationId: null,

  // Tavsiye edilen plan önceden seçili gelir ki tek tıkla ilerlenebilsin.
  openPaywall: ({ requiredTier, reason, invitationId }) =>
    set({
      isPaywallOpen: true,
      requiredTier,
      reason,
      invitationId,
      selectedTier: requiredTier
    }),

  closePaywall: () => set({ isPaywallOpen: false }),

  selectTier: (tier) => {
    // Gereksinimin altındaki planlar bu davetiyenin modüllerini taşıyamaz.
    if (TIER_RANK[tier] >= TIER_RANK[get().requiredTier]) set({ selectedTier: tier });
  }
}));
