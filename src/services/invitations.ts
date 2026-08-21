import { api, unwrapEnvelope } from './api';
import { Invitation, InvitationRecord, TimelineEvent } from '../types';

/**
 * Sunucunun konuştuğu biçim: `localKey` yoktur, çünkü o yalnızca tarayıcının
 * React anahtarıdır (K44). `Omit` ile türetiyoruz ki sözleşme tek yerde kalsın.
 */
type WireTimelineEvent = Omit<TimelineEvent, 'localKey'>;
type WireInvitation = Omit<Invitation, 'timelineEvents'> & {
  timelineEvents: WireTimelineEvent[];
};
type WireRecord = Omit<InvitationRecord, 'invitation'> & { invitation: WireInvitation };

/**
 * Ağ sınırı: buradan içerisi güvenilir, dışarısı değil. Yanlış yönlendirilmiş
 * bir istek SPA fallback'inden HTML bile döndürebilir; kayıt gibi görünmeyen
 * her gövde hata sayılır ki çağıran "backend'e ulaşılamıyor" durumunu göstersin.
 */
function isWireRecord(body: unknown): body is WireRecord {
  return typeof body === 'object' && body !== null && 'id' in body && 'invitation' in body;
}

/** Sunucudan gelen adımlara yerel React anahtarı takar. */
function hydrate(record: WireRecord): InvitationRecord {
  return {
    ...record,
    invitation: {
      ...record.invitation,
      timelineEvents: (record.invitation.timelineEvents ?? []).map((event) => ({
        ...event,
        localKey: `srv-${event.id}`
      }))
    }
  };
}

function toRecord(payload: unknown): InvitationRecord {
  const body = unwrapEnvelope(payload);

  if (!isWireRecord(body)) {
    throw new Error('Unexpected /invitations response shape');
  }

  return hydrate(body);
}

function toRecordList(payload: unknown): InvitationRecord[] {
  const body = unwrapEnvelope(payload);

  if (!Array.isArray(body)) {
    throw new Error('Unexpected /invitations response shape');
  }

  return body.map((item) => {
    if (!isWireRecord(item)) {
      throw new Error('Unexpected /invitations response shape');
    }
    return hydrate(item);
  });
}

/**
 * İstek gövdesi. Alanlar AÇIKÇA yazılır, `localKey` düşürülür.
 *
 * Backend zaten bilmediği alanları yok sayıyor (beyaz liste), ama gövdeye giden
 * her alan bir sözdür: sözleşmede yeri olmayanı göndermek, yarın birinin ona
 * bağlanmasına davetiye çıkarır.
 */
function toPayload(invitation: Invitation): { invitation: WireInvitation } {
  const { timelineEvents, ...design } = invitation;

  return {
    invitation: {
      ...design,
      timelineEvents: timelineEvents.map((event) => ({
        id: event.id,
        time: event.time,
        title: event.title,
        description: event.description
      }))
    }
  };
}

/**
 * Invitation servisi — K37: tam REST koleksiyonu.
 *
 * Bir hesap birden çok davetiye tutabilir; "hesap başına tek davetiye"
 * varsayımı Faz 3'te kaldırıldı.
 */
export const invitationService = {
  /** Kullanıcının tüm davetiyeleri; en son düzenlenen başta. */
  async list(): Promise<InvitationRecord[]> {
    const { data } = await api.get<unknown>('/invitations');
    return toRecordList(data);
  },

  /** Tek kayıt. Başkasının davetiyesinde backend 404 döner (H7). */
  async get(id: string): Promise<InvitationRecord> {
    const { data } = await api.get<unknown>(`/invitations/${id}`);
    return toRecord(data);
  },

  async create(invitation: Invitation): Promise<InvitationRecord> {
    const { data } = await api.post<unknown>('/invitations', toPayload(invitation));
    return toRecord(data);
  },

  async update(id: string, invitation: Invitation): Promise<InvitationRecord> {
    const { data } = await api.put<unknown>(`/invitations/${id}`, toPayload(invitation));
    return toRecord(data);
  },

  /** Soft delete: backend satırı silmez, `deleted_at` damgalar. */
  async remove(id: string): Promise<void> {
    await api.delete(`/invitations/${id}`);
  }
};
