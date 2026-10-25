import React from 'react';
import { Link } from 'react-router-dom';
import { FileLock2 } from 'lucide-react';
import { AccountCard } from '../../components/account/AccountCard';
import { DeleteAccountCard } from '../../components/account/DeleteAccountCard';
import { useAccountEntitlements } from '../../hooks/useAccountEntitlements';

/**
 * `/hesap/gizlilik` — kişisel veriler ve hesabı silme (Faz 14).
 *
 * Haklar burada da yüklenir: silme uyarısı kaç hakkın yanacağını SAYIYLA söyler.
 */
export default function AccountPrivacySection() {
  useAccountEntitlements();

  return (
    <>
      <AccountCard icon={FileLock2} title="Kişisel verileriniz" description="Hangi verilerin neden işlendiğini aydınlatma metninde bulabilirsiniz.">
        <div className="flex flex-wrap gap-4 text-sm">
          <Link to="/privacy" className="font-semibold text-brand hover:text-brand-soft">
            Gizlilik politikası
          </Link>
          <Link to="/cookies" className="font-semibold text-brand hover:text-brand-soft">
            Çerez politikası
          </Link>
          <Link to="/contact" className="font-semibold text-brand hover:text-brand-soft">
            Veri talebi için bize yazın
          </Link>
        </div>
      </AccountCard>

      <DeleteAccountCard />
    </>
  );
}
