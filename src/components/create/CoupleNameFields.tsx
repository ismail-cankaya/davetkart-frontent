import React, { useEffect, useId, useRef, useState } from 'react';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { useActiveCategory } from '../../stores/useCreateWizardStore';
import { joinNames, splitNames } from '../../utils/names';

/** Kategori henüz seçilmemişken kullanılan nötr etiketler. */
const FALLBACK_LABELS: [string, string] = ['Partner 1', 'Partner 2'];
const FALLBACK_PLACEHOLDERS: [string, string] = ['Birinci ismi giriniz', 'İkinci ismi giriniz'];

interface CoupleNameFieldsProps {
  labelClass: string;
  inputClass: string;
}

/**
 * Two-person name entry bound to the invitation's single `names` string.
 * Keystrokes stay local for instant feedback; the joined value is written to
 * the store behind a debounce so the live preview doesn't re-render per key.
 *
 * Etiketler ve placeholder'lar aktif kategoriden okunur ("Gelin Adı" /
 * "Gelin adını giriniz"); iki ayrı ekran (sihirbaz formu ve tasarım
 * stüdyosu) aynı metinleri prop zinciriyle taşımak zorunda kalmaz.
 *
 * 🔴 Alanlar boş başlar: yönlendirme placeholder'dadır, state'te değil.
 */
export function CoupleNameFields({ labelClass, inputClass }: CoupleNameFieldsProps) {
  const names = useInvitationStore(s => s.invitation.names);
  const updateField = useInvitationStore(s => s.updateField);
  const category = useActiveCategory();
  const fieldId = useId();

  const labels = category?.nameLabels ?? FALLBACK_LABELS;
  const placeholders = category?.namePlaceholders ?? FALLBACK_PLACEHOLDERS;

  const [pair, setPair] = useState<[string, string]>(() => splitNames(names));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Re-sync only on external changes (reset, hydration) — never while the
  // edit originated here, or a half-filled pair would jump between fields.
  useEffect(() => {
    setPair(prev => (joinNames(prev[0], prev[1]) === names ? prev : splitNames(names)));
  }, [names]);

  // A pending edit must survive unmount (e.g. submitting the form while the
  // debounce is still open) — flush it instead of dropping it.
  const flushRef = useRef<(() => void) | null>(null);
  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    flushRef.current?.();
  }, []);

  const handleChange = (index: 0 | 1) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next: [string, string] = index === 0 ? [e.target.value, pair[1]] : [pair[0], e.target.value];
    setPair(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const commit = () => {
      flushRef.current = null;
      updateField('names', joinNames(next[0], next[1]));
    };
    flushRef.current = commit;
    debounceRef.current = setTimeout(commit, 400);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {([0, 1] as const).map((index) => (
        <div key={index} className="space-y-2">
          <label htmlFor={`${fieldId}-${index}`} className={labelClass}>
            {labels[index]}
          </label>
          <input
            id={`${fieldId}-${index}`}
            type="text"
            value={pair[index]}
            onChange={handleChange(index)}
            placeholder={placeholders[index]}
            className={inputClass}
          />
        </div>
      ))}
    </div>
  );
}
