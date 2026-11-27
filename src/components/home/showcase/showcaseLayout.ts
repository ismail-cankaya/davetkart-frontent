import { useSyncExternalStore } from 'react';

/**
 * Vitrin sahnesinin cihaz modları (Faz 23).
 * - `phone` (< 640 px), `tablet` (640–1023 px), `desktop` (≥ 1024 px): sahne sabitlenir, kaydırmayla oynar.
 * - `static`: hareketi azalt ya da alçak ekran (yatay telefon, < 560 px): sabitleme yok, son hâl.
 * Ayrıntı: docs/rehber/src/components/home/showcase.md
 */
export type ShowcaseMode = 'phone' | 'tablet' | 'desktop' | 'static';

/** Hero snap'inin ve "Keşfet" bağlantısının hedefi (hooks/useLenis.ts, Hero.tsx). */
export const SHOWCASE_SECTION_ID = 'vitrin-sahnesi';

const STATIC_QUERY = '(prefers-reduced-motion: reduce), (max-height: 559px)';
const DESKTOP_QUERY = '(min-width: 1024px)';
const TABLET_QUERY = '(min-width: 640px)';

/**
 * Sahne kabının yüksekliği = kaydırma maliyeti (1 ekran sabit sahnenin kendisi).
 * 🔴 Tembel parça inene kadar yer tutucu da bu sınıfla çizilir: aynı yükseklik, CLS yok.
 */
export const SHOWCASE_HEIGHT_CLASS =
  'h-[170svh] sm:h-[200svh] lg:h-[220svh] motion-reduce:h-auto [@media(max-height:559px)]:h-auto';

function readMode(): ShowcaseMode {
  if (typeof window === 'undefined' || !window.matchMedia) return 'desktop';
  if (window.matchMedia(STATIC_QUERY).matches) return 'static';
  if (window.matchMedia(DESKTOP_QUERY).matches) return 'desktop';
  if (window.matchMedia(TABLET_QUERY).matches) return 'tablet';
  return 'phone';
}

function subscribe(onChange: () => void): () => void {
  const lists = [STATIC_QUERY, DESKTOP_QUERY, TABLET_QUERY].map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener('change', onChange));
  return () => lists.forEach((l) => l.removeEventListener('change', onChange));
}

/** Etkin mod; ekran döndürülünce ya da pencere boyutu kırılımı geçince güncellenir. */
export function useShowcaseMode(): ShowcaseMode {
  return useSyncExternalStore(subscribe, readMode, () => 'desktop');
}
