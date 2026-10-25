import {
  AccountEntitlements,
  AccountSession,
  AuthUser,
  EmailChangePayload,
  PasswordChangePayload,
  ProfilePayload,
} from '../types';
import { api, unwrapEnvelope } from './api';

/**
 * Hesap ayarlarının backend sınırı (Faz 14).
 *
 * `authService` giriş/çıkış ve oturumun önbelleğiyle ilgilenir; bu servis
 * hesabın AYARLARIYLA: profil, parola, e-posta, oturumlar, plan hakları.
 * İkisi ayrı, çünkü değişme sebepleri ayrı (SRP).
 *
 * 🔴 Yanıt biçimleri sınırda doğrulanır: beklenmeyen bir gövde ekranda
 * "undefined" basmak yerine hata olarak yükselir.
 */
function isAccountEntitlements(value: unknown): value is AccountEntitlements {
  if (typeof value !== 'object' || value === null) return false;
  const body = value as Partial<AccountEntitlements>;
  return Array.isArray(body.tiers) && Array.isArray(body.rights) && typeof body.totalAvailable === 'number';
}

function isSession(value: unknown): value is AccountSession {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { id?: unknown }).id === 'string' &&
    typeof (value as { current?: unknown }).current === 'boolean'
  );
}

function isUser(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value === null) return false;
  const user = value as Record<keyof AuthUser, unknown>;
  return (
    typeof user.id === 'string' &&
    typeof user.firstName === 'string' &&
    typeof user.lastName === 'string' &&
    typeof user.email === 'string'
  );
}

export const accountService = {
  /** "Planlarım": plan başına sayılar ve satır satır haklar (K140). */
  async getEntitlements(): Promise<AccountEntitlements> {
    const { data } = await api.get<unknown>('/account/entitlements');
    const body = unwrapEnvelope(data);
    if (!isAccountEntitlements(body)) throw new Error('Unexpected /account/entitlements response shape');
    return body;
  },

  /**
   * Kullanılmamış bir hakkı iptal eder ve iade ister (K138).
   * Engel varsa 409 `REFUND_NOT_ALLOWED` + `params.reason`.
   */
  async requestRefund(orderId: string, reason: string | null): Promise<void> {
    await api.post(`/orders/${encodeURIComponent(orderId)}/refund-request`, reason ? { reason } : {});
  },

  /** Açık iade talebinden vazgeçer; hak yeniden kullanılabilir. */
  async withdrawRefund(orderId: string): Promise<void> {
    await api.delete(`/orders/${encodeURIComponent(orderId)}/refund-request`);
  },

  /** Ad/soyad. Yanıt `GET /auth/me` ile aynı (`{data: user}`). */
  async updateProfile(payload: ProfilePayload): Promise<AuthUser> {
    const { data } = await api.patch<unknown>('/auth/me', payload);
    const user = unwrapEnvelope(data);
    if (!isUser(user)) throw new Error('Unexpected PATCH /auth/me response shape');
    return user;
  },

  /** Başarıda 204; bu cihaz HARİÇ bütün oturumlar sunucuda kapanır (K142). */
  async changePassword(payload: PasswordChangePayload): Promise<void> {
    await api.put('/auth/password', payload);
  },

  /**
   * Yeni adrese onay bağlantısı ister → 202. Adres kullanımda olsa da AYNI
   * yanıt (K144): ekran "bağlantı gönderildi" der, başka bir şey diyemez.
   */
  async requestEmailChange(payload: EmailChangePayload): Promise<void> {
    await api.post('/auth/email-change', payload);
  },

  /**
   * Maildeki bağlantının sorgusunu API'ye AYNEN gönderir → 204.
   *
   * 🔴 Sorgu yeniden kurulmaz: imza parametrelerin sırasını ve kodlamasını
   * kapsıyor. `URLSearchParams` ile yeniden yazmak `+`'yı `%2B`'den boşluğa
   * çevirip imzayı bozabilirdi.
   */
  async confirmEmailChange(rawQuery: string): Promise<void> {
    const query = rawQuery.startsWith('?') ? rawQuery.slice(1) : rawQuery;
    await api.post(`/public/email-change/confirm?${query}`);
  },

  async listSessions(): Promise<AccountSession[]> {
    const { data } = await api.get<unknown>('/auth/sessions');
    const body = unwrapEnvelope(data);
    if (!Array.isArray(body) || !body.every(isSession)) throw new Error('Unexpected /auth/sessions response shape');
    return body;
  },

  async revokeSession(sessionId: string): Promise<void> {
    await api.delete(`/auth/sessions/${encodeURIComponent(sessionId)}`);
  },

  async revokeOtherSessions(): Promise<void> {
    await api.delete('/auth/sessions');
  },
};
