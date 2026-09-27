import { create } from 'zustand';
import { CheckoutResult, PaymentMethod, SubscriptionTier } from '../types';
import { paymentService } from '../services/payments';

/**
 * Ödeme sayfasının (`/odeme`) akış durumu.
 *
 * Paywall (`useSubscriptionStore`) *hangi paketi* sorusunu cevaplar ve
 * kullanıcıyı buraya gönderir; bu store *nasıl ödenecek* sorusunun
 * durumunu taşır. İkisi ayrı, çünkü paywall bir modal, ödeme ise kendi
 * adresi olan bir sayfa: sayfa yenilendiğinde bağlam (paket, davetiye)
 * URL'den okunur, burada tutulmaz.
 *
 * 🔴 **Kart bilgisi bu store'a GİRMEZ.** Store küreseldir; geliştirici
 * araçlarından okunabilir, bir gün kalıcı hâle getirilebilir. Kart
 * alanları `CardPaymentForm`'un yerel state'inde doğar ve orada ölür.
 */

/** Ödemenin kime yazılacağı: davetiye ya da (`invitationId: null`) hesap paketi (K42). */
export interface CheckoutContext {
  tier: SubscriptionTier;
  invitationId: string | null;
}

interface CheckoutState {
  method: PaymentMethod;
  /** Mesafeli satış onayı — yöntemler arasında geçerken tekrar sorulmaz. */
  termsAccepted: boolean;
  isProcessing: boolean;
  /**
   * Açılmış ama **ödenmemiş** sipariş. Sağlayıcıya yönlendirme
   * gerçekleşmediğinde ekranda ne olduğunu anlatabilmek için tutulur.
   */
  pendingOrder: CheckoutResult | null;
  /** Kullanıcı havaleyi yaptığını bildirdi; sayfa "kontrol bekliyor" ekranına geçer. */
  bankTransferConfirmed: boolean;
  selectMethod: (method: PaymentMethod) => void;
  setTermsAccepted: (accepted: boolean) => void;
  /**
   * Kartla ödeme için siparişi **başlatır** ve sağlayıcının yanıtını döndürür.
   *
   * 🔴 Bu çağrı ödemeyi bitirmez: 201 ile dönen sipariş `pending`'dir, `paid`'e
   * sağlayıcının bildirimi geçirir (bkz. `services/payments.ts`). Kart
   * bilgisi parametre OLARAK ALINMAZ — sağlayıcı bağlanana kadar hiçbir
   * yere gitmez, bağlandığında da tarayıcıdan doğrudan sağlayıcıya gider.
   */
  startCardCheckout: (context: CheckoutContext) => Promise<CheckoutResult | null>;
  confirmBankTransfer: () => void;
  /** "Kontrol bekliyor" ekranından hesap bilgilerine geri döner. */
  reviewBankTransfer: () => void;
  /** Sayfaya girişte ve çıkışta: bir önceki ödemenin durumu yenisine sızmasın. */
  reset: () => void;
}

const INITIAL_STATE = {
  method: 'card' as PaymentMethod,
  termsAccepted: false,
  isProcessing: false,
  pendingOrder: null,
  bankTransferConfirmed: false
};

export const useCheckoutStore = create<CheckoutState>()((set, get) => ({
  ...INITIAL_STATE,

  selectMethod: (method) => {
    // Sipariş açılırken yöntem değişirse yanıt, artık ekranda olmayan yönteme düşer.
    if (!get().isProcessing) set({ method });
  },

  setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),

  startCardCheckout: async ({ tier, invitationId }) => {
    if (get().isProcessing) return null;
    set({ isProcessing: true });

    try {
      // Davetiye kimliği varsa o davetiyeye, yoksa hesaba yazılır (K42).
      const result = invitationId
        ? await paymentService.checkoutForInvitation(invitationId, tier)
        : await paymentService.checkoutForAccount(tier);

      set({ isProcessing: false, pendingOrder: result });
      return result;
    } catch (error) {
      set({ isProcessing: false });
      throw error;
    }
  },

  /**
   * 🔴 Bugün sunucuya bir şey GÖNDERMEZ: backend'de havale siparişi ucu yok.
   * Eşleştirme, havale açıklamasındaki referans koduyla elle yapılır
   * (`bankTransferReference`). Uç açıldığında bu eylem onu çağıracak ve
   * referans, dönen sipariş kimliği olacak. O güne kadar ekrandaki metin de
   * "bildiriminiz alındı" DEMEZ — söylenen yalnızca sonraki adımdır.
   */
  confirmBankTransfer: () => set({ bankTransferConfirmed: true }),

  reviewBankTransfer: () => set({ bankTransferConfirmed: false }),

  reset: () => {
    // Yönlendirme sürerken sıfırlamak, dönen yanıtı sahipsiz bırakırdı.
    if (!get().isProcessing) set(INITIAL_STATE);
  }
}));
