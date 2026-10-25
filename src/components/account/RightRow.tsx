import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, RotateCcw, Undo2 } from 'lucide-react';
import { EntitlementRight } from '../../types';
import { useAccountStore } from '../../stores/useAccountStore';
import { toast } from '../ui/Toast';
import { confirmAction } from '../ui/ConfirmDialog';
import { toDisplayError } from '../../utils/toDisplayError';
import { formatTryMinor } from '../../utils/currency';
import {
  ENTITLEMENT_STATE_LABEL,
  ENTITLEMENT_STATE_TONE,
  TIER_LABEL,
  formatAccountDate,
} from '../../utils/accountLabels';
import { cn } from '../../utils/cn';
import { duration, ease } from '../../utils/motion';

const REASON_MAX = 500;

/**
 * Tek bir hak (sipariş) satırı — durum rozeti, davetiyesi ve iptal akışı (Faz 14, K138).
 *
 * 🔴 "İptal et" düğmesi `refund.eligible`'a göre görünür ama KARARI sunucu
 * verir: arada durum değişebilir (başka sekmede yayın). 409 gelirse sebep
 * toast'ta söylenir ve liste tazelenir.
 */
export function RightRow({ right }: { right: EntitlementRight }) {
  const requestRefund = useAccountStore(s => s.requestRefund);
  const withdrawRefund = useAccountStore(s => s.withdrawRefund);
  const loadEntitlements = useAccountStore(s => s.loadEntitlements);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const request = right.refund.request;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;

    const confirmed = await confirmAction({
      title: `${TIER_LABEL[right.tier]} hakkı iptal edilsin mi?`,
      description: (
        <div className="space-y-2">
          <p>
            Talebiniz incelenene kadar bu hak <strong>dondurulur</strong>: yeni bir davetiyede kullanılamaz.
          </p>
          <p>Onaylandığında {formatTryMinor(right.totalMinor)} ödediğiniz karta iade edilir.</p>
        </div>
      ),
      confirmLabel: 'İptal Talebi Gönder',
      cancelLabel: 'Vazgeç',
      tone: 'danger',
    });
    if (!confirmed) return;

    setBusy(true);
    try {
      await requestRefund(right.orderId, reason.trim() || null);
      toast('İptal talebiniz alındı. Sonucu e-postayla bildireceğiz.');
      setIsFormOpen(false);
      setReason('');
    } catch (error) {
      toast(toDisplayError(error), 'error');
      // Sunucunun gördüğü durum ekranınkinden farklı olabilir: tazele.
      void loadEntitlements().catch(() => undefined);
    } finally {
      setBusy(false);
    }
  };

  const withdraw = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await withdrawRefund(right.orderId);
      toast('İptal talebinizi geri çektiniz. Hakkınız yeniden kullanılabilir.');
    } catch (error) {
      toast(toDisplayError(error), 'error');
      void loadEntitlements().catch(() => undefined);
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="py-5 first:pt-0 last:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink">{TIER_LABEL[right.tier]}</span>
            <span className={cn('text-[11px] font-semibold px-2.5 py-0.5 rounded-full border', ENTITLEMENT_STATE_TONE[right.state])}>
              {ENTITLEMENT_STATE_LABEL[right.state]}
            </span>
          </div>
          <p className="text-xs text-muted">
            {right.paidAt ? `Ödeme: ${formatAccountDate(right.paidAt)}` : `Sipariş: ${formatAccountDate(right.createdAt)}`}
            {' · '}
            {right.totalMinor === 0 ? 'Hediye kodu' : formatTryMinor(right.totalMinor)}
          </p>
          {right.invitation && (
            <p className="text-xs text-muted truncate">
              {right.invitation.deleted ? 'Silinen davetiye: ' : 'Davetiye: '}
              {right.invitation.deleted ? (
                <span className="text-ink">{right.invitation.title}</span>
              ) : (
                <Link to="/dashboard" className="text-brand font-semibold hover:underline inline-flex items-center gap-1">
                  {right.invitation.title}
                  <ExternalLink size={11} aria-hidden />
                </Link>
              )}
            </p>
          )}
          {right.state === 'available' && right.refund.eligible && right.refund.windowEndsAt && (
            <p className="text-[11px] text-muted">İptal hakkı {formatAccountDate(right.refund.windowEndsAt)} tarihine kadar.</p>
          )}
          {request && (
            <p className="text-[11px] text-amber-800">Talep tarihi: {formatAccountDate(request.createdAt, true)}</p>
          )}
        </div>

        <div className="shrink-0 flex gap-2">
          {right.refund.eligible && !isFormOpen && (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 px-4 py-2 rounded-full border border-rose-200 hover:border-rose-400 bg-white transition duration-300 cursor-pointer"
            >
              <RotateCcw size={13} aria-hidden />
              İptal Et
            </button>
          )}
          {request?.status === 'requested' && (
            <button
              type="button"
              onClick={withdraw}
              disabled={busy}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink px-4 py-2 rounded-full border border-ink/15 hover:border-ink/30 bg-white disabled:opacity-60 transition duration-300 cursor-pointer"
            >
              <Undo2 size={13} aria-hidden />
              Talebi Geri Çek
            </button>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isFormOpen && (
          <motion.form
            key="refund-form"
            onSubmit={submit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: duration.base, ease: ease.out }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3">
              <label htmlFor={`reason-${right.orderId}`} className="block text-xs font-bold tracking-wider uppercase text-ink">
                Neden iptal ediyorsunuz? <span className="font-normal normal-case text-muted">(isteğe bağlı)</span>
              </label>
              <textarea
                id={`reason-${right.orderId}`}
                value={reason}
                onChange={event => setReason(event.target.value.slice(0, REASON_MAX))}
                rows={2}
                className="w-full bg-white border border-ink/15 focus:border-brand/50 focus:ring-2 focus:ring-brand/10 focus:outline-none rounded-xl px-4 py-3 text-sm text-ink transition duration-300 resize-none"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white px-5 py-2.5 rounded-full font-semibold text-xs transition duration-300 cursor-pointer"
                >
                  {busy ? 'Gönderiliyor…' : 'Devam Et'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-full font-semibold text-xs text-ink border border-ink/15 hover:border-ink/30 bg-white transition duration-300 cursor-pointer"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </li>
  );
}
