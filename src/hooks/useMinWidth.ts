import { useSyncExternalStore } from 'react';

/** Pencere en az `px` genişlikte mi (CSS medya sorgusu; yeniden boyutlanınca güncellenir). */
export function useMinWidth(px: number): boolean {
  const query = `(min-width: ${px}px)`;
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', notify);
      return () => list.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
