import { api, unwrapEnvelope } from './api';
import { CheckoutResult, SubscriptionTier } from '../types';

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
 * | Hesap için (paket) | `POST /payments/checkout` |
 */
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

export const paymentService = {
  /** Tek bir davetiyeyi yayınlamak için plan satın alır. */
  async checkoutForInvitation(
    invitationId: string,
    tier: SubscriptionTier,
  ): Promise<CheckoutResult> {
    // Gövdede YALNIZCA tier: fiyatı backend config'ten okur (M6).
    const { data } = await api.post<unknown>(`/invitations/${invitationId}/checkout`, { tier });
    return toCheckoutResult(data);
  },

  /** Hesabın tamamı için paket satın alır. */
  async checkoutForAccount(tier: SubscriptionTier): Promise<CheckoutResult> {
    const { data } = await api.post<unknown>('/payments/checkout', { tier });
    return toCheckoutResult(data);
  },
};
