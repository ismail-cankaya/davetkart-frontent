import { api } from './api';
import { toPayload, toRecord } from './invitations';
import type { Invitation, InvitationRecord } from '../types';

/**
 * Taslak katmanının yayınla / vazgeç uçları (Faz 27.3, K323). Ayrı modül: yalnızca editör yükler, misafir paketine
 * girmez (K237 bütçesi); otomatik kaydetme taslak kaydını yalnızca yayındaki davetiyede dinamik olarak yükler.
 */
export const pendingChangesService = {
  /** Yayındaki davetiyede kaydet → taslak; yayında değilse sunucu doğrudan yazar. */
  async save(id: string, invitation: Invitation): Promise<InvitationRecord> {
    const { data } = await api.put<unknown>(`/invitations/${id}/pending`, toPayload(invitation));
    return toRecord(data);
  },

  /** "Değişiklikleri yayınla": paket kapısından geçer (402 fırlatabilir). */
  async publish(id: string): Promise<InvitationRecord> {
    const { data } = await api.post<unknown>(`/invitations/${id}/pending/publish`);
    return toRecord(data);
  },

  /** "Vazgeç": taslağı atar, canlı kaydı döner. */
  async discard(id: string): Promise<InvitationRecord> {
    const { data } = await api.delete<unknown>(`/invitations/${id}/pending`);
    return toRecord(data);
  }
};
