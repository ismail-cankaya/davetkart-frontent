import React, { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Gift, Loader2, X } from 'lucide-react';
import { useCheckoutStore } from '../../../stores/useCheckoutStore';
import { SubscriptionTier } from '../../../types';
import { formatTryMinor } from '../../../utils/currency';
import { cn } from '../../../utils/cn';
import { duration, ease, gesture, spring } from '../../../utils/motion';

interface GiftCodeFieldProps {
  /** Önizlemenin hesaplanacağı plan (URL'den). */
  tier: SubscriptionTier;
}

/** Backend ile aynı üst sınır (`max:64`); uzun bir yapıştırma isteğe gitmesin. */
const MAX_LENGTH = 64;

/**
 * "Hediye kodum var" açılır alanı (Faz 11).
 *
 * Yalnızca **yazar ve gösterir**: önizleme, hata metni ve uygulanan kod
 * `useCheckoutStore`'dadır. Bileşen kapanıp açılsa da (ya da plan değişse de)
 * uygulanan kod kaybolmaz; kart formu ve ücretsiz etkinleştirme aynı kodu okur.
 *
 * Hata metni toast'ta değil alanın altında durur: kullanıcı kodu düzeltirken
 * neyin yanlış olduğunu görmeye devam etmeli.
 * Ayrıntılı açıklama: docs/rehber/src/components/payment/checkout/GiftCodeField.md
 */
export function GiftCodeField({ tier }: GiftCodeFieldProps) {
  const { t } = useTranslation();
  const appliedCode = useCheckoutStore((s) => s.giftCode);
  const preview = useCheckoutStore((s) => s.giftPreview);
  const isChecking = useCheckoutStore((s) => s.isCheckingGiftCode);
  const error = useCheckoutStore((s) => s.giftCodeError);
  const isProcessing = useCheckoutStore((s) => s.isProcessing);
  const applyGiftCode = useCheckoutStore((s) => s.applyGiftCode);
  const removeGiftCode = useCheckoutStore((s) => s.removeGiftCode);

  // Kod zaten uygulanmışsa (plan değişimi, geri dönüş) alan açık başlar.
  const [open, setOpen] = useState(appliedCode !== null);
  const [draft, setDraft] = useState(appliedCode ?? '');

  const uid = useId();
  const inputId = `${uid}-code`;
  const errorId = `${uid}-error`;
  const panelId = `${uid}-panel`;
  const busy = isChecking || isProcessing;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !draft.trim()) return;
    await applyGiftCode(draft, tier);
  };

  const handleRemove = () => {
    removeGiftCode();
    setDraft('');
  };

  return (
    <div className="rounded-2xl border border-ink/[0.07] bg-cream/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer"
      >
        <span className="inline-flex items-center gap-2.5 text-sm font-semibold text-ink">
          <span className="w-8 h-8 rounded-xl bg-champagne/40 text-brand flex items-center justify-center transition-transform duration-500 ease-luxe group-hover:-rotate-6">
            <Gift size={15} />
          </span>
          {t('giftCode.toggle')}
          {preview && (
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded-full px-2 py-0.5">
              {t('giftCode.appliedBadge')}
            </span>
          )}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring.snappy} className="text-muted">
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { duration: duration.panel, ease: ease.out } }}
            exit={{ height: 0, opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {preview && appliedCode ? (
                <AppliedCode code={appliedCode} discountMinor={preview.discountMinor} onRemove={handleRemove} disabled={busy} />
              ) : (
                <form onSubmit={(e) => void handleApply(e)} noValidate className="space-y-2">
                  <label htmlFor={inputId} className="sr-only">
                    {t('giftCode.label')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      id={inputId}
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value.slice(0, MAX_LENGTH))}
                      placeholder={t('giftCode.placeholder')}
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      disabled={busy}
                      aria-invalid={error !== null}
                      aria-describedby={error ? errorId : undefined}
                      className={cn(
                        'min-w-0 flex-1 bg-white border border-ink/10 rounded-xl px-4 py-3 text-sm font-mono uppercase tracking-wider text-ink placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-muted/50 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition duration-300 disabled:opacity-60',
                        error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                      )}
                    />
                    <motion.button
                      type="submit"
                      disabled={busy || !draft.trim()}
                      whileHover={busy ? undefined : { y: -1, transition: gesture.hover }}
                      whileTap={busy ? undefined : { scale: 0.97, transition: gesture.press }}
                      className="shrink-0 inline-flex items-center gap-2 bg-ink text-white px-5 rounded-xl text-sm font-bold hover:bg-brand transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isChecking ? <Loader2 size={15} className="animate-spin" /> : null}
                      {isChecking ? t('giftCode.applying') : t('giftCode.apply')}
                    </motion.button>
                  </div>

                  <AnimatePresence initial={false}>
                    {error && (
                      <motion.p
                        id={errorId}
                        role="alert"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } }}
                        exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
                        className="text-[11px] text-rose-600 font-medium leading-relaxed"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AppliedCodeProps {
  code: string;
  discountMinor: number;
  onRemove: () => void;
  disabled: boolean;
}

function AppliedCode({ code, discountMinor, onRemove, disabled }: AppliedCodeProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1, transition: spring.snappy }}
      className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-3"
    >
      <span className="flex items-center gap-2.5 min-w-0">
        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <Check size={13} strokeWidth={3} />
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-sm font-bold tracking-wider text-emerald-900 truncate uppercase">{code}</span>
          <span className="block text-[11px] text-emerald-800/80">
            {t('giftCode.appliedDiscount', { amount: formatTryMinor(discountMinor) })}
          </span>
        </span>
      </span>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={t('giftCode.remove')}
        className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-emerald-900/70 hover:text-rose-600 transition-colors duration-300 disabled:opacity-50 cursor-pointer"
      >
        <X size={14} />
        {t('giftCode.remove')}
      </button>
    </motion.div>
  );
}
