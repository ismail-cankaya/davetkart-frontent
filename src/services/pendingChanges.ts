import { api } from './api';
import { toRecord } from './invitations';
import type { InvitationRecord } from '../types';

/**
 * Taslak katmanının yayınla / vazgeç uçları (Faz 27.3, K323). Ayrı modül: yalnızca editör yükler, misafir paketine
 * girmez (K237 bütçesi). Kaydetme (`PUT …/pending`) otomatik kaydetmenin parçası olduğu için `invitations.ts`'te.
 */
export const pendingChangesService = {
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
