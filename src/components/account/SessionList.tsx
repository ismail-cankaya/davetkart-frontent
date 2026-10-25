import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut, Monitor, Smartphone } from 'lucide-react';
import { AccountSession } from '../../types';
import { useAccountStore } from '../../stores/useAccountStore';
import { signOut } from '../../stores/sessionActions';
import { toast } from '../ui/Toast';
import { confirmAction } from '../ui/ConfirmDialog';
import { toDisplayError } from '../../utils/toDisplayError';
import { formatAccountDate, sessionDeviceLabel } from '../../utils/accountLabels';
import { duration, ease } from '../../utils/motion';

const MOBILE = new Set(['iOS', 'Android']);

/**
 * Aktif oturumlar (Faz 14, K143). IP ve konum bilerek yok: cihazı tanıtmak
 * için tarayıcı + işletim sistemi yeter (veri minimizasyonu).
 *
 * "Bu cihaz" satırında "kapat" yerine çıkış yapılır: kendi token'ını silen
 * istemcinin bir sonraki isteği 401 alırdı ve kullanıcı sebebini anlamazdı.
 */
export function SessionList() {
  const sessions = useAccountStore(s => s.sessions);
  const status = useAccountStore(s => s.sessionsStatus);
  const loadSessions = useAccountStore(s => s.loadSessions);
  const revokeSession = useAccountStore(s => s.revokeSession);
  const revokeOthers = useAccountStore(s => s.revokeOtherSessions);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    loadSessions().catch(error => toast(toDisplayError(error), 'error'));
  }, [loadSessions]);

  const others = sessions.filter(session => !session.current);

  const closeOne = async (session: AccountSession) => {
    if (session.current) {
      signOut();
      return;
    }
    setBusyId(session.id);
    try {
      await revokeSession(session.id);
      toast(`${sessionDeviceLabel(session)} oturumu kapatıldı.`);
    } catch (error) {
      toast(toDisplayError(error), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const closeOthers = async () => {
    const confirmed = await confirmAction({
      title: 'Diğer bütün cihazlardan çıkılsın mı?',
      description: `${others.length} oturum kapanacak. Bu cihazda oturumunuz açık kalır.`,
      confirmLabel: 'Hepsinden Çık',
      tone: 'danger',
    });
    if (!confirmed) return;

    setBusyId('others');
    try {
      await revokeOthers();
      toast('Diğer cihazlardaki oturumlar kapatıldı.');
    } catch (error) {
      toast(toDisplayError(error), 'error');
    } finally {
      setBusyId(null);
    }
  };

  if (status === 'loading') {
    return <div className="h-24 rounded-2xl bg-cream animate-pulse" aria-label="Oturumlar yükleniyor" />;
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-ink/[0.06]">
        <AnimatePresence initial={false}>
          {sessions.map(session => {
            const Icon = session.system && MOBILE.has(session.system) ? Smartphone : Monitor;
            return (
              <motion.li
                key={session.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: duration.base, ease: ease.out }}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 shrink-0 rounded-xl bg-cream text-ink/70 flex items-center justify-center">
                    <Icon size={16} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink flex flex-wrap items-center gap-x-2 gap-y-1">
                      {sessionDeviceLabel(session)}
                      {session.current && (
                        <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Bu cihaz
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted">
                      Son kullanım: {formatAccountDate(session.lastUsedAt ?? session.createdAt, true)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => closeOne(session)}
                  disabled={busyId !== null}
                  className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-ink px-4 py-2 rounded-full border border-ink/15 hover:border-ink/30 bg-white disabled:opacity-60 transition duration-300 cursor-pointer"
                >
                  <LogOut size={13} aria-hidden />
                  {session.current ? 'Çıkış Yap' : busyId === session.id ? 'Kapatılıyor…' : 'Kapat'}
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {others.length > 0 && (
        <button
          type="button"
          onClick={closeOthers}
          disabled={busyId !== null}
          className="inline-flex items-center gap-2 text-rose-700 px-5 py-2.5 rounded-full font-semibold text-xs border border-rose-200 hover:border-rose-400 bg-white disabled:opacity-60 transition duration-300 cursor-pointer"
        >
          <LogOut size={14} aria-hidden />
          Diğer bütün cihazlardan çık
        </button>
      )}
    </div>
  );
}
