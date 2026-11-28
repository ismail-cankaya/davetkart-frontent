import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { EyeOff, X } from 'lucide-react';
import { isModuleId, useEditorStore, type SectionId } from '../../../stores/useEditorStore';
import { useInvitationDraft } from '../../../hooks/useInvitationDraft';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { TimelineEditor } from '../../create/TimelineEditor';
import { GalleryUploader } from '../../create/GalleryUploader';
import { GiftFields, RsvpFields } from '../../create/ModuleFields';
import { DateTimeInput } from '../../ui/DateTimeInput';
import { toast } from '../../ui/Toast';
import { duration, ease } from '../../../utils/motion';
import '../../../i18nEditor';

const labelClass = 'block text-xs font-bold tracking-wider uppercase text-champagne';
const inputClass =
  'w-full bg-white/5 border border-white/15 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 transition duration-300';

/**
 * Bölüm ayarları çekmecesi (Faz 25, K307): önizlemede bir bölüme ya da ➕ ile eklenen bölüme tıklanınca açılır.
 * Sihirbazın form parçalarını yeniden kullanır; "Gizle" bölümü kapatır ama verisini silmez (geri alınabilir).
 */
export function SectionSettingsDrawer() {
  const section = useEditorStore((s) => s.section);
  return createPortal(<AnimatePresence>{section && <Drawer key={section} section={section} />}</AnimatePresence>, document.body);
}

function Drawer({ section }: { section: SectionId }) {
  const { t } = useTranslation();
  const close = () => useEditorStore.getState().openSection(null);
  const setModule = useEditorStore((s) => s.setModule);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  const hide = () => {
    if (!isModuleId(section)) return;
    setModule(section, false);
    close();
    toast(t('textEditor.modules.hidden', { label: t(`textEditor.sections.${section}`) }), 'info');
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[70] bg-ink/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
        aria-hidden="true"
      />
      <motion.aside
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t(`textEditor.sections.${section}`)}
        onKeyDown={(e) => e.key === 'Escape' && close()}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: duration.panel, ease: ease.out }}
        className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-gradient-to-b from-brand-deep via-emerald-950 to-brand-deep text-white shadow-2xl outline-none"
      >
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">{t('textEditor.modules.settings')}</p>
            <h2 className="font-serif text-xl font-bold">{t(`textEditor.sections.${section}`)}</h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer"
            aria-label={t('textEditor.modules.close')}
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5" data-lenis-prevent>
          {section === 'timeline' && <TimelineEditor inputClass={inputClass} />}
          {section === 'gallery' && <GalleryUploader />}
          {section === 'gift' && <GiftSection />}
          {section === 'rsvp' && <RsvpSection />}
          {section === 'details' && <DetailsSection />}
        </div>

        {isModuleId(section) && (
          <footer className="border-t border-white/10 px-6 py-4">
            <button
              type="button"
              onClick={hide}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 hover:border-white/40 hover:text-white cursor-pointer"
            >
              <EyeOff size={14} />
              {t('textEditor.modules.hide')}
            </button>
          </footer>
        )}
      </motion.aside>
    </>
  );
}

const GIFT_FIELDS = ['bankName', 'accountHolder', 'iban'] as const;
function GiftSection() {
  const { draft, setField } = useInvitationDraft(GIFT_FIELDS);
  return <GiftFields values={draft} onChange={setField} labelClass={labelClass} inputClass={inputClass} />;
}

const RSVP_FIELDS = ['rsvpDeadline', 'askMenuPreference'] as const;
function RsvpSection() {
  const { draft, setField, commit } = useInvitationDraft(RSVP_FIELDS);
  return (
    <RsvpFields
      values={draft}
      onDeadline={(value) => setField('rsvpDeadline', value)}
      onMenu={(value) => commit({ askMenuPreference: value })}
      labelClass={labelClass}
      inputClass={inputClass}
    />
  );
}

const DETAIL_FIELDS = ['date', 'venue'] as const;
function DetailsSection() {
  const { t } = useTranslation();
  const { draft, setField } = useInvitationDraft(DETAIL_FIELDS);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className={labelClass}>{t('textEditor.sections.details')}</span>
        <DateTimeInput value={draft.date} onChange={(e) => setField('date', e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
      </div>
      <input
        type="text"
        value={draft.venue}
        onChange={(e) => setField('venue', e.target.value)}
        className={inputClass}
        placeholder={t('textEditor.fields.venue')}
        aria-label={t('textEditor.fields.venue')}
      />
    </div>
  );
}
