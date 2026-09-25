import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, ReceiptText } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../../data';
import { OrderStatus, SubscriptionTier } from '../../../types';
import { toast } from '../../ui/Toast';
import { duration, ease, gesture } from '../../../utils/motion';

const STATUS_CHIP: Record<OrderStatus | 'unknown', { label: string; className: string }> = {
  paid: { label: 'Onaylandı', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending: { label: 'Onay bekleniyor', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  failed: { label: 'Başarısız', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  expired: { label: 'Süresi doldu', className: 'bg-stone-100 text-stone-600 border-stone-200' },
  refunded: { label: 'İade edildi', className: 'bg-stone-100 text-stone-600 border-stone-200' },
  unknown: { label: 'Doğrulanamadı', className: 'bg-stone-100 text-stone-600 border-stone-200' }
};

function formatPaidAt(iso: string): string | null {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(parsed);
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <dt className="text-xs text-muted shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-ink text-right min-w-0">{children}</dd>
    </div>
  );
}

/** Sipariş numarası + panoya kopyalama: destekle yazışırken ilk sorulan şey. */
function OrderIdValue({ orderId }: { orderId: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
    } catch {
      toast('Sipariş numarası kopyalanamadı — tarayıcı iznini kontrol edin.', 'info');
    }
  };

  return (
    <span className="inline-flex items-center gap-2 min-w-0">
      <span className="font-mono text-xs tracking-tight text-ink/80 truncate">{orderId}</span>
      <motion.button
        type="button"
        onClick={() => void copy()}
        whileTap={{ scale: 0.9, transition: gesture.press }}
        aria-label="Sipariş numarasını kopyala"
        className="shrink-0 w-7 h-7 rounded-lg border border-ink/10 bg-cream/60 text-muted hover:text-brand hover:border-brand/30 transition-colors flex items-center justify-center cursor-pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'done' : 'copy'}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: duration.fast, ease: ease.out } }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: duration.press, ease: ease.in } }}
          >
            {copied ? <Check size={13} className="text-emerald-600" strokeWidth={3} /> : <Copy size={13} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </span>
  );
}

interface OrderReceiptProps {
  orderId: string;
  tier: SubscriptionTier | null;
  /** `null`: sipariş sunucudan okunamadı. */
  status: OrderStatus | null;
  paidAt?: string | null;
}

/**
 * Bilet görünümlü sipariş özeti. Tutar `data.ts` katalogundan gelir ve
 * yalnızca **gösterimdir** — `OrderResource` tutarı bilerek taşımaz (iki
 * fiyat kaynağı ayrışabilirdi).
 */
export function OrderReceipt({ orderId, tier, status, paidAt }: OrderReceiptProps) {
  const plan = tier ? SUBSCRIPTION_PLANS.find((p) => p.id === tier) : undefined;
  const chip = STATUS_CHIP[status ?? 'unknown'];
  const paidAtLabel = paidAt ? formatPaidAt(paidAt) : null;

  return (
    // `overflow-hidden`: deliklerin kartın dışına taşan yarısı kesilir; gölge
    // kutunun kendisine ait olduğu için kesilmez.
    <div className="relative overflow-hidden bg-white rounded-3xl border border-ink/[0.06] shadow-xl shadow-ink/[0.05]">
      <div className="flex items-center justify-between gap-3 px-5 md:px-6 py-4">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-muted uppercase tracking-[0.14em]">
          <ReceiptText size={14} className="text-brand" />
          Sipariş Özeti
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={chip.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } }}
            exit={{ opacity: 0, y: -4, transition: { duration: duration.fast, ease: ease.in } }}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${chip.className}`}
          >
            {chip.label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Bilet delikleri: kesik çizginin iki ucunda sayfa zemininden oyuk. */}
      <div className="relative h-px mx-5 md:mx-6 border-t border-dashed border-ink/15" aria-hidden>
        <span className="absolute -left-[33px] md:-left-[37px] -top-3 w-6 h-6 rounded-full bg-cream border border-ink/[0.06]" />
        <span className="absolute -right-[33px] md:-right-[37px] -top-3 w-6 h-6 rounded-full bg-cream border border-ink/[0.06]" />
      </div>

      <dl className="px-5 md:px-6 pb-2 divide-y divide-ink/[0.05]">
        <Row label="Sipariş No">
          <OrderIdValue orderId={orderId} />
        </Row>
        {plan && (
          <>
            <Row label="Paket">{plan.name} Paket</Row>
            <Row label="Tutar">
              <span className="font-serif text-base font-bold">₺{plan.price}</span>
              <span className="text-[11px] text-muted font-normal ml-1.5">tek seferlik</span>
            </Row>
          </>
        )}
        {paidAtLabel && <Row label="Onay zamanı">{paidAtLabel}</Row>}
      </dl>
    </div>
  );
}
