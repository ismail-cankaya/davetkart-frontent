import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { AuthShell, authInputClass } from '../components/auth/AuthShell';
import { useAuthStore } from '../stores/useAuthStore';
import { toast } from '../components/ui/Toast';
import { fullName } from '../utils/user';
import { AuthRedirectState } from '../types';

/** Sign-in page; on success the visitor returns to where they left off. */
export default function LoginPage() {
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Where to go after auth: back to the interrupted flow (e.g. /create),
  // or the dashboard when the visit started here.
  const redirectTo = (location.state as AuthRedirectState | null)?.from ?? '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const user = await login({ email, password });
      toast(`Tekrar hoş geldiniz, ${fullName(user)}!`);
      navigate(redirectTo, { replace: true });
    } catch {
      toast('Giriş yapılamadı. Bilgilerinizi kontrol edip tekrar deneyin.', 'info');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={<>Tekrar <span className="italic text-champagne font-medium">Hoş Geldiniz</span></>}
      subtitle="Hesabınıza giriş yaparak davetiyelerinizi yayınlayın ve katılım yanıtlarını takip edin."
      footer={
        <>
          Hesabınız yok mu?{' '}
          <Link
            to="/register"
            state={{ from: redirectTo } satisfies AuthRedirectState}
            className="text-champagne font-semibold hover:text-gold transition-colors"
          >
            Kayıt olun
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="login-email" className="block text-xs font-bold tracking-wider uppercase text-champagne">
            E-posta Adresi
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="ornek@eposta.com"
            className={authInputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="block text-xs font-bold tracking-wider uppercase text-champagne">
            Şifre
          </label>
          <input
            id="login-password"
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className={authInputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full relative overflow-hidden bg-champagne hover:bg-gold disabled:opacity-60 disabled:cursor-wait text-brand-deep font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
        >
          <LogIn size={15} />
          {isSubmitting ? 'Giriş yapılıyor…' : 'Giriş Yap'}
        </button>
      </form>
    </AuthShell>
  );
}
