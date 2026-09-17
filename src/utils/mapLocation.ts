import { GeoPoint } from '../types';

/**
 * Harita konumu yardımcıları — "Ulaşım Bilgileri" alanının saf mantığı.
 *
 * 🔴 Seçilen konum ayrı koordinat kolonlarında DEĞİL, var olan `mapUrl`
 * alanında resmî bir Google Haritalar bağlantısı olarak saklanır. Bağlantı
 * backend'in `url` kuralından geçer, misafirin "Yol Tarifi Al" düğmesini
 * doğrudan besler ve anahtar gerektirmez. Koordinat gerektiğinde bağlantıdan
 * geri okunur (`readMapLocation`).
 */

/** Koordinatlar 6 ondalıkla yazılır (~11 cm) — daha fazlası sahte hassasiyettir. */
const COORDINATE_DECIMALS = 6;

const DOT_DECIMAL_PAIR = /^(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)$/;
const COMMA_DECIMAL_PAIR = /^(-?\d+(?:,\d+)?)\s*(?:;\s*|,\s+|\s+)(-?\d+(?:,\d+)?)$/;

/** Nokta seçilmemişken haritanın gösterdiği başlangıç görünümü: Türkiye. */
const DEFAULT_VIEW_BBOX = '25.6,35.8,44.9,42.2';

function toPoint(lat: number, lng: number): GeoPoint | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

const fixed = (value: number) => value.toFixed(COORDINATE_DECIMALS);

/**
 * "enlem, boylam" metnini çözer.
 *
 * Kabul edilen biçimler:
 * - Google Haritalar'da bir noktaya sağ tıklayınca kopyalanan `41.0431, 29.0154`
 * - Boşluk ya da noktalı virgülle ayrılmış `41.0431 29.0154`, `41.0431;29.0154`
 * - Türkçe ondalık virgülüyle `41,0431; 29,0154` veya `41,0431 29,0154`
 *
 * Ayırıcısı belirsiz `41,0431,29,0154` bilinçli olarak reddedilir: tahmin
 * etmek, misafiri yanlış adrese göndermek demektir.
 *
 * @returns Geçerli aralıkta bir nokta, ya da çözülemezse `null`.
 */
export function parseCoordinates(input: string): GeoPoint | null {
  const text = input.trim().replace(/−/g, '-');
  if (text === '') return null;

  const dot = DOT_DECIMAL_PAIR.exec(text);
  if (dot) return toPoint(Number(dot[1]), Number(dot[2]));

  const comma = COMMA_DECIMAL_PAIR.exec(text);
  if (comma) return toPoint(Number(comma[1].replace(',', '.')), Number(comma[2].replace(',', '.')));

  return null;
}

/** `41.043100, 29.015400` — alanda ve özet satırında gösterilen biçim. */
export function formatCoordinates(point: GeoPoint): string {
  return `${fixed(point.lat)}, ${fixed(point.lng)}`;
}

/** Mutlak bir http(s) adresi mi? */
export function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value.trim());
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Misafirin "Yol Tarifi Al" düğmesinin açacağı bağlantı (Google Maps URLs,
 * `dir` eylemi): mobilde uygulamayı açar ve rotayı doğrudan başlatır.
 *
 * @param placeId Öneri listesinden seçilen yerin Google kimliği. Verilirse
 *   Haritalar hedefi çıplak koordinat yerine mekânın kendisi olarak gösterir;
 *   koordinat yine yazılır, çünkü `destination_place_id` tek başına geçersizdir.
 */
export function buildDirectionsUrl(point: GeoPoint, placeId?: string): string {
  const base = `https://www.google.com/maps/dir/?api=1&destination=${fixed(point.lat)},${fixed(point.lng)}`;
  return placeId ? `${base}&destination_place_id=${encodeURIComponent(placeId)}` : base;
}

/** Noktayı Google Haritalar'da iğneyle gösteren bağlantı — doğrulama için. */
export function buildMapSearchUrl(point: GeoPoint): string {
  return `https://www.google.com/maps/search/?api=1&query=${fixed(point.lat)},${fixed(point.lng)}`;
}

/**
 * Bir harita bağlantısındaki koordinatı okur.
 *
 * `buildDirectionsUrl`'in `destination`'ı, Google'ın `query` / `q` / `ll`
 * parametreleri ve paylaşım bağlantılarındaki `/@41.04,29.01,17z` bölümü
 * tanınır. Kısa bağlantılar (`maps.app.goo.gl/…`) koordinat taşımaz → `null`.
 */
export function readMapLocation(mapUrl: string): GeoPoint | null {
  if (!isHttpUrl(mapUrl)) return null;

  const url = new URL(mapUrl.trim());

  for (const key of ['destination', 'query', 'q', 'll']) {
    const value = url.searchParams.get(key);
    const point = value ? parseCoordinates(value) : null;
    if (point) return point;
  }

  const at = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(url.pathname);
  return at ? toPoint(Number(at[1]), Number(at[2])) : null;
}

/**
 * Seçim penceresindeki haritanın gömme adresi (OpenStreetMap).
 *
 * Anahtarsız ve resmî tek gömme yolu budur; Google'ın gömme API'si anahtar
 * ister ve anahtar frontend'de tutulmaz. Harita sağlayıcısı backend
 * entegrasyonuyla değişirse yalnızca bu fonksiyon ve `MapPickerModal`
 * etkilenir.
 *
 * Adres elle kurulur: `URLSearchParams` virgülleri `%2C`'ye çevirir ve gömme
 * sayfası `bbox`/`marker` değerlerini ham virgülle bekler.
 */
export function buildMapEmbedUrl(point: GeoPoint | null): string {
  if (!point) {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${DEFAULT_VIEW_BBOX}&layer=mapnik`;
  }

  // ~1.3 km × 1.5 km'lik bir kadraj: mahalle ölçeği, sokaklar okunur.
  const lngSpan = 0.009;
  const latSpan = 0.006;
  const bbox = [point.lng - lngSpan, point.lat - latSpan, point.lng + lngSpan, point.lat + latSpan]
    .map(fixed)
    .join(',');

  return (
    `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik` +
    `&marker=${fixed(point.lat)},${fixed(point.lng)}`
  );
}
