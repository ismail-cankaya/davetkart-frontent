import { api, unwrapEnvelope } from './api';
import type { Invitation } from '../types';

export interface PreviewLink {
  url: string;
  expiresAt: string;
}

/**
 * "Telefonda aç" (Faz 29.4, K328). Tembel modül: yalnızca düğme ve önizleme sayfası yükler.
 * Ayrıntı: docs/rehber/src/services/previewLink.md
 */
export const previewLinkService = {
  /** Sahibine 24 saatlik imzalı bağlantı. */
  async create(id: string): Promise<PreviewLink> {
    const { data } = await api.post<unknown>(`/invitations/${id}/preview-link`);
    const body = unwrapEnvelope(data) as Partial<PreviewLink>;
    if (typeof body?.url !== 'string' || typeof body.expiresAt !== 'string') throw new Error('Unexpected preview-link response shape');
    return { url: body.url, expiresAt: body.expiresAt };
  },

  /**
   * İmzalı önizleme: sorgu dizesi (`?expires&signature`) olduğu gibi API'ye taşınır (göreli imza). Yük misafir ucuyla
   * aynı biçimde; misafir servisini içe aktarmıyoruz ki o modül misafir sayfasından ayrı parçaya düşmesin (K237).
   */
  async open(id: string, search: string): Promise<Invitation> {
    const { data } = await api.get<unknown>(`/public/invitations/${id}/preview${search}`);
    const body = unwrapEnvelope(data) as { invitation?: Partial<Invitation> & { guestUploads?: boolean } } | null;
    const wire = body?.invitation;
    if (!wire) throw new Error('Unexpected preview response shape');
    return {
      ...(wire as Invitation),
      bankName: wire.bankName ?? '',
      accountHolder: wire.accountHolder ?? '',
      iban: wire.iban ?? '',
      giftOptions: wire.giftOptions ?? [],
      rsvpDeadline: wire.rsvpDeadline ?? '',
      askMenuPreference: wire.askMenuPreference ?? false,
      galleryImages: (wire.galleryImages ?? []).map((image) => ({ id: null, url: image.url })),
      timelineEvents: (wire.timelineEvents ?? []).map((event, index) => ({ ...event, id: null, localKey: `pre-${index}` }))
    };
  }
};
