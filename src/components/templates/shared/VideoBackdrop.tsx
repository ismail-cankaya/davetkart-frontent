import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../../../utils/cn';

/**
 * Tarayıcının seçebileceği tek bir kodlama. Sıra önemlidir: tarayıcı listeyi
 * yukarıdan tarar ve desteklediği İLK kaynağı indirir, diğerlerine hiç dokunmaz.
 */
export interface VideoSource {
  src: string;
  /** 'video/mp4' ya da kodek ipuçlu hâli: 'video/mp4; codecs="avc1.4d401f"' */
  type: string;
}

/** Tek bir en/boy oranı için hazırlanmış tam takım: video + poster + odak. */
export interface VideoVariant {
  sources: VideoSource[];
  /** Video ilk kareyi boyayana kadar görünen durağan görsel. LCP'yi bu kurtarır. */
  poster: string;
  /** Kırpma sırasında korunacak odak noktası, örn. '50% 35%'. */
  objectPosition?: string;
}

interface VideoBackdropProps extends VideoVariant {
  /**
   * Konteyner dikey olduğunda kullanılacak ikinci takım. Verilmezse yatay
   * takım her yerde kullanılır (ve telefonda kadrajın ~%65'i kırpılır).
   */
  portrait?: VideoVariant;
  /** Video üstüne binen okunabilirlik katmanları (scrim, süsleme vb.). */
  children?: React.ReactNode;
  className?: string;
}

type Orientation = 'portrait' | 'landscape';

/**
 * Yön değiştirme eşikleri. Tek eşik yerine iki eşik (histerezis) kullanılır:
 * 1.0 civarında salınan bir genişlikte video sürekli yeniden yüklenmesin.
 */
const TO_PORTRAIT = 0.95;
const TO_LANDSCAPE = 1.05;

/** Kullanıcının işletim sistemi düzeyindeki "hareketi azalt" tercihini izler. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Konteynerin kendi en/boy oranını izler — viewport'un değil. Editördeki
 * telefon simülatörü masaüstü viewport'unda çalışır; medya sorgusu orada
 * yanlış cevap verirdi.
 */
function useContainerOrientation(ref: React.RefObject<HTMLDivElement | null>): Orientation {
  const [orientation, setOrientation] = useState<Orientation>('landscape');

  // useLayoutEffect: ölçüm boyamadan ÖNCE yapılır. useEffect olsaydı ilk kare
  // yanlış varyantla boyanır ve telefon gereksiz yere yatay videoyu indirirdi.
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const apply = (width: number, height: number) => {
      if (height <= 0) return;
      const ratio = width / height;
      setOrientation((prev) =>
        prev === 'landscape'
          ? (ratio < TO_PORTRAIT ? 'portrait' : prev)
          : (ratio > TO_LANDSCAPE ? 'landscape' : prev)
      );
    };

    const rect = element.getBoundingClientRect();
    apply(rect.width, rect.height);

    const observer = new ResizeObserver(([entry]) => {
      apply(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return orientation;
}

/**
 * Davetiye arka planına döngüsel video serer. Şablonlar oynatma mekaniğini
 * bilmez; yalnızca hangi kaynağı hangi odakla göstereceğini söyler.
 *
 * Kırpma sözleşmesi: video her zaman object-cover'dır. Dikey konteynerde
 * ayrı bir dikey takım verilirse kırpma neredeyse sıfırlanır; verilmezse
 * yatay takımın merkez ~%35'i görünür.
 */
export function VideoBackdrop({
  sources,
  poster,
  objectPosition,
  portrait,
  children,
  className
}: VideoBackdropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const orientation = useContainerOrientation(containerRef);

  const usePortrait = orientation === 'portrait' && Boolean(portrait);
  const variantId: Orientation = usePortrait ? 'portrait' : 'landscape';
  const active: VideoVariant = usePortrait && portrait ? portrait : { sources, poster, objectPosition };
  const focus = active.objectPosition ?? '50% 50%';

  // Boyanma durumu varyanta bağlıdır: takım değişince yeni <video> henüz
  // kare üretmeden görünür olmasın, poster altta beklesin.
  const [paintedFor, setPaintedFor] = useState<Orientation | null>(null);
  const isPainted = paintedFor === variantId;

  // Hero ekrandan çıkınca oynatmayı durdur: kaydırılan bölümlerde boşuna
  // GPU/pil harcanmasın. variantId değişince gözlemci yeniden kurulur ve
  // yeni <video> için görünürlük kararı anında tekrar verilir.
  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          // iOS Düşük Güç Modu muted videoyu bile reddedebilir; poster kalır.
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [prefersReducedMotion, variantId]);

  return (
    <div ref={containerRef} className={cn('absolute inset-0 overflow-hidden', className)}>
      {/* Poster her koşulda en altta durur: video yüklenene kadar, autoplay
          reddedilirse ve "hareketi azalt" açıkken görünen katman budur. */}
      <img
        src={active.poster}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover select-none"
        style={{ objectPosition: focus }}
      />

      {!prefersReducedMotion && (
        <video
          // key: kaynak listesi değişince React elementi yeniden kurar.
          // Aynı elementte <source> değiştirmek tarayıcıyı tetiklemez.
          key={variantId}
          ref={videoRef}
          poster={active.poster}
          autoPlay
          // playsInline olmadan iOS Safari videoyu tam ekrana zorlar ve
          // davetiye kompozisyonu tamamen kırılır — pazarlık konusu değil.
          playsInline
          muted
          loop
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setPaintedFor(variantId)}
          className={cn(
            'absolute inset-0 w-full h-full object-cover select-none pointer-events-none',
            'transition-opacity duration-700 ease-out',
            isPainted ? 'opacity-100' : 'opacity-0'
          )}
          style={{ objectPosition: focus }}
        >
          {active.sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      )}

      {children}
    </div>
  );
}
