import { api, unwrapEnvelope } from './api';
import { BankTransferAccount, CatalogPaymentMethod, PlanPrice, PlanPromotion, PricingCatalog, isSubscriptionTier } from '../types';

/**
 * Fiyat kataloğu servisi (Faz 13, backend K128).
 *
 * 🔴 **Frontend'de fiyat yok.** Paket fiyatları, indirimler, ödenecek tutar ve
 * açık ödeme yöntemleri backend'den okunur. Bu dosya o yanıtı alır ve
 * BİÇİMİNİ doğrular; hiçbir sayıyı hesaplamaz.
 *
 * İki uç, iki soru:
 *
 * | Kim | Uç | Fark |
 * |---|---|---|
 * | Misafir | `GET /public/plans` | Liste fiyatı + çalışan kampanya |
 * | Oturumlu | `GET /pricing` | + ilk yayın indirimi (uygunsa) |
 *
 * Ayrıntılı açıklama: docs/rehber/src/services/pricing.md
 */

const PROMOTION_KINDS = new Set(['first_publish', 'campaign']);
const METHODS = new Set<CatalogPaymentMethod>(['card', 'bank_transfer', 'gift_code']);

const isMinor = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= 0;

function isPromotion(value: unknown): value is PlanPromotion {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.kind === 'string' &&
    PROMOTION_KINDS.has(v.kind) &&
    Number.isInteger(v.percent) &&
    isMinor(v.discountMinor) &&
    (v.endsAt === null || typeof v.endsAt === 'string')
  );
}

/**
 * Bir paketin fiyat dökümü mü? Hediye kodu önizlemesi de bu alanları taşır.
 *
 * 🔴 Tutarlılık da sınanır: `priceMinor − discountMinor = totalMinor`. Bozuk
 * bir yanıt ekranda "399 ₺ − 239,40 ₺ = 99 ₺" gibi bir döküm çizerdi.
 */
export function isPlanPrice(value: unknown): value is PlanPrice {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    isSubscriptionTier(v.tier) &&
    isMinor(v.priceMinor) &&
    isMinor(v.discountMinor) &&
    isMinor(v.totalMinor) &&
    (v.promotion === null || isPromotion(v.promotion)) &&
    (v.priceMinor as number) - (v.discountMinor as number) === v.totalMinor
  );
}

function isBankAccount(value: unknown): value is BankTransferAccount {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.bankName === 'string' && typeof v.accountHolder === 'string' && typeof v.iban === 'string';
}

export function isPricingCatalog(value: unknown): value is PricingCatalog {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.currency === 'string' &&
    typeof v.personalized === 'boolean' &&
    Number.isInteger(v.firstPublishPercent) &&
    Array.isArray(v.plans) &&
    v.plans.length > 0 &&
    v.plans.every(isPlanPrice) &&
    Array.isArray(v.paymentMethods) &&
    // Bilinmeyen yöntem (yarın backend 'wallet' eklerse) atılmaz, süzülür: aşağıda.
    v.paymentMethods.every((m) => typeof m === 'string') &&
    (v.bankTransfer === null || isBankAccount(v.bankTransfer))
  );
}

function toCatalog(payload: unknown): PricingCatalog {
  const body = unwrapEnvelope(payload);

  if (!isPricingCatalog(body)) {
    throw new Error('Unexpected pricing catalog shape');
  }

  // Tanımadığımız bir yöntemin düğmesi çizilemez; listeden düşer.
  return {
    ...body,
    paymentMethods: body.paymentMethods.filter((method) => METHODS.has(method)),
  };
}

export const pricingService = {
  /** Misafir kataloğu: herkes için aynı, ETag'le önbelleklenir. */
  async publicCatalog(): Promise<PricingCatalog> {
    const { data } = await api.get<unknown>('/public/plans');
    return toCatalog(data);
  },

  /** Oturum açmış kullanıcının kataloğu: ilk yayın indirimi dahil. */
  async myCatalog(): Promise<PricingCatalog> {
    const { data } = await api.get<unknown>('/pricing');
    return toCatalog(data);
  },
};
