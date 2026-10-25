import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { accountService } from '../../services/account';
import { useAuthStore } from '../../stores/useAuthStore';
import { useAccountStore } from '../../stores/useAccountStore';
import { toast } from '../ui/Toast';
import { toDisplayError, toFieldErrors } from '../../utils/toDisplayError';
import { ForgotPasswordState } from '../../types';
import { FormField, SubmitButton } from './FormField';

/**
 * Oturum açıkken parola değiştirme (Faz 14, `PUT /auth/password`, K142).
 *
 * Tekrar alanı yalnızca burada: backend sözleşmesi kayıt ve sıfırlamayla aynı
 * kaldı (`password_confirmation` yok). Başarıda bu cihaz HARİÇ bütün oturumlar
 * sunucuda kapanır; oturum listesi tazelenir.
 */
export function PasswordForm() {
  const email = useAuthStore(s => s.user?.email);
  const loadSessions = useAccountStore(s => s.loadSessions);

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;

    if (password !== repeat) {
      setErrors({ repeat: 'Yeni parolalar birbirinin aynısı değil.' });
      return;
    }

    setBusy(true);
    setErrors({});
    try {
      await accountService.changePassword({ currentPassword, password });
      setCurrentPassword('');
      setPassword('');
      setRepeat('');
      toast('Parolanız değiştirildi. Diğer cihazlardaki oturumlar kapatıldı.');
      void loadSessions().catch(() => undefined);
    } catch (error) {
      const fields = toFieldErrors(error);
      if (Object.keys(fields).length > 0) setErrors(fields);
      else toast(toDisplayError(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <FormField
        id="password-current"
        label="Mevcut parola"
        type="password"
        autoComplete="current-password"
        required
        value={currentPassword}
        onChange={event => setCurrentPassword(event.target.value)}
        error={errors.currentPassword}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="password-new"
          label="Yeni parola"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={event => setPassword(event.target.value)}
          error={errors.password}
          hint="En az 8 karakter."
        />
        <FormField
          id="password-repeat"
          label="Yeni parola (tekrar)"
          type="password"
          autoComplete="new-password"
          required
          value={repeat}
          onChange={event => setRepeat(event.target.value)}
          error={errors.repeat}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton busy={busy} busyLabel="Değiştiriliyor…">
          Parolayı Değiştir
        </SubmitButton>
        <Link
          to="/sifremi-unuttum"
          state={{ email } satisfies ForgotPasswordState}
          className="text-xs font-semibold text-brand hover:text-brand-soft transition-colors"
        >
          Mevcut parolamı hatırlamıyorum
        </Link>
      </div>
    </form>
  );
}
