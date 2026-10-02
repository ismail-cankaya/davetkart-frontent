import { api, unwrapEnvelope } from './api';
import { conditionalGet, invalidateConditionalCache } from './conditionalGet';
import { RSVPResponse, RsvpCreatePayload, RsvpReceipt } from '../types';
import { toRsvpStatus } from '../utils/rsvpStatus';

/**
 * Sunucudan gelen bir LCV kaydını normalize eder.
 *
 * `status` ham enum değeridir; tanınmayan bir değer gelirse kayıt düşürülmez,
 * `pending` sayılır (bkz. `toRsvpStatus`).
 */
function toRsvp(payload: unknown): RSVPResponse {
  const body = unwrapEnvelope(payload);

  if (!body || typeof body !== 'object' || !('id' in body)) {
    throw new Error('Unexpected RSVP response shape');
  }

  const entry = body as RSVPResponse;
  return { ...entry, status: toRsvpStatus(entry.status) };
}

function toRsvpArray(payload: unknown): RSVPResponse[] {
  const body = unwrapEnvelope(payload);
  if (!Array.isArray(body)) throw new Error('Unexpected RSVP list response shape');
  return body.map(toRsvp);
}

/**
 * LCV uçları.
 *
 * 🔴 Üç uç, üç farklı yetki yüzeyi — ve ikisi davetiye kimliğini **URL'de**
 * taşır (N1): alt kaydın aidiyeti yolun yapısındadır, gövdede değil.
 *
 * | İşlem | Uç | Kim |
 * |---|---|---|
 * | Listele | `GET /invitations/{id}/rsvps` | sahip (auth) |
 * | Gönder | `POST /public/invitations/{id}/rsvps` | misafir (anonim) |
 * | Güncelle | `PUT /public/invitations/{id}/rsvps/{rsvpId}` | misafir (düzenleme koduyla) |
 * | Sil | `DELETE /rsvps/{id}` | sahip (auth) |
 *
 * Silmenin kimlik taşımaması tutarsızlık değil: LCV kimliği zaten tekildir
 * ve sahiplik sunucuda doğrulanır.
 */
export const rsvpService = {
  /**
   * Sahibin bir davetiyesine gelen tüm yanıtlar.
   *
   * 🔴 **Koşullu okuma.** Bu uç ETag üretiyor ve panel 15 saniyede bir
   * yeniliyor; `If-None-Match` göndermeden her poll tüm listeyi yeniden
   * indirirdi. Gövde değişmediyse sunucu 304 döner ve elimizdeki sürüm
   * aynen kullanılır.
   */
  async list(invitationId: string): Promise<RSVPResponse[]> {
    const url = `/invitations/${invitationId}/rsvps`;
    return conditionalGet(url, url, toRsvpArray);
  },

  /**
   * Misafirin yanıtını gönderir; sunucunun ürettiği kayıtla çözülür.
   *
   * 🔴 Honeypot dolu gelirse backend gerçek bir yanıttan ayırt edilemeyen
   * bir 201 döner ama kaydetmez (L2: bot tespiti sessizdir). Yanıt
   * `editCode` da taşır (FE 10.18).
   */
  async create(invitationId: string, payload: RsvpCreatePayload): Promise<RSVPResponse> {
    const { data } = await api.post<unknown>(
      `/public/invitations/${invitationId}/rsvps`,
      payload,
    );
    return toRsvp(data);
  },

  /**
   * Faz 10 (FE 10.18 · K101): aynı misafirin yanıtını düzenleme koduyla
   * günceller; yeni satır açılmaz, kişi sayısı kotadan iki kez düşmez.
   *
   * Yanlış kod ya da silinmiş yanıt 404 `RESOURCE_NOT_FOUND` alır; çağıran
   * bu durumda yeni bir gönderime düşer. Honeypot alanı gönderilmez: bu uca
   * kodu bilmeyen gelemez.
   */
  async update(
    invitationId: string,
    receipt: RsvpReceipt,
    payload: RsvpCreatePayload,
  ): Promise<RSVPResponse> {
    const { website: _honeypot, ...fields } = payload;
    const { data } = await api.put<unknown>(
      `/public/invitations/${invitationId}/rsvps/${encodeURIComponent(receipt.rsvpId)}`,
      { ...fields, editCode: receipt.editCode },
    );
    return toRsvp(data);
  },

  /** Sahibin tek bir kaydı kaldırması. */
  async remove(id: string): Promise<void> {
    await api.delete(`/rsvps/${id}`);
  },

  /**
   * Bu davetiyenin saklanan LCV sürümünü düşürür.
   *
   * Sunucu tarafında gövde değiştiğinde ETag da değişir, yani normalde bu
   * gerekmez. Kapsam değiştiğinde (başka bir davetiyeye geçiş) ya da oturum
   * kapandığında çağrılır: bir sonraki okuma tam gövdeyi çeksin.
   */
  forgetCachedList(invitationId: string): void {
    invalidateConditionalCache(`/invitations/${invitationId}/rsvps`);
  },
};
