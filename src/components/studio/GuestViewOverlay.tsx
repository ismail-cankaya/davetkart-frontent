import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { RotateCcw, X } from 'lucide-react';
import { DeviceCanvas } from './canvas/DeviceCanvas';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { useStudioStore } from '../../stores/useStudioStore';
import { duration, ease } from '../../utils/motion';
import '../../i18nEditor';

/**
 * Misafir gözüyle (Faz 28, K325): editör çerçevesi ve seçici olmadan, canlı kipte (zarf ve giriş baştan).
 * Ayrıntı: docs/rehber/src/components/studio/GuestViewOverlay.md
 */
export function GuestViewOverlay() {
  const open = useStudioStore((s) => s.guestView);
  return createPortal(<AnimatePresence>{open && <Overlay />}</AnimatePresence>, document.body);
}

function Overlay() {
  const { t } = useTranslation();
  const invitation = useInvitationStore((s) => s.invitation);
  const presetId = useInvitationStore((s) => s.activePresetId);
  const device = useStudioStore((s) => s.device);
  const close = () => useStudioStore.getState().setGuestView(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t('textEditor.studio.guest.title')}
      className="fixed inset-0 z-[90] flex flex-col bg-[#0d1512]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration.base, ease: ease.out }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-champagne">{t('textEditor.studio.guest.title')}</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setRun((n) => n + 1)} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-2 text-xs font-semibold hover:bg-white/10 cursor-pointer">
            <RotateCcw size={14} />
            {t('textEditor.studio.guest.replay')}
          </button>
          <button type="button" onClick={close} autoFocus className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-brand-deep hover:bg-champagne cursor-pointer">
            <X size={14} />
            {t('textEditor.studio.guest.close')}
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <DeviceCanvas key={run} device={device} zoom="fit" title={t('textEditor.studio.guest.title')}>
          {() => <TemplateRenderer templateId={presetId} invitation={invitation} mode="live" />}
        </DeviceCanvas>
      </div>
    </motion.div>
  );
}
