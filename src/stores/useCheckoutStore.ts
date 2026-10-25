import { create } from 'zustand';
import { CheckoutResult, GiftCodePreview, PaymentMethod, SubscriptionTier } from '../types';
import { checkoutActionOf, paymentService } from '../services/payments';
import { submitProviderForm } from '../utils/submitProviderForm';
import { apiErrorCode } from '../services/api';
import { toDisplayError } from '../utils/toDisplayError';
import { usePricingStore } from './usePricingStore';

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
 * araçlarından okunabilir, bir gün kalıcı hâle getirilebilir. Faz 12'den beri
 * kart alanı uygulamada hiç yok: kart Shopier'in sayfasında yazılır.
 *
 * Faz 11: hediye kodu da burada. Kod bir sır değil (kullanıcı onu zaten
 * yazdı) ve kart formu ile ücretsiz etkinleştirme düğmesi aynı kodu okumalı.
 * Önizleme yalnızca GÖSTERİMDİR; indirimi checkout yanıtı kesinleştirir.
 *
 * Faz 12: sağlayıcıya gidiş (`goToProvider`) burada — adres mi, imzalı form
 * mu, karar tek yerde. Kart formu ve ücretsiz etkinleştirme aynı kapıdan geçer.
 * Ayrıntılı açıklama: docs/rehber/src/stores/useCheckoutStore.md
 */

/**
 * Faz 13 (backend K134): yöntem sayfa açıkken kapatıldıysa backend 403
 * `PAYMENT_METHOD_DISABLED` döner. Ekrandaki düğmeler artık yanlış: katalog
 * tazelenir ve sayfa açık yöntemlere göre yeniden çizilir.
 */
function refreshCatalogIfMethodClosed(error: unknown): void {
  if (apiErrorCode(error) === 'PAYMENT_METHOD_DISABLED') {
    void usePricingStore.getState().load({ force: true });
  }
}

/** Hediye kodu hatası mı? (`GIFT_CODE_INVALID` · `_ALREADY_USED` · `_NOT_APPLICABLE`) */
function isGiftCodeError(error: unknown): boolean {
  return apiErrorCode(error)?.startsWith('GIFT_CODE_') ?? false;
}

/**
 * Son önizleme isteğinin numarası. Kullanıcı "Uygula"ya art arda basar ya da
 * plan değişirse eski yanıt yenisinden SONRA gelebilir; yalnızca en son
 * isteğin yanıtı yazılır.
 */
let latestPreview = 0;

/** Ödemenin kime yazılacağı: davetiye ya da (`invitationId: null`) davetiyesiz paket; ilk yayında bağlanır (K42, K99). */
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
  /** Faz 11: kullanıcının uyguladığı hediye kodu (yazıldığı hâliyle, kırpılmış). */
  giftCode: string | null;
  /** Son başarılı önizleme. `null` iken checkout'a kod GÖNDERİLMEZ. */
  giftPreview: GiftCodePreview | null;
  isCheckingGiftCode: boolean;
  /** Son önizlemenin ya da checkout'un hediye kodu hatası, çizilmeye hazır metin. */
  giftCodeError: string | null;
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
  /**
   * Faz 12: checkout yanıtına göre sağlayıcıya gider. `form` -> imzalı formu
   * POST eder (Shopier), `redirect` -> adrese gider. `false` = gidilecek bir
   * yer yok (sipariş açıldı ama sağlayıcı sayfası gelmedi).
   */
  goToProvider: (result: CheckoutResult) => boolean;
  confirmBankTransfer: () => void;
  /** "Kontrol bekliyor" ekranından hesap bilgilerine geri döner. */
  reviewBankTransfer: () => void;
  /**
   * Kodu önizler; geçerliyse uygular. `true` = uygulandı. Hata fırlatmaz:
   * metni `giftCodeError`'a yazar (alanın altında durur, toast'ta kaybolmaz).
   */
  applyGiftCode: (code: string, tier: SubscriptionTier) => Promise<boolean>;
  /** Plan değişince aynı kodu yeni plan için yeniden hesaplar (Faz 11). */
  refreshGiftCode: (tier: SubscriptionTier) => Promise<void>;
  removeGiftCode: () => void;
  /**
   * Sayfaya girişte ve çıkışta: bir önceki ödemenin durumu yenisine sızmasın.
   * `keepGiftCode`: aynı sayfada plan değişti; kod korunur, önizleme yeniden hesaplanır.
   */
  reset: (options?: { keepGiftCode?: boolean }) => void;
}

