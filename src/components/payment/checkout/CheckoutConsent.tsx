import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useCheckoutStore } from '../../../stores/useCheckoutStore';
import { cn } from '../../../utils/cn';
import { duration, ease, spring } from '../../../utils/motion';

interface CheckoutConsentProps {
  id: string;
  /** Gönderim denendi ve onay yok: kutu ve uyarı kırmızıya döner. */
  invalid: boolean;
}

/**
 * Ödeme öncesi sözleşme onayı. Durum store'dadır: kullanıcı yöntem
 * değiştirdiğinde aynı kutuyu ikinci kez işaretlemek zorunda kalmaz.
 *
 * Bağlantılar yeni sekmede açılır — aynı sekmede açılsalar yarım kalan kart
 * formu kaybolurdu.
 */
export function CheckoutConsent({ id, invalid }: CheckoutConsentProps) {
  const accepted = useCheckoutStore((s) => s.termsAccepted);
  const setAccepted = useCheckoutStore((s) => s.setTermsAccepted);
  const showError = invalid && !accepted;

  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer select-none group">
        <input
          id={id}
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          aria-invalid={showError}
          aria-describedby={showError ? `${id}-error` : undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            'mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors duration-300',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-brand/30 peer-focus-visible:ring-offset-2',
            accepted ? 'bg-brand border-brand' : showError ? 'border-rose-400 bg-rose-50' : 'border-ink/20 bg-white group-hover:border-brand/50'
          )}
        >
          <motion.span initial={false} animate={{ scale: accepted ? 1 : 0 }} transition={spring.snappy} className="flex text-white">
            <Check size={12} strokeWidth={3.5} />
          </motion.span>
        </span>
        <span className="text-xs text-muted leading-relaxed">
          <Link to="/terms" target="_blank" rel="noopener" className="text-brand font-semibold underline decoration-gold/50 underline-offset-2 hover:decoration-gold">
            Kullanım Koşulları
          </Link>
          &apos;nı ve{' '}
          <Link to="/privacy" target="_blank" rel="noopener" className="text-brand font-semibold underline decoration-gold/50 underline-offset-2 hover:decoration-gold">
            Gizlilik Sözleşmesi
          </Link>
          &apos;ni okudum, kabul ediyorum.
        </span>
      </label>

      <AnimatePresence>
        {showError && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } }}
            exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
            className="text-[11px] text-rose-600 font-medium mt-1.5 ml-8"
          >
            Devam etmek için onaylamanız gerekiyor.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
