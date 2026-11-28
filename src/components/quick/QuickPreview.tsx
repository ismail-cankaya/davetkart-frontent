import React, { useEffect, useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, PenLine, Radio, Save, Sparkles, X } from 'lucide-react';
import { DeviceCanvas } from '../studio/canvas/DeviceCanvas';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { DateTimeInput } from '../ui/DateTimeInput';
import { confirmAction } from '../ui/ConfirmDialog';
import { toast } from '../ui/Toast';
import { invitationService } from '../../services/invitations';
import { saveQuickFields, type QuickFields } from '../../services/quickEdit';
import { USER_FIELD_LIMITS } from '../../invitationText/userFields';
import { useMinWidth } from '../../hooks/useMinWidth';
import { toDisplayError } from '../../utils/toDisplayError';
import { duration, ease } from '../../utils/motion';
import type { InvitationRecord } from '../../types';
import '../../i18nEditor';

const FIELDS = ['names', 'title', 'subtitle', 'date', 'venue'] as const;
type Field = (typeof FIELDS)[number];

const pick = (record: InvitationRecord): QuickFields => ({
  names: record.invitation.names ?? '',
  title: record.invitation.title ?? '',
  subtitle: record.invitation.subtitle ?? '',
  date: record.invitation.date ?? '',
  venue: record.invitation.venue ?? ''
});

const input =
  'w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';
const label = 'block text-[11px] font-bold uppercase tracking-[0.14em] text-brand';

/**
 * Önizleme / hızlı düzenleme (Faz 29.1, K318, K324): panelin üstünde tam ekran katman. Solda temel bilgiler, sağda
 * telefon önizlemesi; teknik ayrıntı yok, paket istemez. "Kaydet" (yayındaysa "Kaydet ve yayınla") yalnızca değişen
 * alanları yazar. Ayrıntı: docs/rehber/src/components/quick/QuickPreview.md
 */
