import { useEffect } from 'react';
import { useAccountStore } from '../stores/useAccountStore';
import { toast } from '../components/ui/Toast';
import { toDisplayError } from '../utils/toDisplayError';

/**
 * "Planlarım" verisini bileşen açılınca tazeler (Faz 14).
 *
 * Her açılışta yeniden okunur: başka bir sekmede yayınlanan bir davetiye
 * bir hakkı "kullanımda"ya taşımış olabilir. Hata toast olur; eski veri
 * varsa ekranda kalır.
 */
export function useAccountEntitlements() {
  const entitlements = useAccountStore(s => s.entitlements);
  const status = useAccountStore(s => s.entitlementsStatus);
  const load = useAccountStore(s => s.loadEntitlements);

  useEffect(() => {
    load().catch(error => toast(toDisplayError(error), 'error'));
  }, [load]);

  return { entitlements, status };
}
