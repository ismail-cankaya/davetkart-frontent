/**
 * Fotoğrafı **yüklemeden önce** tarayıcıda küçültür.
 *
 * 🔴 Sunucu da küçültüyor (`OptimizeUploadedImage`), yani bu katman bir
 * tekrar değil bir **sıra** kararıdır. Farkı asıl yaşayan taraf mobil
 * kullanıcıdır:
 *
 * | | Sıkıştırma yalnızca sunucuda | Önce tarayıcıda ✅ |
 * |---|---|---|
 * | Giden veri | 8-15 MB | ~0,3-1 MB |
 * | Mobil yükleme süresi | 10-30 sn (ve 4G'de daha fazla) | 1-2 sn |
 * | Sunucu işlemcisi | Fotoğraf başına ~0,5 sn | Neredeyse sıfır (dosya hedefte) |
 *
 * ⚠️ Bu katman bir **savunma değildir**: istemci kodu atlanabilir, `curl` ile
 * 15 MB'lık dosya gönderilebilir. Sunucu sınırları ve kuyruktaki küçültme
 * yerinde duruyor; burası yalnızca kullanıcıyı bekletmemek için var.
 *
 * Herhangi bir adım başarısız olursa (çözme hatası, bellek, canvas sınırı,
 * biçim desteği) **orijinal dosya** döner ve işi sunucu yapar. Sessiz bir
 * hatayla yüklemeyi engellemek, büyük dosya göndermekten kötüdür.
 */

/**
 * Hedef dosya boyutu — backend `media.optimize.target_kb` ile aynı.
 * Bu boyutun ALTINDAKİ dosyalara dokunulmaz (PNG hariç, aşağıda).
 */
export const TARGET_BYTES = 2 * 1024 * 1024;

/** En uzun kenar sınırı — backend `media.optimize.max_edge_px` ile aynı. */
export const MAX_EDGE_PX = 2000;

/**
 * Kalite basamakları — backend'in `jpeg_quality` → `min_quality` inişiyle
 * aynı mantık: hedefe inene kadar düşür, tabanda dur.
 */
export const QUALITY_STEPS = [0.82, 0.72, 0.62] as const;

/** Tarayıcıda çözüp yeniden kodlayabildiğimiz biçimler. */
const COMPRESSIBLE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

type CompressibleType = (typeof COMPRESSIBLE_TYPES)[number];
type OutputType = 'image/jpeg' | 'image/webp';

function isCompressibleType(type: string): type is CompressibleType {
  return (COMPRESSIBLE_TYPES as readonly string[]).includes(type);
}

/**
 * Bu dosyaya dokunmaya değer mi?
 *
 * İki koşuldan biri yeterli:
 *   1. Dosya hedeften büyük.
 *   2. 🔴 Dosya PNG. PNG **kayıpsızdır**: küçültülmüş bir fotoğraf PNG olarak
 *      hâlâ megabaytlarca yer tutar, yani "2 MB'ın altında" olması onu hedefte
 *      saymaz. WebP'ye çevirmek tek gerçek çözüm (sunucu da aynısını yapıyor).
 *
 * Zaten küçük bir JPEG'e dokunmuyoruz: yeniden kodlama kalite kaybı demek ve
 * karşılığında kazanılacak bayt yok.
 */
export function shouldCompress(file: { type: string; size: number }): boolean {
  if (!isCompressibleType(file.type)) return false;

  return file.size > TARGET_BYTES || file.type === 'image/png';
}

/**
 * En uzun kenarı sınıra indiren ölçü.
 *
 * 🔴 Sınır GENİŞLİĞE değil EN UZUN KENARA uygulanır: telefonla çekilen
 * fotoğrafların çoğunluğu dikeydir ve genişliği sınırlamak 2000×3000'lik bir
 * kareyi olduğu gibi bırakırdı. (Backend'de tam olarak bu hata vardı.)
 */
