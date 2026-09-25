import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OrderRecord, PaymentReturnOutcome, SubscriptionTier } from '../types';
import { useOrderStatus, OrderLookup } from './useOrderStatus';
import { checkoutMemory } from '../services/checkoutMemory';
import { persistenceService } from '../services/persistence';
import { apiErrorCode } from '../services/api';
import { useSubscriptionStore } from '../stores/useSubscriptionStore';
import { toast } from '../components/ui/Toast';
import { toDisplayError } from '../utils/toDisplayError';

/**
 * Dönüş sayfasının gösterdiği ekran.
 *
 * | Ekran | Ne zaman |
 * |---|---|
 * | `missing` | Adreste geçerli bir `?order=` yok |
 * | `confirming` | Başarı dönüşü, sipariş `pending`, webhook bekleniyor |
 * | `paid` | Sunucu `paid` diyor |
 * | `delayed` | Başarı dönüşü, yoklama bitti, hâlâ `pending` |
 * | `failed` | `failed` / `expired` / `refunded` ya da hata dönüşü |
 * | `unverified` | Başarı dönüşü ama sipariş okunamadı |
 */
export type PaymentReturnView = 'missing' | 'confirming' | 'paid' | 'delayed' | 'failed' | 'unverified';

/** Başarısızlık ekranının hangi cümleyi kuracağı. */
export type PaymentFailureReason = 'declined' | 'expired' | 'refunded';

export interface PaymentReturnModel {
  view: PaymentReturnView;
  failureReason: PaymentFailureReason;
  orderId: string | null;
  /** Sunucudan en son okunan kayıt; hiç okunamadıysa `null`. */
  order: OrderRecord | null;
  tier: SubscriptionTier | null;
  /** `string` = davetiye · `null` = hesap paketi · `undefined` = bilinmiyor. */
  invitationId: string | null | undefined;
  canPublish: boolean;
  canRetry: boolean;
  canRecheck: boolean;
  isPublishing: boolean;
  isRetrying: boolean;
  publish: () => Promise<void>;
  retry: () => Promise<void>;
  recheck: () => void;
}

/** Sipariş kimliği bir ULID'dir; başka bir şey yola hiç yazılmaz. */
const ORDER_ID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/i;

function resolveView(outcome: PaymentReturnOutcome, lookup: OrderLookup): PaymentReturnView {
  // Sonuç belliyse adres değil SUNUCU konuşur: hata rotasına düşmüş ama
  // ödenmiş bir sipariş "ödendi" görür.
  if (lookup.phase === 'settled') {
    return lookup.order.status === 'paid' ? 'paid' : 'failed';
  }

  // 🔴 Hata dönüşünde sağlayıcı zaten "olmadı" dedi. Webhook henüz gelmediği
  // için sipariş `pending` görünür; kullanıcıyı "onaylanıyor" diye bekletmek
  // yanlış bir umut verirdi.
  if (outcome === 'failure') return 'failed';

  switch (lookup.phase) {
    case 'loading':
      return 'confirming';
    case 'waiting':
      return 'delayed';
    case 'unavailable':
      return 'unverified';
  }
}

function resolveFailureReason(order: OrderRecord | null): PaymentFailureReason {
  if (order?.status === 'expired') return 'expired';
  if (order?.status === 'refunded') return 'refunded';
  return 'declined';
}

/**
 * `/odeme/basarili` ve `/odeme/hata`'nın iş mantığı. Sayfa yalnızca bunun
 * döndürdüğünü çizer.
 *
 * 🔴 Adres bir **iddiadır**, kanıt değil: `/odeme/basarili`'yı herkes
 * yazabilir ve sağlayıcının yönlendirmesi webhook'tan önce gelir. Bu yüzden
 * "ödendi" demenin tek yolu sunucunun `paid` demesidir.
 *
 * 🔴 Ödeme YAYINLAMAZ (K67). Onaydan sonra da yayınlama kullanıcının açık
 * bir eylemidir; `publish()` o eylemdir ve yetkiyi yine sunucu verir.
 */
