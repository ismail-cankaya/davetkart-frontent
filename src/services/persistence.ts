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
  listRsvps(): Promise<RSVPResponse[]>;
  createRsvp(payload: RsvpCreatePayload): Promise<RSVPResponse>;
  deleteRsvp(id: string): Promise<void>;
}

const httpAdapter: PersistenceService = {
  listInvitations: () => invitationService.list(),
  createInvitation: (invitation) => invitationService.create(invitation),
  updateInvitation: (id, invitation) => invitationService.update(id, invitation),
  deleteInvitation: (id) => invitationService.remove(id),

  listRsvps: () => rsvpService.list(),
  createRsvp: (payload) => rsvpService.create(payload),
  deleteRsvp: (id) => rsvpService.remove(id)
};

export const persistenceService: PersistenceService = httpAdapter;
