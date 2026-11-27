import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { MailCheck, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { accountService } from '../../services/account';
import { toast } from '../ui/Toast';
import { toDisplayError } from '../../utils/toDisplayError';
import { duration, ease } from '../../utils/motion';

/**
 * Faz 19 (K191) → Faz 22.1 (K276): doğrulanmamış hesaba hatırlatma bandı + yeniden gönder. Engel değil:
 * ödeme ve yayın serbest, yalnızca ilk davetiye indirimi doğrulama ister.
 * Yalnızca sunucu açıkça `emailVerified: false` dediğinde görünür (eski oturum önbelleği alanı taşımaz).
 * Ayrıntılı açıklama: docs/rehber/src/components/account/EmailVerificationBanner.md
 */
export function EmailVerificationBanner() {
  const { t } = useTranslation();
  const user = useAuthStore(s => s.user);
  const [sending, setSending] = useState(false);

  if (user?.emailVerified !== false) return null;

  const resend = async () => {
    setSending(true);
    try {
      await accountService.resendEmailVerification();
      toast(t('auth.verification.sent', { email: user.email }));
    } catch (error) {
      toast(toDisplayError(error), 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.panel, ease: ease.out }}
      className="bg-amber-50 border-b border-amber-200/70 px-4 py-3"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-ink">
        <MailCheck size={18} className="shrink-0 text-amber-700" aria-hidden />
        <p className="flex-1 leading-relaxed">{t('auth.verification.banner', { email: user.email })}</p>
        <button
          type="button"
          onClick={resend}
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 font-semibold text-amber-800 transition duration-300 hover:border-amber-500 disabled:opacity-60 cursor-pointer"
        >
          {sending && <Loader2 size={14} className="animate-spin" aria-hidden />}
          {t('auth.verification.resend')}
        </button>
      </div>
    </motion.div>
  );
}
