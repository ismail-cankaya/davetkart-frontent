import { useTranslation } from 'react-i18next';
import { Settings2 } from 'lucide-react';

/** Bölümün sağ üstündeki "ayarlar" çipi (Faz 25, K307); üzerine gelince görünür. */
export default function SectionChip({ id, onOpen }: { id: string; onOpen: () => void }) {
  const { t } = useTranslation();
  const label = t(`textEditor.sections.${id}`);
  return (
    <button
      type="button"
      data-edit-chip
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-[#2a1033]/85 px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-200 group-hover/section:opacity-100 focus-visible:opacity-100"
      aria-label={t('textEditor.sectionSettings', { label })}
    >
      <Settings2 size={11} />
      {label}
    </button>
  );
}
