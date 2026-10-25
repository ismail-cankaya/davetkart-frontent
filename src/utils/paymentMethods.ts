import { CatalogPaymentMethod } from '../types';

/**
 * Açık ödeme yöntemlerinin ekrandaki "hâli" (Faz 13, backend K134).
 *
 * Yöntem listesi backend `.env`'indeki `PAYMENT_METHODS` satırıdır; bu
 * yardımcı ondan paywall notunun ve fiyat sayfası alt satırının hangi
 * cümleyi kuracağını seçer (`pricing.paywallNote.*`, `pricing.methods.*`).
 *
 * | Hâl | Ne zaman |
 * |---|---|
 * | `cardBank` | Kart ve havale açık |
 * | `card` / `bank` | Yalnızca biri açık |
 * | `giftOnly` | Ne kart ne havale; hediye kodu açık |
 * | `none` | Hiçbir yöntem açık değil |
 */
export type PaymentMethodsMode = 'cardBank' | 'card' | 'bank' | 'giftOnly' | 'none';

export function paymentMethodsMode(methods: readonly CatalogPaymentMethod[]): PaymentMethodsMode {
  const card = methods.includes('card');
  const bank = methods.includes('bank_transfer');

  if (card && bank) return 'cardBank';
  if (card) return 'card';
  if (bank) return 'bank';
  return methods.includes('gift_code') ? 'giftOnly' : 'none';
}
