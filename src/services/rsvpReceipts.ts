import { RsvpReceipt } from '../types';

/**
 * Bu cihazdan verilmiş LCV yanıtlarının kimlik + düzenleme kodu (Faz 10, FE 10.18 · K101).
 *
 * Davetiye başına bir kayıt: aynı misafir formu ikinci kez gönderdiğinde yeni
 * satır açılmaz, bu kodla eskisi güncellenir.
 *
 * Tarayıcı deposu kapalı olabilir (gizli pencere, kota). Her erişim try/catch
 * içinde: depo yoksa misafir her seferinde yeni yanıt gönderir, form bozulmaz.
 */
/** Çerez Politikası da bu adı listeler (B-H5); `verify-render` ikisinin aynı kaldığını denetler. */
export const RSVP_RECEIPT_KEY_PREFIX = 'davetkart_rsvp_receipt:';
const KEY_PREFIX = RSVP_RECEIPT_KEY_PREFIX;

function keyFor(invitationId: string): string {
  return `${KEY_PREFIX}${invitationId}`;
}

function isReceipt(value: unknown): value is RsvpReceipt {
  if (typeof value !== 'object' || value === null) return false;
  const { rsvpId, editCode } = value as Record<string, unknown>;
  return typeof rsvpId === 'string' && rsvpId !== '' && typeof editCode === 'string' && editCode !== '';
}

export const rsvpReceipts = {
  recall(invitationId: string): RsvpReceipt | null {
    try {
      const raw = localStorage.getItem(keyFor(invitationId));
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      return isReceipt(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },

  remember(invitationId: string, receipt: RsvpReceipt): void {
    try {
      localStorage.setItem(keyFor(invitationId), JSON.stringify(receipt));
    } catch {
      // Depo kapalı: bir sonraki gönderim yeni yanıt olur, başka bir şey bozulmaz.
    }
  },

  forget(invitationId: string): void {
    try {
      localStorage.removeItem(keyFor(invitationId));
    } catch {
      // Yapılacak bir şey yok.
    }
  },
};
