import { api } from './api';
import { toRecord } from './invitations';
import type { Invitation, InvitationRecord } from '../types';

/** Hızlı düzenlemenin yazdığı alanlar: kullanıcının kendi içeriği (K305, K324). */
export type QuickFields = Pick<Invitation, 'names' | 'title' | 'subtitle' | 'date' | 'venue'>;

/**
 * Hızlı düzenleme (Faz 29.1, K324): YALNIZCA değişen alanlar gönderilir. Tam gövde göndermek, yayındaki davetiyede
 * stüdyonun yayınlanmamış taslağındaki her alanı düşürürdü (sunucu yazılan alanları taslaktan siler). Tembel modül.
 */
export async function saveQuickFields(id: string, patch: Partial<QuickFields>): Promise<InvitationRecord> {
  const { data } = await api.put<unknown>(`/invitations/${id}`, { invitation: patch });
  return toRecord(data);
}
