import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '../ui/Switch';
import { cn } from '../../utils/cn';
import { isValidIban } from '../../utils/iban';
import '../../i18nEditor';

/**
 * Modül form alanları (Faz 25): sihirbaz (`DetailsFormStep`) ve editörün bölüm ayarları
 * (`SectionSettingsDrawer`) aynı alanları çizer. Taslak ve yazma çağıranındır; burası yalnızca çizer.
 */
interface FieldClasses {
  labelClass: string;
  inputClass: string;
}

type GiftValues = { bankName: string; accountHolder: string; iban: string };

export function GiftFields({
  values,
  onChange,
  labelClass,
  inputClass
}: FieldClasses & { values: GiftValues; onChange: (name: keyof GiftValues, value: string) => void }) {
  const { t } = useTranslation();
  const id = useId();
  // FE 10.19 (K105): boş IBAN serbest; doluysa backend'le aynı kural.
  const ibanInvalid = values.iban.trim() !== '' && !isValidIban(values.iban);
  const hintId = `${id}-iban-hint`;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor={`${id}-bank`} className={labelClass}>{t('textEditor.fields.bankName')}</label>
          <input
            id={`${id}-bank`}
            type="text"
            name="bankName"
            value={values.bankName}
            onChange={(e) => onChange('bankName', e.target.value)}
            placeholder={t('textEditor.fields.bankPlaceholder')}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${id}-holder`} className={labelClass}>{t('textEditor.fields.holder')}</label>
          <input
            id={`${id}-holder`}
            type="text"
            name="accountHolder"
            value={values.accountHolder}
            onChange={(e) => onChange('accountHolder', e.target.value)}
            placeholder={t('textEditor.fields.holderPlaceholder')}
            className={inputClass}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor={`${id}-iban`} className={labelClass}>{t('textEditor.fields.iban')}</label>
        <input
          id={`${id}-iban`}
          type="text"
          name="iban"
          value={values.iban}
          onChange={(e) => onChange('iban', e.target.value)}
          placeholder="TR__ ____ ____ ____ ____ ____ __"
          aria-invalid={ibanInvalid}
          aria-describedby={ibanInvalid ? hintId : undefined}
          className={cn(inputClass, 'font-mono tracking-wide')}
        />
        {/* Backend her kayıtta IBAN'ı denetliyor; geçersizken davetiye kaydedilmez. Nedeni burada. */}
        {ibanInvalid && (
          <p id={hintId} role="alert" className="text-[11px] text-rose-300 leading-relaxed">
            {t('textEditor.fields.ibanInvalid')}
          </p>
        )}
      </div>
    </>
  );
}

export function RsvpFields({
  values,
  onDeadline,
  onMenu,
  labelClass,
  inputClass
}: FieldClasses & {
  values: { rsvpDeadline: string; askMenuPreference: boolean };
  onDeadline: (value: string) => void;
  onMenu: (value: boolean) => void;
}) {
  const { t } = useTranslation();
  const id = useId();
  return (
    <>
      <div className="space-y-2">
        <label htmlFor={`${id}-deadline`} className={labelClass}>{t('textEditor.fields.deadline')}</label>
        <input
          id={`${id}-deadline`}
          type="date"
          name="rsvpDeadline"
          value={values.rsvpDeadline}
          onChange={(e) => onDeadline(e.target.value)}
          className={cn(inputClass, '[color-scheme:dark]')}
        />
      </div>
      <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">{t('textEditor.fields.menu')}</p>
          <p className="text-xs text-white/45 mt-0.5">{t('textEditor.fields.menuHint')}</p>
        </div>
        <Switch checked={values.askMenuPreference} onChange={onMenu} label={t('textEditor.fields.menuLabel')} />
      </div>
    </>
  );
}
