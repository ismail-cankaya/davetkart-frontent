import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CloudOff, CloudUpload, CheckCircle2, Loader2, PenLine, Rocket, ShieldCheck } from 'lucide-react';
import { DesignerPanel } from '../editor/DesignerPanel';
import { DeviceSimulator } from '../preview/DeviceSimulator';
import { PaywallModal } from '../payment/PaywallModal';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCreateWizardStore } from '../../stores/useCreateWizardStore';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { getRequiredTier, useSubscriptionStore } from '../../stores/useSubscriptionStore';
import { toast } from '../ui/Toast';
import { AuthRedirectState, isSubscriptionTier } from '../../types';
import { apiErrorCode, apiErrorParams } from '../../services/api';
import { toDisplayError } from '../../utils/toDisplayError';
import { scrollToTarget } from '../../hooks/useLenis';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

/**
 * Wizard step 4 — the final workspace: detailed designer panel on the left,
 * live phone preview on the right, publish/edit actions at the bottom.
 *
 * Anonymous designers are welcome — the invitation lives in
 * useInvitationStore (persisted through the persistence service), so sending
 * the user through /login loses nothing: after authentication they land right
 * back here with the design intact.
 */
export function EditorWorkspace() {
  const backToBuild = useCreateWizardStore(s => s.backToBuild);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const saveState = useInvitationStore(s => s.saveState);
  const publishInvitation = useInvitationStore(s => s.publishInvitation);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // The phone sits below the panel on mobile; the ref lets flows scroll to it.
  const phoneRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToTarget(0, { immediate: true });
  }, []);

  /**
   * Yayınlamayı dener ve sunucunun kararına göre ilerler.
   *
   * 🔴 Ön kontrol YOK. Eskiden frontend, oturum içinde tutulan bir
   * `activeTier` mock'una bakıp paywall'ı atlıyordu; yani yetki kararını
   * kendisi veriyordu. Tek doğruluk kaynağı sunucudur (`orders` tablosu) —
   * deneriz, 402 gelirse paywall'ı sunucunun bildirdiği planla açarız.
   */
  const attemptPublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);

    try {
      await publishInvitation();
      toast('Davetiyeniz yayınlandı! Katılım yanıtlarını panelinizden takip edebilirsiniz. 🎉');
      navigate('/dashboard');
      return;
    } catch (error) {
      const code = apiErrorCode(error);

      // 🔴 İki 402, iki ayrı ekran. "Önce bir plan al" ile "planını yükselt"
      // aynı şey değildir; ayrım `code`'dadır, durum kodunda değil.
      if (code === 'PAYMENT_REQUIRED' || code === 'PAYWALL_TIER_INSUFFICIENT') {
        const { invitation, recordId } = useInvitationStore.getState();

        // Gereken planı SUNUCU bildirir. `getRequiredTier()` yalnızca yanıtın
        // taşımadığı bir durumda yedek olarak kullanılır.
        const serverTier = apiErrorParams(error).requiredTier;
        const requiredTier = isSubscriptionTier(serverTier)
          ? serverTier
          : getRequiredTier(invitation);

        useSubscriptionStore.getState().openPaywall({
          requiredTier,
          reason: code === 'PAYMENT_REQUIRED' ? 'purchase' : 'upgrade',
          invitationId: recordId
        });
        return;
      }

      // Zaten yayındaysa kullanıcı hedefine ulaşmış demektir; hata gibi
      // göstermek onu bir kez daha denemeye iterdi.
      if (code === 'INVITATION_ALREADY_PUBLISHED') {
        toast('Bu davetiye zaten yayında.', 'info');
        navigate('/dashboard');
        return;
      }

      toast(toDisplayError(error), 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublish = () => {
    if (!isAuthenticated) {
      const state: AuthRedirectState = { from: location.pathname };
      toast('Tasarımınız güvende! Yayınlamak için giriş yapmanız yeterli.', 'info');
      navigate('/login', { state });
      return;
    }

    void attemptPublish();
  };

  const handleBackToEdit = () => {
    backToBuild();
    scrollToTarget(0, { immediate: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: EASE_LUXE }}
      className="bg-cream"
    >
      <section className="pt-10 md:pt-16 pb-6 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_LUXE }}
            className="text-center mb-8 md:mb-12"
          >
            <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block">
              Adım 3 / 3 — Tasarım Stüdyosu
            </span>
            <h1 className="font-serif text-2xl md:text-4xl font-bold text-ink mt-4">
              Davetiyeniz hazır — <span className="italic text-brand font-medium">son dokunuşlar sizde</span>
            </h1>
            <p className="text-muted text-sm mt-3 max-w-xl mx-auto">
              <span className="lg:hidden">
                Üstteki cihaz önizlemesinde sonucu izleyin, aşağıdaki panelden ince ayarları yapın.
              </span>
              <span className="hidden lg:inline">
                Soldaki panelden ince ayarları yapın, sağdaki cihaz önizlemesinde gerçek zamanlı sonucu izleyin.
              </span>
            </p>
          </motion.div>

          {/* Mobile: simulator first (see the result, scroll down to edit).
              Desktop: panel left, simulator right. */}
          <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-14 items-center lg:items-start justify-center">
            <DesignerPanel />
            <DeviceSimulator simulatorRef={phoneRef} />
          </div>
        </div>
      </section>

      {/* Action bar */}
      <section className="pb-16 md:pb-24 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.3 }}
          className="max-w-3xl mx-auto px-4 text-center space-y-5"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
            {/* Yayınlama artık gerçek bir ağ turudur (kaydet → yayınla):
                düğme hem geri bildirim vermeli hem de ikinci kez basılmamalı. */}
            <motion.button
              onClick={handlePublish}
              disabled={isPublishing}
              whileHover={isPublishing ? undefined : { y: -4 }}
              whileTap={isPublishing ? undefined : { scale: 0.98 }}
              className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 bg-brand text-white px-10 py-4.5 rounded-full font-semibold text-sm hover:bg-brand-soft transition-colors duration-500 shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
            >
              {!isPublishing && <span className="absolute inset-0 animate-shimmer pointer-events-none" />}
              {isPublishing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Yayınlanıyor…
                </>
              ) : (
                <>
                  <Rocket size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
                  Tasarımını Yayınla
                </>
              )}
            </motion.button>

            <motion.button
              onClick={handleBackToEdit}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2.5 bg-white text-brand border border-brand/20 hover:border-brand/50 px-10 py-4.5 rounded-full font-semibold text-sm shadow-sm hover:shadow-lg hover:shadow-ink/10 transition-all duration-500 cursor-pointer"
            >
              <PenLine size={15} />
              Tasarımını Düzenle
            </motion.button>
          </div>

          {/* Cloud auto-save status for members; anonymous designers get the
              reassurance line (their draft persists after signing in). */}
          <p className="text-muted text-[11px] flex items-center justify-center gap-1.5">
            {!isAuthenticated ? (
              <>
                <ShieldCheck size={13} className="text-brand" />
                Giriş yapmadan tasarlayabilirsiniz — yayınlamak için giriş yaptığınızda tasarımınız hesabınıza kaydedilir.
              </>
            ) : saveState === 'saving' ? (
              <>
                <CloudUpload size={13} className="text-brand animate-pulse" />
                Değişiklikleriniz buluta kaydediliyor…
              </>
            ) : saveState === 'error' ? (
              <>
                <CloudOff size={13} className="text-amber-600" />
                Kaydedilemedi — bağlantınızı kontrol edin, bir sonraki değişiklikte yeniden denenir.
              </>
            ) : saveState === 'saved' ? (
              <>
                <CheckCircle2 size={13} className="text-emerald-600" />
                Tüm değişiklikler hesabınıza kaydedildi.
              </>
            ) : (
              <>
                <ShieldCheck size={13} className="text-brand" />
                Değişiklikleriniz otomatik olarak hesabınıza kaydedilir.
              </>
            )}
          </p>
        </motion.div>
      </section>

      <PaywallModal />
    </motion.div>
  );
}
