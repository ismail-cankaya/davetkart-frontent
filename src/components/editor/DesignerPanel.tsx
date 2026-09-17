import React, { useState, useEffect, useId, useRef } from 'react';
import { motion } from 'motion/react';
import { Check, Palette, RotateCcw, Sparkles, Type } from 'lucide-react';
import { Invitation } from '../../types';
import { getTemplatesForCategory } from '../../data';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { CoupleNameFields } from '../create/CoupleNameFields';
import { DateTimeInput } from '../ui/DateTimeInput';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

const labelClass = 'block text-xs font-bold tracking-wider uppercase text-champagne';
const inputClass =
  'w-full bg-white/5 border border-white/15 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 transition-all duration-300';

/**
 * Detailed editing panel of the editor workspace: theme & palette switching
 * plus every text field of the invitation, mirrored live on the phone preview.
 */
export const DesignerPanel = React.memo(function DesignerPanel() {
  const invitation = useInvitationStore(s => s.invitation);
  const activePresetId = useInvitationStore(s => s.activePresetId);
  const selectTemplate = useInvitationStore(s => s.selectTemplate);
  const updateField = useInvitationStore(s => s.updateField);
  const resetInvitation = useInvitationStore(s => s.resetInvitation);
  const fieldId = useId();

  // Only offer themes belonging to the invitation's event category.
  const categoryTemplates = getTemplatesForCategory(invitation.categoryId || null);

  // Local mirror keeps typing instant; the store (and live preview) is
  // updated behind a debounce so every keystroke doesn't re-render the app.
  const [localInvitation, setLocalInvitation] = useState<Invitation>(invitation);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setLocalInvitation(invitation);
  }, [invitation]);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof Invitation;
    const { value } = e.target;
    setLocalInvitation(prev => ({ ...prev, [name]: value }));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateField(name, value);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.1 }}
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

        {/* Theme & palette */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold tracking-wider uppercase text-champagne flex items-center gap-2">
            <Palette size={13} className="text-gold" />
            Tema &amp; Renk Paleti
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {categoryTemplates.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => selectTemplate(preset.id)}
                  className={`group flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left cursor-pointer transition-all duration-300 ${
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
                  <span className={`text-[11px] font-semibold leading-tight ${isActive ? 'text-champagne' : 'text-white/80'}`}>
                    {preset.name.split(' (')[0]}
                  </span>
                </button>
              );
            })}
          </div>
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
    </motion.div>
  );
});
