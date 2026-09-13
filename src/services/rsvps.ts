import { api, unwrapEnvelope } from './api';
import { RSVPResponse, RsvpCreatePayload } from '../types';
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
 * | Sil | `DELETE /rsvps/{id}` | sahip (auth) |
 *
 * Silmenin kimlik taşımaması tutarsızlık değil: LCV kimliği zaten tekildir
 * ve sahiplik sunucuda doğrulanır.
 */
export const rsvpService = {
  /** Sahibin bir davetiyesine gelen tüm yanıtlar. */
  async list(invitationId: string): Promise<RSVPResponse[]> {
    const { data } = await api.get<unknown>(`/invitations/${invitationId}/rsvps`);
    return toRsvpArray(data);
  },

  /**
   * Misafirin yanıtını gönderir; sunucunun ürettiği kayıtla çözülür.
   *
   * 🔴 Honeypot dolu gelirse backend **204 döner ve kaydetmez** — gövdesiz.
   * Bu kasıtlıdır (L2: bot tespiti sessizdir) ve `toRsvp()` o durumda
   * beklendiği gibi hata fırlatır; çağıran bunu normal bir başarısızlık
   * gibi ele alır, bota "yakalandın" denmez.
   */
  async create(invitationId: string, payload: RsvpCreatePayload): Promise<RSVPResponse> {
    const { data } = await api.post<unknown>(
      `/public/invitations/${invitationId}/rsvps`,
      payload,
    );
    return toRsvp(data);
  },

  /** Sahibin tek bir kaydı kaldırması. */
  async remove(id: string): Promise<void> {
    await api.delete(`/rsvps/${id}`);
  },
};
