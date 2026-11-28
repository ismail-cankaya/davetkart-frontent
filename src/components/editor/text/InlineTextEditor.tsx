import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Crown, Loader2, RotateCcw, Sparkles, X } from 'lucide-react';
import { useEditorStore, type ActiveText } from '../../../stores/useEditorStore';
import { useInvitationStore } from '../../../stores/useInvitationStore';
import { useUIStore } from '../../../stores/useUIStore';
import { textSlot } from '../../../contracts/textSlots';
import { normalizeText, textProblem } from '../../../invitationText/overrides';
import { DEFAULT_INVITATION_LOCALE } from '../../../invitationText/types';
import { assistantService } from '../../../services/assistant';
import { confirmAction } from '../../ui/ConfirmDialog';
import { toDisplayError } from '../../../utils/toDisplayError';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { duration, ease } from '../../../utils/motion';
import { cn } from '../../../utils/cn';
import { popoverPosition } from './popoverPosition';
import { FieldEditorCard } from './FieldEditorCard';
import '../../../i18nEditor';

const POPOVER_WIDTH = 340;

/**
 * Yerinde metin düzenleyici (Faz 25, K306): masaüstünde metnin yanında açılan pencere, mobilde alttan
 * açılan panel. Kaydet ile yazar (her tuşta değil: yayındaki davetiye misafire yarım metin göstermesin, S2).
 * Ayrıntı: docs/rehber/src/components/editor/text/InlineTextEditor.md
 */
export function InlineTextEditor() {
  const active = useEditorStore((s) => s.active);
  const activeField = useEditorStore((s) => s.activeField);
  const isMobile = useUIStore((s) => s.isMobile);
  return createPortal(
    <AnimatePresence>
      {active && <EditorCard key={active.key} active={active} isMobile={isMobile} />}
      {/* Faz 27.2 (K321): kullanıcının kendi alanı (isimler, başlık, mekân, tarih); paket istemez. */}
      {activeField && <FieldEditorCard key={`field-${activeField.field}`} active={activeField} isMobile={isMobile} />}
    </AnimatePresence>,
    document.body
  );
}

/** `active` açılış anındaki seçimdir: kapanma animasyonu sırasında store'daki seçim boşalır (null). */
function EditorCard({ active, isMobile }: { active: ActiveText; isMobile: boolean }) {
  const closeText = useEditorStore((s) => s.closeText);
  const saveText = useEditorStore((s) => s.saveText);
  const resetText = useEditorStore((s) => s.resetText);
  const recordId = useInvitationStore((s) => s.recordId);
  const overridden = useInvitationStore(
    (s) => s.invitation.textOverrides?.[s.invitation.locale ?? DEFAULT_INVITATION_LOCALE]?.[active.key] !== undefined
  );

  const { t } = useTranslation();
  const slot = textSlot(active.key);
  const [value, setValue] = useState(active.text);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  useFocusTrap(cardRef, true);

  useEffect(() => {
    fieldRef.current?.focus();
    fieldRef.current?.select();
  }, []);

  const problem = textProblem(active.key, value);
  const length = [...normalizeText(active.key, value)].length;
  const max = slot?.maxLength ?? 0;
  const unchanged = normalizeText(active.key, value) === active.text;

  const save = () => {
    if (problem) return;
    if (!unchanged) saveText(active.key, value, active.defaultText);
    closeText();
  };

  const reset = async () => {
    const confirmed = await confirmAction({
      title: t('textEditor.inline.resetTitle'),
      description: active.defaultText ? t('textEditor.inline.resetBody', { text: active.defaultText }) : undefined,
      confirmLabel: t('textEditor.inline.resetConfirm'),
      cancelLabel: t('textEditor.inline.cancel')
    });
    if (!confirmed) return;
    resetText(active.key);
    closeText();
  };

  const suggest = async () => {
    if (!recordId || suggesting) return;
    setSuggesting(true);
    setSuggestError(null);
    try {
      setSuggestions(await assistantService.suggestTexts(recordId, active.key, normalizeText(active.key, value)));
    } catch (error) {
      setSuggestError(toDisplayError(error));
    } finally {
      setSuggesting(false);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeText();
    } else if (event.key === 'Enter' && (!slot?.multiline || event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      save();
    }
  };

  const position = useMemo(() => popoverPosition(active.anchor, isMobile, POPOVER_WIDTH), [active.anchor, isMobile]);

  const fieldClass =
    'w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[80] bg-ink/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeText}
        aria-hidden="true"
      />
      <motion.div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('textEditor.inline.dialog')}
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
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">{t('textEditor.inline.title')}</p>
            {active.defaultText && active.defaultText !== active.text && (
              <p className="mt-0.5 text-[11px] text-muted line-clamp-1">{t('textEditor.inline.templateText', { text: active.defaultText })}</p>
            )}
          </div>
          <button
            type="button"
            onClick={closeText}
            className="rounded-full p-1.5 text-muted hover:bg-ink/5 hover:text-ink cursor-pointer"
            aria-label={t('textEditor.inline.close')}
          >
            <X size={15} />
          </button>
        </div>

        {slot?.multiline ? (
          <textarea
            ref={fieldRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            aria-invalid={problem !== null}
            className={cn(fieldClass, 'resize-none')}
          />
        ) : (
          <input
            ref={fieldRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-invalid={problem !== null}
            className={fieldClass}
          />
        )}

        <div className="flex items-center justify-between gap-3 text-[11px]">
          <span role={problem ? 'alert' : undefined} className={problem ? 'text-rose-600' : 'text-muted'}>
            {problem ? t(`textEditor.inline.problem.${problem}`) : slot?.multiline ? t('textEditor.inline.hintMultiline') : t('textEditor.inline.hintSingle')}
          </span>
          <span className={cn('tabular-nums shrink-0', length > max ? 'text-rose-600 font-semibold' : 'text-muted')}>
            {length}/{max}
          </span>
        </div>

        {/* Asistan önerileri (K310): tıklamak önizler; yazmak yine "Kaydet"tir. */}
        {suggestions && suggestions.length > 0 && (
          <ul className="space-y-1.5" aria-label={t('textEditor.inline.suggestions')}>
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => setValue(suggestion)}
                  className="w-full rounded-lg border border-brand/15 bg-white px-3 py-2 text-left text-xs text-ink hover:border-brand/40 hover:bg-brand/5 cursor-pointer"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        )}
        {suggestError && <p className="text-[11px] text-rose-600">{suggestError}</p>}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={save}
            disabled={problem !== null}
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-soft disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {t('textEditor.inline.save')}
          </button>
          <button
            type="button"
            onClick={closeText}
            className="rounded-full px-3 py-2 text-xs font-semibold text-muted hover:text-ink cursor-pointer"
          >
            {t('textEditor.inline.cancel')}
          </button>
          <span className="flex-1" />
          {recordId && (
            <button
              type="button"
              onClick={suggest}
              disabled={suggesting}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 px-3 py-2 text-xs font-semibold text-brand hover:bg-brand/5 cursor-pointer disabled:opacity-60"
            >
              {suggesting ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
              {t('textEditor.inline.suggest')}
            </button>
          )}
          {overridden && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-muted hover:text-ink cursor-pointer"
            >
              <RotateCcw size={13} />
              {t('textEditor.inline.reset')}
            </button>
          )}
        </div>

        <p className="flex items-center gap-1.5 border-t border-ink/10 pt-2.5 text-[10.5px] text-muted">
          <Crown size={12} className="text-gold shrink-0" />
          {t('textEditor.inline.elitNote')}
        </p>
      </motion.div>
    </>
  );
}
