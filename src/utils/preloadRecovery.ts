/**
 * One reload when a lazy chunk fails to load (FE-02, K223).
 * Details: docs/rehber/src/utils/preloadRecovery.md
 */

/** sessionStorage key holding the time of the last recovery reload. */
export const PRELOAD_RELOAD_KEY = 'davetkart-preload-reload';

/** A second failure inside this window is not retried: RouteError shows instead. */
export const PRELOAD_RELOAD_WINDOW_MS = 60_000;

export interface PreloadRecoveryDeps {
  storage: Pick<Storage, 'getItem' | 'setItem'> | null;
  reload: () => void;
  now: () => number;
}

/** Returns true when it reloaded; false lets Vite rethrow into the route error boundary. */
export function recoverFromPreloadError(event: Pick<Event, 'preventDefault'>, deps: PreloadRecoveryDeps): boolean {
  // No storage, no loop guard: never reload blindly.
  if (!deps.storage) return false;
  try {
    const last = Number(deps.storage.getItem(PRELOAD_RELOAD_KEY));
    if (last && deps.now() - last < PRELOAD_RELOAD_WINDOW_MS) return false;
    deps.storage.setItem(PRELOAD_RELOAD_KEY, String(deps.now()));
  } catch {
    return false;
  }
  event.preventDefault();
  deps.reload();
  return true;
}

/** Wires the handler to Vite's `vite:preloadError` event (call once at startup). */
export function installPreloadRecovery(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('vite:preloadError', event => {
    let storage: Storage | null = null;
    try {
      storage = window.sessionStorage;
    } catch {
      // blocked storage: leave storage null
    }
    recoverFromPreloadError(event, { storage, reload: () => window.location.reload(), now: Date.now });
  });
}
