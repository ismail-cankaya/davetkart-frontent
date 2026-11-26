import { useCallback, useEffect, useRef, useState } from 'react';
import { persistenceService } from '../services/persistence';
import { apiErrorCode } from '../services/api';
import { OrderRecord } from '../types';
import { toDisplayError } from '../utils/toDisplayError';
import { AutoPublishState, PublishMemory, browserPublishMemory, claimAutoPublish } from '../utils/autoPublish';

export type { AutoPublishState };

/**
 * Ödeme onaylandığında siparişin bağlı olduğu davetiyeyi yayına alır (K267: yayın niyetiyle başlayan ödeme).
 * Karar `claimAutoPublish`'te: sekme başına sipariş başına tek istek; tekrar ziyarette `skipped`.
 * Ayrıntı: docs/rehber/src/hooks/useAutoPublish.md
 */
export function useAutoPublish(order: OrderRecord | null): {
  state: AutoPublishState;
  retry: () => void;
} {
  const [state, setState] = useState<AutoPublishState>({ status: 'idle' });
  const attemptedOrderId = useRef<string | null>(null);
  const memory = useRef<PublishMemory | null>(null);

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
  const status = order?.status ?? null;

  useEffect(() => {
    // 🔴 Bu çizimde karar bir kez verilir: StrictMode'un ikinci efekti ilk isteğin sonucunu ezmesin.
    if (!orderId || !status || attemptedOrderId.current === orderId) return;
    memory.current ??= browserPublishMemory();
    const decision = claimAutoPublish({ orderId, invitationId, status }, memory.current);
    if (decision.kind === 'none') return;
    attemptedOrderId.current = orderId;
    if (decision.kind === 'already') setState({ status: 'skipped' });
    else void publish(decision.invitationId);
  }, [orderId, invitationId, status, publish]);

  const retry = useCallback(() => {
    if (invitationId) void publish(invitationId);
  }, [invitationId, publish]);

  return { state, retry };
}
