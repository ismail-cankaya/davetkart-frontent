import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { accountService } from '../../services/account';
import { toast } from '../ui/Toast';
import { toDisplayError, toFieldErrors } from '../../utils/toDisplayError';
import { FormField, SubmitButton } from './FormField';

/**
 * Ad / soyad (Faz 14, `PATCH /auth/me`). E-posta burada DEĞİŞMEZ: doğrulamalı
 * ayrı akış (Giriş ve Güvenlik). Başarıda sunucunun kullanıcısı oturuma yazılır;
 * başlıktaki ad da hemen güncellenir.
 */
export function ProfileForm() {
  const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const unchanged = firstName.trim() === user?.firstName && lastName.trim() === user?.lastName;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || unchanged) return;

    setBusy(true);
    setErrors({});
    try {
      const updated = await accountService.updateProfile({ firstName, lastName });
      setUser(updated);
      setFirstName(updated.firstName);
      setLastName(updated.lastName);
      toast('Bilgileriniz güncellendi.');
    } catch (error) {
      const fields = toFieldErrors(error);
      if (Object.keys(fields).length > 0) setErrors(fields);
      else toast(toDisplayError(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="profile-first-name"
          label="Ad"
          autoComplete="given-name"
          required
          maxLength={60}
          value={firstName}
          onChange={event => setFirstName(event.target.value)}
          error={errors.firstName}
        />
        <FormField
          id="profile-last-name"
          label="Soyad"
          autoComplete="family-name"
          required
          maxLength={60}
          value={lastName}
          onChange={event => setLastName(event.target.value)}
          error={errors.lastName}
        />
      </div>
      <div className="flex items-center gap-4">
        <SubmitButton busy={busy} busyLabel="Kaydediliyor…">
          Kaydet
        </SubmitButton>
        {unchanged && <span className="text-xs text-muted">Değişiklik yok.</span>}
      </div>
    </form>
  );
}
