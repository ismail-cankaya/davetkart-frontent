import React, { useId, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, LayoutGrid, Palette, RotateCcw, Sparkles, Type } from 'lucide-react';
import { getCategoryLabel, getTemplatesForCategory } from '../../data';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { useInvitationDraft } from '../../hooks/useInvitationDraft';
import { CoupleNameFields } from '../create/CoupleNameFields';
import { DateTimeInput } from '../ui/DateTimeInput';
import { ThemePickerModal } from './ThemePickerModal';
import { duration, ease } from '../../utils/motion';

/** Bu panelin gecikmeli yazdığı alanlar — isimler kendi bileşeninde yazılır. */
type PanelField = 'title' | 'date' | 'venue' | 'subtitle';
const PANEL_FIELDS: readonly PanelField[] = ['title', 'date', 'venue', 'subtitle'];

/** Panelde duran hızlı seçim kutucuğu sayısı; gerisi tema seçiciden gelir. */
const QUICK_THEME_COUNT = 4;

const labelClass = 'block text-xs font-bold tracking-wider uppercase text-champagne';
const inputClass =
  'w-full bg-white/5 border border-white/15 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 transition duration-300';

/**
 * Detailed editing panel of the editor workspace: theme & palette switching
 * plus every text field of the invitation, mirrored live on the phone preview.
 */