const INITIAL_GIFT_STATE = {
  giftCode: null,
  giftPreview: null,
  isCheckingGiftCode: false,
  giftCodeError: null
};

const INITIAL_STATE = {
  method: 'card' as PaymentMethod,
  termsAccepted: false,
  isProcessing: false,
  pendingOrder: null,
  bankTransferConfirmed: false,
  ...INITIAL_GIFT_STATE
};

export const useCheckoutStore = create<CheckoutState>()((set, get) => ({
  ...INITIAL_STATE,

  selectMethod: (method) => {
    // Sipariş açılırken yöntem değişirse yanıt, artık ekranda olmayan yönteme düşer.
    if (get().isProcessing) return;
    // Faz 11: hediye kodu yalnızca kartla (sipariş açan yolla) geçerli. Havalede
    // sipariş açılmıyor, kod hiçbir yere ayrılamaz (bkz. kılavuz §4).
    if (method === 'bank_transfer' && get().giftPreview) return;
    set({ method });
  },

  setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),

  startCardCheckout: async ({ tier, invitationId }) => {
    if (get().isProcessing) return null;
    set({ isProcessing: true });

    // Faz 11: kod YALNIZCA geçerli bir önizlemesi varsa gider. Önizlemesi
    // olmayan (hatalı ya da henüz denenmemiş) kod sessizce gönderilseydi
    // kullanıcı indirimsiz bir fiyata "Öde" demiş olurdu.
    const { giftCode, giftPreview } = get();
    const code = giftPreview ? giftCode : null;

    try {
      // Davetiye kimliği varsa o davetiyeye, yoksa davetiyesiz paket olur (K42, K99).
      const result = invitationId
        ? await paymentService.checkoutForInvitation(invitationId, tier, code)
        : await paymentService.checkoutForAccount(tier, code);

      set({ isProcessing: false, pendingOrder: result });
      return result;
    } catch (error) {
      // Önizlemeden sonra kod tükenmiş ya da kullanılmış olabilir: önizleme
      // artık yanlış bir toplam gösteriyor, kaldırılır ve sebep alana yazılır.
      if (isGiftCodeError(error)) {
        set({ isProcessing: false, giftPreview: null, giftCodeError: toDisplayError(error) });
      } else {
        set({ isProcessing: false });
      }
      refreshCatalogIfMethodClosed(error);
      throw error;
    }
  },

  goToProvider: (result) => {
    const action = checkoutActionOf(result);
    if (!action) return false;

    if (action.type === 'form') {
      submitProviderForm(action);
    } else {
      window.location.assign(action.url);
    }
    return true;
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

  applyGiftCode: async (raw, tier) => {
    const code = raw.trim();
    if (!code || get().isProcessing) return false;

    const request = ++latestPreview;
    set({ isCheckingGiftCode: true, giftCodeError: null });

    try {
      const preview = await paymentService.previewGiftCode(code, tier);
      if (request !== latestPreview) return false;

      // Havale açıktaysa karta geçilir: kod yalnızca kartla geçerli.
      set({ giftCode: code, giftPreview: preview, isCheckingGiftCode: false, method: 'card' });
      return true;
    } catch (error) {
      if (request !== latestPreview) return false;

      set({ giftCode: code, giftPreview: null, isCheckingGiftCode: false, giftCodeError: toDisplayError(error) });
      refreshCatalogIfMethodClosed(error);
      return false;
    }
  },

  refreshGiftCode: async (tier) => {
    const { giftCode, applyGiftCode } = get();
    if (giftCode) await applyGiftCode(giftCode, tier);
  },

  removeGiftCode: () => {
    // Uçuştaki önizleme yanıtı geri geldiğinde kodu yeniden yazmasın.
    latestPreview++;
    set(INITIAL_GIFT_STATE);
  },

  reset: (options) => {
    // Yönlendirme sürerken sıfırlamak, dönen yanıtı sahipsiz bırakırdı.
    if (get().isProcessing) return;

    if (options?.keepGiftCode) {
      // Kod kalır; önizleme eski planındı, yeniden hesaplanana kadar yok sayılır.
      const { giftCode } = get();
      set({ ...INITIAL_STATE, giftCode });
      return;
    }

    latestPreview++;
    set(INITIAL_STATE);
  }
}));
