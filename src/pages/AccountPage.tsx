import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertTriangle, KeyRound, Mail, Trash2, UserRound } from 'lucide-react';
import { authService } from '../services/auth';
import { useAuthStore } from '../stores/useAuthStore';
import { signOut } from '../stores/sessionActions';
import { toast } from '../components/ui/Toast';
import { toDisplayError, toFieldErrors } from '../utils/toDisplayError';
import { fullName } from '../utils/user';
import { ForgotPasswordState } from '../types';
import { duration, ease } from '../utils/motion';

/**
 * Hesap sayfası — Faz 10, FE 10.17 (plandaki 10.46). `/hesap`, oturum ister.
 *
 * Şimdilik iki iş: hesap bilgisini göstermek ve hesabı silmek (KVKK: kişinin
 * verisini silme hakkı; Faz 9'a kadar bunun bir yolu yoktu).
 *
 * 🔴 Silme geri alınamaz ve backend parola ister (`current_password`). Açık
 * kalmış bir oturumu bulan biri hesabı silemesin diye; tarayıcının onay
 * penceresi bu korumayı vermez.
 */
export default function AccountPage() {
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();

  // "Hesabımı Sil" önce yalnızca formu açar; silme ikinci adımda, parolayla.
  const [isConfirming, setIsConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDeleting) return;
    setIsDeleting(true);
    setPasswordError(null);
    try {
      await authService.deleteAccount(password);

      // Önce yönlendir: oturum önce düşseydi ProtectedRoute bu sayfayı
      // `/login`'e çevirebilir ve kullanıcı silinmiş hesabına "giriş yap"
      // ekranı görürdü.
      navigate('/', { replace: true });
      // Token sunucuda silindi: iptal isteği gönderilmez. Bellekteki tasarım
      // ve LCV listesi de gider (silinmiş hesabın verisi sekmede kalmamalı).
      signOut({ revoke: false });
      toast('Hesabınız ve bütün davetiyeleriniz silindi.');
    } catch (error) {
      // Yanlış parola alanın altında gösterilir; hız sınırı (429) ve
      // beklenmeyen hatalar toast olur.
      const fieldError = toFieldErrors(error).password;
      if (fieldError) {
        setPasswordError(fieldError);
      } else {
        toast(toDisplayError(error), 'error');
      }
      setIsDeleting(false);
    }
  };

  const cancel = () => {
    setIsConfirming(false);
    setPassword('');
    setPasswordError(null);
  };

  return (
    <section className="flex-grow bg-cream px-4 py-14 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.panel, ease: ease.out }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <header>
          <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Hesabım
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink">
            Hesap <span className="italic text-brand font-medium">Ayarları</span>
          </h1>
        </header>

        {/* Hesap bilgisi */}
        <div className="rounded-[1.5rem] bg-white border border-ink/[0.06] shadow-sm p-6 md:p-8 space-y-5">
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <UserRound size={16} aria-hidden className="text-brand shrink-0" />
              <span className="sr-only">Ad Soyad:</span>
              <span className="text-ink font-medium">{user ? fullName(user) : ''}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} aria-hidden className="text-brand shrink-0" />
              <span className="sr-only">E-posta adresi:</span>
              <span className="text-ink break-all">{user?.email}</span>
            </li>
          </ul>

          {/* Şifre değiştirme ucu yok; sıfırlama bağlantısı aynı işi görür. */}
          <Link
            to="/sifremi-unuttum"
            state={{ email: user?.email } satisfies ForgotPasswordState}
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand hover:text-brand-soft transition-colors"
          >
            <KeyRound size={14} />
            Şifremi değiştirmek istiyorum
          </Link>
        </div>

        {/* Hesabı silme */}
        <div className="rounded-[1.5rem] bg-white border border-rose-200/70 shadow-sm p-6 md:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 shrink-0 rounded-xl border bg-rose-50 text-rose-700 border-rose-200/70 flex items-center justify-center">
              <AlertTriangle size={18} />
            </span>
            <div className="space-y-1">
              <h2 className="font-serif text-xl font-bold text-ink">Hesabımı sil</h2>
              <p className="text-sm text-muted leading-relaxed">Bu işlem geri alınamaz.</p>
            </div>
          </div>

          <ul className="text-sm text-muted leading-relaxed space-y-1.5 list-disc pl-5">
            <li>Yayındakiler dahil bütün davetiyeleriniz silinir; paylaştığınız bağlantılar çalışmaz.</li>
            <li>Misafirlerinizin katılım yanıtları, yüklediği fotoğraf ve videolar, galeriniz silinir.</li>
            <li>Bütün cihazlardaki oturumlarınız kapanır.</li>
            <li>
              Satın aldığınız plan hakları hesabınızla birlikte sona erer. Ödeme kayıtları yasal yükümlülük
              gereği, sizinle bağı kaldırılarak saklanır.
            </li>
          </ul>

          {isConfirming ? (
            <form onSubmit={handleDelete} className="space-y-4 pt-1">
              <div className="space-y-2">
                <label htmlFor="delete-password" className="block text-xs font-bold tracking-wider uppercase text-ink">
                  Onaylamak için şifreniz
                </label>
                <input
                  id="delete-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  autoFocus
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  aria-invalid={passwordError !== null}
                  aria-describedby={passwordError ? 'delete-password-error' : undefined}
                  className="w-full bg-white border border-ink/15 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:outline-none rounded-xl px-4 py-3 text-sm text-ink transition duration-300"
                />
                {passwordError && (
                  <p id="delete-password-error" role="alert" className="text-xs text-rose-700">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 disabled:cursor-wait text-white px-6 py-3 rounded-full font-semibold text-sm transition duration-300 cursor-pointer"
                >
                  <Trash2 size={15} />
                  {isDeleting ? 'Siliniyor…' : 'Hesabımı Kalıcı Olarak Sil'}
                </button>
                <button
                  type="button"
                  onClick={cancel}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm text-ink border border-ink/15 hover:border-ink/30 bg-white transition duration-300 cursor-pointer"
                >
                  Vazgeç
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirming(true)}
              className="inline-flex items-center justify-center gap-2 text-rose-700 px-6 py-3 rounded-full font-semibold text-sm border border-rose-200 hover:border-rose-400 bg-white transition duration-300 cursor-pointer"
            >
              <Trash2 size={15} />
              Hesabımı Sil
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
}