export function usePaymentReturn(outcome: PaymentReturnOutcome): PaymentReturnModel {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const retryCheckout = useSubscriptionStore((s) => s.retryCheckout);

  const rawOrderId = searchParams.get('order');
  const orderId = rawOrderId && ORDER_ID_PATTERN.test(rawOrderId) ? rawOrderId : null;

  const { lookup, recheck } = useOrderStatus(orderId, { poll: outcome === 'success' });
  const remembered = useMemo(() => (orderId ? checkoutMemory.recall(orderId) : null), [orderId]);

  const [isPublishing, setIsPublishing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const order = 'order' in lookup ? lookup.order : null;
  const view = orderId ? resolveView(outcome, lookup) : 'missing';
  const failureReason = resolveFailureReason(order);

  // Sunucu söylediyse o; söylemediyse checkout anında hatırlanan.
  const tier = order?.tier ?? remembered?.tier ?? null;
  const invitationId =
    order && order.invitationId !== undefined ? order.invitationId : remembered ? remembered.invitationId : undefined;

  const canPublish = typeof invitationId === 'string' && (view === 'paid' || view === 'unverified');
  // İade bilinçli bir geri alımdır; "tekrar dene" orada anlamsız. Davetiyenin
  // bilinmediği durumda denemek yanlış uca (hesap paketi) sipariş açardı.
  const canRetry = view === 'failed' && failureReason !== 'refunded' && tier !== null && invitationId !== undefined;
  const canRecheck =
    view === 'delayed' || (view === 'unverified' && lookup.phase === 'unavailable' && lookup.retryable);

  const publish = useCallback(async () => {
    if (typeof invitationId !== 'string' || isPublishing) return;
    setIsPublishing(true);

    try {
      await persistenceService.publishInvitation(invitationId);
      checkoutMemory.forget();
      toast('Davetiyeniz yayınlandı! Katılım yanıtlarını panelinizden takip edebilirsiniz. 🎉');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const code = apiErrorCode(error);

      // Kullanıcı hedefine zaten ulaşmış; hata gibi göstermek onu bir kez
      // daha denemeye iterdi.
      if (code === 'INVITATION_ALREADY_PUBLISHED') {
        checkoutMemory.forget();
        toast('Bu davetiye zaten yayında.', 'info');
        navigate('/dashboard', { replace: true });
        return;
      }

      // Bu sayfada 402 "plan al" değil, "onay henüz gelmedi" demektir:
      // kullanıcı az önce ödeme yaptı.
      if (code === 'PAYMENT_REQUIRED') {
        toast('Ödemeniz henüz onaylanmadı. Onay geldiğinde tekrar deneyin — lütfen yeniden ödeme yapmayın.', 'info');
        return;
      }

      toast(toDisplayError(error), 'error');
    } finally {
      setIsPublishing(false);
    }
  }, [invitationId, isPublishing, navigate]);

  const retry = useCallback(async () => {
    if (!canRetry || tier === null || invitationId === undefined || isRetrying) return;
    setIsRetrying(true);

    try {
      const result = await retryCheckout({ invitationId, tier });
      if (result?.redirectUrl !== undefined) {
        // Uygulamadan ayrılıyoruz; düğme yönlendirme bitene kadar meşgul kalır.
        window.location.assign(result.redirectUrl);
        return;
      }
      if (result) {
        toast('Siparişiniz oluşturuldu, ancak ödeme sayfası açılamadı. Lütfen birazdan tekrar deneyin.', 'info');
      }
    } catch (error) {
      toast(toDisplayError(error), 'error');
    }
    setIsRetrying(false);
  }, [canRetry, tier, invitationId, isRetrying, retryCheckout]);

  return {
    view,
    failureReason,
    orderId,
    order,
    tier,
    invitationId,
    canPublish,
    canRetry,
    canRecheck,
    isPublishing,
    isRetrying,
    publish,
    retry,
    recheck
  };
}
