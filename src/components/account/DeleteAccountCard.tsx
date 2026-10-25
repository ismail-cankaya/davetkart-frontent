import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { authService } from '../../services/auth';
import { signOut } from '../../stores/sessionActions';
import { useAccountStore } from '../../stores/useAccountStore';
import { toast } from '../ui/Toast';
import { toDisplayError, toFieldErrors } from '../../utils/toDisplayError';
import { TIER_LABEL } from '../../utils/accountLabels';
import { AccountCard } from './AccountCard';

/**
 * Hesabı sil (Faz 10, FE 10.17'den taşındı; Faz 14'te hak sayısı eklendi).
 *
 * 🔴 Silme geri alınamaz ve backend parola ister (`current_password`). Açık
 * kalmış bir oturumu bulan biri hesabı silemesin diye.
 *
 * Faz 14: kullanılmamış haklar SAYIYLA söylenir ("1 Gold hakkınız"). "Plan
 * haklarınız sona erer" cümlesi parası ödenmiş bir şeyin kaybını soyut
 * bırakıyordu; sayı, kullanıcıya önce iptal etmeyi düşündürür.
 */
export function DeleteAccountCard() {
  const navigate = useNavigate();
  const entitlements = useAccountStore(s => s.entitlements);

  const [isConfirming, setIsConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const unused = (entitlements?.tiers ?? []).filter(tier => tier.available > 0);
  const pendingRefunds = (entitlements?.tiers ?? []).reduce((sum, tier) => sum + tier.refundRequested, 0);

  const handleDelete = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isDeleting) return;
    setIsDeleting(true);
    setPasswordError(null);
    try {
      await authService.deleteAccount(password);

      // Önce yönlendir: oturum önce düşseydi ProtectedRoute bu sayfayı
      // `/login`'e çevirebilir ve kullanıcı silinmiş hesabına "giriş yap"
      // ekranı görürdü.
      navigate('/', { replace: true });
      signOut({ revoke: false });
      toast('Hesabınız ve bütün davetiyeleriniz silindi.');
    } catch (error) {
      const fieldError = toFieldErrors(error).password;
      if (fieldError) setPasswordError(fieldError);
      else toast(toDisplayError(error), 'error');
      setIsDeleting(false);
    }
  };

  const cancel = () => {
    setIsConfirming(false);
    setPassword('');
    setPasswordError(null);
  };

  return (
    <AccountCard icon={AlertTriangle} title="Hesabımı sil" description="Bu işlem geri alınamaz." tone="danger">
      {unused.length > 0 && (
        <div role="note" className="rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 px-5 py-4 text-sm leading-relaxed">
          Kullanılmamış{' '}
          <strong>{unused.map(tier => `${tier.available} ${TIER_LABEL[tier.tier]}`).join(', ')}</strong>{' '}
          hakkınız hesabınızla birlikte silinecek. Ödemeden itibaren 14 gün içindeyse önce “Planlarım”dan iptal edip
          iade isteyebilirsiniz.
        </div>
      )}
      {pendingRefunds > 0 && (
        <p className="text-sm text-muted">
          Bekleyen iptal talebiniz hesabınız silinse de incelenir; sonuç kayıtlı adresinize gönderilemeyebilir.
        </p>
      )}

      <ul className="text-sm text-muted leading-relaxed space-y-1.5 list-disc pl-5">
        <li>Yayındakiler dahil bütün davetiyeleriniz silinir; paylaştığınız bağlantılar çalışmaz.</li>
        <li>Misafirlerinizin katılım yanıtları, yüklediği fotoğraf ve videolar, galeriniz silinir.</li>
        <li>Bütün cihazlardaki oturumlarınız kapanır.</li>
        <li>
          Satın aldığınız plan hakları hesabınızla birlikte sona erer. Ödeme kayıtları yasal yükümlülük gereği,
          sizinle bağı kaldırılarak saklanır.
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
              onChange={event => setPassword(event.target.value)}
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
    </AccountCard>
  );
}
