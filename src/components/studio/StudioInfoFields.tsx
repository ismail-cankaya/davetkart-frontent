import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { MousePointerClick } from 'lucide-react';
import { CoupleNameFields } from '../create/CoupleNameFields';
import { DateTimeInput } from '../ui/DateTimeInput';
import { useInvitationDraft } from '../../hooks/useInvitationDraft';
import { studioInput, studioLabel } from './studioStyles';
import '../../i18nEditor';

type InfoField = 'title' | 'date' | 'venue' | 'subtitle';
const INFO_FIELDS: readonly InfoField[] = ['title', 'date', 'venue', 'subtitle'];

/** Sol menü → Bilgiler (K319): kullanıcının kendi içeriği; paket istemez, önizlemeye anında yansır. */
export function StudioInfoFields() {
  const { t } = useTranslation();
  const id = useId();
  const { draft, setField } = useInvitationDraft(INFO_FIELDS);
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(e.target.name as InfoField, e.target.value);

  return (
    <div className="space-y-5">
      <p className="flex items-start gap-2 rounded-xl bg-white/[0.06] px-3 py-2.5 text-[11.5px] leading-relaxed text-emerald-100/80">
        <MousePointerClick size={14} className="mt-0.5 shrink-0 text-gold" />
        {t('textEditor.studio.info.hint')}
      </p>
      <CoupleNameFields labelClass={studioLabel} inputClass={studioInput} />
      <div className="space-y-2">
        <label htmlFor={`${id}-title`} className={studioLabel}>{t('textEditor.studio.info.title')}</label>
        <input id={`${id}-title`} name="title" value={draft.title} onChange={onChange} placeholder={t('textEditor.studio.info.titlePlaceholder')} className={studioInput} />
      </div>
      <div className="space-y-2">
        <label htmlFor={`${id}-date`} className={studioLabel}>{t('textEditor.studio.info.date')}</label>
        <DateTimeInput
          id={`${id}-date`}
          name="date"
          value={draft.date}
          onChange={onChange}
          placeholder={t('textEditor.studio.info.datePlaceholder')}
          className={`${studioInput} [color-scheme:dark]`}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor={`${id}-venue`} className={studioLabel}>{t('textEditor.studio.info.venue')}</label>
        <input id={`${id}-venue`} name="venue" value={draft.venue} onChange={onChange} placeholder={t('textEditor.studio.info.venuePlaceholder')} className={studioInput} />
      </div>
      <div className="space-y-2">
        <label htmlFor={`${id}-subtitle`} className={studioLabel}>{t('textEditor.studio.info.subtitle')}</label>
        <textarea
          id={`${id}-subtitle`}
          name="subtitle"
          rows={4}
          value={draft.subtitle}
          onChange={onChange}
          placeholder={t('textEditor.studio.info.subtitlePlaceholder')}
          className={`${studioInput} resize-none`}
        />
      </div>
    </div>
  );
}
