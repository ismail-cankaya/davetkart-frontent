import { create } from 'zustand';
import { PlanPrice, PricingCatalog, SubscriptionTier } from '../types';
import { pricingService } from '../services/pricing';
import { useAuthStore } from './useAuthStore';

/**
 * Backend fiyat kataloğunun tek kopyası (Faz 13, backend K128).
 *
 * 🔴 Frontend'de fiyat yok; fiyat kartları, paywall, ödeme sayfası ve havale
 * paneli sayıları buradan okur. Katalog **kime ait olduğunu** bilir
 * (`loadedFor`): misafirin kataloğu ilk yayın indirimini içermez, giriş
 * yapınca kullanıcınınki yeniden istenir. Çıkış yapınca da tersi.
 *
 * Yalnızca en son isteğin yanıtı yazılır: kullanıcı yükleme sürerken giriş
 * yaparsa misafir yanıtı kullanıcının kataloğunu ezmesin.
 * Ayrıntılı açıklama: docs/rehber/src/stores/usePricingStore.md
 */

export type PricingStatus = 'idle' | 'loading' | 'ready' | 'error';

/** Misafir kataloğunun anahtarı; kullanıcıda kullanıcı kimliği. */
export const GUEST = 'guest';

interface PricingState {
  catalog: PricingCatalog | null;
  /** Kataloğun kime ait olduğu: kullanıcı kimliği ya da `GUEST`. */
  loadedFor: string | null;
  status: PricingStatus;
  /**
   * O anki kimlik için kataloğu getirir. Zaten varsa istek atmaz;
   * `force` (ödeme sayfası) her zaman tazeler: ilk yayın indirimi az önce
   * başka bir sekmede kullanılmış olabilir.
   */
  load: (options?: { force?: boolean }) => Promise<void>;
}

let latestRequest = 0;

/** Şu anki kimliğin anahtarı. */
export function currentPricingKey(): string {
  return useAuthStore.getState().user?.id ?? GUEST;
}

export const usePricingStore = create<PricingState>()((set, get) => ({
  catalog: null,
  loadedFor: null,
  status: 'idle',

  load: async ({ force = false } = {}) => {
    const key = currentPricingKey();
    const { loadedFor, status } = get();

    if (!force && loadedFor === key && (status === 'ready' || status === 'loading')) return;

    const request = ++latestRequest;
    // Başka bir kimliğin kataloğu ekranda KALMAZ: misafir fiyatı "sizin
    // fiyatınız" gibi görünmesin. Aynı kimliğin tazelenmesinde eski katalog
    // yüklenirken görünmeye devam eder (titreme yok).
    set(loadedFor === key ? { status: 'loading' } : { status: 'loading', catalog: null, loadedFor: key });

    try {
      const catalog = key === GUEST ? await pricingService.publicCatalog() : await pricingService.myCatalog();
      if (request !== latestRequest) return;
      set({ catalog, loadedFor: key, status: 'ready' });
    } catch {
      if (request !== latestRequest) return;
      set({ status: 'error' });
    }
  },
}));

/** Kataloğun bu paket için fiyatı; katalog yoksa `null`. */
export function planPriceOf(catalog: PricingCatalog | null, tier: SubscriptionTier): PlanPrice | null {
  return catalog?.plans.find((plan) => plan.tier === tier) ?? null;
}
