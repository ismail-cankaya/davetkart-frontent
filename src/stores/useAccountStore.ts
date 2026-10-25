import { create } from 'zustand';
import { AccountEntitlements, AccountSession } from '../types';
import { accountService } from '../services/account';

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

interface AccountState {
  entitlements: AccountEntitlements | null;
  entitlementsStatus: LoadStatus;
  sessions: AccountSession[];
  sessionsStatus: LoadStatus;

  /** Planlarım, panel rozeti ve hesap silme uyarısı aynı veriyi okur. */
  loadEntitlements: () => Promise<void>;
  /** İptal et → sayılar sunucudan yeniden okunur (frontend saymaz, K128 ruhu). */
  requestRefund: (orderId: string, reason: string | null) => Promise<void>;
  withdrawRefund: (orderId: string) => Promise<void>;

  loadSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeOtherSessions: () => Promise<void>;

  /** Çıkışta hesaba ait bellek düşer (sessionActions.signOut). */
  reset: () => void;
}

const INITIAL = {
  entitlements: null,
  entitlementsStatus: 'idle' as LoadStatus,
  sessions: [],
  sessionsStatus: 'idle' as LoadStatus,
};

/**
 * Hesap ayarlarının sunucu durumu (Faz 14).
 *
 * 🔴 Yazma eylemlerinden sonra liste YENİDEN OKUNUR, yerel olarak
 * düzeltilmez. Bir iptal bir kovayı azaltıp diğerini artırıyor; aynı hesabı
 * burada yapmak, backend'in kuralının (SummarizeEntitlementsAction) ikinci
 * bir kopyası olurdu.
 */
export const useAccountStore = create<AccountState>()((set, get) => ({
  ...INITIAL,

  loadEntitlements: async () => {
    // İlk yüklemede iskelet; yenilemede eski veri ekranda kalır.
    set({ entitlementsStatus: get().entitlements ? 'ready' : 'loading' });
    try {
      set({ entitlements: await accountService.getEntitlements(), entitlementsStatus: 'ready' });
    } catch (error) {
      set({ entitlementsStatus: 'error' });
      throw error;
    }
  },

  requestRefund: async (orderId, reason) => {
    await accountService.requestRefund(orderId, reason);
    await get().loadEntitlements();
  },

  withdrawRefund: async (orderId) => {
    await accountService.withdrawRefund(orderId);
    await get().loadEntitlements();
  },

  loadSessions: async () => {
    set({ sessionsStatus: get().sessions.length > 0 ? 'ready' : 'loading' });
    try {
      set({ sessions: await accountService.listSessions(), sessionsStatus: 'ready' });
    } catch (error) {
      set({ sessionsStatus: 'error' });
      throw error;
    }
  },

  revokeSession: async (sessionId) => {
    await accountService.revokeSession(sessionId);
    await get().loadSessions();
  },

  revokeOtherSessions: async () => {
    await accountService.revokeOtherSessions();
    await get().loadSessions();
  },

  reset: () => set(INITIAL),
}));
