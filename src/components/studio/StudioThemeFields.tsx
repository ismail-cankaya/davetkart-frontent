import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Check, LayoutGrid, RotateCcw } from 'lucide-react';
import { getCategoryLabel } from '../../data';
import { getTemplatesForCategory } from '../../templateCatalog';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { ThemePickerModal } from '../editor/ThemePickerModal';
import { confirmAction } from '../ui/ConfirmDialog';
import '../../i18nEditor';

const QUICK_COUNT = 6;

/** Sol menü → Tema (K319): kategorinin tasarımları; seçili olan hep görünür. Bütün koleksiyon tema seçicide. */
export function StudioThemeFields() {
  const { t } = useTranslation();
  const categoryId = useInvitationStore((s) => s.invitation.categoryId);
  const activePresetId = useInvitationStore((s) => s.activePresetId);
  const selectTemplate = useInvitationStore((s) => s.selectTemplate);
  const resetInvitation = useInvitationStore((s) => s.resetInvitation);
  const [pickerOpen, setPickerOpen] = useState(false);
  const templates = getTemplatesForCategory(categoryId || null);

  const quick = useMemo(() => {
    const selected = templates.find((preset) => preset.id === activePresetId);
    const rest = templates.filter((preset) => preset.id !== activePresetId);
    return (selected ? [selected, ...rest] : rest).slice(0, QUICK_COUNT);
  }, [templates, activePresetId]);

  const reset = async () => {
    const confirmed = await confirmAction({
      title: t('textEditor.studio.theme.reset'),
      confirmLabel: t('textEditor.studio.theme.reset'),
      cancelLabel: t('textEditor.inline.cancel')
    });
    if (confirmed) resetInvitation();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        {quick.map((preset) => {
          const active = preset.id === activePresetId;
          return (
            <motion.button
              key={preset.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectTemplate(preset.id)}
              aria-pressed={active}
              className={`group overflow-hidden rounded-2xl border text-left cursor-pointer transition-colors duration-300 ${
                active ? 'border-gold/70 bg-champagne/10' : 'border-white/10 bg-white/[0.04] hover:border-white/30'
              }`}
            >
              <span className={`relative block h-16 ${preset.backgroundStyle}`}>
                {active && (
                  <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-gold text-brand-deep">
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
              </span>
              <span className="block px-2.5 py-2">
                <span className={`block truncate text-[11px] font-semibold ${active ? 'text-champagne' : 'text-white/80'}`}>{preset.name.split(' (')[0]}</span>
                {active && <span className="block text-[9px] font-semibold uppercase tracking-wider text-gold/80">{t('textEditor.studio.theme.current')}</span>}
              </span>
            </motion.button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/25 px-3 py-2.5 text-[11.5px] font-semibold text-emerald-100/80 hover:border-gold/60 hover:text-champagne cursor-pointer transition-colors duration-300"
      >
        <LayoutGrid size={13} className="text-gold" />
        {t('textEditor.studio.theme.more')}
        <span className="font-medium text-emerald-100/50">{t('textEditor.studio.theme.count', { count: templates.length })}</span>
      </button>
      <button type="button" onClick={() => void reset()} className="flex items-center gap-1.5 pt-2 text-[11px] text-emerald-100/50 hover:text-white cursor-pointer">
        <RotateCcw size={12} />
        {t('textEditor.studio.theme.reset')}
      </button>
      <ThemePickerModal
        open={pickerOpen}
        templates={templates}
        activePresetId={activePresetId}
        categoryLabel={categoryId ? getCategoryLabel(categoryId) : undefined}
        onSelect={selectTemplate}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}
