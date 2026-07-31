import React from 'react';
import { cn } from '../../../../utils/cn';

/**
 * Hero'nun CSS tabanlı atmosfer katmanları — parçacık motorunun tamamlayıcısı.
 *
 * İş bölümü nettir:
 *  - Canvas (particleEngine): tekil, sayılabilen, fizik uygulanan objeler.
 *  - Buradaki katmanlar: geniş alana yayılan ışık/duman/kumaş. Bunları
 *    parçacıkla yapmak yüzlerce dev sprite demek olurdu; CSS gradient +
 *    compositor animasyonu aynı sonucu bedavaya yakın verir.
 *
 * Hepsi `data-atmosphere` taşır: "hareketi azalt" tercihinde index.css tek
 * kuralla tüm animasyonları durdurur, kompozisyon yerinde kalır.
 */

interface LayerProps {
  className?: string;
  /** Saniye cinsinden döngü süresi. */
  duration?: number;
  /** Katmanın toplam opaklığı. */
  opacity?: number;
}

/* ————— Okunabilirlik ————— */

export interface ScrimProps {
  /**
   * Metnin oturduğu yön. Degrade her zaman metnin arkasını koyulaştırır,
   * kompozisyonun geri kalanını açık bırakır.
   */
  from?: 'top' | 'bottom' | 'center' | 'both';
  /** 0..1 — 0.45 çoğu video için okunabilirlik eşiğidir. */
  strength?: number;
  /** Scrim rengi; açık temalarda '255,255,255' verilir. */
  tint?: string;
  className?: string;
}

/**
 * Videonun üstüne binen okunabilirlik katmanı. Şablonlar bunu elle gradient
 * yazmak yerine kullanır — kontrast eşiği tek yerden yönetilir.
 */
export function Scrim({ from = 'both', strength = 0.45, tint = '0,0,0', className }: ScrimProps) {
  const strong = `rgba(${tint},${strength})`;
  const mid = `rgba(${tint},${strength * 0.35})`;
  const none = `rgba(${tint},0)`;

  const image =
    from === 'top'
      ? `linear-gradient(to bottom, ${strong}, ${mid} 45%, ${none})`
      : from === 'bottom'
        ? `linear-gradient(to top, ${strong}, ${mid} 45%, ${none})`
        : from === 'center'
          ? `radial-gradient(ellipse 70% 55% at 50% 50%, ${strong}, ${none} 75%)`
          : `linear-gradient(to bottom, ${strong}, ${mid} 30%, ${mid} 70%, ${strong})`;

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ backgroundImage: image }}
    />
  );
}

/** Kenarları karartıp bakışı merkeze kilitleyen sinematik vinyet. */
export function Vignette({
  className,
  strength = 0.5,
  tint = '0,0,0'
}: {
  className?: string;
  strength?: number;
  tint?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        backgroundImage: `radial-gradient(ellipse 80% 70% at 50% 50%, rgba(${tint},0) 40%, rgba(${tint},${strength}) 100%)`
      }}
    />
  );
}

/* ————— Işık ————— */

export interface GodRaysProps extends LayerProps {
  /** Huzmelerin geldiği açı (derece). */
  angle?: number;
  /** Işık rengi (rgb üçlüsü, örn. '255,236,190'). */
  color?: string;
  /** Huzme sayısı. */
  count?: number;
  /** Işık kaynağının yatay konumu (%). */
  origin?: number;
}

/**
 * Ağaç/pencere arasından süzülen ışık huzmeleri. Her huzme farklı genişlik
 * ve gecikmeyle animasyonlanır; eşit aralıklı olsalardı jaluzi gibi okunurdu.
 */
export function GodRays({
  angle = 18,
  color = '255,236,190',
  count = 7,
  origin = 50,
  duration = 14,
  opacity = 0.5,
  className
}: GodRaysProps) {
  // Deterministik "rastgelelik": aynı şablon her açılışta aynı görünsün.
  const rays = Array.from({ length: count }, (_, i) => {
    const spread = 78;
    const left = origin - spread / 2 + (spread / (count - 1 || 1)) * i;
    const width = 2.5 + ((i * 37) % 60) / 10;
    const alpha = 0.25 + ((i * 53) % 50) / 100;
    const delay = -((i * 31) % 100) / 10;
    return { left, width, alpha, delay };
  });

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      style={{ opacity }}
    >
      {rays.map((ray, i) => (
        <div
          key={i}
          data-atmosphere=""
          className="absolute -top-1/3 h-[180%] blur-[6px]"
          style={{
            left: `${ray.left}%`,
            width: `${ray.width}%`,
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'top center',
            backgroundImage: `linear-gradient(to bottom, rgba(${color},${ray.alpha}), rgba(${color},${ray.alpha * 0.35}) 45%, rgba(${color},0) 85%)`,
            animation: `ray-sweep ${duration + i}s ease-in-out ${ray.delay}s infinite`
          }}
        />
      ))}
    </div>
  );
}

