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
 *
 * Faz 18.3 (backend K159, K163): ilk yayın indirimi tek açık siparişe verilir,
 * bu yüzden fiyat bir **hedef** için sorulur. Ortak katalog (`catalog`)
 * davetiyesiz fiyatı taşır ve her yerde okunur; ödeme sayfası kendi
 * davetiyesinin fiyatını ayrı bir yuvada (`targeted`) tutar. İki yuva, çünkü
 * ortak kataloğu aynı anda birçok bileşen okur: onu bir davetiyeye göre
 * değiştirmek, o an ekranda olan diğer bileşenlerin fiyatını da değiştirirdi.
 * Ayrıntılı açıklama: docs/rehber/src/stores/usePricingStore.md
 */

export type PricingStatus = 'idle' | 'loading' | 'ready' | 'error';

/** Misafir kataloğunun anahtarı; kullanıcıda kullanıcı kimliği. */
export const GUEST = 'guest';

/** Bir davetiye İÇİN sorulmuş katalog (Faz 18.3). */
export interface TargetedPricing {
  /** Kimin için: kullanıcı kimliği. Misafirin hedefli kataloğu olmaz. */
  loadedFor: string;
  invitationId: string;
  catalog: PricingCatalog | null;
  status: PricingStatus;
}

interface PricingState {
  catalog: PricingCatalog | null;
  /** Kataloğun kime ait olduğu: kullanıcı kimliği ya da `GUEST`. */
  loadedFor: string | null;
  status: PricingStatus;
  /** Ödeme sayfasının davetiyesi için katalog; o sayfa dışında `null` kalabilir. */
  targeted: TargetedPricing | null;
  /**
   * O anki kimlik için kataloğu getirir. Zaten varsa istek atmaz;
   * `force` (ödeme sayfası) her zaman tazeler: ilk yayın indirimi az önce
   * başka bir sekmede kullanılmış olabilir.
   */
  load: (options?: { force?: boolean }) => Promise<void>;
  /**
   * Bir davetiyenin fiyatını getirir (`GET /pricing?invitation=…`). Ortak
   * kataloğa DOKUNMAZ. Misafirde bir şey yapmaz: çağıran ortak kataloğu okur.
   */
  loadFor: (invitationId: string, options?: { force?: boolean }) => Promise<void>;
  /** Ekrandaki katalogları tazeler: ortak olanı ve (varsa) hedefli olanı. */
  refresh: () => Promise<void>;
}

let latestRequest = 0;
let latestTargetedRequest = 0;

/** Şu anki kimliğin anahtarı. */
export function currentPricingKey(): string {
  return useAuthStore.getState().user?.id ?? GUEST;
}

export const usePricingStore = create<PricingState>()((set, get) => ({
  catalog: null,
  loadedFor: null,
  status: 'idle',
  targeted: null,

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

  loadFor: async (invitationId, { force = false } = {}) => {
    const key = currentPricingKey();
    if (key === GUEST) return;

    const current = get().targeted;
    const same = current !== null && current.loadedFor === key && current.invitationId === invitationId;

    if (!force && same && (current.status === 'ready' || current.status === 'loading')) return;

    const request = ++latestTargetedRequest;
    // Başka bir davetiyenin (ya da kimliğin) fiyatı ekranda KALMAZ: bir
    // davetiyenin indirimli fiyatı diğerinin fiyatı gibi görünmesin.
    set({
      targeted: { loadedFor: key, invitationId, catalog: same ? current.catalog : null, status: 'loading' },
    });

    try {
      const catalog = await pricingService.myCatalog(invitationId);
      if (request !== latestTargetedRequest) return;
      set({ targeted: { loadedFor: key, invitationId, catalog, status: 'ready' } });
    } catch {
      if (request !== latestTargetedRequest) return;
      set({ targeted: { loadedFor: key, invitationId, catalog: null, status: 'error' } });
    }
  },

  refresh: async () => {
    const { targeted, load, loadFor } = get();

    await Promise.all([
      load({ force: true }),
      targeted ? loadFor(targeted.invitationId, { force: true }) : Promise.resolve(),
    ]);
  },
}));

/** Kataloğun bu paket için fiyatı; katalog yoksa `null`. */
export function planPriceOf(catalog: PricingCatalog | null, tier: SubscriptionTier): PlanPrice | null {
  return catalog?.plans.find((plan) => plan.tier === tier) ?? null;
}
