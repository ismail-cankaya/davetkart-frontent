import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, Link2Off } from 'lucide-react';
import { AuthShell, authInputClass } from '../components/auth/AuthShell';
import { authService } from '../services/auth';
import { apiErrorCode } from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';
import { signOut } from '../stores/sessionActions';
import { toast } from '../components/ui/Toast';
import { toDisplayError } from '../utils/toDisplayError';
import { ForgotPasswordState } from '../types';

/**
 * Yeni şifre belirleme — Faz 10, FE 10.16 (`/sifre-sifirla?token=…&email=…`).
 *
 * Kullanıcı buraya maildeki bağlantıyla gelir. Adresi backend kurar:
 * `config/davetkart.php` → `frontend.url` + `frontend.password_reset_path`.
 * 🔴 Bu rotanın yolu o değerle AYNI olmalı. Biri değişirse maildeki bağlantı
 * `*` rotasına düşer ve kullanıcı sessizce ana sayfaya atılır.
 *
 * Başarıda oturum AÇILMAZ (backend token vermez) ve o hesabın bütün oturumları
 * kapanır; kullanıcı yeni şifresiyle giriş yapar.
 */
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Sunucu bağlantıyı reddettiyse form bir daha işe yaramaz.
  const [rejected, setRejected] = useState(false);

  if (!token || !email || rejected) return <InvalidLink email={email} />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await authService.resetPassword({ token, email, password });

      // Bu cihazda aynı hesap açıksa onun token'ı da sunucuda silindi.
      // Başka bir hesap açıksa ona dokunulmaz.
      if (useAuthStore.getState().user?.email === email) {
        signOut({ revoke: false });
      }

      toast('Şifreniz yenilendi. Yeni şifrenizle giriş yapabilirsiniz.');
      navigate('/login', { replace: true });
    } catch (e) {
      // Tek kod, alan yok (backend H6): token yanlış mı, süresi mi dolmuş,
      // adres mi tutmuyor, ayrılmaz. Hepsinin çaresi aynı: yeni bağlantı.
      if (apiErrorCode(e) === 'PASSWORD_RESET_INVALID') {
        setRejected(true);
        return;
      }
      toast(toDisplayError(e), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={<>Yeni <span className="italic text-champagne font-medium">Şifrenizi</span> Belirleyin</>}
      subtitle="Hesabınız için yeni bir şifre seçin. Kaydettiğinizde açık olan bütün oturumlarınız kapanır."
      footer={
        <Link to="/login" className="text-champagne font-semibold hover:text-gold transition-colors">
          Giriş sayfasına dönün
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="reset-email" className="block text-xs font-bold tracking-wider uppercase text-champagne">
            Hesap
          </label>
          {/* Salt okunur: adres token'la birlikte gelir ve onunla eşleşmeli.
              `username` otomatik tamamlaması, şifre yöneticisinin yeni şifreyi
              doğru hesaba kaydetmesi için. */}
          <input
            id="reset-email"
            type="email"
            readOnly
            autoComplete="username"
            value={email}
            className={`${authInputClass} opacity-70 cursor-default`}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="reset-password" className="block text-xs font-bold tracking-wider uppercase text-champagne">
            Yeni Şifre
          </label>
          <input
            id="reset-password"
            type="password"
            required
            // Backend kuralı min:8 (kayıtla aynı).
            minLength={8}
            autoComplete="new-password"
            autoFocus
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="En az 8 karakter"
            className={authInputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full relative overflow-hidden bg-champagne hover:bg-gold disabled:opacity-60 disabled:cursor-wait text-brand-deep font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 cursor-pointer"
        >
          <KeyRound size={15} />
          {isSubmitting ? 'Kaydediliyor…' : 'Şifremi Yenile'}
        </button>
      </form>
    </AuthShell>
  );
}

/** Bağlantı eksik (`token`/`email` yok) ya da sunucu reddetti. */
function InvalidLink({ email }: { email: string }) {
  return (
    <AuthShell
      title={<>Bağlantı <span className="italic text-champagne font-medium">Geçersiz</span></>}
      subtitle="Bu şifre sıfırlama bağlantısı eksik, kullanılmış ya da süresi dolmuş."
      footer={
        <Link to="/login" className="text-champagne font-semibold hover:text-gold transition-colors">
          Giriş sayfasına dönün
        </Link>
      }
    >
      <div role="alert" className="space-y-5 text-center">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-400/10 border border-rose-300/20 text-rose-200">
          <Link2Off size={22} />
        </span>
        <p className="text-sm text-emerald-50/90 leading-relaxed">
          Her bağlantı yalnızca bir kez ve sınırlı bir süre için kullanılabilir. Yeni bir bağlantı isteyerek devam
          edebilirsiniz.
        </p>
        <Link
          to="/sifremi-unuttum"
          state={{ email } satisfies ForgotPasswordState}
          className="w-full bg-champagne hover:bg-gold text-brand-deep font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5"
        >
          Yeni Bağlantı İsteyin
        </Link>
      </div>
    </AuthShell>
  );
}
