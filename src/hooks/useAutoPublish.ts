import { useCallback, useEffect, useRef, useState } from 'react';
import { persistenceService } from '../services/persistence';
import { apiErrorCode } from '../services/api';
import { OrderRecord } from '../types';
import { toDisplayError } from '../utils/toDisplayError';

export type AutoPublishState =
  | { status: 'idle' }
  | { status: 'publishing' }
  | { status: 'published'; invitationId: string }
  | { status: 'error'; message: string };

/**
 * Ödeme onaylandığında siparişin bağlı olduğu davetiyeyi yayına alır.
 *
 * Kart, Shopier ve hediye kodu (toplam 0) aynı dönüş sayfasına düşer; sipariş
 * `paid` olunca kullanıcıdan ikinci bir "Yayınla" tıklaması beklenmez. Yayının
 * kendisi yine `POST /invitations/{id}/publish`: plan kontrolünü (402) sunucu
 * yapar, frontend yetki kararı vermez.
 *
 * - Paket siparişi (`invitationId: null`): yayınlanacak bir davetiye yok, `idle`.
 * - 409 `INVITATION_ALREADY_PUBLISHED`: kullanıcı hedefine ulaşmış, başarı sayılır.
 * - Diğer hatalar: ödeme geçerli kalır; ekran sebebi ve "Tekrar Dene"yi gösterir.
 *
 * 🔴 Aynı sipariş için istek bir kez atılır (ref bekçisi). Sonuç iptal
 * edilmez: StrictMode'un çift efekti ilk isteğin sonucunu düşürseydi ikinci
 * çalışma bekçiye takılır ve ekran "yayınlanıyor"da kalırdı.
 */
export function useAutoPublish(order: OrderRecord | null): {
  state: AutoPublishState;
  retry: () => void;
} {
  const [state, setState] = useState<AutoPublishState>({ status: 'idle' });
  const attemptedOrderId = useRef<string | null>(null);

  const publish = useCallback(async (invitationId: string) => {
    setState({ status: 'publishing' });
    try {
      await persistenceService.publishInvitation(invitationId);
      setState({ status: 'published', invitationId });
    } catch (error) {
      if (apiErrorCode(error) === 'INVITATION_ALREADY_PUBLISHED') {
        setState({ status: 'published', invitationId });
        return;
      }
      setState({ status: 'error', message: toDisplayError(error) });
    }
  }, []);

  const orderId = order?.orderId ?? null;
  const invitationId = order?.invitationId ?? null;
  const isPaid = order?.status === 'paid';

  useEffect(() => {
    if (!orderId || !invitationId || !isPaid) return;
    if (attemptedOrderId.current === orderId) return;
    attemptedOrderId.current = orderId;
    void publish(invitationId);
  }, [orderId, invitationId, isPaid, publish]);

  const retry = useCallback(() => {
    if (invitationId) void publish(invitationId);
  }, [invitationId, publish]);

  return { state, retry };
}
