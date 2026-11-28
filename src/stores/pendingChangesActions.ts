import { useInvitationStore } from './useInvitationStore';
import { pendingChangesService } from '../services/pendingChanges';
import type { InvitationRecord } from '../types';

/**
 * Yayındaki davetiyenin taslağını yayınlar ya da atar (Faz 27.3, K323). Store'un dışında: yalnızca editör yükler
 * (misafir paketi, K237). Ayrıntı: docs/rehber/src/stores/pendingChangesActions.md
 */
export async function publishPendingChanges(): Promise<InvitationRecord> {
  const store = useInvitationStore.getState();
  // Son düzenleme debounce penceresinde olabilir: önce taslağa yazılır; yazılamadıysa yayınlanmaz.
  await store.saveInvitation();
  const { recordId, saveState, saveError } = useInvitationStore.getState();
  if (saveState === 'error' || saveState === 'rejected') throw saveError ?? new Error('Değişiklikler kaydedilemedi.');
  if (!recordId) throw new Error('Davetiye kaydedilmediği için değişiklikler yayınlanamadı.');

  const record = await pendingChangesService.publish(recordId);
  useInvitationStore.getState().adoptServerRecord(record);
  return record;
}

export async function discardPendingChanges(): Promise<void> {
  const { recordId, saveInvitation } = useInvitationStore.getState();
  if (!recordId) return;
  // Uçan bir taslak kaydı vazgeçten sonra yeniden taslak yazmasın.
  await saveInvitation();
  const record = await pendingChangesService.discard(recordId);
  useInvitationStore.getState().loadRecord(record);
}
