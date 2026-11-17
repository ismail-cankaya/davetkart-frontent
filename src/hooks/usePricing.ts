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
 *
 * Faz 18.3 (backend K159): `invitationId` fiyatı sorulan HEDEF. Verilirse
 * o davetiyenin kataloğu ayrı yuvadan okunur (ortak katalog değişmez);
 * verilmezse ortak, davetiyesiz katalog. Başka bir davetiyenin kataloğu bu
 * bileşene hiç verilmez: ekrandaki tutar, bu hedefin checkout'unun keseceği
 * tutardır.
 * Ayrıntılı açıklama: docs/rehber/src/stores/usePricingStore.md §3
 */
export function usePricing(options: { force?: boolean; invitationId?: string | null } = {}): UsePricingResult {
  const key = useAuthStore((s) => s.user?.id ?? GUEST);
  // Misafirin hedefli kataloğu olmaz: ilk yayın indirimi kişiye özeldir.
  const target = key === GUEST ? null : (options.invitationId ?? null);
  const force = options.force ?? false;

  const catalog = usePricingStore((s) => {
    if (target === null) return s.loadedFor === key ? s.catalog : null;
    return s.targeted?.loadedFor === key && s.targeted.invitationId === target ? s.targeted.catalog : null;
  });
  const status = usePricingStore((s): PricingStatus => {
    if (target === null) return s.loadedFor === key ? s.status : 'loading';
    return s.targeted?.loadedFor === key && s.targeted.invitationId === target ? s.targeted.status : 'loading';
  });
  const load = usePricingStore((s) => s.load);
  const loadFor = usePricingStore((s) => s.loadFor);

  useEffect(() => {
    void (target === null ? load({ force }) : loadFor(target, { force }));
  }, [key, target, force, load, loadFor]);

  return {
    catalog,
    status,
    reload: () => void (target === null ? load({ force: true }) : loadFor(target, { force: true })),
  };
}

/**
 * İlk yayın indirimi yüzdesi (pazarlama metinleri için: "İlk davetiye %60
 * indirimli"). Katalog gelene kadar ve indirim kapalıyken `0`: metin
 * çizilmez — kapatılmış bir indirim vaat edilmesin.
 */
export function useFirstPublishPercent(): number {
  return usePricing().catalog?.firstPublishPercent ?? 0;
}
