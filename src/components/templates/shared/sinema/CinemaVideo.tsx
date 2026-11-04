import React, { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { useContainerOrientation, usePrefersReducedMotion, type VideoVariant } from '../VideoBackdrop';
import type { VideoSet } from '../videoAssets';

/**
 * Oynatma biçimi:
 *  - `loop`  : sessiz döngü (VideoBackdrop ile aynı sözleşme).
 *  - `scrub` : kaydırma ↔ `currentTime`. Video kısa GOP'la kodlanır (6 karede
 *              bir anahtar kare), geri sarma da anında olur.
 *  - `intro` : önce tek seferlik giriş klibi, bitince ana döngüye çapraz geçiş
 *              (bölümler arası "kesme").
 */
export type CinemaPlayback =
  | { kind: 'loop' }
  | { kind: 'scrub'; progress: MotionValue<number> }
  | { kind: 'intro'; intro: VideoSet };

export type CinemaPhase = 'intro' | 'loop';

interface CinemaVideoProps {
  video: VideoSet;
  mode: 'preview' | 'live';
  playback?: CinemaPlayback;
  className?: string;
  /** Giriş klibi bitip döngüye geçildiğinde (ya da giriş hiç oynamadıysa hemen). */
  onPhase?: (phase: CinemaPhase) => void;
  /** Ana klibin `<video>` öğesi (canlı sahneyi videonun zamanına eşlemek için). */
  onVideo?: (el: HTMLVideoElement | null) => void;
}

function pick(set: VideoSet, portrait: boolean): VideoVariant {
  return portrait ? set.portrait : set.landscape;
}

/** Görünürlük + sekme durumu: ikisi birden doğruysa oynatılabilir. */
function useVisible(ref: React.RefObject<HTMLElement | null>, enabled: boolean): boolean {
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, enabled]);
  useEffect(() => {
    if (!enabled) return;
    const on = () => setPageVisible(document.visibilityState === 'visible');
    on();
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, [enabled]);
  return inView && pageVisible;
}

const VIDEO_CLASS = 'absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity ease-out';

/**
 * Premium şablonların video katmanı. Poster her zaman en altta durur (LCP);
 * önizlemede (`mode === 'preview'`) ve "hareketi azalt"ta video hiç
 * oluşturulmaz — galeride onlarca video aynı anda inmez.
 */
export function CinemaVideo({ video, mode, playback = { kind: 'loop' }, className, onPhase, onVideo }: CinemaVideoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const orientation = useContainerOrientation(ref);
  const portrait = orientation === 'portrait';
  const still = mode === 'preview' || reduced;
  const visible = useVisible(ref, !still);

  const main = pick(video, portrait);
  const intro = playback.kind === 'intro' ? pick(playback.intro, portrait) : null;
  const [phase, setPhase] = useState<CinemaPhase>(intro && !still ? 'intro' : 'loop');
  /** Hangi yönün ana klibi kare boyadı (yön değişince yeni <video> kurulur). */
  const [mainReady, setMainReady] = useState<string | null>(null);
  const [introPainted, setIntroPainted] = useState(false);
  /** Giriş bitince bir süre daha kurulu kalır: ana klibin üstünden söner. */
  const [introMounted, setIntroMounted] = useState(phase === 'intro');

  const mainRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLVideoElement>(null);
  const onPhaseRef = useRef(onPhase);
  onPhaseRef.current = onPhase;
  const onVideoRef = useRef(onVideo);
  onVideoRef.current = onVideo;
  useEffect(() => {
    onVideoRef.current?.(mainRef.current);
    return () => onVideoRef.current?.(null);
  }, [still, orientation]);

  useEffect(() => {
    onPhaseRef.current?.(phase);
    if (phase !== 'loop' || !introMounted) return;
    const id = window.setTimeout(() => setIntroMounted(false), 1200);
    return () => window.clearTimeout(id);
  }, [phase, introMounted]);

  const finishIntro = () => {
    const el = mainRef.current;
    if (!el) return setPhase('loop');
    void el.play().catch(() => undefined).finally(() => setPhase('loop'));
  };

  // Döngü ve giriş: görünürken oynat, değilken durdur.
  useEffect(() => {
    if (still || playback.kind === 'scrub') return;
    const el = phase === 'intro' ? introRef.current : mainRef.current;
    if (!el) return;
    if (visible) void el.play().catch(() => (phase === 'intro' ? setPhase('loop') : undefined));
    else el.pause();
  }, [still, visible, phase, playback.kind, orientation]);

  // Kaydırma ↔ zaman: yumuşatılmış hedefe doğru, yalnızca arama bitince yeni arama.
  const progress = playback.kind === 'scrub' ? playback.progress : null;
  useEffect(() => {
    if (still || !progress) return;
    const el = mainRef.current;
    if (!el) return;
    let raf = 0;
    let current = -1;
    const tick = () => {
      raf = 0;
      const d = el.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      const target = Math.min(1, Math.max(0, progress.get())) * (d - 0.05);
      current = current < 0 ? target : current + (target - current) * 0.22;
      if (!el.seeking && Math.abs(el.currentTime - current) > 0.012) el.currentTime = current;
      if (Math.abs(target - current) > 0.004) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    // iOS: hiç oynatılmamış videoda arama kare boyamaz; bir kez oynat-durdur.
    const unlock = () => {
      void el
        .play()
        .then(() => el.pause())
        .catch(() => undefined)
        .finally(kick);
    };
    el.addEventListener('loadedmetadata', kick);
    el.addEventListener('loadeddata', unlock, { once: true });
    const unsub = progress.on('change', kick);
    kick();
    return () => {
      unsub();
      el.removeEventListener('loadedmetadata', kick);
      el.removeEventListener('loadeddata', unlock);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [still, progress, orientation]);

  const poster = intro && phase === 'intro' ? intro.poster : main.poster;
  const focus = main.objectPosition ?? '50% 50%';
  const isScrub = playback.kind === 'scrub';

  return (
    <div ref={ref} className={cn('absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <img
        src={poster}
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover select-none"
        style={{ objectPosition: focus }}
      />
      {!still && (
        <>
          {/* Ana klip: döngü ya da kaydırma. Giriş sürerken arka planda iner. */}
          <video
            key={`main-${orientation}`}
            ref={mainRef}
            poster={main.poster}
            muted
            playsInline
            loop={!isScrub}
            preload={isScrub || phase === 'loop' || introPainted ? 'auto' : 'metadata'}
            disablePictureInPicture
            tabIndex={-1}
            onLoadedData={() => setMainReady(orientation)}
            className={cn(VIDEO_CLASS, 'duration-1000', mainReady === orientation && phase === 'loop' ? 'opacity-100' : 'opacity-0')}
            style={{ objectPosition: focus }}
          >
            {main.sources.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
          {intro && introMounted && (
            <video
              key={`intro-${orientation}`}
              ref={introRef}
              poster={intro.poster}
              muted
              playsInline
              autoPlay
              preload="auto"
              disablePictureInPicture
              tabIndex={-1}
              onPlaying={() => setIntroPainted(true)}
              onEnded={finishIntro}
              onError={() => setPhase('loop')}
              className={cn(VIDEO_CLASS, 'duration-1000', introPainted && phase === 'intro' ? 'opacity-100' : 'opacity-0')}
              style={{ objectPosition: intro.objectPosition ?? focus }}
            >
              {intro.sources.map((s) => (
                <source key={s.src} src={s.src} type={s.type} />
              ))}
            </video>
          )}
        </>
      )}
    </div>
  );
}
