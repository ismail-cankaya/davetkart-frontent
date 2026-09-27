import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../utils/cn';
import { duration, ease, gesture } from '../../utils/motion';
import { toast } from './Toast';

interface CopyFieldProps {
  label: string;
  /** Ekranda görünen hâl (ör. gruplanmış IBAN). */
  display: string;
  /** Panoya giden hâl; verilmezse `display` kopyalanır. */
  copyValue?: string;
  /** Uzun kodlar (IBAN, referans) eşit aralıklı yazıyla okunur. */
  mono?: boolean;
  /** Vurgulu satır: kullanıcının atlamaması gereken değer (tutar, referans). */
  emphasis?: boolean;
  className?: string;
}

/** Kopyalandı işaretinin ekranda kalma süresi. */
const COPIED_MS = 1800;

/**
 * Etiket + değer + tek dokunuşla kopyalama. Havale bilgileri gibi elle
 * yazıldığında hata yapılan değerler için.
 *
 * Pano izni reddedilirse değer yine seçilebilir metin olarak ekranda durur;
 * kullanıcıya bunu söyleyen bir bilgi notu düşülür.
 */
export function CopyField({ label, display, copyValue, mono, emphasis, className }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue ?? display);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      toast('Kopyalanamadı — değeri seçip elle kopyalayabilirsiniz.', 'info');
    }
  };

  return (
    <div
      className={cn(
        'group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors duration-300 ease-luxe',
        emphasis ? 'bg-champagne/40 border-gold/40' : 'bg-cream/70 border-ink/[0.06] hover:border-brand/20',
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
        <p
          className={cn(
            'text-sm font-semibold text-ink mt-0.5 break-all select-all',
            mono && 'font-mono tracking-wide text-[13px] md:text-sm'
          )}
        >
          {display}
        </p>
      </div>

      <motion.button
        type="button"
        onClick={() => void handleCopy()}
        whileTap={{ scale: 0.92, transition: gesture.press }}
        aria-label={`${label} kopyala`}
        className={cn(
          'relative shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-colors duration-300 cursor-pointer',
          copied
            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
            : 'bg-white border-ink/10 text-muted hover:text-brand hover:border-brand/30'
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'copied' : 'copy'}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: duration.fast, ease: ease.out } }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: duration.press, ease: ease.in } }}
            className="flex"
          >
            {copied ? <Check size={15} strokeWidth={3} /> : <Copy size={15} />}
          </motion.span>
        </AnimatePresence>
        {/* Ekran okuyucuya durum değişikliği; görsel işaret yalnızca ikon. */}
        <span className="sr-only" aria-live="polite">
          {copied ? 'Kopyalandı' : ''}
        </span>
      </motion.button>
    </div>
  );
}
