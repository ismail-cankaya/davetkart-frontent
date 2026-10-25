import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { GUEST, usePricingStore } from '../stores/usePricingStore';
import type { PricingStatus } from '../stores/usePricingStore';
import { PricingCatalog } from '../types';

interface UsePricingResult {
  catalog: PricingCatalog | null;
  status: PricingStatus;
  reload: () => void;
}

/**
 * Fiyat kataloğunu okuyan bileşenlerin tek kapısı (Faz 13).
 *
 * Kimlik değişince (giriş / çıkış) katalog kendiliğinden yeniden istenir.
 * `force`: bileşen açıldığında önbellekteki kataloğa güvenme (ödeme sayfası).
 * Ayrıntılı açıklama: docs/rehber/src/stores/usePricingStore.md §3
 */
export function usePricing(options: { force?: boolean } = {}): UsePricingResult {
  const key = useAuthStore((s) => s.user?.id ?? GUEST);
  const catalog = usePricingStore((s) => (s.loadedFor === key ? s.catalog : null));
  const status = usePricingStore((s) => (s.loadedFor === key ? s.status : 'loading'));
  const load = usePricingStore((s) => s.load);
  const force = options.force ?? false;

  useEffect(() => {
    void load({ force });
  }, [key, force, load]);

  return { catalog, status, reload: () => void load({ force: true }) };
}

/**
 * İlk yayın indirimi yüzdesi (pazarlama metinleri için: "İlk davetiye %60
 * indirimli"). Katalog gelene kadar ve indirim kapalıyken `0`: metin
 * çizilmez — kapatılmış bir indirim vaat edilmesin.
 */
export function useFirstPublishPercent(): number {
  return usePricing().catalog?.firstPublishPercent ?? 0;
}
