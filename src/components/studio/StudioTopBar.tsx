import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronLeft, CloudOff, CloudUpload, Loader2, Redo2, Rocket, ScanEye, TriangleAlert, Undo2 } from 'lucide-react';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useStudioStore } from '../../stores/useStudioStore';
import { usePublishFlow } from '../../hooks/usePublishFlow';
import { useDiscardChanges } from '../../hooks/useDiscardChanges';
import { useReadiness } from './StudioChecklist';
import { displayNames } from '../../utils/names';
import type { AuthRedirectState } from '../../types';
import { cn } from '../../utils/cn';
import '../../i18nEditor';

/** Kayıt durumu: buluta kaydediliyor / kaydedildi / hata / bu cihazda (oturumsuz). */
function SaveStatus() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const saveState = useInvitationStore((s) => s.saveState);
  const pending = useInvitationStore((s) => s.recordStatus === 'published' && s.hasPendingChanges);

  if (!isAuthenticated) return <span className="text-[11px] text-white/50">{t('textEditor.studio.save.local')}</span>;
  const state =
    saveState === 'saving'
      ? { icon: <CloudUpload size={13} className="animate-pulse" />, text: t('textEditor.studio.save.saving') }
      : saveState === 'error' || saveState === 'rejected'
        ? { icon: <CloudOff size={13} className="text-amber-300" />, text: t('textEditor.studio.save.error') }
        : { icon: <CheckCircle2 size={13} className="text-emerald-400" />, text: t('textEditor.studio.save.saved') };
  return (
    <span data-save-state={saveState} className="inline-flex items-center gap-1.5 text-[11px] text-white/60">
      {state.icon}
      {state.text}
      {pending && <span className="ml-1 rounded-full bg-gold/20 px-2 py-0.5 font-semibold text-champagne">{t('textEditor.studio.save.pending')}</span>}
    </span>
  );
}

/**
 * Stüdyonun üst çubuğu (Faz 28, K319, K323, K325). Tam ekranda düzenlerken gizlenir.
 * Ayrıntı: docs/rehber/src/components/studio/StudioTopBar.md
 */
export function StudioTopBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const names = useInvitationStore((s) => displayNames(s.invitation.names));
  const isLive = useInvitationStore((s) => s.recordStatus === 'published');
  const hasPending = useInvitationStore((s) => s.hasPendingChanges);
  const canUndo = useEditorStore((s) => s.history.past.length > 0);
  const canRedo = useEditorStore((s) => s.history.future.length > 0);
  const overflowCount = useStudioStore((s) => s.overflowCount);
  const { done, total } = useReadiness();
  const { isPublishing, attemptPublish } = usePublishFlow();
  const discard = useDiscardChanges();

  const publish = () => {
    if (!isAuthenticated) {
      const state: AuthRedirectState = { from: location.pathname };
      navigate('/login', { state });
      return;
    }
    void attemptPublish();
  };

  const icon = 'grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default';

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/10 bg-brand-deep px-2 text-white sm:px-3">
      <Link to={isAuthenticated ? '/dashboard' : '/'} className={icon} aria-label={isAuthenticated ? t('textEditor.studio.back') : t('textEditor.studio.backHome')}>
        <ChevronLeft size={20} />
      </Link>
      <div className="min-w-0 flex-1 sm:flex-none">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">{t('textEditor.studio.title')}</p>
        <p className="truncate font-serif text-sm font-bold leading-tight sm:max-w-[220px]">{names || t('textEditor.studio.untitled')}</p>
      </div>
      <div className="hidden md:block pl-3">
        <SaveStatus />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          onClick={() => useStudioStore.getState().setTab('checklist', true)}
          className={cn(
            'hidden sm:inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold cursor-pointer',
            done === total ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gold/15 text-champagne'
          )}
        >
          <CheckCircle2 size={13} />
          {t('textEditor.studio.ready.chip', { done, total })}
        </button>
        {overflowCount > 0 && (
          <button
            type="button"
            onClick={() => useStudioStore.getState().setTab('checklist', true)}
            className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-full bg-rose-500/15 px-3 text-[11px] font-semibold text-rose-200 cursor-pointer"
          >
            <TriangleAlert size={13} />
            {t('textEditor.studio.overflow.chip', { count: overflowCount })}
          </button>
        )}
        <span className="mx-1 hidden h-5 w-px bg-white/15 sm:block" aria-hidden />
        <button type="button" className={icon} onClick={() => useEditorStore.getState().undo()} disabled={!canUndo} aria-label={t('textEditor.studio.undo')} title={t('textEditor.studio.undo')}>
          <Undo2 size={17} />
        </button>
        <button type="button" className={icon} onClick={() => useEditorStore.getState().redo()} disabled={!canRedo} aria-label={t('textEditor.studio.redo')} title={t('textEditor.studio.redo')}>
          <Redo2 size={17} />
        </button>
        <button
          type="button"
          onClick={() => useStudioStore.getState().setGuestView(true)}
          className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-3.5 text-xs font-semibold text-white/85 hover:bg-white/10 cursor-pointer"
        >
          <ScanEye size={15} />
          {t('textEditor.studio.guest.open')}
        </button>
        {isLive && hasPending && (
          <button type="button" onClick={() => void discard()} className="hidden sm:inline-flex h-9 items-center rounded-full px-3 text-xs font-semibold text-white/60 hover:text-rose-200 cursor-pointer">
            {t('textEditor.publish.discard')}
          </button>
        )}
        <motion.button
          type="button"
          onClick={publish}
          disabled={isPublishing || (isLive && !hasPending)}
          whileTap={{ scale: 0.97 }}
          className="relative inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-full bg-champagne px-4 text-xs font-bold text-brand-deep shadow-lg shadow-black/20 hover:bg-white disabled:opacity-50 cursor-pointer disabled:cursor-default"
        >
          {isPublishing ? <Loader2 size={15} className="animate-spin" /> : <Rocket size={15} />}
          {isPublishing ? t('textEditor.studio.publish.publishing') : isLive ? t('textEditor.publish.changes') : t('textEditor.studio.publish.first')}
        </motion.button>
      </div>
    </header>
  );
}
