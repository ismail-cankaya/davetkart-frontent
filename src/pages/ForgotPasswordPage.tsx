import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MailCheck, Send } from 'lucide-react';
import { AuthShell, authInputClass } from '../components/auth/AuthShell';
import { authService } from '../services/auth';
import { toast } from '../components/ui/Toast';
import { toDisplayError } from '../utils/toDisplayError';
import { ForgotPasswordState } from '../types';

/**
 * Şifre sıfırlama bağlantısı isteme — Faz 10, FE 10.16 (`/sifremi-unuttum`).
 *
 * 🔴 "Gönderildi" ekranı adresin kayıtlı olup olmadığını SÖYLEMEZ. Backend her
 * adrese aynı 202'yi döner; burada "bu adrese ait bir hesap yok" demek,
 * backend'in sakladığı bilgiyi (kim üye?) arayüzden geri açardı. Metin bu
 * yüzden koşulludur: "kayıtlıysa … gönderdik".
 */
export default function ForgotPasswordPage() {
  const location = useLocation();

  // Giriş formunda yazılmış adres taşınır; kullanıcı yeniden yazmasın.
  const [email, setEmail] = useState((location.state as ForgotPasswordState | null)?.email ?? '');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await authService.requestPasswordReset(email);
      setSentTo(email.trim());
    } catch (e) {
      // Hız sınırı (429) ve biçimsiz adres buraya düşer. Kayıtlı olmayan
      // adres DÜŞMEZ: o da 202'dir.
      toast(toDisplayError(e), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={<>Şifrenizi mi <span className="italic text-champagne font-medium">Unuttunuz?</span></>}
      subtitle="Hesabınızın e-posta adresini yazın; şifrenizi yenilemeniz için bir bağlantı gönderelim."
      footer={
        <>
          Şifrenizi hatırladınız mı?{' '}
          <Link to="/login" className="text-champagne font-semibold hover:text-gold transition-colors">
            Giriş yapın
          </Link>
        </>
      }
    >
      {sentTo ? (
        <div role="status" className="space-y-5 text-center">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-300/20 text-emerald-200">
            <MailCheck size={22} />
          </span>
          <p className="text-sm text-emerald-50/90 leading-relaxed">
            <span className="font-semibold text-white break-all">{sentTo}</span> bir hesaba kayıtlıysa şifre
            sıfırlama bağlantısını gönderdik. Gelen kutunuzu ve istenmeyen e-posta klasörünü kontrol edin.
          </p>
          <p className="text-xs text-emerald-100/60 leading-relaxed">
            Bağlantı yalnızca bir kez ve sınırlı bir süre için geçerlidir.
          </p>
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="text-xs font-semibold text-champagne hover:text-gold transition-colors cursor-pointer"
          >
            Başka bir adres deneyin
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="forgot-email" className="block text-xs font-bold tracking-wider uppercase text-champagne">
              E-posta Adresi
            </label>
            <input
              id="forgot-email"
              type="email"
              required
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ornek@eposta.com"
              className={authInputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative overflow-hidden bg-champagne hover:bg-gold disabled:opacity-60 disabled:cursor-wait text-brand-deep font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            <Send size={15} />
            {isSubmitting ? 'Gönderiliyor…' : 'Sıfırlama Bağlantısı Gönder'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
