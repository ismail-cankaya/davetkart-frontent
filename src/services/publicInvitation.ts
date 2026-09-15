import { unwrapEnvelope } from './api';
import { conditionalGet } from './conditionalGet';
import { Invitation, TimelineEvent } from '../types';

/**
 * Misafirin gördüğü davetiye — `GET /api/public/invitations/:id`.
 *
 * 🔴 Bu uç, sahibin ucundan (`/invitations/:id`) FARKLI bir gövde döndürür.
 * Backend'in C4 kuralı gereği KAPALI MODÜLÜN VERİSİ HİÇ GÖNDERİLMEZ: boş
 * string olarak değil, anahtar olarak da yoktur. Ayrıca `status`, `updatedAt`
 * ve program adımlarının `id`'si de gelmez.
 *
 * Ayrıntılı açıklama: docs/rehber/src/services/publicInvitation.md
 */

/** Misafirin adımlarında `id` YOKTUR: düzenleme yapmaz, kimliğe ihtiyacı olmaz. */
type WireTimelineEvent = Omit<TimelineEvent, 'id' | 'localKey'>;

/** Her zaman gelen alanlar — davetiyenin iskeleti ve modül bayrakları. */
type PublicCore = Omit<
  Invitation,
  | 'timelineEvents'
  | 'galleryImages'
  | 'bankName'
  | 'accountHolder'
  | 'iban'
  | 'giftOptions'
  | 'rsvpDeadline'
  | 'askMenuPreference'
>;

/** Modül AÇIKSA gelen, kapalıysa gövdede HİÇ BULUNMAYAN alanlar. */
type PublicModules = Partial<
  Pick<
    Invitation,
    'galleryImages' | 'bankName' | 'accountHolder' | 'iban' | 'giftOptions' | 'rsvpDeadline' | 'askMenuPreference'
  >
> & {
  timelineEvents?: WireTimelineEvent[];
};

type WirePublicInvitation = PublicCore & PublicModules;

interface WirePublicRecord {
  id: string;
  invitation: WirePublicInvitation;
}

/** Misafir sayfasının çizim için ihtiyaç duyduğu her şey. */
export interface PublicInvitationView {
  id: string;
  invitation: Invitation;
}

/**
 * Ağ sınırı: buradan içerisi güvenilir, dışarısı değil. Yanlış yönlendirilmiş
 * bir istek SPA fallback'inden HTML bile döndürebilir.
 */
function isWirePublicRecord(body: unknown): body is WirePublicRecord {
  return typeof body === 'object' && body !== null && 'id' in body && 'invitation' in body;
}

/**
 * Eksik anahtarları tamamlar ve React anahtarını takar.
 *
 * 🔴 Burada doldurulan varsayılanlar HİÇBİR ZAMAN ÇİZİLMEZ: bir alan yalnızca
 * modül kapalıyken eksik gelir, kapalı modülün bileşeni ise
 * `InvitationComposition` içinde mount bile olmaz. Yani bu, Faz 3'te
 * reddettiğimiz "eksik alanı varsayılanla doldur" davranışı DEĞİLDİR —
 * orada eksiklik "bilinmiyor" demekti, burada "sana ait değil" demek.
 */
function hydrate(wire: WirePublicInvitation): Invitation {
  return {
    ...wire,

    bankName: wire.bankName ?? '',
    accountHolder: wire.accountHolder ?? '',
    iban: wire.iban ?? '',
    giftOptions: wire.giftOptions ?? [],

    rsvpDeadline: wire.rsvpDeadline ?? '',
    askMenuPreference: wire.askMenuPreference ?? false,

    galleryImages: wire.galleryImages ?? [],

    // `id: null` dürüst olan tek değer: sunucu kimlik göndermedi, uydurmuyoruz.
    // `localKey` dizinin konumundan üretiliyor; liste bu sayfada değişmiyor.
    timelineEvents: (wire.timelineEvents ?? []).map((event, index) => ({
      ...event,
      id: null,
      localKey: `pub-${index}`
    }))
  };
}

export const publicInvitationService = {
  /**
   * Yayınlanmış davetiyeyi getirir.
   *
   * Yayınlanmamış, silinmiş ve hiç var olmayan kimlikler AYNI 404'ü döner
   * (backend H7) — çağıran taraf aralarında ayrım yapamaz, yapmamalıdır.
   */
  async get(id: string): Promise<PublicInvitationView> {
    const url = `/public/invitations/${id}`;

    // 🔴 Koşullu okuma (K46): bu uç ETag üretiyor. Misafir bağlantıyı
    // birden çok kez açabilir; davetiye değişmediyse gövde hiç inmez.
    return conditionalGet(url, url, (payload) => {
      const body = unwrapEnvelope(payload);

      if (!isWirePublicRecord(body)) {
        throw new Error('Unexpected /public/invitations response shape');
      }

      return { id: body.id, invitation: hydrate(body.invitation) };
    });
  }
};
