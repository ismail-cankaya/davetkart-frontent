import type { Invitation } from '../types';
import type { UserField } from '../invitationText/userFields';

/** Yayına hazır mı kontrol listesinin maddeleri (Faz 28, K325). */
export type ReadinessId = 'names' | 'date' | 'future' | 'venue' | 'rsvp';

export interface ReadinessItem {
  id: ReadinessId;
  ok: boolean;
  /** Maddeye tıklanınca açılacak yer: kullanıcı alanı ya da bölüm ayarı. */
  target: { field: UserField } | { section: 'rsvp' };
}

const WALL_CLOCK = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/;

/** Duvar saati bugünden ileride mi (gün bazında; saat dilimi yok sayılır, K23 ruhu). */
function isUpcoming(date: string, now: Date): boolean {
  const match = WALL_CLOCK.exec(date.trim());
  if (!match) return false;
  const day = Number(match[1]) * 10000 + Number(match[2]) * 100 + Number(match[3]);
  const today = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  return day >= today;
}

/**
 * Eksikleri sayar; uyarıdır, yayını engellemez (kural sunucuda değil, kullanıcıya yardım). LCV maddesi yalnızca LCV
 * açıkken listelenir. Ayrıntı: docs/rehber/src/utils/readiness.md
 */
export function readinessItems(invitation: Invitation, now: Date = new Date()): ReadinessItem[] {
  const date = invitation.date?.trim() ?? '';
  const items: ReadinessItem[] = [
    { id: 'names', ok: Boolean(invitation.names?.trim()), target: { field: 'names' } },
    { id: 'date', ok: date !== '', target: { field: 'date' } },
    { id: 'future', ok: date !== '' && isUpcoming(date, now), target: { field: 'date' } },
    { id: 'venue', ok: Boolean(invitation.venue?.trim()), target: { field: 'venue' } }
  ];
  if (invitation.showRSVP) items.push({ id: 'rsvp', ok: Boolean(invitation.rsvpDeadline?.trim()), target: { section: 'rsvp' } });
  return items;
}
