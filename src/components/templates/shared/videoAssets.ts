import { VideoSource, VideoVariant } from './VideoBackdrop';

/**
 * Videolu şablonların varlık sözleşmesi. Tek kural:
 *
 *   public/videos/templates/<slug>/<slug>-<variant>.{mp4,webm}
 *   public/videos/templates/<slug>/<slug>-<variant>-poster.jpg
 *
 * Sözleşme tek yerde tanımlı olduğu için yeni bir videolu tema eklemek
 * dosyaları doğru klasöre koyup slug'ı yazmaktan ibaret; hiçbir şablon
 * yol dizgisi (path string) taşımaz.
 */

/** BASE_URL öneki: uygulama alt dizine kurulsa da yollar bozulmaz. */
const ROOT = `${import.meta.env.BASE_URL}videos/templates`;

export interface VideoSet {
  landscape: VideoVariant;
  portrait: VideoVariant;
}

/**
 * mp4 önce, webm sonra: tarayıcı desteklediği İLK kaynağı indirir. H.264 her
 * telefonda donanımda çözülür (pil, ısı); VP9 iPhone'da yazılımla çözülürdü.
 */
function sourcesOf(base: string): VideoSource[] {
  return [
    { src: `${base}.mp4`, type: 'video/mp4' },
    { src: `${base}.webm`, type: 'video/webm' }
  ];
}

function variantOf(slug: string, variant: 'desktop' | 'mobile', objectPosition?: string): VideoVariant {
  const base = `${ROOT}/${slug}/${slug}-${variant}`;
  return { sources: sourcesOf(base), poster: `${base}-poster.jpg`, objectPosition };
}

/**
 * Bir slug için yatay ve dikey takımı birlikte döndürür. Odak noktaları
 * (objectPosition) kompozisyona göre şablondan geçilebilir; verilmezse
 * VideoBackdrop merkezi kullanır.
 */
export function videoSet(
  slug: string,
  focus: { landscape?: string; portrait?: string } = {}
): VideoSet {
  return {
    landscape: variantOf(slug, 'desktop', focus.landscape),
    portrait: variantOf(slug, 'mobile', focus.portrait)
  };
}

/**
 * Aynı şablonun ikinci klibi (ör. giriş klibi): `<slug>/<slug>-<clip>-<variant>`.
 * Ana klip `videoSet(slug)` olarak kalır; kesmeli şablonlar bunu ekler.
 */
export function clipSet(
  slug: string,
  clip: string,
  focus: { landscape?: string; portrait?: string } = {}
): VideoSet {
  const base = (variant: 'desktop' | 'mobile') => `${ROOT}/${slug}/${slug}-${clip}-${variant}`;
  return {
    landscape: { sources: sourcesOf(base('desktop')), poster: `${base('desktop')}-poster.jpg`, objectPosition: focus.landscape },
    portrait: { sources: sourcesOf(base('mobile')), poster: `${base('mobile')}-poster.jpg`, objectPosition: focus.portrait }
  };
}
