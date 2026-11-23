import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, MailX } from 'lucide-react';
import { accountService } from '../services/account';
import { useAuthStore } from '../stores/useAuthStore';
import { toDisplayError } from '../utils/toDisplayError';
import { duration, ease } from '../utils/motion';

type Phase = 'confirming' | 'done' | 'failed';

/**
 * `/eposta-dogrula` — kayıt sonrası doğrulama bağlantısının hedefi (Faz 19, K191).
 * Oturum istemez; sorgu backend'e AYNEN gider. İstek bir kez gider (StrictMode + tek kullanım).
 * Ayrıntılı açıklama: docs/rehber/src/pages/EmailVerificationPage.md
 */
export default function EmailVerificationPage() {
  const { t } = useTranslation();
  const { search } = useLocation();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const refreshSession = useAuthStore(s => s.refreshSession);
  const [phase, setPhase] = useState<Phase>('confirming');
  const [message, setMessage] = useState('');
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    accountService
      .confirmEmailVerification(search)
      .then(async () => {
        // Bu sekmede oturum açıksa bant hemen kalksın: kullanıcı yeniden okunur.
        if (isAuthenticated) await refreshSession();
        setPhase('done');
      })
      .catch(error => {
        setMessage(toDisplayError(error));
        setPhase('failed');
      });
  }, [search, isAuthenticated, refreshSession]);

  return (
    <section className="flex-grow bg-cream px-4 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.panel, ease: ease.out }}
        className="max-w-md mx-auto rounded-[1.5rem] bg-white border border-ink/[0.06] shadow-sm p-8 text-center space-y-5"
      >
        {phase === 'confirming' && (
          <>
            <Loader2 size={32} className="mx-auto text-brand animate-spin" aria-hidden />
            <h1 className="font-serif text-2xl font-bold text-ink">{t('auth.verification.confirming')}</h1>
          </>
        )}

        {phase === 'done' && (
          <>
            <CheckCircle2 size={36} className="mx-auto text-emerald-700" aria-hidden />
            <h1 className="font-serif text-2xl font-bold text-ink">{t('auth.verification.doneTitle')}</h1>
            <p className="text-sm text-muted leading-relaxed">{t('auth.verification.doneBody')}</p>
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              replace
              className="inline-flex items-center justify-center bg-brand hover:bg-brand-soft text-white px-6 py-3 rounded-full font-semibold text-sm transition duration-300"
            >
              {isAuthenticated ? t('auth.myPanel') : t('auth.login')}
            </Link>
          </>
        )}

        {phase === 'failed' && (
          <>
            <MailX size={36} className="mx-auto text-rose-700" aria-hidden />
            <h1 className="font-serif text-2xl font-bold text-ink">{t('auth.verification.failedTitle')}</h1>
            <p className="text-sm text-muted leading-relaxed">{message}</p>
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="inline-flex items-center justify-center text-brand px-6 py-3 rounded-full font-semibold text-sm border border-brand/20 hover:border-brand/50 bg-white transition duration-300"
            >
              {isAuthenticated ? t('auth.myPanel') : t('auth.login')}
            </Link>
          </>
        )}
      </motion.div>
    </section>
  );
}
