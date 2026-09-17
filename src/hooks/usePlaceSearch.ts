import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { PlaceSuggestion } from '../types';
import { MAX_PLACE_QUERY_LENGTH, MIN_PLACE_QUERY_LENGTH, placesService } from '../services/places';

/** Yazma durduktan sonra aramanın başlaması için beklenen süre. */
const SEARCH_DEBOUNCE_MS = 300;

export interface PlaceSearchState {
  suggestions: PlaceSuggestion[];
  loading: boolean;
  /**
   * Sonucu elde olan son aramanın sorgusu; hiç arama yapılmadıysa `null`.
   * "Sonuç bulunamadı" yalnızca bu, ekrandaki metinle aynıyken gösterilir.
   */
  completedQuery: string | null;
}

const IDLE: PlaceSearchState = { suggestions: [], loading: false, completedQuery: null };

/**
 * Yazılan konum için öneri listesi — tuş başına değil, yazma durduğunda sorar.
 *
 * 🔴 Geç gelen yanıt yeni sorgunun listesini ezmez: her sorgu kendi
 * `AbortController`'ıyla başlar, sorgu değişince ya da bileşen ayrılınca
 * iptal edilir ve iptal edilmiş isteğin sonucu hiç yazılmaz.
 *
 * Hata kullanıcıya bildirim olarak gösterilmez: öneri listesi yardımcı bir
 * kolaylıktır ve "Harita üzerinden konum seç" her durumda çalışır.
 *
 * @param query Aranacak metin; boş geçmek aramayı durdurur.
 */
export function usePlaceSearch(query: string): PlaceSearchState {
  const [debouncedQuery] = useDebounce(query.trim(), SEARCH_DEBOUNCE_MS);
  const [state, setState] = useState<PlaceSearchState>(IDLE);

  useEffect(() => {
    const searchable =
      debouncedQuery.length >= MIN_PLACE_QUERY_LENGTH && debouncedQuery.length <= MAX_PLACE_QUERY_LENGTH;

    if (!placesService.isSearchEnabled || !searchable) {
      setState(IDLE);
      return;
    }

    const controller = new AbortController();
    setState((previous) => ({ ...previous, loading: true }));

    placesService
      .search(debouncedQuery, controller.signal)
      .then((suggestions) => {
        if (!controller.signal.aborted) setState({ suggestions, loading: false, completedQuery: debouncedQuery });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (import.meta.env.DEV) console.warn('[places] Konum araması başarısız:', error);
        setState(IDLE);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  return state;
}
