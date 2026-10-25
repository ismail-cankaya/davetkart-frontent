import React from 'react';
import { KeyRound, Mail, MonitorSmartphone } from 'lucide-react';
import { AccountCard } from '../../components/account/AccountCard';
import { PasswordForm } from '../../components/account/PasswordForm';
import { EmailChangeForm } from '../../components/account/EmailChangeForm';
import { SessionList } from '../../components/account/SessionList';

/** `/hesap/guvenlik` — parola, e-posta ve aktif oturumlar (Faz 14). */
export default function AccountSecuritySection() {
  return (
    <>
      <AccountCard icon={KeyRound} title="Parola" description="Değiştirdiğinizde diğer cihazlardaki oturumlarınız kapanır.">
        <PasswordForm />
      </AccountCard>

      <AccountCard
        icon={Mail}
        title="E-posta adresi"
        description="Giriş ve bildirimler bu adresle yapılır. Yeni adres, gelen bağlantıyla onaylanınca geçerli olur."
      >
        <EmailChangeForm />
      </AccountCard>

      <AccountCard
        icon={MonitorSmartphone}
        title="Aktif oturumlar"
        description="Hesabınıza giriş yapılmış cihazlar. Tanımadığınız bir cihaz görürseniz kapatın ve parolanızı değiştirin."
      >
        <SessionList />
      </AccountCard>
    </>
  );
}
