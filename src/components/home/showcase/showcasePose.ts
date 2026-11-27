import type { ShowcaseMode } from './showcaseLayout';

/**
 * Vitrin sahnesinin koreografisi: kaydırma ilerlemesi (0–1) → her öğenin `transform`/`opacity` değeri.
 * Saf fonksiyon (React yok); yalnızca compositor özellikleri üretir. Ayrıntı:
 * docs/rehber/src/components/home/showcase.md §3
 */

interface ModeParams {
  /** Yan telefonun yatay açılması, kendi genişliğinin katı. */
  spread: number;
  /** Yan telefonun içe eğimi (derece). */
  tilt: number;
  /** Açılmış yan telefonun ölçeği. */
  sideScale: number;
}

const PARAMS: Record<ShowcaseMode, ModeParams> = {
  phone: { spread: 0.74, tilt: 10, sideScale: 0.8 },
  tablet: { spread: 0.98, tilt: 14, sideScale: 0.84 },
  desktop: { spread: 1.1, tilt: 16, sideScale: 0.84 },
  static: { spread: 1, tilt: 12, sideScale: 0.84 }
};

/** Ekran içi kaydırmanın en uzun yolu: ekran yüksekliğinin %120'si (görsel üç ekran boyunda). */
const SCREEN_TRAVEL_CQH = 120;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** `a`–`b` aralığında yumuşak 0→1 (smoothstep). */
const span = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export interface ShowcasePose {
  center: string;
  start: string;
  end: string;
  sideOpacity: number;
  /** Ekran içi kaydırma (`translate3d`), telefon başına. */
  screenCenter: string;
  screenStart: string;
  screenEnd: string;
  headOpacity: number;
  head: string;
  ctaOpacity: number;
  cta: string;
}

const screen = (t: number) => `translate3d(0, ${(-t * SCREEN_TRAVEL_CQH).toFixed(2)}cqh, 0)`;

/**
 * `rtl`: `start` telefon sağa açılır. `static` modda ilerleme yok sayılır: telefonlar açık, metin ve
 * bağlantı görünür, ekranlar başta.
 */
export function showcasePose(progress: number, mode: ShowcaseMode, rtl: boolean): ShowcasePose {
  const { spread, tilt, sideScale } = PARAMS[mode];
  const isStatic = mode === 'static';
  const p = clamp01(progress);

  const open = isStatic ? 1 : span(0.12, 0.6, p);
  const lift = isStatic ? 0 : lerp(4, 0, span(0, 0.5, p)); // % of own height
  const side = (sign: number) =>
    `translate3d(${(sign * spread * open * 100).toFixed(2)}%, ${(lift + 7 * open).toFixed(2)}%, 0) ` +
    `rotateY(${(-sign * tilt * open).toFixed(2)}deg) scale(${lerp(0.88, sideScale, open).toFixed(3)})`;
  const startSign = rtl ? 1 : -1;

  const headOut = isStatic ? 0 : span(0.62, 0.86, p);
  const ctaIn = isStatic ? 1 : span(0.8, 0.96, p);

  return {
    center: `translate3d(0, ${lift.toFixed(2)}%, 0)`,
    start: side(startSign),
    end: side(-startSign),
    sideOpacity: clamp01(open * 2.2),
    screenCenter: screen(isStatic ? 0 : span(0.25, 0.95, p)),
    screenStart: screen(isStatic ? 0 : span(0.35, 1, p) * 0.8),
    screenEnd: screen(isStatic ? 0 : span(0.3, 0.98, p) * 0.9),
    headOpacity: 1 - headOut,
    head: `translate3d(0, ${(-40 * headOut).toFixed(1)}px, 0)`,
    ctaOpacity: ctaIn,
    cta: `translate3d(0, ${(16 * (1 - ctaIn)).toFixed(1)}px, 0)`
  };
}
