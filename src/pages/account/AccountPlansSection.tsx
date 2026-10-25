import React from 'react';
import { Link } from 'react-router-dom';
import { History, Info, Ticket } from 'lucide-react';
import { AccountCard } from '../../components/account/AccountCard';
import { TierRightsGrid } from '../../components/account/TierRightsGrid';
import { RightRow } from '../../components/account/RightRow';
import { useAccountEntitlements } from '../../hooks/useAccountEntitlements';
import { EntitlementState } from '../../types';

/** Ekranda "aktif" (üstte) ve "geçmiş" (altta) diye ayrılan kovalar. */
const HISTORY: ReadonlySet<EntitlementState> = new Set(['consumed', 'refunded']);

/**
 * `/hesap/planlarim` — sahip olunan plan hakları (Faz 14, K140).
 *
 * Büyük sayı KULLANILABİLİR haktır: 2 Gold alıp 1'ini iptal eden kullanıcı
 * burada 1 görür. Sayıyı backend hesaplar; bu sayfa yalnızca gösterir.
 */
export default function AccountPlansSection() {
  const { entitlements, status } = useAccountEntitlements();

  if (!entitlements) {
    return (
      <AccountCard icon={Ticket} title="Planlarım">
        {status === 'error' ? (
          <p className="text-sm text-rose-700">Haklarınız yüklenemedi. Sayfayı yenileyip tekrar deneyin.</p>
        ) : (
          <div className="h-40 rounded-2xl bg-cream animate-pulse" aria-label="Yükleniyor" />
        )}
      </AccountCard>
    );
  }

  const active = entitlements.rights.filter(right => !HISTORY.has(right.state));
  const history = entitlements.rights.filter(right => HISTORY.has(right.state));

  return (
    <>
      <AccountCard
        icon={Ticket}
        title="Planlarım"
        description={
          entitlements.totalAvailable > 0
            ? `${entitlements.totalAvailable} kullanılabilir hakkınız var. Bir sonraki yayınınızda, davetiyenizin ihtiyacını karşılayan en uygun hak kendiliğinden kullanılır.`
            : 'Şu an kullanılabilir hakkınız yok. Davetiyenizi yayınlarken ya da fiyatlar sayfasından plan alabilirsiniz.'
        }
        action={
          entitlements.totalAvailable === 0 ? (
            <Link to="/pricing" className="text-xs font-semibold text-brand hover:text-brand-soft">
              Planları gör
            </Link>
          ) : undefined
        }
      >
        <TierRightsGrid tiers={entitlements.tiers} />
      </AccountCard>

      {active.length > 0 && (
        <AccountCard icon={Info} title="Haklarım" description="Kullanılmamış ve ödemesi yapılmış bir hakkı, ödemeden itibaren 14 gün içinde iptal edip iade isteyebilirsiniz.">
          <ul className="divide-y divide-ink/[0.06]">
            {active.map(right => (
              <RightRow key={right.orderId} right={right} />
            ))}
          </ul>
        </AccountCard>
      )}

      {history.length > 0 && (
        <AccountCard icon={History} title="Geçmiş" description="Kullanılan ve iade edilen haklar.">
          <ul className="divide-y divide-ink/[0.06]">
            {history.map(right => (
              <RightRow key={right.orderId} right={right} />
            ))}
          </ul>
        </AccountCard>
      )}
    </>
  );
}
