import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, Minimize2 } from 'lucide-react';
import { StudioTopBar } from './StudioTopBar';
import { StudioSidebar, StudioMobileBar } from './StudioSidebar';
import { StudioCanvasArea } from './StudioCanvasArea';
import { GuestViewOverlay } from './GuestViewOverlay';
import { InlineTextEditor } from '../editor/text/InlineTextEditor';
import { SectionSettingsDrawer } from '../editor/sections/SectionSettingsDrawer';
import { PaywallModal } from '../payment/PaywallModal';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { useAuthStore } from '../../stores/useAuthStore';
import type { AuthRedirectState } from '../../types';
import { useCreateWizardStore } from '../../stores/useCreateWizardStore';
import { useSubscriptionStore } from '../../stores/useSubscriptionStore';
import { useStudioStore } from '../../stores/useStudioStore';
import { useInvitationAutoSave } from '../../hooks/useInvitationAutoSave';
import { useEditorShortcuts } from '../../hooks/useTextEditorBridge';
import { useMinWidth } from '../../hooks/useMinWidth';
import { invitationService } from '../../services/invitations';
import { toast, Toaster } from '../ui/Toast';
import { ConfirmHost } from '../ui/ConfirmDialog';
import { toDisplayError } from '../../utils/toDisplayError';
import { duration, ease } from '../../utils/motion';
import '../../i18nEditor';

/**
 * Tasarım Stüdyosu (Faz 28, K318–K322): ayrı, tam ekran editör. Solda menü, ortada tuval, sağda bölüm ayarları
 * (geniş ekranda sütun, dar ekranda katman), telefonda alt çubuk. `/studio/:id` kaydı sunucudan yükler; `/studio`
 * oturumsuz tasarımcının yerel taslağıdır. Ayrıntı: docs/rehber/src/pages/StudioPage.md
 */
export default function StudioWorkspace() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recordId = useInvitationStore((s) => s.recordId);
  const focusMode = useStudioStore((s) => s.focusMode);
  const docked = useMinWidth(1440);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  useInvitationAutoSave();
  useEditorShortcuts();

  // Plan duvarı bu sayfaya aittir (Faz 10 deseni): girişte ve çıkışta kapanır; tam ekran kipi de çıkışta biter.
  useEffect(() => {
    useSubscriptionStore.getState().closePaywall();
    document.title = t('textEditor.studio.title');
    return () => {
      useSubscriptionStore.getState().closePaywall();
      useStudioStore.getState().setFocusMode(false);
      useStudioStore.getState().setGuestView(false);
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    };
  }, [t]);

  // K192 deseni: kayıt açılınca kimlik adrese yazılır; yenileme aynı davetiyeye döner.
  useEffect(() => {
    if (!id && recordId) navigate(`/studio/${recordId}`, { replace: true });
  }, [id, recordId, navigate]);

  // `/studio/:id` başka bir belge açıkken (ya da yenilemeden sonra) kaydı yükler; sahiplik sunucuda (H7).
  useEffect(() => {
    if (!id || !isAuthenticated || useInvitationStore.getState().recordId === id) return;
    let cancelled = false;
    invitationService
      .get(id)
      .then((record) => {
        if (cancelled) return;
        useInvitationStore.getState().loadRecord(record);
        useCreateWizardStore.getState().resumeEditor(record.invitation.categoryId || 'dugun');
      })
      .catch((error) => {
        if (cancelled) return;
        toast(toDisplayError(error), 'error');
        navigate('/dashboard', { replace: true });
      });
    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated, navigate]);

  // Kayıtlı davetiye oturum ister (ProtectedRoute ile aynı sözleşme; rota tek: `/studio/:id?`).
  if (id && !isAuthenticated) {
    const state: AuthRedirectState = { from: location.pathname + location.search };
    return <Navigate to="/login" replace state={state} />;
  }

  if (id && recordId !== id) {
    return (
      <div className="grid h-dvh place-items-center bg-brand-deep">
        <Loader2 size={28} className="animate-spin text-champagne" aria-hidden />
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-brand-deep">
      <AnimatePresence initial={false}>
        {!focusMode && (
          <motion.div key="top" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: duration.base, ease: ease.out }}>
            <StudioTopBar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-0 flex-1">
        {!focusMode && <StudioSidebar />}
        <StudioCanvasArea />
        {!focusMode && docked && <SectionSettingsDrawer docked />}
      </div>

      {!focusMode && <StudioMobileBar />}

      {focusMode && (
        <button
          type="button"
          onClick={() => {
            useStudioStore.getState().setFocusMode(false);
            if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
          }}
          className="fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-full bg-brand-deep/90 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur hover:bg-brand-deep cursor-pointer"
        >
          <Minimize2 size={14} />
          {t('textEditor.studio.focus.exit')}
          <span className="text-white/50">· {t('textEditor.studio.focus.hint')}</span>
        </button>
      )}

      {(!docked || focusMode) && <SectionSettingsDrawer />}
      <InlineTextEditor />
      <GuestViewOverlay />
      <PaywallModal />
      {/* Site çerçevesinin dışında: bildirim ve onay kapları burada da gerekir. */}
      <Toaster />
      <ConfirmHost />
    </div>
  );
}
