import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * Shared HTTP client for the DavetKart microservices gateway.
 *
 * Every feature service (invitations, RSVPs, AI generation proxy…) must go
 * through this instance so JWT injection and session handling stay in one
 * place. AI prompts are also sent through here — the backend proxies Google
 * GenAI; secret keys never live in the frontend.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' }
});

// Attach the JWT of the active session to every outgoing request.
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Laravel API Resources wrap payloads in a `{ data: ... }` envelope; plain
 * controller responses don't. Feature services normalize through this helper
 * so both shapes are accepted.
 */
export function unwrapEnvelope(payload: unknown): unknown {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

/** Backend hata zarfı: `{ error: { code, fields?, params? } }` — K20. */
interface ApiErrorEnvelope {
  error?: {
    code?: string;
    params?: Record<string, unknown>;
  };
}

function envelopeOf(error: unknown): ApiErrorEnvelope['error'] {
  if (!axios.isAxiosError(error)) return undefined;
  return (error.response?.data as ApiErrorEnvelope | undefined)?.error;
}

/**
 * Backend'in döndürdüğü hata kodu (`INVALID_CREDENTIALS`, `RATE_LIMITED`…).
 * Ağ hatası, timeout veya beklenmeyen gövdede `null` döner.
 *
 * Geçici çözüm: kalıcı olan `toDisplayError()` çeviri katmanı henüz yok
 * (bkz. claude/Notlar/03 §3.3). O geldiğinde bu yardımcı onun içine taşınacak.
 */
export function apiErrorCode(error: unknown): string | null {
  return envelopeOf(error)?.code ?? null;
}

/** Hata koduna eşlik eden beyaz listelenmiş parametreler (ör. `retryAfter`). */
export function apiErrorParams(error: unknown): Record<string, unknown> {
  return envelopeOf(error)?.params ?? {};
}

/**
 * 🔴 Bir 401 İKİ farklı olayı anlatır ve ikisine aynı tepki verilemez:
 *
 *   UNAUTHENTICATED      → token yok / geçersiz / iptal edilmiş  → oturumu düşür
 *   INVALID_CREDENTIALS  → girilen e-posta veya parola yanlış    → FORMDA KAL
 *
 * Ayrım yapılmazsa kullanıcı yanlış parola girdiğinde `logout()` tetiklenir;
 * giriş sayfası yeniden kurulur ve kullanıcının yazdıkları kaybolur.
 */
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      (error as AxiosError).response?.status === 401 &&
      apiErrorCode(error) !== 'INVALID_CREDENTIALS'
    ) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
