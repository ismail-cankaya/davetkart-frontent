import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Flag, Loader2, X } from 'lucide-react';
import { REPORT_REASONS, reportService, type InvitationReportReason } from '../../services/reports';
import { useFixedText } from '../../invitationText/InvitationTextContext';
import { HoneypotField } from '../ui/HoneypotField';
import { toast } from '../ui/Toast';
import { toDisplayError } from '../../utils/toDisplayError';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { duration, ease } from '../../utils/motion';

/** "Bu davetiyeyi bildir" penceresi (Faz 25, K313): neden, isteğe bağlı ayrıntı, honeypot. */
export default function ReportDialog({ invitationId, onClose }: { invitationId: string; onClose: () => void }) {
  const fixed = useFixedText();
  const [reason, setReason] = useState<InvitationReportReason>('phishing');
  const [details, setDetails] = useState('');
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  useFocusTrap(ref, true);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      await reportService.reportInvitation(invitationId, reason, details, website);
      toast(fixed('report.sent'));
      onClose();
    } catch (error) {
      toast(toDisplayError(error), 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={fixed('report.title')}
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: duration.base, ease: ease.out }}
        className="relative w-full max-w-sm space-y-4 rounded-3xl bg-white p-6 text-stone-800 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <Flag size={16} className="text-rose-600" />
            {fixed('report.title')}
          </h2>
          <button type="button" onClick={onClose} aria-label={fixed('report.cancel')} className="rounded-full p-1 text-stone-500 hover:bg-stone-100 cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <p className="text-xs leading-relaxed text-stone-500">{fixed('report.body')}</p>
        <HoneypotField id="report-website" value={website} onChange={setWebsite} />
        <fieldset className="space-y-1.5">
          <legend className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500">{fixed('report.reason')}</legend>
          {REPORT_REASONS.map((value) => (
            <label key={value} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-stone-200 px-3 py-2 text-sm has-[:checked]:border-rose-400 has-[:checked]:bg-rose-50">
              <input type="radio" name="reason" value={value} checked={reason === value} onChange={() => setReason(value)} className="accent-rose-600" />
              {fixed(`report.reasons.${value}`)}
            </label>
          ))}
        </fieldset>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">{fixed('report.details')}</span>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full resize-none rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer">
            {fixed('report.cancel')}
          </button>
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60 cursor-pointer"
          >
            {sending && <Loader2 size={13} className="animate-spin" />}
            {sending ? fixed('report.sending') : fixed('report.send')}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
