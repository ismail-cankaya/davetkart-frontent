import { api, unwrapEnvelope } from './api';
import { CheckoutPayload, CheckoutResult, GiftCodePreview, OrderRecord, SubscriptionTier } from '../types';

/**
 * Ödeme servisi.
 *
 * 🔴 Buradaki tek en önemli gerçek: **checkout ödeme değildir.** Uç bir
 * sipariş kaynağı yaratır (201) ve `status: 'pending'` döner; `paid`'e geçişi
 * sağlayıcının webhook'u yapar. Kullanıcı `redirectUrl`'e gidip ödemesini
 * tamamlamadan hiçbir hak doğmaz.
 *
 * Bu dosya eskiden 1.8 saniye bekleyip `status: 'paid'` döndüren bir mock'tu.
 * Gerçek uç açıldığında zincir sessizce kırılacaktı: kullanıcı "ödendi"
 * ekranını görüp yayınlamaya basacak ve **402** alacaktı.
 *
 * İki uç, iki kapsam (K42):
 *
 * | Ne alınıyor | Uç |
 * |---|---|
 * | Bu davetiye için | `POST /invitations/{id}/checkout` |
 * | Davetiyesiz (paket) | `POST /payments/checkout` |
 *
 * Faz 10 (backend 10.58 · K99): paket de TEK davetiyelik. Davetiyesiz alınan
 * sipariş ilk yayınlanan davetiyeye bağlanır; hesabın bütün davetiyelerini
 * açmaz.
 *
 * Faz 10 (10.26): siparişi OKUYAN iki uç — `GET /orders/{id}` ve `GET /orders`.
 *
 * Faz 11: checkout'a isteğe bağlı `giftCode` ve hediye kodu önizleme ucu
 * (`POST /gift-codes/preview`). İstisna: kod tutarı 0'a indirirse checkout
 * `paid` döner (backend K107).
 * Ayrıntılı açıklama: docs/rehber/src/services/payments.md
 */

/**
 * Checkout gövdesi. Kod yoksa ya da yalnızca boşluksa anahtar HİÇ konmaz:
 * boş bir `giftCode` alanı backend'de anlamsız bir durum doğururdu.
 * Fiyat, tutar ve indirim ASLA gövdeye girmez (M6).
 */
export function checkoutBody(tier: SubscriptionTier, giftCode?: string | null): CheckoutPayload {
  const code = giftCode?.trim();
  return code ? { tier, giftCode: code } : { tier };
}

function isGiftCodePreview(body: unknown): body is GiftCodePreview {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.benefit === 'string' &&
    typeof b.tier === 'string' &&
    Number.isInteger(b.priceMinor) &&
    Number.isInteger(b.discountMinor) &&
    Number.isInteger(b.totalMinor) &&
    typeof b.currency === 'string'
  );
}
function toCheckoutResult(payload: unknown): CheckoutResult {
  const body = unwrapEnvelope(payload);

  if (
    !body ||
    typeof body !== 'object' ||
    typeof (body as { orderId?: unknown }).orderId !== 'string'
  ) {
    throw new Error('Unexpected checkout response shape');
  }

  return body as CheckoutResult;
}

function isOrderRecord(body: unknown): body is OrderRecord {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as { orderId?: unknown }).orderId === 'string' &&
    typeof (body as { status?: unknown }).status === 'string'
  );
}

function toOrder(payload: unknown): OrderRecord {
  const body = unwrapEnvelope(payload);

  if (!isOrderRecord(body)) {
    throw new Error('Unexpected /orders response shape');
  }

  return body;
}

function toOrderList(payload: unknown): OrderRecord[] {
  const body = unwrapEnvelope(payload);

  if (!Array.isArray(body) || !body.every(isOrderRecord)) {
    throw new Error('Unexpected /orders response shape');
  }

  return body;
}

export const paymentService = {
  /** Tek bir davetiyeyi yayınlamak için plan satın alır. */
  async checkoutForInvitation(
    invitationId: string,
    tier: SubscriptionTier,
    giftCode?: string | null,
  ): Promise<CheckoutResult> {
    // Gövdede tier ve (varsa) giftCode: fiyatı ve indirimi backend hesaplar (M6).
    const { data } = await api.post<unknown>(`/invitations/${invitationId}/checkout`, checkoutBody(tier, giftCode));
    return toCheckoutResult(data);
  },

  /** Davetiyesiz paket alır; ilk yayınlanan davetiyeye bağlanır (K99). */
  async checkoutForAccount(tier: SubscriptionTier, giftCode?: string | null): Promise<CheckoutResult> {
    const { data } = await api.post<unknown>('/payments/checkout', checkoutBody(tier, giftCode));
    return toCheckoutResult(data);
  },

  /**
   * Hediye kodunun bu plan için ne kazandıracağı (Faz 11). Hiçbir şey AYIRMAZ:
   * kod arada tükenebilir, karar checkout'ta verilir. Hatalar 422
   * `GIFT_CODE_*` olarak gelir ve `toDisplayError` ile çizilir.
   */
  async previewGiftCode(code: string, tier: SubscriptionTier): Promise<GiftCodePreview> {
    const { data } = await api.post<unknown>('/gift-codes/preview', { code: code.trim(), tier });
    const body = unwrapEnvelope(data);

    if (!isGiftCodePreview(body)) {
      throw new Error('Unexpected /gift-codes/preview response shape');
    }

    return body;
  },

  /**
   * Tek sipariş. Ödeme dönüş sayfası bunu birkaç saniye yoklar: webhook
   * sağlayıcıdan dönüşten ÖNCE de SONRA da gelebilir.
   *
   * Başkasının siparişi ile var olmayan sipariş aynı **404**'ü döner (H7);
   * çağıran ikisini ayırt etmeye çalışmamalı.
   */
  async getOrder(orderId: string): Promise<OrderRecord> {
    // Kimlik URL'nin sorgu dizesinden geliyor (`?order=`): kodlanmadan
    // yola yazılırsa `../` gibi bir değer başka bir uca gidebilirdi.
    const { data } = await api.get<unknown>(`/orders/${encodeURIComponent(orderId)}`);
    return toOrder(data);
  },

  /** Kullanıcının kendi siparişleri, en yeni üstte (sırayı backend verir). */
  async listOrders(): Promise<OrderRecord[]> {
    const { data } = await api.get<unknown>('/orders');
    return toOrderList(data);
  },
};
