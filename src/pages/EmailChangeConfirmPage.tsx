import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, MailX } from 'lucide-react';
import { accountService } from '../services/account';
import { useAuthStore } from '../stores/useAuthStore';
import { signOut } from '../stores/sessionActions';
import { toDisplayError } from '../utils/toDisplayError';
import { duration, ease } from '../utils/motion';

type Phase = 'confirming' | 'done' | 'failed';

/**
 * `/eposta-onay` — e-posta değişikliği onay bağlantısının hedefi (Faz 14, K144).
 *
 * Oturum İSTEMEZ: bağlantı başka bir cihazda açılabilir. Yetkinin kanıtı
 * sorgudaki imza; sorgu backend'e AYNEN gönderilir.
 *
 * Başarıda backend bütün oturumları kapatır. Bu sekmede oturum açıksa
 * yerelde de düşürülür (token zaten geçersiz; `revoke: false`).
 *
 * 🔴 İstek yalnızca BİR KEZ gider: React StrictMode effect'i iki kez çalıştırır
 * ve bağlantı tek kullanımlık — ikinci istek "geçersiz" derdi.
 */
export default function EmailChangeConfirmPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [phase, setPhase] = useState<Phase>('confirming');
  const [message, setMessage] = useState('');
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    accountService
      .confirmEmailChange(search)
      .then(() => {
        if (isAuthenticated) signOut({ revoke: false });
        setPhase('done');
      })
      .catch(error => {
        setMessage(toDisplayError(error));
        setPhase('failed');
      });
  }, [search, isAuthenticated]);

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
            <h1 className="font-serif text-2xl font-bold text-ink">Adresiniz onaylanıyor…</h1>
          </>
        )}

        {phase === 'done' && (
          <>
            <CheckCircle2 size={36} className="mx-auto text-emerald-700" aria-hidden />
            <h1 className="font-serif text-2xl font-bold text-ink">E-posta adresiniz değişti</h1>
            <p className="text-sm text-muted leading-relaxed">
              Güvenliğiniz için bütün cihazlardaki oturumlar kapatıldı. Yeni adresiniz ve parolanızla giriş yapın.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="inline-flex items-center justify-center bg-brand hover:bg-brand-soft text-white px-6 py-3 rounded-full font-semibold text-sm transition duration-300 cursor-pointer"
            >
              Giriş Yap
            </button>
          </>
        )}

        {phase === 'failed' && (
          <>
            <MailX size={36} className="mx-auto text-rose-700" aria-hidden />
            <h1 className="font-serif text-2xl font-bold text-ink">Bağlantı kullanılamadı</h1>
            <p className="text-sm text-muted leading-relaxed">{message}</p>
            <Link
              to="/hesap/guvenlik"
              className="inline-flex items-center justify-center text-brand px-6 py-3 rounded-full font-semibold text-sm border border-brand/20 hover:border-brand/50 bg-white transition duration-300"
            >
              Hesap Ayarlarına Dön
            </Link>
          </>
        )}
      </motion.div>
    </section>
  );
}
