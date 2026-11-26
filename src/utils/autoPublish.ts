import type { OrderRecord } from '../types';
import type { ReturnView } from './paymentReturn';

/**
 * Ödeme dönüşünde otomatik yayın kararı (FE-58, K267): yayın niyetiyle başlayan ödeme dönüşte bir kez yayınlar.
 * Saf fonksiyonlar; `verify:payment` sınar. Ayrıntı: docs/rehber/src/utils/autoPublish.md
 */

/** sessionStorage anahtarı: bu sekmede yayın isteği atılmış sipariş kimlikleri. */
export const AUTO_PUBLISH_KEY = 'davetkart-auto-published';

const MAX_REMEMBERED = 20;

export type AutoPublishState =
  | { status: 'idle' }
  | { status: 'publishing' }
  | { status: 'published'; invitationId: string }
  /** Bu sekmede daha önce denendi (yenileme, geri gelme): yeniden yayınlanmaz. */
  | { status: 'skipped' }
  | { status: 'error'; message: string };

export type AutoPublishOrder = Pick<OrderRecord, 'orderId' | 'invitationId' | 'status'>;

export type AutoPublishDecision =
  | { kind: 'publish'; invitationId: string }
  | { kind: 'already' }
  | { kind: 'none' };

export interface PublishMemory {
  has(orderId: string): boolean;
  add(orderId: string): void;
}

/** `publish` dönerse siparişi belleğe yazar: aynı sipariş bir daha `already` döner. */
export function claimAutoPublish(order: AutoPublishOrder, memory: PublishMemory): AutoPublishDecision {
  if (order.status !== 'paid' || !order.invitationId) return { kind: 'none' };
  if (memory.has(order.orderId)) return { kind: 'already' };
  memory.add(order.orderId);
  return { kind: 'publish', invitationId: order.invitationId };
}

type MemoryStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Sekme belleği; depolama yoksa ya da hata verirse yalnızca bu nesnenin ömrü (ziyaret içi). */
export function sessionPublishMemory(storage: MemoryStorage | null): PublishMemory {
  const local = new Set<string>();

  const stored = (): string[] => {
    if (!storage) return [];
    try {
      const parsed: unknown = JSON.parse(storage.getItem(AUTO_PUBLISH_KEY) ?? '[]');
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  };

  return {
    has: (orderId) => local.has(orderId) || stored().includes(orderId),
    add: (orderId) => {
      local.add(orderId);
      if (!storage) return;
      try {
        const ids = [...stored().filter((id) => id !== orderId), orderId].slice(-MAX_REMEMBERED);
        storage.setItem(AUTO_PUBLISH_KEY, JSON.stringify(ids));
      } catch {
        // Dolu ya da engelli depolama: ziyaret içi bekçi (local) yine korur.
      }
    },
  };
}

/** Tarayıcıda sessionStorage; erişim engelliyse (gizli kip, ayar) depolamasız bellek. */
export function browserPublishMemory(): PublishMemory {
  let storage: Storage | null = null;
  try {
    storage = typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    storage = null;
  }
  return sessionPublishMemory(storage);
}

export type ReturnCardView = ReturnView | 'publishing' | 'published' | 'publishFailed';

/** Ödeme onaylandıysa davetiyeli siparişte kartı yayın belirler; tekrar ziyarette "onaylandı" kalır. */
export function returnCardView(
  view: ReturnView,
  order: Pick<OrderRecord, 'invitationId'>,
  publish: AutoPublishState,
): ReturnCardView {
  if (view !== 'confirmed' || !order.invitationId) return view;
  switch (publish.status) {
    case 'published':
      return 'published';
    case 'error':
      return 'publishFailed';
    case 'skipped':
      return 'confirmed';
    default:
      return 'publishing';
  }
}
