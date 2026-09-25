import { useCallback, useEffect, useState } from 'react';
import { OrderRecord } from '../types';
import { paymentService } from '../services/payments';
import { apiErrorStatus, isNetworkError } from '../services/api';

/**
 * Siparişin sunucudaki durumu, dönüş sayfasının anlayacağı dört evrede.
 *
 * | Evre | Anlamı |
 * |---|---|
 * | `loading` | İlk okuma ya da `pending` iken yoklama sürüyor |
 * | `settled` | Durum `pending` değil — sonuç belli |
 * | `waiting` | Yoklama bütçesi bitti, sipariş hâlâ `pending` |
 * | `unavailable` | Sipariş okunamadı (404, ağ, beklenmeyen gövde) |
 */
export type OrderLookup =
  | { phase: 'loading'; order: OrderRecord | null }
  | { phase: 'settled'; order: OrderRecord }
  | { phase: 'waiting'; order: OrderRecord }
  | { phase: 'unavailable'; retryable: boolean };

/**
 * Webhook genellikle birkaç saniyede gelir. 30 saniyede gelmediyse kullanıcıyı
 * bir dönen çemberin önünde bekletmek yerine durumu açıkça söylemek daha
 * dürüsttür — sayfa ondan sonra yalnızca istek üzerine yeniden sorar.
 */
const POLL_INTERVAL_MS = 2_000;
const POLL_BUDGET_MS = 30_000;

interface Options {
  /** `false`: tek okuma; `pending` hemen `waiting` olur (başarısızlık dönüşü). */
  poll: boolean;
}

/**
 * `GET /orders/{id}`'yi okur ve `pending` iken kısa süre yoklar.
 *
 * 🔴 Tekrar denemeye değer olan yalnızca geçici hatalardır (ağ, 5xx, 429).
 * 404 kalıcıdır: sipariş bu hesabın değil (H7) ya da uç henüz yok — aynı
 * soruyu yeniden sormak aynı cevabı getirir.
 */
export function useOrderStatus(orderId: string | null, { poll }: Options) {
  const [lookup, setLookup] = useState<OrderLookup>({ phase: 'loading', order: null });
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!orderId) return;

    const controller = new AbortController();
    const deadline = Date.now() + POLL_BUDGET_MS;
    let timer: number | undefined;

    // Yeniden kontrol edilirken bilinen sipariş ekranda kalır; kart boşalmaz.
    setLookup((prev) => ({ phase: 'loading', order: 'order' in prev ? prev.order : null }));

    const read = async () => {
      try {
        const order = await paymentService.getOrder(orderId, { signal: controller.signal });
        if (controller.signal.aborted) return;

        if (order.status !== 'pending') {
          setLookup({ phase: 'settled', order });
          return;
        }

        if (!poll || Date.now() + POLL_INTERVAL_MS > deadline) {
          setLookup({ phase: 'waiting', order });
          return;
        }

        setLookup({ phase: 'loading', order });
        timer = window.setTimeout(read, POLL_INTERVAL_MS);
      } catch (error) {
        if (controller.signal.aborted) return;
        const status = apiErrorStatus(error);
        const retryable = isNetworkError(error) || status === 429 || (status !== null && status >= 500);
        setLookup({ phase: 'unavailable', retryable });
      }
    };

    void read();

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [orderId, poll, round]);

  const recheck = useCallback(() => setRound((n) => n + 1), []);

  return { lookup, recheck };
}