/**
 * Ekranı çapraz süpüren ışık sızıntısı — kristal avize, cam yansıması.
 * Tek geçiş uzun sürer ve aralarda söner: sürekli olsaydı ucuz görünürdü.
 */
export function LightLeak({
  color = '255,240,214',
  duration = 11,
  opacity = 0.5,
  className
}: LayerProps & { color?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      style={{ opacity }}
    >
      <div
        data-atmosphere=""
        className="absolute -inset-x-1/2 top-0 h-full blur-2xl"
        style={{
          backgroundImage: `linear-gradient(105deg, rgba(${color},0) 38%, rgba(${color},0.55) 50%, rgba(${color},0) 62%)`,
          animation: `leak-sweep ${duration}s ease-in-out infinite`
        }}
      />
    </div>
  );
}

/** Metnin arkasında duran, nefes alan yumuşak hale — kontrastı tabandan kurar. */
export function Halo({
  color = '255,220,160',
  size = 62,
  x = 50,
  y = 45,
  duration = 7,
  opacity = 0.6,
  className
}: LayerProps & { color?: string; size?: number; x?: number; y?: number }) {
  return (
    <div
      aria-hidden="true"
      data-atmosphere=""
      className={cn('absolute pointer-events-none rounded-full blur-3xl', className)}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}%`,
        aspectRatio: '1 / 1',
        transform: 'translate(-50%, -50%)',
        backgroundImage: `radial-gradient(circle, rgba(${color},0.85), rgba(${color},0) 70%)`,
        opacity,
        animation: `halo-breathe ${duration}s ease-in-out infinite`
      }}
    />
  );
}

/* ————— Hacim ————— */

/**
 * Zeminde sürüklenen sis. İki bant zıt yönde ve farklı hızda gider; tek bant
 * kaydırılan bir doku gibi okunur, iki bant hacim üretir.
 */
export function FogDrift({
  color = '255,255,255',
  duration = 34,
  opacity = 0.35,
  className
}: LayerProps & { color?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      style={{ opacity }}
    >
      <div
        data-atmosphere=""
        className="absolute inset-x-[-30%] bottom-[-10%] h-[65%] blur-3xl"
        style={{
          backgroundImage: `radial-gradient(ellipse 55% 100% at 30% 100%, rgba(${color},0.5), rgba(${color},0) 70%), radial-gradient(ellipse 45% 90% at 75% 100%, rgba(${color},0.38), rgba(${color},0) 70%)`,
          animation: `fog-drift-a ${duration}s ease-in-out infinite alternate`
        }}
      />
      <div
        data-atmosphere=""
        className="absolute inset-x-[-30%] bottom-[-20%] h-[80%] blur-3xl"
        style={{
          backgroundImage: `radial-gradient(ellipse 60% 100% at 55% 100%, rgba(${color},0.3), rgba(${color},0) 72%)`,
          animation: `fog-drift-b ${duration * 1.6}s ease-in-out infinite alternate`
        }}
      />
    </div>
  );
}

/**
 * Dalgalanan ipek/tül perde — kına ve oryantal konseptler. Üst üste iki
 * katman, farklı hız ve yönde; aralarındaki faz farkı kumaşın kalınlığını verir.
 */
export function SilkVeil({
  color = '138,20,44',
  duration = 16,
  opacity = 0.45,
  className
}: LayerProps & { color?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      style={{ opacity }}
    >
      <div
        data-atmosphere=""
        className="absolute inset-[-10%] blur-2xl"
        style={{
          backgroundImage: `linear-gradient(115deg, rgba(${color},0) 8%, rgba(${color},0.55) 28%, rgba(${color},0.12) 46%, rgba(${color},0.5) 68%, rgba(${color},0) 92%)`,
          animation: `veil-flow ${duration}s ease-in-out infinite`
        }}
      />
      <div
        data-atmosphere=""
        className="absolute inset-[-10%] blur-3xl"
        style={{
          backgroundImage: `linear-gradient(-70deg, rgba(${color},0) 15%, rgba(${color},0.4) 42%, rgba(${color},0) 78%)`,
          animation: `veil-flow ${duration * 1.45}s ease-in-out -${duration / 3}s infinite`
        }}
      />
    </div>
  );
}

/**
 * Aurora mesh — akışkan renk zemini.
 *
 * Üç dev, yoğun bulanıklaştırılmış leke birbirinden bağımsız yörüngelerde
 * gezer. Tek bir çok-duraklı degradeyi animasyonlamak yerine ayrı lekeler
 * kullanılır: degrade animasyonu her karede yeniden hesaplanır (pahalı),
 * lekeler ise yalnızca transform ile taşınır — compositor işi, bedava.
 *
 * Videosuz şablonların görsel omurgası budur.
 */
export function AuroraMesh({
  colors = ['139,92,246', '236,72,153', '34,211,238'],
  duration = 22,
  opacity = 0.75,
  className
}: LayerProps & { colors?: [string, string, string] | string[] }) {
  const orbits = ['mesh-drift-a', 'mesh-drift-b', 'mesh-drift-c'];
  const spots = [
    { x: '22%', y: '26%', size: '78%' },
    { x: '76%', y: '32%', size: '70%' },
    { x: '48%', y: '78%', size: '84%' }
  ];

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      style={{ opacity }}
    >
      {spots.map((spot, i) => (
        <div
          key={i}
          data-atmosphere=""
          className="absolute rounded-full blur-3xl"
          style={{
            left: spot.x,
            top: spot.y,
            width: spot.size,
            aspectRatio: '1 / 1',
            transform: 'translate(-50%, -50%)',
            backgroundImage: `radial-gradient(circle, rgba(${colors[i % colors.length]},0.85), rgba(${colors[i % colors.length]},0) 68%)`,
            // Süreler eşit olsaydı üç leke kilitlenir, tek bir kütle gibi hareket ederdi.
            animation: `${orbits[i]} ${duration + i * 7}s ease-in-out infinite`
          }}
        />
      ))}
    </div>
  );
}

/**
 * İridesan krom yüzey — sıvı metal yansıması.
 *
 * Renk açısı (hue-rotate) ile konum birlikte kaydırılır; ikisi farklı hızda
 * olduğu için yüzey "aynı dokunun kayması" değil, ışığın metalde dönmesi
 * gibi okunur.
 */
export function Iridescent({
  duration = 14,
  opacity = 0.6,
  className
}: LayerProps) {
  return (
    <div
      aria-hidden="true"
      data-atmosphere=""
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        opacity,
        backgroundImage:
          'linear-gradient(115deg, #7f9cf5 0%, #e0c3fc 18%, #8ec5fc 34%, #f5d0c5 52%, #c2e9fb 68%, #d5b4f2 84%, #9ad6f0 100%)',
        backgroundSize: '320% 320%',
        animation: `chrome-shift ${duration}s ease-in-out infinite`
      }}
    />
  );
}

/* ————— Yüzey ————— */

/** Metalik yüzeyde gezen altın parlama. Panel/başlık üstünde kullanılır. */
export function GoldSheen({
  color = '255,236,180',
  duration = 6,
  opacity = 0.55,
  className
}: LayerProps & { color?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      style={{ opacity }}
    >
      <div
        data-atmosphere=""
        className="absolute inset-y-0 w-1/3"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(${color},0), rgba(${color},0.65), rgba(${color},0))`,
          animation: `sheen-sweep ${duration}s ease-in-out infinite`
        }}
      />
    </div>
  );
}

/**
 * Film grenı. Videonun sıkıştırma bantlaşmasını (banding) kırar — özellikle
 * koyu degradelerde tek başına "ucuz" görüntüyü kurtaran katman budur.
 */
export function Grain({ opacity = 0.035, className }: { opacity?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
      }}
    />
  );
}

/**
 * Alt kenarda gövde zeminine karışan geçiş. Video ile sayfanın düz zemini
 * arasındaki sert kesiği yok eder.
 */
export function BottomFade({ to, className }: { to: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-x-0 bottom-0 h-32 pointer-events-none', className)}
      style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${to})` }}
    />
  );
}
