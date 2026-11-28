import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { BadgeCheck, X } from 'lucide-react';
import { useEditorStore, type ActiveField } from '../../../stores/useEditorStore';
import { useInvitationStore } from '../../../stores/useInvitationStore';
import { MULTILINE_USER_FIELDS, USER_FIELD_LIMITS, userFieldValue } from '../../../invitationText/userFields';
import { DateTimeInput } from '../../ui/DateTimeInput';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { duration, ease } from '../../../utils/motion';
import { cn } from '../../../utils/cn';
import { popoverPosition } from './popoverPosition';
import '../../../i18nEditor';

/**
 * Önizlemede tıklanan kullanıcı alanının düzenleyicisi (Faz 27.2, K321): isimler, başlık, alt başlık, mekân, tarih.
 * Metin düzenleyicisiyle aynı yerde açılır; "Kaydet" ile yazar, geri alınabilir, paket istemez (K305).
 * Ayrıntı: docs/rehber/src/components/editor/text/FieldEditorCard.md
 */
export function FieldEditorCard({ active, isMobile }: { active: ActiveField; isMobile: boolean }) {
  const { t } = useTranslation();
  const closeField = useEditorStore((s) => s.closeField);
  const saveField = useEditorStore((s) => s.saveField);
  const initial = useInvitationStore((s) => userFieldValue(s.invitation, active.field));
  const [value, setValue] = useState(initial);
  const cardRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  useFocusTrap(cardRef, true);

  const isDate = active.field === 'date';
  const multiline = MULTILINE_USER_FIELDS.has(active.field);
  const max = isDate ? 0 : USER_FIELD_LIMITS[active.field as Exclude<typeof active.field, 'date'>];
  const length = [...value].length;
  const tooLong = !isDate && length > max;

  useEffect(() => {
    fieldRef.current?.focus();
    if (!isDate) fieldRef.current?.select();
  }, [isDate]);

  const save = () => {
    if (tooLong) return;
    const next = isDate ? value : value.replace(/\s+$/u, '');
    if (next !== initial) saveField(active.field, next);
    closeField();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeField();
    } else if (event.key === 'Enter' && (!multiline || event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      save();
    }
  };

  const position = useMemo(() => popoverPosition(active.anchor, isMobile, 340, 260), [active.anchor, isMobile]);
  const fieldClass =
    'w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';
  const label = t(`textEditor.field.label.${active.field}`);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[80] bg-ink/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeField}
        aria-hidden="true"
      />
      <motion.div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('textEditor.field.dialog')}
        onKeyDown={onKeyDown}
        initial={isMobile ? { y: '100%' } : { opacity: 0, y: 6, scale: 0.98 }}
        animate={isMobile ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
        exit={isMobile ? { y: '100%' } : { opacity: 0, y: 6, scale: 0.98 }}
        transition={{ duration: duration.base, ease: ease.out }}
        style={position}
        className={cn(
          'fixed z-[81] bg-cream text-ink shadow-2xl shadow-ink/25 border border-ink/10 p-4 space-y-3',
          isMobile ? 'inset-x-0 bottom-0 rounded-t-3xl pb-[max(1rem,env(safe-area-inset-bottom))]' : 'rounded-2xl'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <label htmlFor="studio-field-input" className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
            {label}
          </label>
          <button
            type="button"
            onClick={closeField}
            className="rounded-full p-1.5 text-muted hover:bg-ink/5 hover:text-ink cursor-pointer"
            aria-label={t('textEditor.inline.close')}
          >
            <X size={15} />
          </button>
        </div>

        {isDate ? (
          <DateTimeInput
            id="studio-field-input"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={fieldClass}
            placeholderClassName="text-muted/60"
          />
        ) : multiline ? (
          <textarea
            id="studio-field-input"
            ref={fieldRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            aria-invalid={tooLong}
            className={cn(fieldClass, 'resize-none')}
          />
        ) : (
          <input
            id="studio-field-input"
            ref={fieldRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-invalid={tooLong}
            className={fieldClass}
          />
        )}

        {!isDate && (
          <div className="flex items-center justify-between gap-3 text-[11px]">
            <span role={tooLong ? 'alert' : undefined} className={tooLong ? 'text-rose-600' : 'text-muted'}>
              {tooLong
                ? t('textEditor.field.limit', { max })
                : active.field === 'names'
                  ? t('textEditor.field.namesHint')
                  : value.trim() === ''
                    ? t('textEditor.field.empty')
                    : multiline
                      ? t('textEditor.inline.hintMultiline')
                      : t('textEditor.inline.hintSingle')}
            </span>
            <span className={cn('tabular-nums shrink-0', tooLong ? 'text-rose-600 font-semibold' : 'text-muted')}>
              {length}/{max}
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={save}
            disabled={tooLong}
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-soft disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {t('textEditor.inline.save')}
          </button>
          <button
            type="button"
            onClick={closeField}
            className="rounded-full px-3 py-2 text-xs font-semibold text-muted hover:text-ink cursor-pointer"
          >
            {t('textEditor.inline.cancel')}
          </button>
        </div>

        <p className="flex items-center gap-1.5 border-t border-ink/10 pt-2.5 text-[10.5px] text-muted">
          <BadgeCheck size={12} className="text-brand shrink-0" />
          {t('textEditor.field.freeNote')}
        </p>
      </motion.div>
    </>
  );
}