export const DesignerPanel = React.memo(function DesignerPanel() {
  const invitation = useInvitationStore(s => s.invitation);
  const activePresetId = useInvitationStore(s => s.activePresetId);
  const selectTemplate = useInvitationStore(s => s.selectTemplate);
  const resetInvitation = useInvitationStore(s => s.resetInvitation);
  const fieldId = useId();
  const [pickerOpen, setPickerOpen] = useState(false);

  // Only offer themes belonging to the invitation's event category.
  const categoryTemplates = getTemplatesForCategory(invitation.categoryId || null);

  /**
   * Hızlı seçim — koleksiyonun tamamı değil, yalnızca dört kutucuk.
   *
   * 🔴 Burada 30 küsur temayı listelemek, asıl işi (metinleri yazmak) ekranın
   * çok aşağısına itiyordu. Seçili tema ilk dördün dışında kaldığında başa
   * sabitlenir: kullanıcı seçiminin ne olduğunu her zaman görebilmeli.
   */
  const quickTemplates = useMemo(() => {
    const selectedIndex = categoryTemplates.findIndex(preset => preset.id === activePresetId);
    if (selectedIndex < QUICK_THEME_COUNT) return categoryTemplates.slice(0, QUICK_THEME_COUNT);

    const selected = categoryTemplates[selectedIndex];
    const rest = categoryTemplates
      .filter(preset => preset.id !== selected.id)
      .slice(0, QUICK_THEME_COUNT - 1);
    return [selected, ...rest];
  }, [categoryTemplates, activePresetId]);

  const hiddenThemeCount = Math.max(categoryTemplates.length - quickTemplates.length, 0);

  // Local mirror keeps typing instant; the store (and live preview) is
  // updated behind a debounce so every keystroke doesn't re-render the app.
  // Eski sürüm yalnızca son alanı yazıyor ve bekleyen yazımı ayrılırken
  // atıyordu; ortak hook ikisini de kapatır (bkz. useInvitationDraft).
  const { draft: localInvitation, setField } = useInvitationDraft(PANEL_FIELDS);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setField(e.target.name as PanelField, e.target.value);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: duration.panel, ease: ease.out, delay: 0.05 }}
      className="w-full lg:w-1/2 bg-gradient-to-b from-brand-deep via-emerald-950 to-brand-deep text-white rounded-3xl border border-white/10 shadow-2xl shadow-black/20 p-6 md:p-8 space-y-7 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/4 w-72 h-72 bg-emerald-800/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 space-y-7">
        <div>
          <div className="bg-champagne text-brand-deep px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide w-fit flex items-center gap-1.5 shadow-sm mb-4">
            <Sparkles size={12} className="text-gold" />
            <span>İnce Ayar Stüdyosu</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold">
            Davetiyeni <span className="italic font-medium text-champagne">Kusursuzlaştır</span>
          </h2>
          <p className="text-emerald-100/70 text-xs md:text-sm mt-2.5 leading-relaxed">
            Renk temasını ve tüm metinleri buradan düzenleyin; her değişiklik
            cihaz önizlemesine anında yansır.
          </p>
        </div>

        {/* Theme & palette — hızlı seçim + tam koleksiyon */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-champagne flex items-center gap-2">
              <Palette size={13} className="text-gold" />
              Tema &amp; Renk Paleti
            </h3>
            {hiddenThemeCount > 0 && (
              <span className="text-emerald-100/50 text-[10px] font-medium">
                {categoryTemplates.length} tema
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {quickTemplates.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => selectTemplate(preset.id)}
                  aria-pressed={isActive}
                  className={`group flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left cursor-pointer transition duration-300 ${
                    isActive
                      ? 'bg-champagne/15 border-gold/60 shadow-inner'
                      : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full ${preset.backgroundStyle} border shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'border-gold' : 'border-white/30'
                    }`}
                  >
                    {isActive && <Check size={11} className="text-champagne" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[11px] font-semibold leading-tight truncate ${isActive ? 'text-champagne' : 'text-white/80'}`}>
                      {preset.name.split(' (')[0]}
                    </span>
                    {/* Seçili olanı yalnızca o kutucuk söyler; diğerleri sessiz kalır. */}
                    {isActive && (
                      <span className="block text-[9px] font-semibold tracking-wider uppercase text-gold/80 mt-0.5">
                        Seçili
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {hiddenThemeCount > 0 && (
            <motion.button
              type="button"
              onClick={() => setPickerOpen(true)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/25 hover:border-gold/60 bg-white/[0.03] hover:bg-white/[0.07] px-3 py-2.5 text-[11px] font-semibold text-emerald-100/80 hover:text-champagne cursor-pointer transition-colors duration-300"
            >
              <LayoutGrid size={13} className="text-gold" />
              Daha fazla tema
              <span className="text-emerald-100/50 font-medium">(+{hiddenThemeCount})</span>
            </motion.button>
          )}
        </div>

        {/* Text fields */}
        <div className="space-y-5">
          <h3 className="text-xs font-bold tracking-wider uppercase text-champagne flex items-center gap-2">
            <Type size={13} className="text-gold" />
            Metinler &amp; Konumlandırma
          </h3>

          <CoupleNameFields labelClass={labelClass} inputClass={inputClass} />

          <div className="space-y-2">
            <label className={labelClass}>Üst Başlık (Slogan)</label>
            <input
              type="text"
              name="title"
              value={localInvitation.title}
              onChange={handleLocalChange}
              placeholder="Örn. HAYATIMIZIN EN ÖZEL GÜNÜ"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor={`${fieldId}-date`} className={labelClass}>Etkinlik Tarihi &amp; Saati</label>
              <DateTimeInput
                id={`${fieldId}-date`}
                name="date"
                value={localInvitation.date}
                onChange={handleLocalChange}
                placeholder="Davet tarihini seçiniz"
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`${fieldId}-venue`} className={labelClass}>Davet Konumu</label>
              <input
                id={`${fieldId}-venue`}
                type="text"
                name="venue"
                value={localInvitation.venue}
                onChange={handleLocalChange}
                placeholder="Çırağan Sarayı, İstanbul"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Davet Mesajı (Açıklama / Şiir)</label>
            <textarea
              name="subtitle"
              rows={3}
              value={localInvitation.subtitle}
              onChange={handleLocalChange}
              placeholder="Örn. Sizleri de bu mutlu günümüzde aramızda görmekten onur duyarız..."
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="flex justify-end pt-1 border-t border-white/10">
          <button
            type="button"
            onClick={resetInvitation}
            className="mt-4 text-emerald-100/60 hover:text-white text-xs cursor-pointer flex items-center gap-1.5 transition-colors duration-300"
          >
            <RotateCcw size={12} />
            Bütün Alanları Sıfırla
          </button>
        </div>
      </div>

      <ThemePickerModal
        open={pickerOpen}
        templates={categoryTemplates}
        activePresetId={activePresetId}
        categoryLabel={invitation.categoryId ? getCategoryLabel(invitation.categoryId) : undefined}
        onSelect={selectTemplate}
        onClose={() => setPickerOpen(false)}
      />
    </motion.div>
  );
});
