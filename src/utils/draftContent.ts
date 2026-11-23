import type { Invitation } from '../types';

/**
 * Faz 19 (K192, FE-50): sunucuda ilk taslağı açmaya değer mi? Yalnızca "gerçek içerik"
 * (isimler, tarih, mekân) sayılır; kategori ve tema seçimi yerel durumda kalır.
 * Ayrıntılı açıklama: docs/rehber/src/hooks/useInvitationAutoSave.md
 */
export function hasDraftContent(invitation: Pick<Invitation, 'names' | 'date' | 'venue'>): boolean {
  return invitation.names.trim() !== '' || invitation.date.trim() !== '' || invitation.venue.trim() !== '';
}

/** Otomatik kaydetme kapısı: kayıt zaten varsa her düzenleme, yoksa yalnızca gerçek içerik. */
export function shouldAutoSave(state: { recordId: string | null; invitation: Invitation }): boolean {
  return state.recordId !== null || hasDraftContent(state.invitation);
}
