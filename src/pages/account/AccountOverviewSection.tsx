import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Ticket, UserRound } from 'lucide-react';
import { AccountCard } from '../../components/account/AccountCard';
import { ProfileForm } from '../../components/account/ProfileForm';
import { TierRightsGrid } from '../../components/account/TierRightsGrid';
import { useAccountEntitlements } from '../../hooks/useAccountEntitlements';

/** `/hesap` — profil ve hak özetinin tek bakışı (Faz 14). */
export default function AccountOverviewSection() {
  const { entitlements, status } = useAccountEntitlements();

  return (
    <>
      <AccountCard icon={UserRound} title="Profil" description="Davetiyelerinizde ve maillerde görünen adınız.">
        <ProfileForm />
      </AccountCard>

      <AccountCard
        icon={Ticket}
        title="Plan haklarım"
        description="Her hak bir davetiyeyi yayınlar. Yeni bir davetiye yayınladığınızda uygun hak kendiliğinden kullanılır."
        action={
          <Link to="/hesap/planlarim" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-soft">
            Ayrıntılar <ArrowRight size={13} aria-hidden />
          </Link>
        }
      >
        {entitlements ? (
          <TierRightsGrid tiers={entitlements.tiers} compact />
        ) : (
          <div className={status === 'error' ? 'text-sm text-rose-700' : 'h-32 rounded-2xl bg-cream animate-pulse'}>
            {status === 'error' ? 'Haklarınız yüklenemedi.' : null}
          </div>
        )}
      </AccountCard>
    </>
  );
}