export default function QuickPreview({ id, onClose, onSaved }: { id: string; onClose: () => void; onSaved: () => void }) {
  const { t } = useTranslation();
  const formId = useId();
  const wide = useMinWidth(1024);
  const framed = useMinWidth(640);
  const [record, setRecord] = useState<InvitationRecord | null>(null);
  const [fields, setFields] = useState<QuickFields | null>(null);
  const [saving, setSaving] = useState(false);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    let cancelled = false;
    invitationService
      .get(id)
      .then((loaded) => {
        if (cancelled) return;
        setRecord(loaded);
        setFields(pick(loaded));
      })
      .catch((error) => {
        if (cancelled) return;
        toast(toDisplayError(error), 'error');
        onClose();
      });
    return () => {
      cancelled = true;
    };
  }, [id, onClose]);

  const changed = useMemo(() => {
    if (!record || !fields) return {};
    const base = pick(record);
    return Object.fromEntries(FIELDS.filter((f) => fields[f] !== base[f]).map((f) => [f, fields[f]])) as Partial<QuickFields>;
  }, [record, fields]);
  const dirty = Object.keys(changed).length > 0;
  const tooLong = fields ? FIELDS.find((f) => f !== 'date' && [...fields[f]].length > USER_FIELD_LIMITS[f]) : undefined;
  const live = record?.status === 'published';

  const close = async () => {
    if (dirty) {
      const ok = await confirmAction({
        title: t('textEditor.quick.discardTitle'),
        description: t('textEditor.quick.discardBody'),
        confirmLabel: t('textEditor.quick.discardConfirm'),
        cancelLabel: t('textEditor.inline.cancel')
      });
      if (!ok) return;
    }
    onClose();
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // Onay penceresi açıkken Esc onu kapatır, bu katmanı değil.
      if (event.key === 'Escape' && !document.querySelector('[aria-labelledby="confirm-title"]')) void close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const save = async () => {
    if (!record || !dirty || tooLong || saving) return;
    setSaving(true);
    try {
      const saved = await saveQuickFields(record.id, changed);
      setRecord(saved);
      setFields(pick(saved));
      toast(live ? t('textEditor.quick.savedLive') : t('textEditor.quick.saved'));
      onSaved();
    } catch (error) {
      toast(toDisplayError(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  const set = (field: Field) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((current) => (current ? { ...current, [field]: event.target.value } : current));

  const preview = useMemo(
    () => (record && fields ? { ...record.invitation, ...fields, showEnvelope: false } : null),
    [record, fields]
  );

  const form = fields && (
    <form
      id={formId}
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
      className="space-y-4"
    >
      {live && (
        <p className="flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-[12px] text-emerald-800">
          <Radio size={14} className="mt-0.5 shrink-0" />
          {t('textEditor.quick.liveNote')}
        </p>
      )}
      {record?.hasPendingChanges && (
        <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-[12px] text-amber-800">
          <Sparkles size={14} className="mt-0.5 shrink-0" />
          {t('textEditor.quick.pendingNote')}
        </p>
      )}
      <div className="space-y-1.5">
        <label htmlFor={`${formId}-names`} className={label}>{t('textEditor.quick.names')}</label>
        <input id={`${formId}-names`} value={fields.names} onChange={set('names')} className={input} aria-describedby={`${formId}-names-hint`} />
        <p id={`${formId}-names-hint`} className="text-[11px] text-muted">{t('textEditor.quick.namesHint')}</p>
      </div>
      <div className="space-y-1.5">
        <label htmlFor={`${formId}-title`} className={label}>{t('textEditor.quick.title_field')}</label>
        <input id={`${formId}-title`} value={fields.title} onChange={set('title')} className={input} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={`${formId}-date`} className={label}>{t('textEditor.quick.date')}</label>
        <DateTimeInput id={`${formId}-date`} value={fields.date} onChange={set('date')} className={input} placeholderClassName="text-muted/60" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={`${formId}-venue`} className={label}>{t('textEditor.quick.venue')}</label>
        <input id={`${formId}-venue`} value={fields.venue} onChange={set('venue')} className={input} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={`${formId}-subtitle`} className={label}>{t('textEditor.quick.subtitle_field')}</label>
        <textarea id={`${formId}-subtitle`} rows={3} value={fields.subtitle} onChange={set('subtitle')} className={`${input} resize-none`} />
      </div>
      {tooLong && (
        <p role="alert" className="text-[12px] text-rose-600">
          {t(`textEditor.quick.${tooLong === 'title' ? 'title_field' : tooLong === 'subtitle' ? 'subtitle_field' : tooLong}`)}:{' '}
          {t('textEditor.quick.tooLong', { max: USER_FIELD_LIMITS[tooLong as Exclude<Field, 'date'>] })}
        </p>
      )}
    </form>
  );

  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="submit"
        form={formId}
        disabled={!dirty || Boolean(tooLong) || saving}
        className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 hover:bg-brand-soft disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {saving ? t('textEditor.quick.saving') : live ? t('textEditor.quick.saveLive') : t('textEditor.quick.save')}
      </button>
      <Link to={`/studio/${id}`} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-brand hover:bg-brand/5">
        <PenLine size={15} />
        {t('textEditor.quick.studio')}
      </Link>
    </div>
  );

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t('textEditor.quick.title')}
      className="fixed inset-0 z-[85] flex flex-col bg-cream"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: duration.panel, ease: ease.out }}
    >
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-ink/10 bg-white/80 px-4 backdrop-blur">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">{t('textEditor.quick.title')}</p>
          <p className="truncate text-[12px] text-muted">{t('textEditor.quick.subtitle')}</p>
        </div>
        <button type="button" onClick={() => void close()} aria-label={t('textEditor.quick.close')} className="rounded-full p-2 text-ink/60 hover:bg-ink/5 hover:text-ink cursor-pointer">
          <X size={18} />
        </button>
      </header>

      {!record || !preview ? (
        <div className="grid flex-1 place-items-center text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            {t('textEditor.quick.loading')}
          </span>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          {wide && (
            <aside className="flex w-[420px] shrink-0 flex-col border-r border-ink/10 bg-white/60">
              <div className="flex-1 overflow-y-auto px-6 py-6" data-lenis-prevent>
                {form}
              </div>
              <div className="border-t border-ink/10 px-6 py-4">{actions}</div>
            </aside>
          )}
          <section className="relative min-w-0 flex-1 bg-[#ECE8E1] [background-image:radial-gradient(rgba(20,40,30,0.08)_1px,transparent_1px)] [background-size:18px_18px]">
            <DeviceCanvas device="phone" zoom="fit" bare={!framed} insetBottom={wide ? 0 : 72} title={t('textEditor.studio.canvas')}>
              {() => <TemplateRenderer templateId={preview.imageTheme} invitation={preview} mode="preview" />}
            </DeviceCanvas>
            {!wide && (
              <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setSheet(true)}
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-xl cursor-pointer"
                >
                  <PenLine size={15} />
                  {t('textEditor.quick.edit')}
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      <AnimatePresence>
        {!wide && sheet && record && (
          <>
            <motion.div className="fixed inset-0 z-[86] bg-ink/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} aria-hidden />
            <motion.section
              role="dialog"
              aria-label={t('textEditor.quick.edit')}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: duration.panel, ease: ease.out }}
              className="fixed inset-x-0 bottom-0 z-[87] flex max-h-[82dvh] flex-col rounded-t-3xl bg-cream shadow-2xl"
            >
              <div className="flex-1 overflow-y-auto px-5 pb-3 pt-5" data-lenis-prevent>
                {form}
              </div>
              <div className="border-t border-ink/10 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{actions}</div>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
