import { api, unwrapEnvelope } from './api';
import { compressImageForUpload } from '../utils/compressImage';

/**
 * Yüklenen dosyanın sunucudaki karşılığı — `MediaResource`.
 *
 * 🔴 **`id` kritik.** LCV gönderimi medyayı `photoMediaId` / `videoMediaId`
 * ile bağlar; yalnızca `url` saklanırsa misafirin yüklediği fotoğraf hiçbir
 * zaman yanıtına iliştirilemez. URL yalnızca kullanıcıya "yüklendi" demek
 * içindir.
 */
export interface UploadedMedia {
  /** ULID. LCV gövdesinde bu gönderilir. */
  id: string;
  /** Türetilmiş genel adres; şema kolonu değil (E1). */
  url: string;
}

/** Misafirin yükleyebileceği türler — backend `MediaKind::guestUploadable`. */
export type GuestMediaKind = 'rsvp_photo' | 'rsvp_video';

/** Yüklenebilen tüm türler. */
export type MediaKind = 'gallery' | GuestMediaKind;

/**
 * Sunucunun tür başına kabul ettiği en büyük dosya.
 *
 * Backend karşılığı: `config/davetkart.php` → `media.<tür>.max_size_kb`. İki
 * taraf ayrışırsa kullanıcı ya boşuna engellenir ya da dosyayı yükledikten
 * sonra 422 alır — ikincisi mobil bağlantıda dakikalar demek.
 */
export const MEDIA_UPLOAD_LIMIT_BYTES: Record<MediaKind, number> = {
  gallery: 15 * 1024 * 1024,
  rsvp_photo: 15 * 1024 * 1024,
  rsvp_video: 20 * 1024 * 1024,
};

/**
 * Yükleme isteğine verilen süre.
 *
 * 🔴 İstemcinin genel zaman aşımı 15 saniyedir ve bu sayı **sunucunun işleme
 * süresi** içindir (15 saniye kuralı): ağır iş kuyruğa gider, istek hemen
 * döner. Ama dosya **aktarımı** o bütçeye sığmaz — mobil yüklemede 1 MB'lık
 * bir fotoğraf bile zayıf bir bağlantıda 15 saniyeyi geçebilir. Zaman aşımı
 * bu yüzden yalnızca yükleme isteklerinde gevşetiliyor.
 */
const UPLOAD_TIMEOUT_MS = 120_000;

/**
 * Sıkıştırmadan sonra bile sunucunun sınırını aşan dosya.
 *
 * İstek hiç gönderilmiyor: 15 MB'ı yükleyip 422 almak kullanıcının zamanını
 * ve mobil verisini harcardı. `toDisplayError` bunu sunucunun aynı durumda
 * döndürdüğü kodun metnine (`FILE_TOO_LARGE`) çevirir.
 */
export class MediaTooLargeError extends Error {
  constructor(public readonly limitBytes: number) {
    super(`Media exceeds the ${limitBytes} byte upload limit`);
    this.name = 'MediaTooLargeError';
  }
}

/**
 * Medya yükleme sınırı.
 *
 * 🔴 Düz bir `/media/upload` ucu **yoktur ve olmayacak** (N1): alt kaydın
 * aidiyeti URL'nin yapısında durur, gövdede değil. Gövdeden gelen bir
 * davetiye kimliği, istemcinin sözüne kalırdı.
 *
 * İki uç iki farklı okuyucuya hizmet eder ve yetkileri farklıdır:
 *
 * | Kim | Uç | Auth | İzinli `kind` |
 * |---|---|---|---|
 * | Sahip (galeri) | `POST /invitations/{id}/media` | ✅ | `gallery` |
 * | Misafir (LCV) | `POST /public/invitations/{id}/media` | — | `rsvp_photo`, `rsvp_video` |
 */
export interface MediaService {
  /**
   * Davetiye sahibinin galeri yüklemesi.
   *
   * Sunucu dosyayı galerinin SONUNA kendisi ekler (kilit altında); istemci
   * sırayı göndermez. Yanıttaki `id` galeri öğesinin kimliğidir.
   */
  uploadForOwner(invitationId: string, file: File): Promise<UploadedMedia>;
  /** Misafirin LCV'sine iliştireceği fotoğraf veya video. */
  uploadAsGuest(invitationId: string, file: File, kind: GuestMediaKind): Promise<UploadedMedia>;
  /**
   * Galeriden bir fotoğrafı kaldırır — `DELETE /invitations/{id}/media/{mediaId}`.
   *
   * Sunucu fotoğrafı sıradan çıkarır, satırı ve dosyayı siler; kotayı da
   * boşaltır. Başka davetiyenin ya da bir LCV'nin dosyası 404 alır.
   */
  removeForOwner(invitationId: string, mediaId: string): Promise<void>;
}

function toUploadedMedia(payload: unknown): UploadedMedia {
  const body = unwrapEnvelope(payload);

  if (
    body &&
    typeof body === 'object' &&
    typeof (body as { id?: unknown }).id === 'string' &&
    typeof (body as { url?: unknown }).url === 'string'
  ) {
    return body as UploadedMedia;
  }

  throw new Error('Unexpected media upload response shape');
}

/**
 * `kind` her iki uçta da **zorunludur**: boyut ve MIME sınırı türe göre
 * değişir (`MediaKind::maxSizeKb`), yani sunucu dosyayı doğrulamadan önce
 * hangi türden olduğunu bilmek zorunda.
 */
async function upload(path: string, file: File, kind: MediaKind): Promise<UploadedMedia> {
  // 🔴 Sıkıştırma İSTEK ÖNCESİ ve TEK YERDE: sahibin galerisi ile misafirin
  // LCV fotoğrafı aynı yoldan geçiyor. Bileşenlerin içine yazılsaydı biri
  // eklenirken diğeri unutulur ve fark yalnızca mobil kullanıcıda görünürdü.
  //
  // Video dokunulmadan geçer (compressImageForUpload biçime bakıyor);
  // transcode tarayıcının işi değil.
  const prepared = await compressImageForUpload(file);

  if (prepared.size > MEDIA_UPLOAD_LIMIT_BYTES[kind]) {
    throw new MediaTooLargeError(MEDIA_UPLOAD_LIMIT_BYTES[kind]);
  }

  const form = new FormData();
  form.append('kind', kind);
  form.append('file', prepared);

  // 🔴 Başlık AÇIKÇA multipart. axios bir JSON Content-Type görürse FormData'yı
  // JSON'a çevirir ve dosya `{}` olarak gider — yüklemeler bir dönem tam olarak
  // bu yüzden 422 aldı (bkz. api.ts). Bu satır, biri ileride istemci geneline
  // JSON başlığını geri eklese bile yüklemeyi korur. Tarayıcıda adaptör başlığı
  // düşürür ve multipart sınırını (`boundary`) tarayıcı yazar.
  const { data } = await api.post<unknown>(path, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: UPLOAD_TIMEOUT_MS,
  });
  return toUploadedMedia(data);
}

const httpAdapter: MediaService = {
  uploadForOwner(invitationId, file) {
    return upload(`/invitations/${invitationId}/media`, file, 'gallery');
  },

  uploadAsGuest(invitationId, file, kind) {
    return upload(`/public/invitations/${invitationId}/media`, file, kind);
  },

  async removeForOwner(invitationId, mediaId) {
    await api.delete(`/invitations/${invitationId}/media/${mediaId}`);
  },
};

export const mediaService: MediaService = httpAdapter;
