import { AuthSession, AuthUser, LoginCredentials, PasswordResetPayload, RegisterPayload } from '../types';
import { api, unwrapEnvelope } from './api';

/**
 * Frontend boundary of the dedicated Auth microservice.
 *
 * The store talks only to this interface. The HTTP adapter calls the Laravel
 * backend through the shared `api` client (POST /auth/login,
 * POST /auth/register) — the response is `{ user, token }`, exactly the
 * frontend `AuthSession` shape. localStorage is used only to cache the
 * session across reloads (JWTs stay server-issued).
 */
export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  register(payload: RegisterPayload): Promise<AuthSession>;
  /**
   * Best-effort server-side token revocation (POST /auth/logout). The token
   * is passed explicitly because the store clears its state before calling
   * this — a rejected/expired token must not re-trigger the 401 logout loop.
   */
  revokeSession(token: string): void;
  /**
   * Faz 10 (10.29): önbellekteki token HÂLÂ geçerli mi? `GET /auth/me` —
   * geçerliyse güncel kullanıcıyı döner. 401 (süresi dolmuş: 30 gün, K90;
   * başka cihazdan iptal edilmiş) api.ts'in interceptor'ı oturumu düşürür.
   */
  fetchCurrentUser(): Promise<AuthUser>;
  /**
   * Faz 10 (FE 10.16): şifre sıfırlama bağlantısı ister, `POST /auth/forgot-password`.
   *
   * 🔴 Dönüş değeri BİLEREK yok. Backend adres kayıtlı olsun olmasın aynı
   * 202'yi döner; istemcinin "gönderildi" ya da "böyle bir hesap yok"
   * diyebileceği bir bilgi yoktur (enumeration savunması).
   */
  requestPasswordReset(email: string): Promise<void>;
  /**
   * Maildeki bağlantının token'ıyla yeni şifreyi yazar, `POST /auth/reset-password` → 204.
   * Oturum AÇMAZ; backend o hesabın bütün token'larını siler. Geçersiz ya da
   * süresi dolmuş bağlantı: 422 `PASSWORD_RESET_INVALID`.
   */
  resetPassword(payload: PasswordResetPayload): Promise<void>;
  /**
   * Faz 10 (FE 10.17): hesabı kalıcı olarak siler, `DELETE /auth/me` → 204.
   *
   * Parola onayı backend'de (`current_password`): yanlışsa 422
   * `VALIDATION_FAILED`, `password` alanında. Başarıda token sunucuda silinir;
   * çağıran yerel oturumu `signOut({ revoke: false })` ile kapatır.
   */
  deleteAccount(password: string): Promise<void>;
  /** Re-hydrate a cached session (offline support only — JWTs stay server-issued). */
  restoreSession(): AuthSession | null;
  persistSession(session: AuthSession): void;
  clearSession(): void;
}

const SESSION_KEY = 'davetkart_auth_session';

/**
 * Önbellekteki oturumun GÜNCEL sözleşmeye uyup uymadığını doğrular.
 *
 * Sözleşme değiştiğinde (ör. `fullName` → `firstName` + `lastName`) eski
 * localStorage kaydı hâlâ okunabilir JSON'dur; şekli kontrol edilmezse
 * başlıkta ve panelde "undefined" basılırdı. Uymayan oturum sessizce
 * atılır, kullanıcı yeniden giriş yapar.
 */
function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) return false;

  const { user, token } = value as { user?: unknown; token?: unknown };
  return typeof token === 'string' && isAuthUser(user);
}

/** Aynı şekil denetimi `GET /auth/me` yanıtı için de kullanılır (10.29). */
function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<keyof AuthUser, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.firstName === 'string' &&
    typeof candidate.lastName === 'string' &&
    typeof candidate.email === 'string'
  );
}

const httpAuthAdapter: AuthService = {
  async login(credentials) {
    const { data } = await api.post<AuthSession>('/auth/login', credentials);
    return data;
  },

  async register(payload) {
    const { data } = await api.post<AuthSession>('/auth/register', payload);
    return data;
  },

  revokeSession(token) {
    // Fire-and-forget: local logout must never block on the network.
    void api
      .post('/auth/logout', undefined, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .catch(() => {
        // Token already expired/revoked server-side — nothing to do.
      });
  },

  async fetchCurrentUser() {
    // `me` ZARFLI döner ({ data: user }) — zarfsız olanlar yalnızca login/register (K11).
    const { data } = await api.get<unknown>('/auth/me');
    const user = unwrapEnvelope(data);

    if (!isAuthUser(user)) {
      throw new Error('Unexpected /auth/me response shape');
    }

    return user;
  },

  async requestPasswordReset(email) {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(payload) {
    await api.post('/auth/reset-password', payload);
  },

  async deleteAccount(password) {
    // DELETE gövdesi axios'ta `data` ile gönderilir; ikinci argüman config'tir.
    await api.delete('/auth/me', { data: { password } });
  },

  restoreSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;

      const parsed: unknown = JSON.parse(raw);
      return isAuthSession(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },

  persistSession(session) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Private-mode/quota failures only cost session survival across reloads.
    }
  },

  clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Nothing actionable.
    }
  }
};

export const authService: AuthService = httpAuthAdapter;