export function targetSize(
  width: number,
  height: number,
  maxEdge: number = MAX_EDGE_PX,
): { width: number; height: number } {
  const longestEdge = Math.max(width, height);

  if (longestEdge <= maxEdge || longestEdge === 0) {
    return { width, height };
  }

  const ratio = maxEdge / longestEdge;

  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

/**
 * Çıktı biçimi: JPEG JPEG kalır, PNG ve WebP → WebP.
 *
 * PNG'yi JPEG'e çevirmek şeffaf görselleri siyahlatırdı; WebP hem kayıplı
 * sıkıştırır hem alfa kanalını taşır. Backend'deki `targetMimeType()` ile
 * aynı karar.
 */
export function outputTypeFor(inputType: string): OutputType {
  return inputType === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
}

/** `dugun.png` → `dugun.webp`. Uzantı içerikle tutarlı kalsın. */
export function renameForType(name: string, type: OutputType): string {
  const extension = type === 'image/jpeg' ? 'jpg' : 'webp';
  const base = name.replace(/\.[^./\\]+$/, '');

  return `${base || 'foto'}.${extension}`;
}

/**
 * Fotoğrafı hedefe indirir; indiremezse orijinali döndürür.
 */
export async function compressImageForUpload(file: File): Promise<File> {
  if (!shouldCompress(file)) return file;

  try {
    const source = await decode(file);
    const { width, height } = targetSize(sourceWidth(source), sourceHeight(source));
    const canvas = drawScaled(source, width, height);

    if (source instanceof ImageBitmap) source.close();

    const type = outputTypeFor(file.type);
    const blob = await encodeWithinTarget(canvas, type);

    // Biçim üretilemediyse (Safari'nin bazı sürümleri canvas'tan WebP
    // vermez, sessizce PNG döner) ya da kazanç yoksa orijinali gönderiyoruz.
    if (blob === null || blob.type !== type || blob.size >= file.size) {
      return file;
    }

    return new File([blob], renameForType(file.name, type), {
      type,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

/**
 * Görseli çözer.
 *
 * 🔴 EXIF yönü burada kritik: telefon fotoğrafı "gösterirken 90 derece çevir"
 * notuyla gelir ve canvas'a çizerken bu not uygulanmazsa yüklenen fotoğraf
 * **yan yatar**. `createImageBitmap` bunu `imageOrientation: 'from-image'` ile
 * yapar; seçenek desteklenmiyorsa `<img>` yoluna düşüyoruz — tarayıcılar bir
 * `<img>` elemanını çizerken yönü zaten uygular.
 */
async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // Seçenek desteklenmiyor ya da çözme başarısız: <img> yolunu dene.
    }
  }

  return await decodeWithImageElement(file);
}

function decodeWithImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Görsel çözülemedi'));
    };

    image.src = url;
  });
}

function sourceWidth(source: ImageBitmap | HTMLImageElement): number {
  return source instanceof ImageBitmap ? source.width : source.naturalWidth;
}

function sourceHeight(source: ImageBitmap | HTMLImageElement): number {
  return source instanceof ImageBitmap ? source.height : source.naturalHeight;
}

function drawScaled(
  source: ImageBitmap | HTMLImageElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas bağlamı alınamadı');

  // Küçültmede örnekleme kalitesi görünür fark yaratır: varsayılan ("low")
  // ince dokularda tırtık bırakır. Backend'de IMG_TRIANGLE seçmenin karşılığı.
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(source, 0, 0, width, height);

  return canvas;
}

/** Hedefe inene kadar kaliteyi düşürür; tabanda durur. */
async function encodeWithinTarget(canvas: HTMLCanvasElement, type: OutputType): Promise<Blob | null> {
  let last: Blob | null = null;

  for (const quality of QUALITY_STEPS) {
    const blob = await toBlob(canvas, type, quality);

    if (blob === null) return last;

    last = blob;

    // İstenen biçim üretilemiyorsa daha fazla denemenin anlamı yok.
    if (blob.type !== type) return blob;
    if (blob.size <= TARGET_BYTES) return blob;
  }

  return last;
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}
