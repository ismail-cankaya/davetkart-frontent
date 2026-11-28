import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, Loader2, QrCode as QrIcon, X } from 'lucide-react';
import { previewLinkService, type PreviewLink } from '../../services/previewLink';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { toast } from '../ui/Toast';
import { toDisplayError } from '../../utils/toDisplayError';
import { duration, ease } from '../../utils/motion';
import '../../i18nEditor';

const QrCode = lazy(() => import('./QrCode'));

/**
 * "Telefonda aç" (Faz 29.4, K328): sunucudan 24 saatlik imzalı önizleme bağlantısı alır, QR kodla gösterir. Bağlantı
 * yayınlanmamış değişiklikleri de gösterir; taslak davetiyede de çalışır. Ayrıntı: docs/rehber/src/components/share/PhoneLinkButton.md
 */
export function PhoneLinkButton({ invitationId, className }: { invitationId: string; className?: string }) {
  const { t } = useTranslation();
  const [link, setLink] = useState<PreviewLink | null>(null);
  const [busy, setBusy] = useState(false);

  const open = async () => {
    if (busy) return;
    setBusy(true);
    try {
      setLink(await previewLinkService.create(invitationId));
    } catch (error) {
      toast(`${t('textEditor.phone.failed')} ${toDisplayError(error)}`, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => void open()} disabled={busy} className={className}>
        {busy ? <Loader2 size={15} className="animate-spin" /> : <QrIcon size={15} />}
        <span>{t('textEditor.phone.button')}</span>
      </button>
      {createPortal(<AnimatePresence>{link && <PhoneLinkCard key="phone" link={link} onClose={() => setLink(null)} />}</AnimatePresence>, document.body)}
    </>
  );
}

function PhoneLinkCard({ link, onClose }: { link: PreviewLink; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const until = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(link.expiresAt));
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast(t('textEditor.share.copyFailed'), 'info');
    }
  };

  return (
    <>
      <motion.div className="fixed inset-0 z-[95] bg-ink/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={t('textEditor.phone.title')}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: duration.base, ease: ease.out }}
        className="fixed left-1/2 top-1/2 z-[96] w-[min(92vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-cream p-5 text-ink shadow-2xl shadow-ink/30"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">{t('textEditor.phone.button')}</p>
            <p className="mt-0.5 font-serif text-lg font-bold">{t('textEditor.phone.title')}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t('textEditor.share.close')} className="rounded-full p-1.5 text-muted hover:bg-ink/5 hover:text-ink cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 flex justify-center">
          <Suspense fallback={<div className="h-[200px] w-[200px] animate-pulse rounded-2xl bg-white" />}>
            <QrCode value={link.url} size={200} label={t('textEditor.share.qrLabel')} />
          </Suspense>
        </div>
        <p className="mt-3 text-center text-[12px] text-ink/80">{t('textEditor.phone.hint')}</p>
        <p className="mt-2 text-center text-[11px] text-muted">{t('textEditor.phone.expires', { time: until })}</p>
        <button
          type="button"
          onClick={() => void copy()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-semibold hover:border-brand/40 hover:text-brand cursor-pointer"
        >
          {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
          {copied ? t('textEditor.share.copied') : t('textEditor.phone.copy')}
        </button>
      </motion.div>
    </>
  );
}
