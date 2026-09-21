import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { ease } from '../../utils/motion';

export interface ConfirmOptions {
  title: string;
  /** Gövde; düz metin ya da zengin içerik (uyarı kutuları, listeler). */
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` geri alınamaz işlemler için kırmızı onay düğmesi çizer. */
  tone?: 'danger' | 'default';
}

interface PendingConfirm extends ConfirmOptions {
  resolve: (confirmed: boolean) => void;
}

type Listener = (request: PendingConfirm) => void;

let listener: Listener | null = null;

/**
 * Onay penceresi açar ve kullanıcının kararıyla çözülür.
 *
 * 🔴 `window.confirm` yerine geçer ve bu bir estetik tercih değildir:
 * tarayıcının yerleşik penceresi **yalnızca düz metin** taşır. Silmenin
 * ticari sonucunu (ödenen plan hakkına ne olacağı) tek satırlık bir metne
 * sığdırmak mümkün değil; üstelik `confirm()` ana iş parçacığını bloke eder
 * ve mobilde uygulamanın kimliğinden tamamen kopuk görünür.
 *
 * API bilinçli olarak `toast()` ile aynı biçimde: modül düzeyinde bir
 * dinleyici, çağrı yerinde tek satır. Böylece her çağıran kendi görünürlük
 * durumunu taşımak zorunda kalmaz.
 *
 * ```ts
 * if (!(await confirmAction({ title: 'Silinsin mi?' }))) return;
 * ```
 */
export function confirmAction(options: ConfirmOptions): Promise<boolean> {
  // Host mount edilmemişse kilitlenmek yerine reddedilir: onay alınamadan
  // yıkıcı bir işlemi çalıştırmak, sormamaktan beterdir.
  if (!listener) return Promise.resolve(false);

  return new Promise<boolean>((resolve) => {
    listener?.({ ...options, resolve });
  });
}

/** Onay penceresinin tek örneği; `AppLayout` içinde bir kez mount edilir. */
export function ConfirmHost() {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  useEffect(() => {
    listener = (request) => setPending(request);
    return () => {
      listener = null;
    };
  }, []);

  const settle = useCallback(
    (confirmed: boolean) => {
      setPending((current) => {
        current?.resolve(confirmed);
        return null;
      });
    },
    []
  );

  // Escape iptal eder; açıkken arkadaki sayfa kaymaz.
  useEffect(() => {
    if (!pending) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') settle(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [pending, settle]);

  const isDanger = pending?.tone === 'danger';

  return (
    <AnimatePresence>
      {pending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: ease.out }}
          onClick={() => settle(false)}
          className="fixed inset-0 z-[100] bg-ink/45 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.45, ease: ease.out }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-cream rounded-3xl shadow-2xl shadow-ink/30 border border-white/40 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => settle(false)}
              aria-label="Kapat"
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-muted hover:text-ink hover:bg-ink/5 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="p-6 md:p-7">
              <div className="flex items-start gap-3.5">
                <span
                  className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center ${
                    isDanger ? 'bg-rose-100 text-rose-600' : 'bg-brand/10 text-brand'
                  }`}
                >
                  <AlertTriangle size={18} />
                </span>
                <div className="min-w-0 pt-1">
                  <h2 id="confirm-title" className="font-serif text-lg font-bold text-ink leading-snug pr-6">
                    {pending.title}
                  </h2>
                </div>
              </div>

              {pending.description && (
                <div className="mt-4 text-xs text-muted leading-relaxed space-y-3">
                  {pending.description}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => settle(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-ink bg-white border border-ink/10 hover:border-ink/25 transition-colors cursor-pointer"
                >
                  {pending.cancelLabel ?? 'Vazgeç'}
                </button>
                <motion.button
                  type="button"
                  autoFocus
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => settle(true)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold text-white shadow-lg transition-colors cursor-pointer ${
                    isDanger
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                      : 'bg-brand hover:bg-brand-soft shadow-brand/25'
                  }`}
                >
                  {pending.confirmLabel ?? 'Onayla'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
