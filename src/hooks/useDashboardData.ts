import { useCallback, useEffect, useMemo, useState } from 'react';
import { persistenceService } from '../services/persistence';
import { InvitationRecord } from '../types';

export interface DashboardData {
  /** Remote records with status 'published' — live at /invite/:id. */
  published: InvitationRecord[];
  /** Remote records saved to the account but not yet published. */
  saved: InvitationRecord[];
  isLoading: boolean;
  /** Backend unreachable — the library can't be listed right now. */
  remoteError: boolean;
  refresh: () => void;
  /** Davetiyeyi siler; hata olursa liste sunucudan geri yüklenir. */
  remove: (id: string) => Promise<void>;
}

/**
 * Loads the member dashboard's invitation library from the Invitation service.
 *
 * Faz 3 (K37): backend artık hesap başına BİRDEN ÇOK davetiye tutuyor, bu yüzden
 * tek kayıt varsayımı kaldırıldı. Ayrıntılı açıklama:
 * docs/rehber/src/hooks/useDashboardData.md
 */
export function useDashboardData(): DashboardData {
  const [records, setRecords] = useState<InvitationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [remoteError, setRemoteError] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setRecords(await persistenceService.listInvitations());
      setRemoteError(false);
    } catch {
      setRecords([]);
      setRemoteError(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /**
   * İyimser güncelleme: kart anında kaybolur, ağı beklemez. Silme başarısız
   * olursa liste sunucudan tazelenir ve kart geri gelir — ekranda gerçek
   * durumdan farklı bir şey kalmaz.
   */
  const remove = useCallback(
    async (id: string) => {
      setRecords((prev) => prev.filter((record) => record.id !== id));
      try {
        await persistenceService.deleteInvitation(id);
      } catch (error) {
        await load();
        throw error;
      }
    },
    [load]
  );

  const published = useMemo(() => records.filter((r) => r.status === 'published'), [records]);
  const saved = useMemo(() => records.filter((r) => r.status === 'saved'), [records]);

  return {
    published,
    saved,
    isLoading,
    remoteError,
    refresh: () => void load(),
    remove
  };
}
