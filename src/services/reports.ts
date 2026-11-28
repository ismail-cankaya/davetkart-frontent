import { api } from './api';

/** Misafirin bildirme nedeni — backend `InvitationReportReason` (Faz 25, K313). */
export type InvitationReportReason = 'phishing' | 'spam' | 'offensive' | 'other';

export const REPORT_REASONS: readonly InvitationReportReason[] = ['phishing', 'spam', 'offensive', 'other'];

export const reportService = {
  /**
   * `POST /public/invitations/:id/report` → 204. Honeypot (`website`) doluysa backend sessizce yutar.
   * Yalnızca yayındaki davetiye bildirilir (taslak 404).
   */
  async reportInvitation(invitationId: string, reason: InvitationReportReason, details: string, website: string): Promise<void> {
    await api.post(`/public/invitations/${invitationId}/report`, {
      reason,
      details: details.trim() === '' ? null : details.trim(),
      website
    });
  }
};
