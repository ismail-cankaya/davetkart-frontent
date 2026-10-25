import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MailCheck } from 'lucide-react';
import { accountService } from '../../services/account';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from '../ui/Toast';
import { toDisplayError, toFieldErrors } from '../../utils/toDisplayError';
import { duration, ease } from '../../utils/motion';
import { FormField, SubmitButton } from './FormField';

/**
 * E-posta değişikliği isteği (Faz 14, `POST /auth/email-change`, K144).
 *
 * 🔴 Başarı mesajı "bağlantı gönderildi"den fazlasını söyleyemez: backend adres
 * başka hesapta kayıtlı olsa da aynı 202'yi döner (hesap tarayıcısı olmasın).
 * Adres onaylanana kadar eskisi geçerli.
 */
export function EmailChangeForm() {
  const currentEmail = useAuthStore(s => s.user?.email ?? '');

  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setErrors({});
    try {
      const target = email.trim();
      await accountService.requestEmailChange({ email: target, currentPassword });
      setSentTo(target);
      setEmail('');
      setCurrentPassword('');
    } catch (error) {
      const fields = toFieldErrors(error);
      if (Object.keys(fields).length > 0) setErrors(fields);
      else toast(toDisplayError(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Şu anki adresiniz: <span className="font-semibold text-ink break-all">{currentEmail}</span>
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {sentTo ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: duration.base, ease: ease.out }}
            className="flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-4 text-sm"
          >
            <MailCheck size={18} className="shrink-0 mt-0.5" aria-hidden />
            <div className="space-y-2">
              <p>
                <strong className="break-all">{sentTo}</strong> adresine bir onay bağlantısı gönderdik. Bağlantıya
                tıklayana kadar eski adresiniz geçerli. Onaydan sonra yeni adresinizle yeniden giriş yapmanız gerekir.
              </p>
              <button
                type="button"
                onClick={() => setSentTo(null)}
                className="text-xs font-semibold text-emerald-800 underline underline-offset-2 cursor-pointer"
              >
                Başka bir adres gir
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: duration.base, ease: ease.out }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="email-new"
                label="Yeni e-posta"
                type="email"
                autoComplete="email"
                required
                maxLength={255}
                value={email}
                onChange={event => setEmail(event.target.value)}
                error={errors.email}
              />
              <FormField
                id="email-password"
                label="Mevcut parola"
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={event => setCurrentPassword(event.target.value)}
                error={errors.currentPassword}
              />
            </div>
            <SubmitButton busy={busy} busyLabel="Gönderiliyor…">
              Onay Bağlantısı Gönder
            </SubmitButton>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
