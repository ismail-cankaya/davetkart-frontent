import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, MessageCircle, Share2, X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { toast } from '../ui/Toast';
import { duration, ease } from '../../utils/motion';
import '../../i18nEditor';

const QrCode = lazy(() => import('./QrCode'));

/** Telefonda (dokunmatik + Web Share) cihazın kendi paylaşım menüsü kullanılır (K327). */
function nativeShareAvailable(): boolean {
  return typeof navigator.share === 'function' && window.matchMedia?.('(pointer: coarse)').matches === true;
}

/**
 * Paylaş (Faz 29, K327): telefonda `navigator.share`; masaüstünde pencere: bağlantıyı kopyala, WhatsApp, QR kod.
 * `useShare()` döndürdüğü işlevle açılır. Ayrıntı: docs/rehber/src/components/share/ShareDialog.md
 */
export function useShare(): { share: (url: string, title: string) => void; dialog: React.ReactNode } {
  const [target, setTarget] = useState<{ url: string; title: string } | null>(null);
  const share = (url: string, title: string) => {
    if (nativeShareAvailable()) {
      navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    setTarget({ url, title });
  };
  const dialog = createPortal(
    <AnimatePresence>{target && <ShareCard key="share" url={target.url} title={target.title} onClose={() => setTarget(null)} />}</AnimatePresence>,
    document.body
  );
  return { share, dialog };
}

function ShareCard({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast(t('textEditor.share.copyFailed'), 'info');
    }
  };

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(t('textEditor.share.message', { url }))}`;
  const action = 'flex w-full items-center gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink hover:border-brand/40 hover:text-brand transition-colors cursor-pointer';

  return (
    <>
      <motion.div className="fixed inset-0 z-[95] bg-ink/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={t('textEditor.share.title')}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: duration.base, ease: ease.out }}
        className="fixed left-1/2 top-1/2 z-[96] w-[min(92vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-cream p-5 shadow-2xl shadow-ink/30"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">{t('textEditor.share.title')}</p>
            <p className="mt-0.5 truncate font-serif text-lg font-bold text-ink">{title}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t('textEditor.share.close')} className="rounded-full p-1.5 text-muted hover:bg-ink/5 hover:text-ink cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          <Suspense fallback={<div className="h-[184px] w-[184px] animate-pulse rounded-2xl bg-white" />}>
            <QrCode value={url} label={t('textEditor.share.qrLabel')} />
          </Suspense>
          <p className="text-[11px] text-muted">{t('textEditor.share.qr')}</p>
        </div>

        <p className="mt-3 truncate rounded-xl bg-white/70 px-3 py-2 text-center text-[11.5px] text-ink/70" title={url}>
          {url}
        </p>

        <div className="mt-3 space-y-2">
          <button type="button" onClick={() => void copy()} className={action}>
            {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            {copied ? t('textEditor.share.copied') : t('textEditor.share.copy')}
          </button>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={action}>
            <MessageCircle size={16} className="text-emerald-600" />
            {t('textEditor.share.whatsapp')}
          </a>
          {typeof navigator.share === 'function' && (
            <button type="button" onClick={() => navigator.share({ title, url }).catch(() => undefined)} className={action}>
              <Share2 size={16} />
              {t('textEditor.share.more')}
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}
