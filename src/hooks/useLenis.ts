import { useEffect } from 'react';
import Lenis from 'lenis';

const HEADER_OFFSET = -76;

// Module-scoped handle so imperative flows (e.g. the /create wizard) can
// glide with the same physics as anchor clicks. Null when Lenis is inactive
// (prefers-reduced-motion) — callers fall back to native scrolling.
let lenisInstance: Lenis | null = null;
/** Uyuyan rAF döngüsünü programatik bir kaydırmadan önce uyandırır (bkz. useLenis). */
let wakeLenis: (() => void) | null = null;

/**
 * Smooth-scroll to an element id or an absolute position, through Lenis when
 * it is running and natively otherwise. `immediate` jumps without animation.
 */
export function scrollToTarget(target: string | number, options?: { immediate?: boolean }) {
  const el = typeof target === 'string' ? document.getElementById(target) : null;
  if (typeof target === 'string' && !el) return;
  const dest = el ?? (target as number);

  if (options?.immediate) {
    // Instant jumps go through the native API: Lenis no-ops a scrollTo whose
    // destination equals its internal target, which can be stale right after
    // a browser-driven (native) scroll — while it always adopts native jumps.
    const top = el ? el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET : (dest as number);
    window.scrollTo({ top, behavior: 'auto' });
    return;
  }

  if (lenisInstance) {
    lenisInstance.scrollTo(dest, {
      offset: el ? HEADER_OFFSET : 0,
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4)
    });
    wakeLenis?.();
  } else if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.scrollTo({ top: dest as number, behavior: 'smooth' });
  }
}
// First section after the landing hero (template showcase) — the hero snap's
// target. On other pages the zone math collapses and the snap stays inert
// (on /create the same section sits at the top, so no zone can form).
const SNAP_SECTION_ID = 'animasyon-ve-onizleme';
const SNAP_TRIGGER = 60; // px of scroll intent past the cue before the snap kicks in
const EASE_OUT_QUART = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Buttery-smooth inertia scrolling (Lenis) + smooth anchor navigation
 * with sticky-header offset. Respects prefers-reduced-motion.
 *
 * Also snaps the hero: once its bottom edge — the "Keşfet" cue — is fully
 * on screen, continued downward scrolling glides automatically to the
 * explore section, and scrolling back up glides to that cue point (the top
 * of the page on screens tall enough to show the whole hero at once).
 */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1
      // syncTouch stays at its default (false): emulating touch inertia in JS
      // fights the phone's hardware-composited scrolling and tanks FPS on
      // mobile. Touch gestures are 100% native; Lenis only smooths wheel
      // input, so the hero snap below is effectively desktop-only (native
      // touch scrolls are filtered out by the isScrolling === 'native' guard).
    });
    lenisInstance = lenis;

    // 🔴 rAF döngüsü yalnızca Lenis bir kaydırmayı canlandırırken döner.
    // Hiç durmayan bir döngü, sayfa boştayken bile tarayıcıyı her ekran
    // yenilemesinde bir ana thread karesi üretmeye zorluyordu: çalışan her CSS
    // animasyonunun stili yeniden hesaplanıyor, IntersectionObserver'lar yeniden
    // ölçülüyordu. Oysa o animasyonlar compositor'da döner ve ana thread'e
    // ihtiyaç duymaz. Tekerlek girdisi ve programatik kaydırmalar döngüyü uyandırır;
    // animasyon bitince (`isScrolling` 'smooth' olmaktan çıkınca) döngü uyur.
    // Dokunmatik ve kaydırma çubuğu zaten doğaldır, rAF'e ihtiyaç duymaz.
    let rafId = 0;
    let rafRunning = false;
    const raf = (time: number) => {
      lenis.raf(time);
      if (lenis.isScrolling === 'smooth') {
        rafId = requestAnimationFrame(raf);
      } else {
        rafId = 0;
        rafRunning = false;
      }
    };
    const wake = () => {
      if (rafRunning) return;
      rafRunning = true;
      // Lenis kare aralığını bir önceki `raf` zamanından hesaplar. Uykudan
      // sonraki ilk karede bütün bekleme süresini tek adımda uygular ve kaydırma
      // yumuşamak yerine hedefe zıplardı; `time` sıfırlanınca ilk aralık 0 sayılır.
      lenis.time = 0;
      rafId = requestAnimationFrame(raf);
    };
    wakeLenis = wake;
    // Pasif dinleyici: Lenis'in kendi (engelleyen) tekerlek dinleyicisini
    // etkilemez, yalnızca döngüyü uyandırır.
    window.addEventListener('wheel', wake, { passive: true });

    let autoScrolling = false;
    let unlockTimer: number | undefined;

    const glideTo = (target: HTMLElement | number, duration: number, lock = false) => {
      autoScrolling = true;
      window.clearTimeout(unlockTimer);
      // Fallback unlock in case the animation gets interrupted before onComplete
      unlockTimer = window.setTimeout(() => { autoScrolling = false; }, duration * 1000 + 300);
      lenis.scrollTo(target, {
        offset: typeof target === 'number' ? 0 : HEADER_OFFSET,
        duration,
        lock,
        easing: EASE_OUT_QUART,
        onComplete: () => { autoScrolling = false; }
      });
      wake();
    };

    // 🔴 Snap geometrisi ÖNBELLEKTE tutulur. Bu callback kaydırma sürdükçe her
    // karede çalışır; her seferinde getBoundingClientRect okumak, o karede
    // Motion'ın yazdığı stiller yüzünden tarayıcıyı senkron style/layout
    // hesabına zorluyordu — tam da ilk kaydırmanın en kalabalık karelerinde.
    // Bölümün konumu yalnızca boyutlar değişince değişir: pencere yeniden
    // boyutlanınca ya da sayfa içeriğinin yüksekliği değişince (tembel yüklenen
    // bölümler, route değişimi) önbellek düşürülür ve bir sonraki karede bir kez
    // okunur.
    interface SnapGeometry {
      section: HTMLElement;
      /** Kaydırmanın bu değeri geçince hero tamamen görünür (yüksek ekranlarda 0). */
      heroFloor: number;
      /**
       * Aşağı snap'in gerçekten indiği yer: Lenis öğenin scroll-margin-top'unu
       * (Tailwind `scroll-mt-*`) bizim ofsetimize ekler; bölge sınırı aynı
       * hesabı kullanmazsa iniş noktası bölgenin içinde kalıp her kaydırmada
       * snap'i yeniden tetikleyebilir.
       */
      snapPoint: number;
    }

    let geometry: SnapGeometry | null = null;
    const invalidateGeometry = () => {
      geometry = null;
    };

    const readGeometry = (): SnapGeometry | null => {
      if (geometry?.section.isConnected) return geometry;
      const section = document.getElementById(SNAP_SECTION_ID);
      if (!section) return null;
      const sectionTop = section.getBoundingClientRect().top + lenis.scroll;
      const snapMargin = Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
      geometry = {
        section,
        heroFloor: Math.max(0, sectionTop - window.innerHeight),
        snapPoint: sectionTop - snapMargin + HEADER_OFFSET
      };
      return geometry;
    };

    const resizeObserver = new ResizeObserver(invalidateGeometry);
    resizeObserver.observe(document.body);
    window.addEventListener('resize', invalidateGeometry, { passive: true });

    // Hero snap: the zone opens only once the hero's bottom edge — where the
    // "Keşfet" cue sits — is fully on screen, so on small viewports the stats
    // above it are scrolled through normally instead of being flown past.
    const onScroll = () => {
      if (autoScrolling) return;

      // Never snap against browser-driven movement (native touch fling,
      // scrollbar drag): a programmatic glide would fight it frame-by-frame.
      // With syncTouch off this also makes all phone scrolling — including
      // the hero — fully native; the snap only engages on wheel input.
      if (lenis.isScrolling === 'native') return;

      const snap = readGeometry();
      if (!snap) return;

      const inSnapZone =
        lenis.scroll > snap.heroFloor + SNAP_TRIGGER && lenis.scroll < snap.snapPoint - SNAP_TRIGGER;
      if (!inSnapZone) return;
      if (lenis.direction === 1) glideTo(snap.section, 1.2, true);
      else if (lenis.direction === -1) glideTo(snap.heroFloor, 1.2, true);
    };
    lenis.on('scroll', onScroll);

    // Intercept in-page anchors so they glide instead of jumping
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      e.preventDefault();
      glideTo(target, 1.4);
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', wake);
      wakeLenis = null;
      window.clearTimeout(unlockTimer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', invalidateGeometry);
      document.removeEventListener('click', onClick);
      lenisInstance = null;
      lenis.destroy();
    };
  }, []);
}
