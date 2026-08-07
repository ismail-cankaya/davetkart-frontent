import { AuthSession, AuthUser, LoginCredentials, RegisterPayload } from '../types';
import { api } from './api';

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
  if (typeof token !== 'string' || typeof user !== 'object' || user === null) return false;

  const candidate = user as Record<keyof AuthUser, unknown>;

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
