import { Invitation, InvitationRecord, RSVPResponse, RsvpCreatePayload } from '../types';
import { invitationService } from './invitations';
import { rsvpService } from './rsvps';

/**
 * Data-access boundary for core application data (Invitation, RSVPs).
 *
 * Stores ve hook'lar YALNIZCA bu arayüzle konuşur, taşıma katmanıyla asla.
 * Böylece ileride önbellekli veya çevrimdışı bir uyarlayıcı eklemek tek dosyayı
 * değiştirir.
 *
 * Faz 3 (K37): davetiye metotları kimlik taşır — hesap başına tek davetiye
 * varsayımı kaldırıldı. Ayrıntılı açıklama: docs/rehber/src/services/persistence.md
 */
export interface PersistenceService {
  listInvitations(): Promise<InvitationRecord[]>;
  createInvitation(invitation: Invitation): Promise<InvitationRecord>;
  updateInvitation(id: string, invitation: Invitation): Promise<InvitationRecord>;
  deleteInvitation(id: string): Promise<void>;
  /**
   * Faz 5 (N1): LCV metotları davetiye kimliği taşır. Hesap başına tek
   * davetiye varsayımı burada da kalkıyor — alt kaydın aidiyeti yolun
   * yapısındadır, gövdede değil.
   */
  listRsvps(invitationId: string): Promise<RSVPResponse[]>;
  createRsvp(invitationId: string, payload: RsvpCreatePayload): Promise<RSVPResponse>;
  deleteRsvp(id: string): Promise<void>;
}

const httpAdapter: PersistenceService = {
  listInvitations: () => invitationService.list(),
  createInvitation: (invitation) => invitationService.create(invitation),
  updateInvitation: (id, invitation) => invitationService.update(id, invitation),
  deleteInvitation: (id) => invitationService.remove(id),

  listRsvps: (invitationId) => rsvpService.list(invitationId),
  createRsvp: (invitationId, payload) => rsvpService.create(invitationId, payload),
  deleteRsvp: (id) => rsvpService.remove(id)
};

export const persistenceService: PersistenceService = httpAdapter;
