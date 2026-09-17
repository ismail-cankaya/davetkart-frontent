import { api, unwrapEnvelope } from './api';
import { GeoPoint, PlaceSuggestion } from '../types';

/**
 * Konum arama servisi — "Ulaşım Bilgileri" alanının öneri listesi.
 *
 * 🔴 Google Haritalar'a TARAYICI DEĞİL BACKEND bağlanır. Places API anahtarı,
 * kotası ve önbelleği sunucuda durur; frontend yalnızca kendi API'mize sorar
 * (bkz. `.env.example` → gizli anahtarlar). Gömülü bir Maps anahtarı herkesin
 * okuyabileceği derlemeye girerdi.
 *
 * Uç `/public` altındadır: sihirbaz giriş yapmadan da kullanılabiliyor, bu
 * yüzden arama kimlik istememeli (backend'deki diğer anonim uçlar gibi kendi
 * `throttle` kovasıyla korunur).
 *
 * ⏳ Backend ucu henüz yazılmadı. `VITE_PLACES_SEARCH_ENABLED=true` olana kadar
 * servis ağa HİÇ çıkmaz ve boş liste döner; arayüz bu durumda kullanıcıyı
 * "Harita üzerinden konum seç" akışına yönlendirir. Böylece var olmayan bir uca
 * tuş başına 404 atılmaz. Beklenen sözleşme:
 * docs/rehber/src/services/places.md
 */
const SEARCH_ENABLED = import.meta.env.VITE_PLACES_SEARCH_ENABLED === 'true';

const SEARCH_PATH = '/public/places/search';

/** Sağlayıcıya gitmeye değecek en kısa sorgu — daha kısası kota harcar, sonuç vermez. */
export const MIN_PLACE_QUERY_LENGTH = 3;

/** Backend doğrulamasının üst sınırı; daha uzun sorgu 422 alacağı için hiç gönderilmez. */
export const MAX_PLACE_QUERY_LENGTH = 120;

function isGeoPoint(value: unknown): value is GeoPoint {
  if (typeof value !== 'object' || value === null) return false;
  const { lat, lng } = value as Record<string, unknown>;
  return typeof lat === 'number' && typeof lng === 'number' && Number.isFinite(lat) && Number.isFinite(lng);
}

/**
 * Ağ sınırı: buradan içerisi güvenilir, dışarısı değil. Beklenmeyen bir öğe
 * listeyi düşürmez, yalnızca kendisi elenir — tek bir bozuk sonuç yüzünden
 * kullanıcı hiç öneri görmemeli değil.
 */
function isPlaceSuggestion(value: unknown): value is PlaceSuggestion {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.placeId === 'string' &&
    typeof item.name === 'string' &&
    typeof item.address === 'string' &&
    isGeoPoint(item.location)
  );
}

export const placesService = {
  /** Backend ucu yayında mı? Kapalıyken arayüz öneri beklemez. */
  isSearchEnabled: SEARCH_ENABLED,

  /**
   * Yazılan metne uyan yerler — `GET /public/places/search?query=…`.
   *
   * @param signal Yeni sorgu başladığında eskisini iptal etmek için.
   */
  async search(query: string, signal?: AbortSignal): Promise<PlaceSuggestion[]> {
    const trimmed = query.trim();
    if (!SEARCH_ENABLED || trimmed.length < MIN_PLACE_QUERY_LENGTH || trimmed.length > MAX_PLACE_QUERY_LENGTH) {
      return [];
    }

    const { data } = await api.get<unknown>(SEARCH_PATH, { params: { query: trimmed }, signal });
    const body = unwrapEnvelope(data);

    if (!Array.isArray(body)) {
      throw new Error(`Unexpected ${SEARCH_PATH} response shape`);
    }

    return body.filter(isPlaceSuggestion);
  }
};
