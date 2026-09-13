import { api, unwrapEnvelope } from './api';

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
  /** Davetiye sahibinin galeri yüklemesi. */
  uploadForOwner(invitationId: string, file: File): Promise<UploadedMedia>;
  /** Misafirin LCV'sine iliştireceği fotoğraf veya video. */
  uploadAsGuest(invitationId: string, file: File, kind: GuestMediaKind): Promise<UploadedMedia>;
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
async function upload(path: string, file: File, kind: string): Promise<UploadedMedia> {
  const form = new FormData();
  form.append('kind', kind);
  form.append('file', file);

  // axios, FormData gövdelerde instance'ın JSON Content-Type'ını düşürür;
  // multipart sınırını tarayıcı kendisi koyar — elle başlık gerekmez.
  const { data } = await api.post<unknown>(path, form);
  return toUploadedMedia(data);
}

const httpAdapter: MediaService = {
  uploadForOwner(invitationId, file) {
    return upload(`/invitations/${invitationId}/media`, file, 'gallery');
  },

  uploadAsGuest(invitationId, file, kind) {
    return upload(`/public/invitations/${invitationId}/media`, file, kind);
  },
};

export const mediaService: MediaService = httpAdapter;
