import { create } from 'zustand';
import { AuthUser, LoginCredentials, RegisterPayload } from '../types';
import { authService } from '../services/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Authenticate against the Auth service; resolves with the signed-in user. */
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
  /**
   * Faz 10 (10.29): önbellekteki oturumu sunucuya doğrulatır ve kullanıcıyı
   * tazeler. Uygulama açılışında bir kez çağrılır (App.tsx).
   */
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (credentials) => {
    const session = await authService.login(credentials);
    authService.persistSession(session);
    set({ user: session.user, token: session.token, isAuthenticated: true });
    return session.user;
  },

  register: async (payload) => {
    const session = await authService.register(payload);
    authService.persistSession(session);
    set({ user: session.user, token: session.token, isAuthenticated: true });
    return session.user;
  },

  logout: () => {
    const { token } = get();
    // Clear local state first: if the server-side revoke below comes back
    // 401, the response interceptor calls logout() again — token is already
    // null by then, so the revoke is not re-issued (no loop).
    authService.clearSession();
    set({ user: null, token: null, isAuthenticated: false });
    if (token) {
      authService.revokeSession(token);
    }
  },

  refreshSession: async () => {
    const { token } = get();
    if (!token) return;

    try {
      const user = await authService.fetchCurrentUser();

      // İstek yoldayken oturum değiştiyse (çıkış ya da başka hesapla giriş),
      // eski oturumun cevabı yeni oturumun kullanıcısının üstüne yazılmaz.
      if (get().token !== token) return;

      authService.persistSession({ user, token });
      set({ user });
    } catch {
      // 401: api.ts'in interceptor'ı logout() çağırdı (bayat değilse).
      // Ağ hatası: çevrimdışı olabilir. Önbellekteki oturum kalır; bir sonraki
      // kimlikli istek karar verir. Oturumu ağ yüzünden düşürmek, metroda
      // uygulamayı açan kullanıcıyı her seferinde çıkarırdı.
    }
  }
}));

// Re-hydrate a cached session synchronously so protected routes and the
// header render the correct auth state on first paint.
const cached = authService.restoreSession();
if (cached) {
  useAuthStore.setState({ user: cached.user, token: cached.token, isAuthenticated: true });
}
